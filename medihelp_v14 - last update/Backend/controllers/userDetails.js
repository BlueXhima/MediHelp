const express = require('express');
const router = express.Router();
const dbconnection = require('../config/db');

// Fetch User Details Endpoint
router.get('/user-details', async (req, res) => {
    const { email } = req.query;

    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }

    try {
        const [users] = await dbconnection.query(
            'SELECT FirstName, LastName FROM users WHERE Email = ?',
            [email]
        );

        if (users.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const user = users[0];
        res.json({ firstName: user.FirstName, lastName: user.LastName });
    } catch (error) {
        console.error('Error fetching user details:', error);
        res.status(500).json({ error: 'An error occurred while fetching user details' });
    }
});

module.exports = router;