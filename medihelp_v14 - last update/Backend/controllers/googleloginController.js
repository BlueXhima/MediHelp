const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const dbconnection = require('../config/db');
const jwt = require('jsonwebtoken');
const { google } = require('googleapis');

const googleLogin = async (req, res) => {
    const { token } = req.body; // Ito ang access_token mula sa React

    try {
        // Gumamit ng Google OAuth2 client para makuha ang user info
        const oauth2Client = new google.auth.OAuth2();
        oauth2Client.setCredentials({ access_token: token });

        const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
        const userInfo = await oauth2.userinfo.get(); // Dito kukunin ang profile data

        const { email, name } = userInfo.data;
        const normalizedEmail = email.toLowerCase().trim();

        // 1. Hatiin ang 'name' mula kay Google para sa FirstName at LastName
        const nameParts = name.split(' ');
        const firstName = nameParts[0]; // "Carlos"
        const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : ''; // "Emmanuel R. Reyes"

        // 1. Database Check
        const [users] = await dbconnection.query('SELECT * FROM users WHERE Email = ?', [normalizedEmail]);

        let user;
        if (users.length > 0) {
            user = users[0];
        } else {
            // 1. Mag-generate ng random placeholder password
            // Hindi ito gagamitin ng user dahil Google ang auth nila, pero kailangan ito ng DB mo.
            const placeholderPassword = `GOOGLE_AUTH_${Math.random().toString(36).slice(-10)}`;

            // 2. I-update ang INSERT query para isama ang Password
            const [result] = await dbconnection.query(
                `INSERT INTO users (FirstName, LastName, Email, Password, RoleID, Created_Date, Created_Time) 
                VALUES (?, ?, ?, ?, ?, CURDATE(), CURTIME())`,
                [firstName, lastName, normalizedEmail, placeholderPassword, 2] // Idinagdag ang Password field[cite: 13]
            );

            const [newUser] = await dbconnection.query('SELECT * FROM users WHERE UserID = ?', [result.insertId]);
            user = newUser[0];
        }

        // 2. Generate JWT
        const sessionToken = jwt.sign(
            { UserID: user.UserID, Email: user.Email, Role: user.RoleID },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        // 3. Set HttpOnly Cookie
        res.cookie('token', sessionToken, {
            httpOnly: true,
            secure: false, // Gawing true kung naka-HTTPS sa production
            sameSite: 'lax',
            maxAge: 24 * 60 * 60 * 1000 
        });

        return res.json({
            success: true,
            role: user.RoleID === 1 ? 'admin' : 'user',
            email: user.Email
        });

    } catch (error) {
        console.error('Google Login Error:', error);
        res.status(401).json({ success: false, message: "Invalid Google Authentication" });
    }
};

module.exports = { googleLogin };