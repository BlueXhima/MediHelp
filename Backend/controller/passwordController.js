const crypto = require('crypto');
const bcrypt = require('bcrypt');
const dbconnection = require('../config/db');
const transporter = require('../config/mailer');

exports.requestReset = async (req, res) => {
    const { email } = req.body;
    const normalizedEmail = email.toLowerCase().trim();

    try {
        const [users] = await dbconnection.query('SELECT * FROM users WHERE Email = ?', [normalizedEmail]);
        
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

        const resetUrl = `http://localhost:5173/forgot-password?token=${resetToken}&email=${normalizedEmail}`;
        
        await transporter.sendMail({
            from: `"MediHelp Support" <${process.env.EMAIL_USER}>`,
            to: normalizedEmail,
            subject: 'Password Reset Request',
            html: `<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden;">
                <div style="background-color: #4f46e5; padding: 30px; text-align: center; color: white;">
                    <h1>MediHelp</h1>
                </div>
                <div style="padding: 40px; color: #1e293b;">
                    <h2>Reset Your Password</h2>
                    <p>Click the button below to reset your password. This link is valid for 1 hour.</p>
                    <a href="${resetUrl}" style="display: inline-block; background: #4f46e5; color: white; padding: 12px 25px; text-decoration: none; border-radius: 8px;">Reset Password</a>
                </div>
            </div>`
        });

        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
};

exports.resetPassword = async (req, res) => {
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

        // --- FIX: Isama ang Pepper bago i-hash ---
        // Gamitin kung ano ang nasa registerController mo (PASSWORD_PEPPER)
        const pepper = process.env.PASSWORD_PEPPER || ""; 
        const passwordWithPepper = newPassword + pepper;
        
        const hashedPassword = await bcrypt.hash(passwordWithPepper, 10);
        // ----------------------------------------

        await dbconnection.query(
            'UPDATE users SET Password = ?, ResetToken = NULL, resetExpiryDate = NULL, resetExpiryTime = NULL WHERE Email = ?',
            [hashedPassword, email]
        );

        res.json({ success: true, message: "Password updated successfully!" });
    } catch (error) {
        console.error("Reset Error:", error);
        res.status(500).json({ error: "Failed to reset password." });
    }
};