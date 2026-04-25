const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const dbconnection = require('../config/db');
const transporter = require('../config/mailer');

// Login Endpoint
router.post('/login', async (req, res) => {
    // 1. Ginawa nating lowercase 'email' at 'password' para tugma sa login.jsx
    const { email, password } = req.body;

    try {
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        const normalizedEmail = email.toLowerCase();

        // 2. Static admin credentials check
        const adminCredentials = {
            email: "admin@medihelp.com",
            password: "admin123",
        };

        if (normalizedEmail === adminCredentials.email && password === adminCredentials.password) {
            return res.json({
                success: true,
                token: "admin-token-123", // Sample token
                role: "admin",
                user: { UserID: 0, FullName: "Administrator", Email: normalizedEmail }
            });
        }

        // 3. Query database for user
        const [accounts] = await dbconnection.query(
            'SELECT * FROM users WHERE LOWER(Email) = ?',
            [normalizedEmail]
        );

        if (accounts.length === 0) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const user = accounts[0];

        // 4. Password comparison
        const passwordMatch = await bcrypt.compare(password, user.Password);

        if (passwordMatch) {
            // 5. IMPORTANTE: Dito natin ibabalik ang lahat ng kailangan ng Frontend
            return res.json({
                success: true,
                token: "your-session-token", // Dito mo ilalagay yung JWT kung meron na
                role: user.RoleID === 1 ? 'admin' : 'user',
                // Ibinabalik natin ang user object para ma-save sa LocalStorage
                user: {
                    UserID: user.UserID,
                    FullName: user.FullName,
                    Email: user.Email
                }
            });
        } else {
            return res.status(401).json({ error: 'Invalid email or password' });
        }
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: 'An error occurred during login' });
    }
});

// Endpoint Security Alert Email
router.post('/send-security-alert', async (req, res) => {
    const { Email, Device, Time } = req.body;
    
    // Check if email exists before sending (Optional but recommended)
    const mailOptions = {
        from: `"MediHelp Security" <${process.env.EMAIL_USER}>`,
        to: Email,
        subject: 'Security Alert: Failed Login Attempts',
        html: `
            <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee;">
                <h2 style="color: #dc2626;">Security Notification</h2>
                <p>Multiple failed login attempts were detected on your account.</p>
                <p><b>Time:</b> ${Time}</p>
                <p><b>Device/Browser:</b> ${Device}</p>
                <p>Your account has been temporarily restricted for security purposes. If this wasn't you, please reset your password immediately.</p>
            </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({ success: true, message: "Alert sent" });
    } catch (error) {
        console.error("Email error:", error);
        res.status(500).json({ error: "Failed to send email alert" });
    }
});

module.exports = router;