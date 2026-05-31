const db = require('../config/db');
// Import Security & Sanitization Utilities
const { encrypt, decrypt } = require('../utils/encryptionUtils');
const { sanitizeName } = require('../utils/sanitizer');

exports.getMedications = async (req, res) => {
    const { patientId } = req.params;
    try {
        const [medications] = await db.query(
            `SELECT MedicationID as id, MedicationName as name, Dosage as dosage, 
                    Frequency as frequency, PrescribedBy as prescribedBy, Status as status 
            FROM medications WHERE PatientID = ? ORDER BY Created_Date DESC, Created_Time DESC`,
            [patientId]
        );

        // DECRYPT ang bawat field bago ibalik sa frontend ng MediHelp
        const decryptedMedications = medications.map(m => ({
            ...m,
            name: decrypt(m.name),
            dosage: decrypt(m.dosage),
            prescribedBy: decrypt(m.prescribedBy)
        }));

        res.json({ success: true, medications: decryptedMedications });
    } catch (error) {
        console.error("Medication Fetch Error:", error);
        res.status(500).json({ error: error.message });
    }
};

exports.addMedication = async (req, res) => {
    const { patientId } = req.params;
    const { name, dosage, frequency, prescribedBy, status } = req.body;
    
    try {
        // 1. Sanitize Inputs (Proteksyon laban sa XSS/Scripts)
        // 2. Encrypt Sensitive Data (Proteksyon sa Privacy)
        const encryptedName = encrypt(sanitizeName(name));
        const encryptedDosage = encrypt(sanitizeName(dosage));
        const encryptedPrescribedBy = encrypt(sanitizeName(prescribedBy));

        const [result] = await db.query(
            `INSERT INTO medications (
                PatientID, MedicationName, Dosage, Frequency, 
                PrescribedBy, Status, Created_Date, Created_Time
            ) VALUES (?, ?, ?, ?, ?, ?, CURDATE(), CURTIME())`,
            [
                patientId, 
                encryptedName, 
                encryptedDosage, 
                frequency, // Ang frequency (e.g., "3x a day") ay karaniwang dropdown, pero pwede ring i-encrypt kung gusto mo
                encryptedPrescribedBy, 
                status || 'Active'
            ]
        );
        
        res.json({ success: true, id: result.insertId });
    } catch (error) {
        console.error("Add Medication Error:", error);
        res.status(500).json({ error: error.message });
    }
};

exports.deleteMedication = async (req, res) => {
    try {
        const { medicationId } = req.params;
        await db.query('DELETE FROM medications WHERE MedicationID = ?', [medicationId]);
        res.json({ success: true, message: 'Medication deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};