const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dbconnection = require('../config/db');
const axios = require('axios');

exports.login = async (req, res) => {
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

        // ==========================================================\
        // REMOVED: Static Admin Credentials Check
        // Ngayon, dadaan na ang lahat sa database check sa baba.
        // ==========================================================\

        // 2. Query database for user
        // Note: 'rows' ang gagamitin natin dito base sa mysql2 pattern mo
        const [users] = await dbconnection.query('SELECT * FROM users WHERE Email = ?', [normalizedEmail]);

        // FIX: Check if user exists first. If NOT, return 401.
        if (users.length === 0) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const user = users[0]; // FIX: Use 'users', not 'rows'
        const pepper = process.env.PASSWORD_PEPPER || "";
        const passwordWithPepper = password + pepper;

        const isMatch = await bcrypt.compare(passwordWithPepper, user.Password);

        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Check verification after password match
        if (user.isVerified === 0) {
            return res.status(401).json({ 
                error: 'Account not verified. Please check your email for the OTP code.'
            });
        }

        // 3. GENERATE JWT TOKEN (If match is successful)
        // Awtomatiko nang papasok dito ang Admin at susunod sa user.RoleID
        const token = jwt.sign(
            { 
                UserID: user.UserID,
                Email: user.Email,
                Role: user.RoleID
            },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        const refreshToken = jwt.sign (
            { UserID: user.UserID },
            process.env.JWT_REFRESH_SECRET,
            { expiresIn: '7d' }
        );

        // SET COOKIES
        res.cookie('token', token, {
            httpOnly: true,
            secure: true, // Set to true kung naka-HTTPS ka na
            sameSite: 'none',
            maxAge: 24 * 60 * 60 * 1000
        });

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true, // Set to true kung naka-HTTPS ka na
            sameSite: 'none',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.json({
            success: true,
            role: user.RoleID === 1 ? 'admin' : 'user',
        })
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: 'An error occurred during login' });
    }
};

exports.verifySession = (req, res) => {
    // Basahin ang token mula sa req.cookies O req.signedCookies para sa cross-site compatibility
    const token = req.cookies?.token || req.headers?.cookie?.split('token=')[1]?.split(';')[0];

    if (!token) {
        console.log("No token found in cookies");
        return res.status(200).json({ isAuthenticated: false });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Isalin ang RoleID para tumugma sa format ng ProtectedRoute mo
        const normalizedUser = {
            ...decoded,
            Role: decoded.Role // Tiyaking itong decoded.Role ay ang user.RoleID (1 o 2)
        };
        
        res.json({ isAuthenticated: true, user: decoded });
    } catch (err) {
        console.error("JWT Verification Error:", err.message);
        res.status(200).json({ isAuthenticated: false });
    }
};

exports.logout = (req, res) => {
    res.clearCookie('token', {
        httpOnly: true,
        secure: true,
        sameSite: 'none'
    });
    return res.json({ success: true, message: "Logged out successfully" });
};
