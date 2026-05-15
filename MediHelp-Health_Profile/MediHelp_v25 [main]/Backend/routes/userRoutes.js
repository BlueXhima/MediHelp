// userRoutes.js - Express router for handling patient profile and medical records API endpoints.

const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const db = require('../config/db');

// ============================================
// SANITIZATION HELPERS — backend security layer
// ============================================
const sanitizeName = (value) => {
    if (!value) return '';
    return String(value).replace(/[@#$%^&*()=+{}[\]<>/\\|"'";:]/g, '');
};

const sanitizeAddress = (value) => {
    if (!value) return '';
    return String(value).replace(/[<>{}|\\^`]/g, '');
};

const sanitizeEmail = (value) => {
    if (!value) return '';
    return String(value).toLowerCase().trim();
};

// ============================================
// MULTER SETUP — profile picture uploads
// ============================================
const storage = multer.diskStorage({
    destination: 'uploads/',
    filename: (req, file, cb) => {
        cb(null, `pfp-${Date.now()}${path.extname(file.originalname)}`);
    }
});
const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed'));
        }
    }
});

// ============================================
// HEALTH METRICS API
// ============================================

// GET latest health metrics for a patient
router.get('/health-metrics/:patientId', async (req, res) => {
    const { patientId } = req.params;
    
    console.log('GET /health-metrics/:patientId - patientId:', patientId);

    const numericPatientId = parseInt(patientId, 10);
    if (isNaN(numericPatientId)) {
        return res.status(400).json({ error: 'Invalid patient ID format' });
    }

    try {
        const [metrics] = await db.query(
            `SELECT MetricID as id, BloodPressure as bloodPressure, HeartRate as heartRate,
                    Weight_kg as weight, Height_cm as height, BloodSugar as bloodSugar,
                    Temperature as temperature, RecordedDate as recordedDate, RecordedTime as recordedTime
             FROM health_metrics 
             WHERE PatientID = ? 
             ORDER BY RecordedDate DESC, RecordedTime DESC 
             LIMIT 1`,
            [numericPatientId]
        );

        console.log('Health metrics fetched:', metrics.length);
        res.json({ success: true, metrics: metrics[0] || null });

    } catch (error) {
        console.error('Error fetching health metrics:', error);
        res.status(500).json({ error: 'Failed to fetch health metrics', details: error.message });
    }
});

// GET health metrics history for a patient
router.get('/health-metrics/:patientId/history', async (req, res) => {
    const { patientId } = req.params;
    const limit = parseInt(req.query.limit, 10) || 30;
    
    const numericPatientId = parseInt(patientId, 10);
    if (isNaN(numericPatientId)) {
        return res.status(400).json({ error: 'Invalid patient ID format' });
    }

    try {
        const [metrics] = await db.query(
            `SELECT MetricID as id, BloodPressure as bloodPressure, HeartRate as heartRate,
                    Weight_kg as weight, Height_cm as height, BloodSugar as bloodSugar,
                    Temperature as temperature, RecordedDate as recordedDate, RecordedTime as recordedTime
             FROM health_metrics 
             WHERE PatientID = ? 
             ORDER BY RecordedDate DESC, RecordedTime DESC 
             LIMIT ?`,
            [numericPatientId, limit]
        );

        res.json({ success: true, metrics: metrics || [] });

    } catch (error) {
        console.error('Error fetching health metrics history:', error);
        res.status(500).json({ error: 'Failed to fetch health metrics history', details: error.message });
    }
});

// ADD new health metrics (always insert, never update — preserves history)
router.post('/health-metrics/:patientId', async (req, res) => {
    console.log('POST /health-metrics/:patientId - req.params:', req.params);
    console.log('POST /health-metrics/:patientId - req.body:', req.body);
    
    const { patientId } = req.params;
    const { bloodPressure, heartRate, weight, height, bloodSugar, temperature } = req.body;
    
    const numericPatientId = parseInt(patientId, 10);
    if (isNaN(numericPatientId)) {
        return res.status(400).json({ error: 'Invalid patient ID format' });
    }

    try {
        const [patientCheck] = await db.query('SELECT PatientID FROM patient WHERE PatientID = ?', [numericPatientId]);
        if (patientCheck.length === 0) {
            return res.status(404).json({ error: 'Patient not found' });
        }

        const [result] = await db.query(
            `INSERT INTO health_metrics 
             (PatientID, BloodPressure, HeartRate, Weight_kg, Height_cm, BloodSugar, Temperature, RecordedDate, RecordedTime) 
             VALUES (?, ?, ?, ?, ?, ?, ?, CURDATE(), CURTIME())`,
            [
                numericPatientId,
                bloodPressure || null,
                heartRate ? parseInt(heartRate, 10) : null,
                weight ? parseFloat(weight) : null,
                height ? parseFloat(height) : null,
                bloodSugar ? parseInt(bloodSugar, 10) : null,
                temperature ? parseFloat(temperature) : null
            ]
        );
        
        console.log('Health metrics added, insertId:', result.insertId);
        res.json({ 
            success: true, 
            id: result.insertId, 
            message: 'Health metrics recorded successfully' 
        });

    } catch (error) {
        console.error('Error saving health metrics:', error);
        res.status(500).json({ 
            error: 'Failed to save health metrics', 
            details: error.message, 
            code: error.code 
        });
    }
});

// ============================================
// GET PATIENT PROFILE — Fetch patient data by UserID
// ============================================
router.get('/patient-profile/:userId', async (req, res) => {
    const { userId } = req.params;
    
    console.log('Fetching patient profile for UserID:', userId);
    
    try {
        const [patientRows] = await db.query(
            'SELECT * FROM patient WHERE UserID = ?',
            [userId]
        );
        
        const [userRows] = await db.query(
            'SELECT Email, profile_picture FROM users WHERE UserID = ?',
            [userId]
        );
        
        if (patientRows.length === 0) {
            return res.json({ 
                success: true,
                message: 'No patient record found',
                data: {
                    Email: userRows[0]?.Email || '',
                    profile_picture: userRows[0]?.profile_picture || '',
                    FirstName: '',
                    LastName: '',
                    Address: '',
                    Gender: '',
                    Height_cm: null,
                    Weight_kg: null,
                    DateOfBirth: '',
                    BloodType: '',
                    PatientID: null
                }
            });
        }
        
        const combinedData = {
            ...patientRows[0],
            Email: userRows[0]?.Email || '',
            profile_picture: userRows[0]?.profile_picture || ''
        };
        
        console.log('Combined patient data found:', combinedData);
        res.json(combinedData);
        
    } catch (error) {
        console.error('Fetch patient error:', error);
        res.status(500).json({ 
            error: 'Database error',
            details: error.message 
        });
    }
});

// ============================================
// UPDATE PATIENT PROFILE — Save/update patient data and profile picture
// ============================================
router.post('/update-profile-full', upload.single('profileImage'), async (req, res) => {
    console.log('=== REQUEST RECEIVED ===');
    console.log('Body:', req.body);
    console.log('File:', req.file);
    console.log('========================');

    const { 
        userId, 
        firstName, 
        lastName, 
        address, 
        gender, 
        height, 
        weight, 
        dob,
        bloodType,
        removeProfileImage
    } = req.body;

    if (!userId) {
        return res.status(400).json({ error: 'User ID is required' });
    }

    const sanitizedFirstName = sanitizeName(firstName);
    const sanitizedLastName = sanitizeName(lastName);
    const sanitizedAddress = sanitizeAddress(address);

    const connection = await db.getConnection();
    let oldImagePath = null;
    
    try {
        await connection.beginTransaction();

        const [existing] = await connection.query(
            'SELECT PatientID FROM patient WHERE UserID = ?', 
            [userId]
        );
        
        console.log('Existing patient:', existing);

        let patientQuery;
        let patientParams = [];

        if (existing.length > 0) {
            patientQuery = `UPDATE patient SET 
                Updated_Date = CURDATE(), 
                Updated_Time = CURTIME(),
                FirstName = ?,
                LastName = ?,
                Address = ?,
                Gender = ?,
                Height_cm = ?,
                Weight_kg = ?,
                DateOfBirth = ?,
                BloodType = ?
            WHERE UserID = ?`;
            
            patientParams = [
                sanitizedFirstName,
                sanitizedLastName,
                sanitizedAddress || null,
                gender || 'Other',
                height || null,
                weight || null,
                dob || null,
                bloodType || null,
                userId
            ];
        } else {
            patientQuery = `INSERT INTO patient (
                UserID, FirstName, LastName, DateOfBirth, Gender,
                Height_cm, Weight_kg, Address, BloodType,
                Created_Date, Created_Time, Updated_Date, Updated_Time
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, CURDATE(), CURTIME(), CURDATE(), CURTIME())`;
            
            patientParams = [
                userId,
                sanitizedFirstName,
                sanitizedLastName,
                dob || '2000-01-01',
                gender || 'Other',
                height || null,
                weight || null,
                sanitizedAddress || null,
                bloodType || null
            ];
        }

        console.log('Patient SQL Query:', patientQuery);
        console.log('Patient Parameters:', patientParams);

        await connection.query(patientQuery, patientParams);

        // Handle profile image removal
        if (removeProfileImage === 'true') {
            const [currentUser] = await connection.query(
                'SELECT profile_picture FROM users WHERE UserID = ?',
                [userId]
            );
            
            if (currentUser[0]?.profile_picture) {
                oldImagePath = path.join(__dirname, '..', 'uploads', currentUser[0].profile_picture.split('/').pop());
            }
            
            await connection.query(
                'UPDATE users SET profile_picture = NULL, Updated_Date = CURDATE(), Updated_Time = CURTIME() WHERE UserID = ?',
                [userId]
            );
            console.log('Profile picture removed from users table');
            
        } else if (req.file) {
            const [currentUser] = await connection.query(
                'SELECT profile_picture FROM users WHERE UserID = ?',
                [userId]
            );
            
            if (currentUser[0]?.profile_picture) {
                oldImagePath = path.join(__dirname, '..', 'uploads', currentUser[0].profile_picture.split('/').pop());
            }
            
            const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
            
            await connection.query(
                'UPDATE users SET profile_picture = ?, Updated_Date = CURDATE(), Updated_Time = CURTIME() WHERE UserID = ?',
                [imageUrl, userId]
            );
            console.log('Profile picture updated in users table:', imageUrl);
        }

        await connection.commit();

        // Delete old image only after successful commit
        if (oldImagePath && fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
            console.log('Deleted old profile picture:', oldImagePath);
        }

        const [updatedPatient] = await connection.query(
            'SELECT * FROM patient WHERE UserID = ?',
            [userId]
        );
        
        const [updatedUser] = await connection.query(
            'SELECT Email, profile_picture FROM users WHERE UserID = ?',
            [userId]
        );

        res.json({ 
            message: 'Profile updated successfully!',
            success: true,
            data: {
                ...updatedPatient[0],
                Email: updatedUser[0]?.Email || '',
                profile_picture: updatedUser[0]?.profile_picture || ''
            }
        });
        
    } catch (error) {
        await connection.rollback();
        console.error('=== DATABASE ERROR ===');
        console.error('Error message:', error.message);
        console.error('Error code:', error.code);
        console.error('SQL State:', error.sqlState);
        console.error('======================');
        
        // Clean up new file on rollback
        if (req.file) {
            const filePath = path.join(__dirname, '..', 'uploads', req.file.filename);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }
        
        res.status(500).json({ 
            error: 'Database error: ' + error.message,
            details: error.message,
            code: error.code
        });
    } finally {
        connection.release();
    }
});

// ============================================
// MEDICAL RECORDS API
// ============================================

// GET all medical records for a patient
router.get('/medical-records/:patientId', async (req, res) => {
    const { patientId } = req.params;
    
    console.log('GET /medical-records/:patientId - patientId:', patientId);

    const numericPatientId = parseInt(patientId, 10);
    if (isNaN(numericPatientId)) {
        return res.status(400).json({ error: 'Invalid patient ID format' });
    }

    try {
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

        console.log('Records fetched:', { conditions: conditions.length, allergies: allergies.length, surgeries: surgeries.length });
        res.json({ 
            success: true, 
            conditions: conditions || [], 
            allergies: allergies || [], 
            surgeries: surgeries || [] 
        });

    } catch (error) {
        console.error('Error fetching medical records:', error);
        res.status(500).json({ error: 'Failed to fetch medical records', details: error.message });
    }
});

// ADD medical condition
router.post('/medical-condition/:patientId', async (req, res) => {
    console.log('POST /medical-condition/:patientId - req.params:', req.params);
    console.log('POST /medical-condition/:patientId - req.body:', req.body);
    
    const { patientId } = req.params;
    const { name, date, status } = req.body;
    
    const numericPatientId = parseInt(patientId, 10);
    if (isNaN(numericPatientId)) {
        return res.status(400).json({ error: 'Invalid patient ID format' });
    }

    if (!name || !name.trim()) {
        return res.status(400).json({ error: 'Condition name is required' });
    }

    try {
        const [patientCheck] = await db.query('SELECT PatientID FROM patient WHERE PatientID = ?', [numericPatientId]);
        if (patientCheck.length === 0) {
            return res.status(404).json({ error: 'Patient not found' });
        }
        
        const [result] = await db.query(
            `INSERT INTO medical_conditions 
             (PatientID, ConditionName, DiagnosisDate, Status, Created_Date, Created_Time) 
             VALUES (?, ?, ?, ?, CURDATE(), CURTIME())`,
            [numericPatientId, sanitizeName(name), date || null, status || 'Active']
        );

        console.log('Condition added, insertId:', result.insertId);
        res.json({ success: true, id: result.insertId, message: 'Condition added successfully' });
    } catch (error) {
        console.error('Error adding condition:', error);
        res.status(500).json({ error: 'Failed to add condition', details: error.message, code: error.code });
    }
});

// ADD allergy
router.post('/allergy/:patientId', async (req, res) => {
    console.log('POST /allergy/:patientId - req.params:', req.params);
    console.log('POST /allergy/:patientId - req.body:', req.body);
    
    const { patientId } = req.params;
    const { name, severity, reaction } = req.body;
    
    const numericPatientId = parseInt(patientId, 10);
    if (isNaN(numericPatientId)) {
        return res.status(400).json({ error: 'Invalid patient ID format' });
    }

    if (!name || !name.trim()) {
        return res.status(400).json({ error: 'Allergen name is required' });
    }

    try {
        const [patientCheck] = await db.query('SELECT PatientID FROM patient WHERE PatientID = ?', [numericPatientId]);
        if (patientCheck.length === 0) {
            return res.status(404).json({ error: 'Patient not found' });
        }
        
        const [result] = await db.query(
            `INSERT INTO allergies 
             (PatientID, AllergenName, Severity, Reaction, Created_Date, Created_Time) 
             VALUES (?, ?, ?, ?, CURDATE(), CURTIME())`,
            [numericPatientId, sanitizeName(name), severity || 'Moderate', sanitizeAddress(reaction) || null]
        );

        console.log('Allergy added, insertId:', result.insertId);
        res.json({ success: true, id: result.insertId, message: 'Allergy added successfully' });
    } catch (error) {
        console.error('Error adding allergy:', error);
        res.status(500).json({ error: 'Failed to add allergy', details: error.message, code: error.code });
    }
});

// ADD surgery / procedure
router.post('/surgery/:patientId', async (req, res) => {
    console.log('POST /surgery/:patientId - req.params:', req.params);
    console.log('POST /surgery/:patientId - req.body:', req.body);
    
    const { patientId } = req.params;
    const { name, date, hospital } = req.body;
    
    const numericPatientId = parseInt(patientId, 10);
    if (isNaN(numericPatientId)) {
        return res.status(400).json({ error: 'Invalid patient ID format' });
    }

    if (!name || !name.trim()) {
        return res.status(400).json({ error: 'Procedure name is required' });
    }

    try {
        const [patientCheck] = await db.query('SELECT PatientID FROM patient WHERE PatientID = ?', [numericPatientId]);
        if (patientCheck.length === 0) {
            return res.status(404).json({ error: 'Patient not found' });
        }
        
        const [result] = await db.query(
            `INSERT INTO surgeries 
             (PatientID, ProcedureName, ProcedureDate, Hospital, Created_Date, Created_Time) 
             VALUES (?, ?, ?, ?, CURDATE(), CURTIME())`,
            [numericPatientId, sanitizeName(name), date || null, sanitizeAddress(hospital) || null]
        );

        console.log('Surgery added, insertId:', result.insertId);
        res.json({ success: true, id: result.insertId, message: 'Surgery added successfully' });
    } catch (error) {
        console.error('Error adding surgery:', error);
        res.status(500).json({ error: 'Failed to add surgery', details: error.message, code: error.code });
    }
});

// DELETE medical condition
router.delete('/medical-condition/:conditionId', async (req, res) => {
    const { conditionId } = req.params;
    const numericId = parseInt(conditionId, 10);
    if (isNaN(numericId)) {
        return res.status(400).json({ error: 'Invalid condition ID' });
    }
    
    try {
        await db.query('DELETE FROM medical_conditions WHERE ConditionID = ?', [numericId]);
        res.json({ success: true, message: 'Condition deleted successfully' });
    } catch (error) {
        console.error('Error deleting condition:', error);
        res.status(500).json({ error: 'Failed to delete condition', details: error.message });
    }
});

// DELETE allergy
router.delete('/allergy/:allergyId', async (req, res) => {
    const { allergyId } = req.params;
    const numericId = parseInt(allergyId, 10);
    if (isNaN(numericId)) {
        return res.status(400).json({ error: 'Invalid allergy ID' });
    }
    
    try {
        await db.query('DELETE FROM allergies WHERE AllergyID = ?', [numericId]);
        res.json({ success: true, message: 'Allergy deleted successfully' });
    } catch (error) {
        console.error('Error deleting allergy:', error);
        res.status(500).json({ error: 'Failed to delete allergy', details: error.message });
    }
});

// DELETE surgery
router.delete('/surgery/:surgeryId', async (req, res) => {
    const { surgeryId } = req.params;
    const numericId = parseInt(surgeryId, 10);
    if (isNaN(numericId)) {
        return res.status(400).json({ error: 'Invalid surgery ID' });
    }
    
    try {
        await db.query('DELETE FROM surgeries WHERE SurgeryID = ?', [numericId]);
        res.json({ success: true, message: 'Surgery deleted successfully' });
    } catch (error) {
        console.error('Error deleting surgery:', error);
        res.status(500).json({ error: 'Failed to delete surgery', details: error.message });
    }
});

// ============================================
// MEDICATIONS API
// ============================================

// GET all medications for a patient
router.get('/medications/:patientId', async (req, res) => {
    const { patientId } = req.params;
    
    console.log('GET /medications/:patientId - patientId:', patientId);

    const numericPatientId = parseInt(patientId, 10);
    if (isNaN(numericPatientId)) {
        return res.status(400).json({ error: 'Invalid patient ID format' });
    }

    try {
        const [medications] = await db.query(
            `SELECT MedicationID as id, MedicationName as name, Dosage as dosage, 
                    Frequency as frequency, PrescribedBy as prescribedBy, Status as status 
             FROM medications 
             WHERE PatientID = ? 
             ORDER BY Created_Date DESC, Created_Time DESC`,
            [numericPatientId]
        );

        console.log('Medications fetched:', medications.length);
        res.json({ success: true, medications: medications || [] });

    } catch (error) {
        console.error('Error fetching medications:', error);
        res.status(500).json({ error: 'Failed to fetch medications', details: error.message });
    }
});

// ADD medication
router.post('/medication/:patientId', async (req, res) => {
    console.log('POST /medication/:patientId - req.params:', req.params);
    console.log('POST /medication/:patientId - req.body:', req.body);
    
    const { patientId } = req.params;
    const { name, dosage, frequency, prescribedBy, status } = req.body;
    
    const numericPatientId = parseInt(patientId, 10);
    if (isNaN(numericPatientId)) {
        return res.status(400).json({ error: 'Invalid patient ID format' });
    }

    if (!name || !name.trim()) {
        return res.status(400).json({ error: 'Medication name is required' });
    }

    try {
        const [patientCheck] = await db.query('SELECT PatientID FROM patient WHERE PatientID = ?', [numericPatientId]);
        if (patientCheck.length === 0) {
            return res.status(404).json({ error: 'Patient not found' });
        }
        
        const [result] = await db.query(
            `INSERT INTO medications 
             (PatientID, MedicationName, Dosage, Frequency, PrescribedBy, Status, Created_Date, Created_Time) 
             VALUES (?, ?, ?, ?, ?, ?, CURDATE(), CURTIME())`,
            [numericPatientId, sanitizeName(name), dosage || null, frequency || null, sanitizeName(prescribedBy) || null, status || 'Active']
        );

        console.log('Medication added, insertId:', result.insertId);
        res.json({ success: true, id: result.insertId, message: 'Medication added successfully' });
    } catch (error) {
        console.error('Error adding medication:', error);
        res.status(500).json({ error: 'Failed to add medication', details: error.message, code: error.code });
    }
});

// DELETE medication
router.delete('/medication/:medicationId', async (req, res) => {
    const { medicationId } = req.params;
    const numericId = parseInt(medicationId, 10);
    if (isNaN(numericId)) {
        return res.status(400).json({ error: 'Invalid medication ID' });
    }
    
    try {
        await db.query('DELETE FROM medications WHERE MedicationID = ?', [numericId]);
        res.json({ success: true, message: 'Medication deleted successfully' });
    } catch (error) {
        console.error('Error deleting medication:', error);
        res.status(500).json({ error: 'Failed to delete medication', details: error.message });
    }
});

// ============================================
// EMERGENCY CONTACTS API
// ============================================

// GET all emergency contacts for a patient
router.get('/emergency-contacts/:patientId', async (req, res) => {
    const { patientId } = req.params;
    
    console.log('GET /emergency-contacts/:patientId - patientId:', patientId);

    const numericPatientId = parseInt(patientId, 10);
    if (isNaN(numericPatientId)) {
        return res.status(400).json({ error: 'Invalid patient ID format' });
    }

    try {
        const [contacts] = await db.query(
            `SELECT ContactID as id, Name as name, Relationship as relationship, 
                    Phone as phone, Email as email, IsPrimary as isPrimary 
             FROM emergency_contacts 
             WHERE PatientID = ? 
             ORDER BY IsPrimary DESC, Created_Date DESC, Created_Time DESC`,
            [numericPatientId]
        );

        console.log('Emergency contacts fetched:', contacts.length);
        res.json({ success: true, contacts: contacts || [] });

    } catch (error) {
        console.error('Error fetching emergency contacts:', error);
        res.status(500).json({ error: 'Failed to fetch emergency contacts', details: error.message });
    }
});

// ADD emergency contact
router.post('/emergency-contact/:patientId', async (req, res) => {
    console.log('POST /emergency-contact/:patientId - req.params:', req.params);
    console.log('POST /emergency-contact/:patientId - req.body:', req.body);
    
    const { patientId } = req.params;
    const { name, relationship, phone, email, isPrimary } = req.body;
    
    const numericPatientId = parseInt(patientId, 10);
    if (isNaN(numericPatientId)) {
        return res.status(400).json({ error: 'Invalid patient ID format' });
    }

    if (!name || !name.trim()) {
        return res.status(400).json({ error: 'Contact name is required' });
    }
    if (!phone || !phone.trim()) {
        return res.status(400).json({ error: 'Phone number is required' });
    }

    const connection = await db.getConnection();
    
    try {
        await connection.beginTransaction();

        const [patientCheck] = await connection.query(
            'SELECT PatientID FROM patient WHERE PatientID = ?', 
            [numericPatientId]
        );
        if (patientCheck.length === 0) {
            await connection.rollback();
            return res.status(404).json({ error: 'Patient not found' });
        }

        if (isPrimary) {
            await connection.query(
                'UPDATE emergency_contacts SET IsPrimary = FALSE, Updated_Date = CURDATE(), Updated_Time = CURTIME() WHERE PatientID = ?',
                [numericPatientId]
            );
        }

        const [result] = await connection.query(
            `INSERT INTO emergency_contacts 
             (PatientID, Name, Relationship, Phone, Email, IsPrimary, Created_Date, Created_Time) 
             VALUES (?, ?, ?, ?, ?, ?, CURDATE(), CURTIME())`,
            [numericPatientId, sanitizeName(name), sanitizeName(relationship) || null, phone.trim(), sanitizeEmail(email), isPrimary ? 1 : 0]
        );

        await connection.commit();

        console.log('Emergency contact added, insertId:', result.insertId);
        res.json({ success: true, id: result.insertId, message: 'Emergency contact added successfully' });
    } catch (error) {
        await connection.rollback();
        console.error('Error adding emergency contact:', error);
        res.status(500).json({ error: 'Failed to add emergency contact', details: error.message, code: error.code });
    } finally {
        connection.release();
    }
});

// UPDATE emergency contact
router.put('/emergency-contact/:contactId', async (req, res) => {
    const { contactId } = req.params;
    const { name, relationship, phone, email, isPrimary } = req.body;
    
    const numericId = parseInt(contactId, 10);
    if (isNaN(numericId)) {
        return res.status(400).json({ error: 'Invalid contact ID' });
    }

    const connection = await db.getConnection();
    
    try {
        await connection.beginTransaction();

        const [contactRows] = await connection.query(
            'SELECT PatientID FROM emergency_contacts WHERE ContactID = ?',
            [numericId]
        );

        if (contactRows.length === 0) {
            await connection.rollback();
            return res.status(404).json({ error: 'Contact not found' });
        }

        const patientId = contactRows[0].PatientID;

        if (isPrimary) {
            await connection.query(
                'UPDATE emergency_contacts SET IsPrimary = FALSE, Updated_Date = CURDATE(), Updated_Time = CURTIME() WHERE PatientID = ? AND ContactID != ?',
                [patientId, numericId]
            );
        }

        await connection.query(
            `UPDATE emergency_contacts 
             SET Name = ?, Relationship = ?, Phone = ?, Email = ?, IsPrimary = ?, Updated_Date = CURDATE(), Updated_Time = CURTIME()
             WHERE ContactID = ?`,
            [sanitizeName(name), sanitizeName(relationship) || null, phone?.trim() || null, sanitizeEmail(email), isPrimary ? 1 : 0, numericId]
        );

        await connection.commit();
        res.json({ success: true, message: 'Emergency contact updated successfully' });
    } catch (error) {
        await connection.rollback();
        console.error('Error updating emergency contact:', error);
        res.status(500).json({ error: 'Failed to update emergency contact', details: error.message });
    } finally {
        connection.release();
    }
});

// SET primary contact
router.patch('/emergency-contact/:contactId/primary', async (req, res) => {
    const { contactId } = req.params;
    const numericId = parseInt(contactId, 10);
    if (isNaN(numericId)) {
        return res.status(400).json({ error: 'Invalid contact ID' });
    }

    const connection = await db.getConnection();
    
    try {
        await connection.beginTransaction();

        const [contactRows] = await connection.query(
            'SELECT PatientID FROM emergency_contacts WHERE ContactID = ?',
            [numericId]
        );

        if (contactRows.length === 0) {
            await connection.rollback();
            return res.status(404).json({ error: 'Contact not found' });
        }

        const patientId = contactRows[0].PatientID;

        await connection.query(
            'UPDATE emergency_contacts SET IsPrimary = FALSE, Updated_Date = CURDATE(), Updated_Time = CURTIME() WHERE PatientID = ?',
            [patientId]
        );

        await connection.query(
            'UPDATE emergency_contacts SET IsPrimary = TRUE, Updated_Date = CURDATE(), Updated_Time = CURTIME() WHERE ContactID = ?',
            [numericId]
        );

        await connection.commit();
        res.json({ success: true, message: 'Primary contact updated successfully' });
    } catch (error) {
        await connection.rollback();
        console.error('Error setting primary contact:', error);
        res.status(500).json({ error: 'Failed to set primary contact', details: error.message });
    } finally {
        connection.release();
    }
});

// DELETE emergency contact
router.delete('/emergency-contact/:contactId', async (req, res) => {
    const { contactId } = req.params;
    const numericId = parseInt(contactId, 10);
    if (isNaN(numericId)) {
        return res.status(400).json({ error: 'Invalid contact ID' });
    }
    
    try {
        await db.query('DELETE FROM emergency_contacts WHERE ContactID = ?', [numericId]);
        res.json({ success: true, message: 'Emergency contact deleted successfully' });
    } catch (error) {
        console.error('Error deleting emergency contact:', error);
        res.status(500).json({ error: 'Failed to delete emergency contact', details: error.message });
    }
});

module.exports = router;
