// routes/changeEmailOtp.js
const express = require('express');
const router = express.Router();
const transporter = require('../config/mailer');
const { generateOTP, otpStore } = require('../utils/otpUtils');

router.post('/', async (req, res) => {
    const { email } = req.body; // Ito yung bagong email

    if (!email) {
        return res.status(400).json({ success: false, message: 'New email is required' });
    }

    try {
        const otp = generateOTP();
        
        // I-save sa store gamit ang BAGONG email
        otpStore.set(email, {
            otp,
            expiresAt: Date.now() + 10 * 60 * 1000,
        });

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: '🔐 Verify Your New Email - MediHelp',
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                    <h2 style="color: #2563eb;">Email Change Request</h2>
                    <p>You are changing your email to: <strong>${email}</strong></p>
                    <p>Use the code below to verify this change:</p>
                    <h1 style="background: #f3f4f6; padding: 10px; text-align: center; letter-spacing: 5px;">${otp}</h1>
                    <p>If you didn't request this, please secure your account.</p>
                </div>
            `
        });

        res.status(200).json({ success: true, message: 'OTP sent to new email' });
    } catch (error) {
        console.error('Change Email OTP Error:', error);
        res.status(500).json({ success: false, message: 'Failed to send OTP' });
    }
});

module.exports = router;