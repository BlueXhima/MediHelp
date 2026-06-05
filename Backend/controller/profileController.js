const db = require('../config/db');
const path = require('path');
const fs = require('fs');

const { encrypt, decrypt } = require('../utils/encryptionUtils');
const { sanitizeName, sanitizeAddress } = require('../utils/sanitizer');

// Fetch Health Metrics
exports.getLatestMetrics = async (req, res) => {
    const { patientId } = req.params;
    const numericPatientId = parseInt(patientId, 10);
    if (isNaN(numericPatientId)) return res.status(400).json({ error: 'Invalid patient ID' });

    try {
        const [metrics] = await db.query(
            `SELECT MetricID as id, BloodPressure as bloodPressure, HeartRate as heartRate,
                    Weight_kg as weight, Height_cm as height, BloodSugar as bloodSugar,
                    Temperature as temperature, RecordedDate as recordedDate, RecordedTime as recordedTime
            FROM health_metrics WHERE PatientID = ? ORDER BY RecordedDate DESC, RecordedTime DESC LIMIT 1`,
            [numericPatientId]
        );
        res.json({ success: true, metrics: metrics[0] || null });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch metrics', details: error.message });
    }
};

// BAGONG DAGDAG: Controller para mag-insert ng bagong parameters ng Health Metrics
exports.updateMetrics = async (req, res) => {
    const { patientId } = req.params;
    const { bloodPressure, heartRate, weight, height, bloodSugar, temperature } = req.body;
    
    const numericPatientId = parseInt(patientId, 10);
    if (isNaN(numericPatientId)) return res.status(400).json({ error: 'Invalid patient ID' });

    try {
        await db.query(
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

        res.json({ success: true, message: 'Health metrics updated successfully!' });
    } catch (error) {
        console.error("Metrics Update Error:", error);
        res.status(500).json({ error: 'Failed to record health metrics', details: error.message });
    }
};

// Fetch Full Patient Profile
exports.getPatientProfile = async (req, res) => {
    const userId = req.user.UserID; // Tama ito, nanggagaling sa verifyToken cookie
    try {
        const [patientRows] = await db.query('SELECT * FROM patient WHERE UserID = ?', [userId]);
        
        // TINANGGAL ANG Phone DITO:
        const [userRows] = await db.query('SELECT Email, profile_picture FROM users WHERE UserID = ?', [userId]);
        
        let patientData = patientRows[0] || { 
            FirstName: '', LastName: '', Address: '', Gender: '', 
            Height_cm: '', Weight_kg: '', DateOfBirth: '', BloodType: '' 
        };

        if (patientData.Address) {
            patientData.Address = decrypt(patientData.Address);
        }

        const combinedData = {
            ...patientData,
            Email: userRows[0]?.Email || '',
            // TINANGGAL ANG Phone DITO:
            profile_picture: userRows[0]?.profile_picture || ''
        };
        
        res.json(combinedData);
    } catch (error) {
        res.status(500).json({ error: 'Database error', details: error.message });
    }
};

// Update Patient Profile
exports.updateFullProfile = async (req, res) => {
    const userId = req.user.UserID; // Ligtas na kinuha mula sa token

    // TINANGGAL ANG phone DITO:
    const { 
        firstName, lastName, email, address, gender, 
        height, weight, dob, bloodType, removeProfileImage 
    } = req.body;

    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        const cleanFirstName = sanitizeName(firstName);
        const cleanLastName = sanitizeName(lastName);
        const cleanAddress = sanitizeAddress(address);
        const encryptedAddress = cleanAddress ? encrypt(cleanAddress) : null;

        // Siguraduhing magiging null kapag blanko ang string ('') para hindi mag-error ang ENUM column
        const finalGender = (gender && gender.trim() !== '') ? gender : null;

        // TINANGGAL ANG Phone = ?, AT ANG phone VARIABLE SA ARRAY DITO:
        await connection.query(
            'UPDATE users SET FirstName = ?, LastName = ?, Email = ?, Updated_Date = CURDATE(), Updated_Time = CURTIME() WHERE UserID = ?',
            [cleanFirstName, cleanLastName, email, userId]
        );

        const [patientExists] = await connection.query('SELECT PatientID FROM patient WHERE UserID = ?', [userId]);

        if (patientExists.length > 0) {
             await connection.query(
                `UPDATE patient SET 
                    FirstName = ?, LastName = ?, Address = ?, Gender = ?, 
                    Height_cm = ?, Weight_kg = ?, DateOfBirth = ?, BloodType = ?,
                    Updated_Date = CURDATE(), Updated_Time = CURTIME() 
                WHERE UserID = ?`,
                // Ginamit ang finalGender variable
                [cleanFirstName, cleanLastName, encryptedAddress, finalGender, height || null, weight || null, dob || null, bloodType || null, userId]
            );
        } else {
            await connection.query(
                `INSERT INTO patient 
                    (UserID, FirstName, LastName, Address, Gender, Height_cm, Weight_kg, DateOfBirth, BloodType, Created_Date, Created_Time) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, CURDATE(), CURTIME())`,
                // Ginamit ang finalGender variable
                [userId, cleanFirstName, cleanLastName, encryptedAddress, finalGender, height || null, weight || null, dob || null, bloodType || null]
            );
        }

        // --- Simula ng Image Management (Walang Pagbabago Dito) ---
        let finalImageUrl = null;
        let oldImagePath = null;

        if (removeProfileImage === 'true' || removeProfileImage === true) {
            const [currentUser] = await connection.query('SELECT profile_picture FROM users WHERE UserID = ?', [userId]);
            if (currentUser[0]?.profile_picture) {
                const filename = currentUser[0].profile_picture.split('/').pop();
                oldImagePath = path.join(__dirname, '..', 'uploads', filename);
            }
            await connection.query('UPDATE users SET profile_picture = NULL WHERE UserID = ?', [userId]);
        } else if (req.file) {
            const [currentUser] = await connection.query('SELECT profile_picture FROM users WHERE UserID = ?', [userId]);
            if (currentUser[0]?.profile_picture) {
                const filename = currentUser[0].profile_picture.split('/').pop();
                oldImagePath = path.join(__dirname, '..', 'uploads', filename);
            }

            // Babasahin nito kung HTTPS ang orihinal na request bago pumasok sa proxy gateway
            const protocol = req.headers['x-forwarded-proto'] || req.protocol;
            finalImageUrl = `${protocol}://${req.get('host')}/uploads/${req.file.filename}`;
            
            await connection.query(
                'UPDATE users SET profile_picture = ?, Updated_Date = CURDATE(), Updated_Time = CURTIME() WHERE UserID = ?', 
                [finalImageUrl, userId]
            );
        }

        await connection.commit();

        if (oldImagePath && fs.existsSync(oldImagePath)) {
            try {
                fs.unlinkSync(oldImagePath);
            } catch (err) {
                console.error("Failed to delete physical file:", err.message);
            }
        }

        res.json({ 
            success: true, 
            message: 'Profile updated with security encryption!',
            profile_picture: finalImageUrl
        });
    } catch (error) {
        await connection.rollback();
        console.error("Profile Update Error:", error);
        res.status(500).json({ error: 'Failed to update profile', details: error.message });
    } finally {
        connection.release();
    }
};
