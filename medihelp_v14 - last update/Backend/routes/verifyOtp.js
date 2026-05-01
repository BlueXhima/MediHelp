const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { otpStore } = require('../utils/otpUtils');
const dbconnection = require('../config/db');

router.post('/verify-otp', async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({ success: false, message: 'Email and OTP are required.' });
        }

        // 1. Kuhanin ang OTP data mula sa Map()
        const otpData = otpStore.get(email);

        if (!otpData) {
            return res.status(400).json({ success: false, message: 'OTP expired or not found.' });
        }

        // 2. I-check kung expired na ang OTP
        if (Date.now() > otpData.expiresAt) {
            otpStore.delete(email); // Linisin ang expired data
            return res.status(400).json({ success: false, message: 'OTP has expired.' });
        }

        // 3. I-verify kung tama ang OTP
        if (otpData.otp !== otp) {
            return res.status(400).json({ success: false, message: 'Invalid verification code.' });
        }

        // 4. Kuhanin ang User details mula sa DB
        const [users] = await dbconnection.query(
            'SELECT UserID, FirstName, LastName, RoleID FROM users WHERE Email = ?',
            [email]
        );

        if (users.length === 0) {
            return res.status(404).json({ success: false, message: 'User record not found.' });
        }

        const user = users[0];

        // 5. GENERATE JWT TOKEN
        const token = jwt.sign(
            { 
                UserID: user.UserID, 
                Email: email, 
                Role: user.RoleID 
            },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        // 6. I-STORE SA SECURE COOKIE
        res.cookie('token', token, {
            httpOnly: true,
            secure: false, // Set to true if using HTTPS
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000 
        });

        // 7. Linisin ang otpStore pagkatapos ng success
        otpStore.delete(email);

        return res.status(200).json({ 
            success: true, 
            message: 'Email verified successfully!',
            user: {
                firstName: user.FirstName,
                lastName: user.LastName,
                email: user.Email
            }
        });

    } catch (error) {
        console.error('Verification Error:', error);
        return res.status(500).json({ success: false, message: 'Internal server error.' });
    }
});

module.exports = router;