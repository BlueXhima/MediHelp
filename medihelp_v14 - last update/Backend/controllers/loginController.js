const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const dbconnection = require('../config/db');

// Login Endpoint
router.post('/login', async (req, res) => {
    const { Email, Password } = req.body;

    try {
        // Normalize email to lowercase for case-insensitive comparison
        const normalizedEmail = Email.toLowerCase();

        // Static admin credentials
        const adminCredentials = {
            email: "admin@medihelp.com",
            password: "admin123",
        };

        // Check for static admin credentials
        if (normalizedEmail === adminCredentials.email && Password === adminCredentials.password) {
            return res.json({
                success: true,
                role: "admin",
            });
        }

        console.log('Normalized Email:', normalizedEmail);

        // Query database for user
        const [accounts] = await dbconnection.query(
            'SELECT * FROM users WHERE LOWER(Email) = ?',
            [normalizedEmail]
        );

        console.log('Accounts Retrieved:', accounts);

        if (accounts.length === 0) {
            console.log('No accounts found for the provided email.');
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const user = accounts[0];
        console.log('User Retrieved:', user);

        const passwordMatch = await bcrypt.compare(Password, user.Password);
        console.log('Password Match Result:', passwordMatch);

        if (passwordMatch) {
            return res.json({
                success: true,
                role: user.RoleID === 1 ? 'admin' : 'user',
            });
        } else {
            console.log('Password does not match.');
            return res.status(401).json({ error: 'Invalid email or password' });
        }
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: 'An error occurred during login' });
    }
});

module.exports = router;