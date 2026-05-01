const express = require('express');
const router = express.Router();
const transporter = require('../config/mailer');
const { generateOTP, otpStore } = require('../utils/otpUtils');
const dbconnection = require('../config/db');

router.put('/change-email', async (req, res) => {
    const { oldEmail, newEmail } = req.body;

    if (!oldEmail || !newEmail) {
        return res.status(400).json({ success: false, message: 'Both old and new email are required.' });
    }

    try {
        // 1. Check if NEW email is already taken by ANOTHER user
        const [existingUser] = await dbconnection.query(
            'SELECT UserID FROM users WHERE Email = ?', 
            [newEmail]
        );

        if (existingUser.length > 0) {
            return res.status(400).json({ 
                success: false, 
                message: 'This new email is already registered to another account.' 
            });
        }

        // 2. Generate OTP first[cite: 17, 18]
        const otp = generateOTP();
        
        // I-save sa store gamit ang NEW email
        otpStore.set(newEmail, {
            otp,
            expiresAt: Date.now() + 1 * 60 * 1000, // Gawin nating 1 min para hindi masyadong bitin
        });

        // 3. Update Database (Temporary change or mark as unverified)
        await dbconnection.query(
            'UPDATE users SET Email = ?, Updated_Date = CURDATE(), Updated_Time = CURTIME() WHERE Email = ?',
            [newEmail, oldEmail]
        );

        // 5. Send Mail to the NEW email address
        await transporter.sendMail({
            from: `"MediHelp Team" <${process.env.EMAIL_USER}>`,
            to: newEmail,
            subject: 'Verify Your New Email - MediHelp',
            html: `
                <div style="font-family: 'Inter', -apple-system, sans-serif; background-color: #f9fafb; padding: 60px 20px; color: #374151; line-height: 1.5;">
                    <div style="max-width: 480px; margin: 0 auto; background-color: #ffffff; border-radius: 24px; padding: 40px; border: 1px solid #f3f4f6; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
                        
                        <!-- Brand Header -->
                        <div style="text-align: center; margin-bottom: 32px;">
                            <div style="display: inline-block; width: 64px; height: 64px; background-color: #eff6ff; border-radius: 16px; margin-bottom: 12px; padding: 12px; box-sizing: border-box;">
                                <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiMyNTYzZWIiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cGF0aCBkPSJNNC44IDIuM0EuMy4zIDAgMSAwIDUgMkg0YTIgMiAwIDAgMC0yIDJ2NWE2IDYgMCAwIDAgNiA2djBhNiA2IDAgMCAwIDYtNlY0YTIgMiAwIDAgMC0yLTJoLTFhLjIuMiAwIDEgMCAuMy4zIj48L3BhdGg+PHBhdGggZD0iTTggMTV2MWE2IDYgMCAwIDAgNiA2djBhNiA2IDAgMCAwIDYtNnYtNCI+PC9wYXRoPjxjaXJjbGUgY3g9IjIwIiBjeT0iMTAiIHI9IjIiPjwvY2lyY2xlPjwvc3ZnPg==" 
                                    alt="MediHelp Logo" 
                                    style="width: 100%; height: auto; display: block;" />
                            </div>
                            <h2 style="margin: 0; font-size: 20px; font-weight: 800; color: #111827; letter-spacing: -0.025em;">MediHelp</h2>
                            <p style="margin: 0; color: #64748b; font-size: 14px;">Secure Email Update</p>
                        </div>

                        <!-- Message Body -->
                        <div style="text-align: left; margin-bottom: 32px;">
                            <p style="font-size: 14px; color: #6b7280; margin: 0;">
                                You recently requested to change your email address. To complete this secure process, please use the verification code below.
                            </p>
                        </div>

                        <!-- Minimalist OTP Box -->
                        <div style="background-color: #f8fafc; border-radius: 16px; padding: 32px; text-align: center; border: 1px solid #e5e7eb; margin-bottom: 24px;">
                            <span style="display: block; font-size: 11px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 12px;">Verification Code</span>
                            <h1 style="font-family: 'Courier New', monospace; font-size: 40px; font-weight: 800; letter-spacing: 8px; color: #2563eb; margin: 0;">${otp}</h1>
                        </div>

                        <!-- Security Note -->
                        <p style="font-size: 12px; color: #9ca3af; text-align: center; margin-bottom: 32px;">
                            This code will expire in <span style="color: #4b5563; font-weight: 600;">1 minute</span>. If you didn't request this, please ignore this email.
                        </p>

                        <!-- Footer -->
                        <div style="border-top: 1px solid #f3f4f6; padding-top: 24px; text-align: center;">
                            <p style="font-size: 11px; font-weight: 700; color: #d1d5db; text-transform: uppercase; letter-spacing: 0.05em; margin: 0;">
                                © 2026 MediHelp Philippines
                            </p>
                            <p style="font-size: 11px; color: #d1d5db; margin: 4px 0 0 0;">Imus, Cavite</p>
                        </div>

                    </div>
                </div>
            `
        });

        res.status(200).json({ 
            success: true, 
            message: 'Email updated in records. Please verify with the OTP sent to your new email.' 
        });

    } catch (error) {
        console.error('Change Email OTP Error:', error);
        res.status(500).json({ success: false, message: 'Database or Mailer error.' });
    }
});

module.exports = router;