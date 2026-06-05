const crypto = require('crypto');
const bcrypt = require('bcrypt');
const dbconnection = require('../config/db');
const sendEmailViaGoogle  = require('../config/mailer');

exports.requestReset = async (req, res) => {
    const { email } = req.body;
    
    if (!email) {
        return res.status(400).json({ error: "Email is required" });
    }

    try {
        const normalizedEmail = email.toLowerCase().trim();
        const [users] = await dbconnection.query('SELECT * FROM users WHERE Email = ?', [normalizedEmail]);
        
        // Security feature: Huwag ipalaminf sa hacker kung umiiral ba ang email o hindi
        if (users.length === 0) {
            return res.json({ success: true, message: "If that email exists, a link has been sent." });
        }

        const resetToken = crypto.randomBytes(32).toString('hex');
        const tokenExpiry = new Date(Date.now() + 3600000); 

        const expiryDate = tokenExpiry.toISOString().split('T')[0];
        const expiryTime = tokenExpiry.toTimeString().split(' ')[0];

        await dbconnection.query(
            'UPDATE users SET ResetToken = ?, resetExpiryDate = ?, resetExpiryTime = ? WHERE Email = ?',
            [resetToken, expiryDate, expiryTime, normalizedEmail]
        );

        const baseUrl = process.env.NEW_CLIENT_URL;
        const resetUrl = `${baseUrl.replace(/\/$/, '')}/forgot-password?token=${resetToken}&email=${normalizedEmail}`;
        
         // Pinalitan ang Nodemailer ng Google Apps Script integration
        await sendEmailViaGoogle(
            normalizedEmail,
            'Password Reset Request',
            `<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden;">
                <div style="background-color: #4f46e5; padding: 30px; text-align: center; color: white;">
                    <h1 style="margin: 0;">MediHelp</h1>
                </div>
                <div style="padding: 40px; color: #1e293b;">
                    <h2 style="margin-top: 0;">Reset Your Password</h2>
                    <p>Click the button below to reset your password. This link is valid for 1 hour.</p>
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${resetUrl}" style="display: inline-block; background: #4f46e5; color: white; padding: 12px 25px; text-decoration: none; border-radius: 8px; font-weight: bold;">Reset Password</a>
                    </div>
                    <p style="font-size: 12px; color: #64748b; margin-bottom: 0;">If you didn't request this change, you can safely ignore this email.</p>
                </div>
            </div>`
        );

        return res.json({ success: true, message: "If that email exists, a link has been sent." });
    } catch (error) {
        console.error("Request Reset Main Flow Error:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

exports.resetPassword = async (req, res) => {
    const { email, token, newPassword } = req.body;

    if (!email || !token || !newPassword) {
        return res.status(400).json({ error: "Missing required fields." });
    }

    try {
        const normalizedEmail = email.toLowerCase().trim();
        
        const [users] = await dbconnection.query(
            `SELECT * FROM users 
            WHERE Email = ? 
            AND ResetToken = ? 
            AND TIMESTAMP(resetExpiryDate, resetExpiryTime) > NOW()`,
            [normalizedEmail, token]
        );

        if (users.length === 0) {
            return res.status(400).json({ error: "Invalid or expired reset link." });
        }

        // --- FIX: Isama ang Pepper bago i-hash ---
        // Gamitin kung ano ang nasa registerController mo (PASSWORD_PEPPER)
        const pepper = process.env.PASSWORD_PEPPER || ""; 
        const passwordWithPepper = newPassword + pepper;
        
        const hashedPassword = await bcrypt.hash(passwordWithPepper, 10);
        // ----------------------------------------

        await dbconnection.query(
            'UPDATE users SET Password = ?, ResetToken = NULL, resetExpiryDate = NULL, resetExpiryTime = NULL WHERE Email = ?',
            [hashedPassword, normalizedEmail]
        );

        res.json({ success: true, message: "Password updated successfully!" });
    } catch (error) {
        console.error("Reset Error:", error);
        res.status(500).json({ error: "Failed to reset password." });
    }
};
