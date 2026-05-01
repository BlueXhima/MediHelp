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
        subject: 'Security Alert: Login Attempts',
        html: `
            <div style="font-family: 'Inter', -apple-system, sans-serif; background-color: #f9fafb; padding: 60px 20px; color: #374151; line-height: 1.5;">
                <div style="max-width: 480px; margin: 0 auto; background-color: #ffffff; border-radius: 24px; padding: 40px; border: 1px solid #f3f4f6;">
                    
                    <!-- Brand Header - Minimalist Reused -->
                    <div style="text-align: center; margin-bottom: 32px;">
                        <div style="display: inline-block; width: 64px; height: 64px; background-color: #fef2f2; border-radius: 16px; margin-bottom: 12px; padding: 12px; box-sizing: border-box;">
                            <!-- Base64 Shield Alert Icon para sa Security -->
                            <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiNkYzI2MjYiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cGF0aCBkPSJNMTIgMjJzOC00IDgtMTBWNWwtOC0zLTggM3Y3YzAgNiA4IDEwIDggMTB6Ii8+PHBhdGggZD0iTTEyIDh2NG0wIDRoLjAxIi8+PC9zdmc+" 
                                alt="Security Alert" 
                                style="width: 100%; height: auto; display: block;" />
                        </div>
                        <h2 style="margin: 0; font-size: 20px; font-weight: 800; color: #111827; letter-spacing: -0.025em;">MediHelp</h2>
                    </div>

                    <!-- Message Body -->
                    <div style="text-align: left; margin-bottom: 32px;">
                        <p style="font-size: 15px; font-weight: 600; color: #111827; margin-bottom: 8px;">Security Notification,</p>
                        <p style="font-size: 14px; color: #6b7280; margin: 0;">
                            We detected multiple failed login attempts on your account. For your protection, we've temporarily restricted access.
                        </p>
                    </div>

                    <!-- Incident Details Box -->
                    <div style="background-color: #f8fafc; border-radius: 16px; padding: 24px; border: 1px solid #e5e7eb; margin-bottom: 32px;">
                        <span style="display: block; font-size: 11px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 12px;">Incident Details</span>
                        <p style="margin: 4px 0; font-size: 13px; color: #4b5563;"><b>Time:</b> ${Time}</p>
                        <p style="margin: 4px 0; font-size: 13px; color: #4b5563;"><b>Device:</b> ${Device}</p>
                    </div>

                    <!-- Action Button -->
                    <div style="text-align: center; margin-bottom: 32px;">
                        <p style="font-size: 14px; color: #6b7280; margin-bottom: 20px;">If this wasn't you, please secure your account immediately:</p>
                        <a href="http://localhost:5173/forgot-password" 
                            style="display: inline-block; background-color: #111827; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 12px; font-weight: 600; font-size: 14px; transition: all 0.2s;">
                            Secure My Account
                        </a>
                    </div>

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