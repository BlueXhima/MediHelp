const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
// const userController = require('../controllers/userController');
const db = require('../config/db');

// Setup multer storage
const storage = multer.diskStorage({
    destination: 'uploads/', // Siguraduhing existing ang folder na ito
    filename: (req, file, cb) => {
        cb(null, `pfp-${Date.now()}${path.extname(file.originalname)}`);
    }
});
const upload = multer({ storage: storage });


// Endpoint para sa pagkuha ng users table
router.post('/update-profile-full', upload.single('profileImage'), async (req, res) => {
    const { userId, removeProfileImage } = req.body;

    if (!userId) {
        return res.status(400).json({ error: 'User ID is required' });
    }

    try {
        let query = `UPDATE users SET updated_date = CURDATE(), updated_time = CURTIME()`;
        let queryParams = [];

        // Logic for Profile Picture
        if (removeProfileImage === 'true') {
            // This is the "Delete" action for the database
            query += `, profile_picture = NULL`; 
        } else if (req.file) {
            // This is the "Upload/Update" action
            const pfpUrl = `http://localhost:5000/uploads/${req.file.filename}`;
            query += `, profile_picture = ?`;
            queryParams.push(pfpUrl);
        }

        // Finalize query
        query += ` WHERE UserID = ?`;
        queryParams.push(userId);

        await db.query(query, queryParams);
        
        res.json({ 
            message: 'Profile picture processed successfully!',
            success: true 
        });
    } catch (error) {
        console.error('Save Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;