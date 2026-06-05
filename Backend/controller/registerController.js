const bcrypt = require('bcrypt');
const dbconnection = require('../config/db');
const { generateOTP, otpStore } = require("../utils/otpUtils");
const mailjet = require("../config/mailer");
const { matchedData } = require('express-validator');
const jwt = require('jsonwebtoken');

exports.registerUser = async (req, res) => {
    // 1. Gamitin ang matchedData para makuha ang NILINIS (sanitized) na data
    const data = matchedData(req);
    const { FirstName, LastName, Email, Password } = data;

    // Selyo para sa debugging: I-comment out ito kapag okay na
    // console.log("Sanitized Register Data:", { FirstName, LastName, Email });

    // Siguraduhing may pumasok na email at password
    if (!Email || !Password) {
        return res.status(400).json({ message: 'Missing required registration fields.' });
    }

    try {
        const normalizedEmail = Email.toLowerCase().trim();
        
        // 2. Check if email already exists
        const [rows] = await dbconnection.query('SELECT Email FROM users WHERE Email = ?', [Email]);
        if (rows.length > 0) {
            return res.status(400).json({ message: 'Email is already registered.' });
        }

        // 3. PASSWORD PEPPER IMPLEMENTATION
        // Kunin ang pepper sa .env (dapat kapareho ng nasa authController)
        const pepper = process.env.PASSWORD_PEPPER || "";
        
        // Idikit ang pepper sa password bago i-hash
        const hashedPassword = await bcrypt.hash(Password + pepper, 10);
        const roleID = 2; // Default user role
        const otp = generateOTP();
        const expiresAt = Date.now() + 1 * 60 * 1000; // 1 minute from now

        // 4. STORE OTP FIRST (I-save muna bago mag-send para iwas error sa verification mamaya)
        otpStore.set(normalizedEmail, {
            otp,
            expiresAt
        });

        try {
            // 5. ✅ PAGPAPADALA NG EMAIL GAMIT ANG MAILJET API (Hindi ito haharangin ng Railway)
            await mailjet
                .post("send", { version: 'v3.1' })
                .request({
                    Messages: [
                        {
                            From: {
                                Email: "medihelp241@gmail.com", // Eksaktong tugma sa active sender address mo
                                Name: "MediHelp Support"
                            },
                            To: [
                                {
                                    Email: normalizedEmail,
                                    Name: FirstName
                                }
                            ],
                            Subject: "Verify Your MediHelp Account",
                            HTMLPart: `
                                <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #f0f0f0; border-radius: 10px;">
                                    <h2 style="color: #6d28d9; text-align: center;">Welcome to MediHelp!</h2>
                                    <p>Hi ${FirstName},</p>
                                    <p>Use the code below to complete your registration:</p>
                                    <div style="background: #f3f4f6; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
                                        <h1 style="letter-spacing: 5px; color: #1f2937; margin: 0;">${otp}</h1>
                                    </div>
                                    <p style="font-size: 12px; color: #6b7280; text-align: center;">This code will expire in 1 minute.</p>
                                </div>
                            `
                        }
                    ]
                });
            
            // 6. Insert to Database
            await dbconnection.query(
                'INSERT INTO users (FirstName, LastName, Email, Password, RoleID, isVerified, Created_Date, Created_Time) VALUES (?, ?, ?, ?, ?, 0, CURDATE(), CURTIME())',
                [FirstName, LastName, Email, hashedPassword, roleID]
            );

            res.status(201).json({ 
                message: 'User registered successfully. Please verify your email.',
                role: 'user',
                expiresAt: expiresAt,
                user: { 
                    firstName: FirstName, 
                    lastName: LastName 
                }
            });
        } catch (mailError) {
            // Kung nabigo ang email, burahin ang OTP sa store para malinis
            otpStore.delete(normalizedEmail);
            console.error('Mailjet API Error Details:', mailError.statusCode, mailError.message);
            return res.status(500).json({ message: 'Failed to send verification email.' });
        }
    } catch (error) {
        console.error('Registration Error:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
};

exports.refreshToken = (req, res) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) return res.status(401).json({ message: "No refresh token" });

    try {
        // I-verify ang Refresh Token
        const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

        // Kung valid, gumawa ng bagong Access Token
        const newAccessToken = jwt.sign(
            { UserID: payload.UserID, Email: payload.Email, Role: payload.Role },
            process.env.JWT_SECRET,
            { expiresIn: '30m' }
        );

        res.json({ accessToken: newAccessToken });
    } catch (err) {
        return res.status(403).json({ message: "Invalid refresh token" });
    }
};
