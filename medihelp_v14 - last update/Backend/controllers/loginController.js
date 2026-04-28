const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dbconnection = require('../config/db');
const transporter = require('../config/mailer');
const axios = require('axios');
const rateLimit = require('express-rate-limit');


// I-define ang limiter rules
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes na window
    max: 5, // Limitahan sa 5 attempts bawat IP sa loob ng 15 mins
    handler: (req, res) => {
        res.status(429).json({ 
            error: "Too many login attempts from this IP. Please try muli after 15 minutes." 
        });
    },
    standardHeaders: true, // I-send ang rate limit info sa headers
    legacyHeaders: false,
});

// Login Endpoint
router.post('/login', loginLimiter, async (req, res) => {
    // 1. Ginawa nating lowercase 'email' at 'password' para tugma sa login.jsx
    const { email, password, captchaToken } = req.body;
    console.log("Login Attempt:", email, password);

    try {
        if (captchaToken) {
            const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${captchaToken}`;
            const captchaResponse = await axios.post(verifyUrl);
            
            if (!captchaResponse.data.success) {
                return res.status(400).json({ error: 'CAPTCHA session expired. Please try again.' });
            }
        }

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        const normalizedEmail = email ? email.toLowerCase().trim() : "";

        // 2. Static admin credentials check
        const adminCredentials = {
            email: "admin@medihelp.com",
            password: "admin123",
        };

        if (normalizedEmail === adminCredentials.email && password === adminCredentials.password) {
            const token = jwt.sign(
                { UserID: 0, Email: adminCredentials.email, Role: 1 }, 
                process.env.JWT_SECRET,
                { expiresIn: '10h' }
            );

            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 3600000 
            });

            // IMPORTANT: Return agad para hindi na tumuloy sa database check sa baba
            return res.json({ success: true, role: 'admin', email: adminCredentials.email });
        }

        // 3. Query database for user
        const [users] = await dbconnection.query('SELECT * FROM users WHERE Email = ?', [normalizedEmail]);

        if (users.length === 0) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Bago i-compare o i-hash:
        const pepper = process.env.PASSWORD_PEPPER;
        const passwordWithPepper = password + pepper;

        const user = users[0];

        // 4. Password comparison
        const isMatch = await bcrypt.compare(password, user.Password);

        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        if (isMatch) {
            // 4. GENERATE JWT TOKEN
            // Isasama natin ang UserID at Role para magamit sa frontend permissions
            const token = jwt.sign(
                { 
                    UserID: user.UserID, 
                    Email: user.Email, 
                    Role: user.RoleID 
                },
                process.env.JWT_SECRET,
                { expiresIn: '24h' } // Mag-eexpire ang session after 1 day
            );

            // 4. HTTPONLY COOKIE IMPLEMENTATION (ETO ANG BAGONG DAGDAG)
            // Sa halip na sa body lang, ilalagay natin ang token sa cookie para mas safe.
            res.cookie('token', token, {
                httpOnly: true, // Invisible sa JavaScript (Proteksyon sa XSS)
                secure: false,
                // secure: process.env.NODE_ENV === 'production', // Dapat true kung naka-HTTPS (Live site)
                sameSite: 'lax',
                // sameSite: 'strict', // Proteksyon sa CSRF
                maxAge: 24 * 60 * 60 * 1000 // 24 Hours na buhay ng cookie
            });

            return res.json({
                success: true,
                // token: token, // Ito ang JWT na ise-save sa LocalStorage
                role: 'user',
                email: user.Email
                // Optional: Pwede mo pa rin i-send ang token dito kung gusto mong i-store 
                // sa LocalStorage for non-sensitive data, pero cookies ang primary focus natin.
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

router.get('/verify-session', (req, res) => {
    const token = req.cookies.token; // Basahin ang cookie

    if (!token) return res.status(401).json({ isAuthenticated: false });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        res.json({ isAuthenticated: true, user: decoded });
    } catch (err) {
        res.status(401).json({ isAuthenticated: false });
    }
});

// Logout Endpoint
router.post('/logout', (req, res) => {
    res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
    });
    return res.json({ success: true, message: "Logged out successfully" });
});

module.exports = router;