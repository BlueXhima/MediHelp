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
            subject: 'Your MediHelp Verification Code',
            html: `
                <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7fb; padding: 40px 20px; text-align: center;">
                    <div style="max-width: 500px; margin: 0 auto; background-color: #ffffff; border-radius: 24px; padding: 40px; shadow: 0 10px 25px rgba(0,0,0,0.05); border: 1px solid #e1e8f0;">
                        
                        <div style="margin-bottom: 30px;">
                            <div style="display: inline-block; padding: 15px; background-color: #f0f7ff; border-radius: 20px; margin-bottom: 15px;">
                                <img src="https://img.icons8.com/fluency/96/stethoscope.png" width="50" height="50" alt="MediHelp Logo" />
                            </div>
                            <h2 style="color: #0f172a; margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.5px;">MediHelp Security</h2>
                        </div>

                        <div style="height: 1px; background-color: #f1f5f9; width: 100%; margin-bottom: 30px;"></div>

                        <p style="color: #64748b; font-size: 16px; line-height: 1.6; margin-bottom: 25px;">
                            Hello! To complete your registration and keep your medical records secure, please use the 6-digit verification code below:
                        </p>

                        <div style="background-color: #f8fafc; border: 2px dashed #cbd5e1; border-radius: 16px; padding: 25px; margin-bottom: 30px;">
                            <h1 style="color: #2563eb; font-size: 42px; font-weight: 900; letter-spacing: 12px; margin: 0; font-family: monospace;">${otp}</h1>
                        </div>

                        <p style="color: #94a3b8; font-size: 13px; margin-bottom: 0;">
                            This code will expire in <strong style="color: #ef4444;">10 minutes</strong>.
                        </p>
                        <p style="color: #94a3b8; font-size: 13px; margin-top: 5px;">
                            If you didn't request this, you can safely ignore this email.
                        </p>

                        <div style="height: 1px; background-color: #f1f5f9; width: 100%; margin-top: 30px; margin-bottom: 30px;"></div>

                        <p style="color: #cbd5e1; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; font-weight: 700;">
                            © 2026 MediHelp Healthcare Platform
                        </p>
                    </div>
                    
                    <p style="color: #94a3b8; font-size: 12px; margin-top: 20px;">
                        Imus, Cavite, Philippines
                    </p>
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