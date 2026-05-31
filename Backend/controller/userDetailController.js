const express = require('express');
const router = express.Router();
const dbconnection = require('../config/db');
const verifyToken = require('../middleware/auth');

const { decrypt } = require('../utils/encryptionUtils');

// Fetch User Details Endpoint
router.get('/user-details', verifyToken, async (req, res) => {
    // Ngayon, ang user info ay galing na sa token (req.user)
    // Hindi na kailangan ng req.query.email
    // Ang email ay kukunin na natin sa decoded JWT token (req.user)
    const emailFromToken = req.user.Email;

    if (!emailFromToken) {
        return res.status(400).json({ error: 'Email is required' });
    }

    try {
        const [users] = await dbconnection.query(
            `SELECT 
                u.UserID, u.FirstName, u.LastName, u.Email, u.profile_picture, u.isVerified,
                p.Address, 
                p.DateOfBirth, -- Siguraduhing ito ang exact column name sa database mo (hindi Birthdate)
                p.Gender, 
                p.BloodType, 
                p.Height_cm AS Height, 
                p.Weight_kg AS Weight
            FROM users u
            LEFT JOIN patient p ON u.UserID = p.UserID 
            WHERE u.Email = ?`,
            [emailFromToken]
        );

        if (users.length > 0) {
            const user = users[0];

            // 1. 💡 I-decrypt muna ang address bago i-send
            let decryptedAddress = user.Address;
            if (user.Address) {
                try {
                    decryptedAddress = decrypt(user.Address); // Tinatawag ang iyong encryptionUtils helper
                } catch (decError) {
                    console.error("Decryption failed:", decError.message);
                    // Kung mag-error, mananatiling encrypted para hindi mag-crash ang app
                }
            }

            // 2. I-send ang data na may kasamang decrypted address at tamang mapping
            return res.json({ 
                userID: user.UserID, 
                firstName: user.FirstName, 
                lastName: user.LastName, 
                email: user.Email,
                profile_picture: user.profile_picture,
                isVerified: user.isVerified,
                address: decryptedAddress,
                birthdate: user.DateOfBirth,
                gender: user.Gender,
                bloodType: user.BloodType,
                height: user.Height,
                weight: user.Weight
            });
        }
        return res.status(404).json({ error: 'User not found' });
    } catch (error) {
        console.error("Error fetching user details:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;