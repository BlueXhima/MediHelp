const db = require('../config/db');

// Import Security & Sanitization Utilities
const { encrypt, decrypt } = require('../utils/encryptionUtils');
const { sanitizeName, sanitizeAddress } = require('../utils/sanitizer');

exports.getMedicalRecords = async (req, res) => {
    const { patientId } = req.params;
    const numericPatientId = parseInt(patientId, 10);
    if (isNaN(numericPatientId)) return res.status(400).json({ error: 'Invalid patient ID format' });

    try {
        // 1. Fetch encrypted records from DB
        const [conditions] = await db.query(
            `SELECT ConditionID as id, ConditionName as name, DiagnosisDate as date, Status as status 
            FROM medical_conditions WHERE PatientID = ? ORDER BY Created_Date DESC, Created_Time DESC`,
            [numericPatientId]
        );
        const [allergies] = await db.query(
            `SELECT AllergyID as id, AllergenName as name, Severity as severity, Reaction as reaction 
            FROM allergies WHERE PatientID = ? ORDER BY Created_Date DESC, Created_Time DESC`,
            [numericPatientId]
        );
        const [surgeries] = await db.query(
            `SELECT SurgeryID as id, ProcedureName as name, ProcedureDate as date, Hospital as hospital 
            FROM surgeries WHERE PatientID = ? ORDER BY Created_Date DESC, Created_Time DESC`,
            [numericPatientId]
        );

        // 2. DECRYPT the records before sending to frontend
        const decryptedConditions = conditions.map(c => ({
            ...c,
            name: decrypt(c.name) // Decrypt condition name
        }));

        const decryptedAllergies = allergies.map(a => ({
            ...a,
            name: decrypt(a.name),
            reaction: decrypt(a.reaction) // Decrypt sensitive reaction details
        }));

        const decryptedSurgeries = surgeries.map(s => ({
            ...s,
            name: decrypt(s.name),
            hospital: decrypt(s.hospital) // Decrypt hospital name
        }));

        res.json({ 
            success: true, 
            conditions: decryptedConditions, 
            allergies: decryptedAllergies, 
            surgeries: decryptedSurgeries 
        });

    } catch (error) {
        console.error("Medical Fetch Error:", error);
        res.status(500).json({ error: 'Failed to fetch medical records', details: error.message });
    }
};

// ============================================
// ADD RECORDS (With Sanitization & Encryption)
// ============================================

exports.addCondition = async (req, res) => {
    const { patientId } = req.params;
    const { name, date, status } = req.body;
    try {
        // Sanitize then Encrypt
        const encryptedName = encrypt(sanitizeName(name));

        const [result] = await db.query(
            `INSERT INTO medical_conditions (PatientID, ConditionName, DiagnosisDate, Status, Created_Date, Created_Time) 
            VALUES (?, ?, ?, ?, CURDATE(), CURTIME())`,
            [patientId, encryptedName, date || null, status || 'Active']
        );
        res.json({ success: true, id: result.insertId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.addAllergy = async (req, res) => {
    const { patientId } = req.params;
    const { name, severity, reaction } = req.body;
    try {
        // Sanitize and Encrypt
        const encryptedAllergen = encrypt(sanitizeName(name));
        const encryptedReaction = encrypt(sanitizeName(reaction));

        const [result] = await db.query(
            `INSERT INTO allergies (PatientID, AllergenName, Severity, Reaction, Created_Date, Created_Time) 
            VALUES (?, ?, ?, ?, CURDATE(), CURTIME())`,
            [patientId, encryptedAllergen, severity, encryptedReaction]
        );
        res.json({ success: true, id: result.insertId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.addSurgery = async (req, res) => {
    const { patientId } = req.params;
    const { name, date, hospital } = req.body;
    try {
        const encryptedSurgery = encrypt(sanitizeName(name));
        const encryptedHospital = encrypt(sanitizeAddress(hospital)); // Use address sanitizer for hospitals

        const [result] = await db.query(
            `INSERT INTO surgeries (PatientID, ProcedureName, ProcedureDate, Hospital, Created_Date, Created_Time) 
            VALUES (?, ?, ?, ?, CURDATE(), CURTIME())`,
            [patientId, encryptedSurgery, date || null, encryptedHospital]
        );
        res.json({ success: true, id: result.insertId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ============================================
// DELETE RECORDS
// ============================================

exports.deleteCondition = async (req, res) => {
    try {
        await db.query('DELETE FROM medical_conditions WHERE ConditionID = ?', [req.params.conditionId]);
        res.json({ success: true, message: 'Condition deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteAllergy = async (req, res) => {
    const { allergyId } = req.params;
    try {
        const [result] = await db.query('DELETE FROM allergies WHERE AllergyID = ?', [allergyId]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, error: 'Allergy record not found' });
        }
        
        res.json({ success: true, message: 'Allergy record deleted successfully' });
    } catch (error) {
        console.error("Error deleting allergy:", error);
        res.status(500).json({ error: error.message });
    }
};

exports.deleteSurgery = async (req, res) => {
    const { surgeryId } = req.params;
    try {
        const [result] = await db.query('DELETE FROM surgeries WHERE SurgeryID = ?', [surgeryId]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, error: 'Surgery record not found' });
        }
        
        res.json({ success: true, message: 'Surgery record deleted successfully' });
    } catch (error) {
        console.error("Error deleting surgery:", error);
        res.status(500).json({ error: error.message });
    }
};

// Add similar delete functions for Allergy and Surgery as needed...