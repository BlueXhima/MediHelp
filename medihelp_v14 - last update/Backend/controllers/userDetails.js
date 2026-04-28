const express = require('express');
const router = express.Router();
const dbconnection = require('../config/db');
const verifyToken = require('../middleware/auth');

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
            'SELECT UserID, FirstName, LastName, Email, profile_picture FROM users WHERE Email = ?',
            [emailFromToken]
        );

        if (users.length > 0) {
            const user = users[0];
            return res.json({ 
                userID: user.UserID, 
                firstName: user.FirstName, 
                lastName: user.LastName, 
                email: user.Email,
                profile_picture: user.profile_picture 
            });
        }
        return res.status(404).json({ error: 'User not found' });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;