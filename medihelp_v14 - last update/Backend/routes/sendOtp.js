const express = require('express');
const router = express.Router();
const transporter = require('../config/mailer');
const { generateOTP, otpStore } = require('../utils/otpUtils');

router.post('/send-otp', async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ message: 'Email is required' });

        const otp = generateOTP();
        otpStore.set(email, { otp, expiresAt: Date.now() + 10 * 60 * 1000 });

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Your MediHelp OTP',
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; text-align: center;">
                    <h2 style="color: #2563eb;">MediHelp Verification</h2>
                    <p>Your OTP code is:</p>
                    <h1 style="letter-spacing: 5px;">${otp}</h1>
                    <p>Expires in 10 minutes.</p>
                </div>
            `
        });

        return res.status(200).json({ success: true, message: 'OTP sent successfully' });
    } catch (error) {
        console.error('Mailer Error:', error);
        return res.status(500).json({ success: false, message: 'Failed to send OTP' });
    }
});

module.exports = router;