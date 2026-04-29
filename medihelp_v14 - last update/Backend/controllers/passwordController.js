const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const dbconnection = require('../config/db');
const transporter = require('../config/mailer');

// Step 1: Request Password Reset
router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
    const normalizedEmail = email.toLowerCase().trim();

    try {
        const [users] = await dbconnection.query('SELECT * FROM users WHERE Email = ?', [normalizedEmail]);
        
        if (users.length === 0) {
            // Security Tip: Don't reveal if email exists. Send success anyway.
            return res.json({ success: true, message: "If that email exists, a link has been sent." });
        }

        // Generate a random token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const tokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now

        const expiryDate = tokenExpiry.toISOString().split('T')[0]; // Format: YYYY-MM-DD
        const expiryTime = tokenExpiry.toTimeString().split(' ')[0];

        // Store token in DB (You may need to add ResetToken and ResetExpiry columns to your users table)
        await dbconnection.query(
            'UPDATE users SET ResetToken = ?, resetExpiryDate = ?, resetExpiryTime = ? WHERE Email = ?',
            [resetToken, expiryDate, expiryTime, normalizedEmail]
        );

        // Send Email
        const resetUrl = `http://localhost:5173/forgot-password?token=${resetToken}&email=${normalizedEmail}`;
        
        await transporter.sendMail({
            from: `"MediHelp Support" <${process.env.EMAIL_USER}>`,
            to: normalizedEmail,
            subject: 'Password Reset Request',
            html: `
                <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; background-color: #ffffff;">
                    <div style="background-color: #4f46e5; padding: 30px; text-align: center;">
                        <h1 style="color: white; margin: 0; font-size: 28px; letter-spacing: -0.5px;">MediHelp</h1>
                        <p style="color: #e0e7ff; margin: 5px 0 0 0; font-size: 14px;">Your Health, Our Priority</p>
                    </div>

                    <div style="padding: 40px 30px; color: #1e293b; line-height: 1.6;">
                        <h2 style="font-size: 20px; margin-top: 0;">Password Reset Request</h2>
                        <p>Hello,</p>
                        <p>We received a request to reset the password for your MediHelp account. If you didn't make this request, you can safely ignore this email.</p>
                        
                        <div style="text-align: center; margin: 40px 0;">
                            <a href="${resetUrl}" style="background-color: #4f46e5; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; box-shadow: 0 4px 6px -1px rgba(79, 70, 229, 0.2);">
                                Reset My Password
                            </a>
                        </div>

                        <p style="font-size: 13px; color: #64748b;">
                            <b>Note:</b> This link is valid for <b>1 hour</b> only. For your security, please do not share this link with anyone.
                        </p>
                        
                        <hr style="border: 0; border-top: 1px solid #f1f5f9; margin: 30px 0;">
                        
                        <p style="font-size: 12px; color: #94a3b8;">
                            If the button above doesn't work, copy and paste this URL into your browser: <br>
                            <a href="${resetUrl}" style="color: #4f46e5; word-break: break-all;">${resetUrl}</a>
                        </p>
                    </div>

                    <div style="background-color: #f8fafc; padding: 20px; text-align: center; color: #94a3b8; font-size: 12px;">
                        <p style="margin: 0;">&copy; 2026 MediHelp Philippines. All rights reserved.</p>
                        <p style="margin: 5px 0 0 0;">Imus, Cavite, Philippines</p>
                    </div>
                </div>
            `
        });

        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Step 2: Update Password
router.post('/reset-password', async (req, res) => {
    const { email, token, newPassword } = req.body;

    try {
        const [users] = await dbconnection.query(
            `SELECT * FROM users 
            WHERE Email = ? 
            AND ResetToken = ? 
            AND TIMESTAMP(resetExpiryDate, resetExpiryTime) > NOW()`,
            [email, token]
        );

        if (users.length === 0) {
            return res.status(400).json({ error: "Invalid or expired reset link." });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update password and clear the token
        await dbconnection.query(
            'UPDATE users SET Password = ?, ResetToken = NULL, resetExpiryDate = NULL, resetExpiryTime = NULL WHERE Email = ?',
            [hashedPassword, email]
        );

        res.json({ success: true, message: "Password updated successfully!" });
    } catch (error) {
        res.status(500).json({ error: "Failed to reset password." });
    }
});

module.exports = router;