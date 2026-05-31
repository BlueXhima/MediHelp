const db = require('../config/db');
// Import Security & Sanitization Utilities
const { encrypt, decrypt } = require('../utils/encryptionUtils');
const { sanitizeName, sanitizeEmail } = require('../utils/sanitizer');

exports.getContacts = async (req, res) => {
    const { patientId } = req.params;
    try {
        const [contacts] = await db.query(
            `SELECT ContactID as id, Name as name, Relationship as relationship, 
                    Phone as phone, Email as email, IsPrimary as isPrimary 
             FROM emergency_contacts WHERE PatientID = ? ORDER BY IsPrimary DESC`,
            [patientId]
        );

        // DECRYPT ang sensitive contact details bago ipadala sa frontend
        const decryptedContacts = contacts.map(c => ({
            ...c,
            name: decrypt(c.name),
            phone: decrypt(c.phone),
            email: decrypt(c.email),
            relationship: c.relationship // Pwedeng hindi na i-encrypt kung standard labels lang (e.g., Parent, Spouse)
        }));

        res.json({ success: true, contacts: decryptedContacts });
    } catch (error) {
        console.error("Fetch Emergency Contacts Error:", error);
        res.status(500).json({ error: error.message });
    }
};

exports.addContact = async (req, res) => {
    const { patientId } = req.params;
    const { name, relationship, phone, email, isPrimary } = req.body;
    const connection = await db.getConnection();
    
    try {
        await connection.beginTransaction();

        // 1. Sanitize Inputs
        const cleanName = sanitizeName(name);
        const cleanRel = sanitizeName(relationship);
        const cleanEmail = sanitizeEmail(email);

        // 2. Encrypt PII (Personally Identifiable Information)
        const encryptedName = encrypt(cleanName);
        const encryptedPhone = encrypt(phone); // Direct encrypt since phone is usually numbers/plus sign
        const encryptedEmail = encrypt(cleanEmail);

        if (isPrimary) {
            await connection.query('UPDATE emergency_contacts SET IsPrimary = FALSE WHERE PatientID = ?', [patientId]);
        }

        const [result] = await connection.query(
            `INSERT INTO emergency_contacts (
                PatientID, Name, Relationship, Phone, Email, 
                IsPrimary, Created_Date, Created_Time, Updated_Date, Updated_Time
            ) VALUES (?, ?, ?, ?, ?, ?, CURDATE(), CURTIME(), CURDATE(), CURTIME())`,
            [patientId, encryptedName, cleanRel, encryptedPhone, encryptedEmail, isPrimary ? 1 : 0]
        );

        await connection.commit();
        res.json({ success: true, id: result.insertId });
    } catch (error) {
        await connection.rollback();
        console.error("Add Emergency Contact Error:", error);
        res.status(500).json({ error: error.message });
    } finally {
        connection.release();
    }
};

exports.deleteContact = async (req, res) => {
    const { contactId } = req.params;
    try {
        await db.query('DELETE FROM emergency_contacts WHERE ContactID = ?', [contactId]);
        res.json({ success: true, message: 'Emergency contact deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};