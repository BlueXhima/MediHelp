const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const dbconnection = require('../config/db');
const { body, validationResult } = require('express-validator');
const { generateOTP, otpStore } = require("../utils/otpUtils");
const transporter = require("../config/mailer");

// Register User Endpoint
router.post(
    '/register',
    [
        body('FirstName').notEmpty().withMessage('First name is required.'),
        body('LastName').notEmpty().withMessage('Last name is required.'),
        body('Email').isEmail().withMessage('Invalid email address.'),
        body('Password')
            .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long.')
            .matches(/\d/).withMessage('Password must contain at least one number.')
            .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter.'),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { FirstName, LastName, Email, Password } = req.body;

        try {
            // Hash the password
            const hashedPassword = await bcrypt.hash(Password, 10);

            // Get the RoleID for 'user'
            const [roleResult] = await dbconnection.query(
                'SELECT RoleID FROM role WHERE RoleName = ?',
                ['user']
            );

            if (roleResult.length === 0) {
                return res.status(500).json({ error: "Role 'user' not found in the database." });
            }

            const roleID = roleResult[0].RoleID;

            // Insert user into the database with the RoleID for 'user'
            await dbconnection.query(
                'INSERT INTO users (FirstName, LastName, Email, Password, RoleID, created_date, created_time, updated_date, updated_time) VALUES (?, ?, ?, ?, ?, CURDATE(), CURTIME(), NULL, NULL)',
                [FirstName, LastName, Email, hashedPassword, roleID]
            );

            // Generate OTP
            const otp = generateOTP();

            // Store OTP with 10-minute expiry
            otpStore.set(Email, {
                otp,
                expiresAt: Date.now() + 10 * 60 * 1000,
            });

            // Send OTP email
            await transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: Email,
                subject: 'Your MediHelp OTP',
                html: `
                    <div style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #ffffff; padding: 40px; max-width: 450px; margin: auto; border: 1px solid #f0f0f0; border-radius: 16px;">
                        <div style="text-align: center; margin-bottom: 30px;">
                            <h2 style="color: #2563eb; margin: 0; font-size: 24px; font-weight: 700; letter-spacing: -0.5px;">MediHelp</h2>
                        </div>

                        <div style="margin-bottom: 25px;">
                            <h3 style="color: #111827; font-size: 20px; font-weight: 600; margin-bottom: 12px; text-align: center;">Verify your email</h3>
                            <p style="color: #4b5563; font-size: 15px; line-height: 24px; text-align: center; margin: 0;">
                                Hi there! Use the verification code below to complete your registration. This code is valid for <strong>10 minutes</strong>.
                            </p>
                        </div>

                        <div style="background-color: #f8fafc; border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 25px; border: 1px dashed #cbd5e1;">
                            <span style="display: block; color: #64748b; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px;">Your Code</span>
                            <h1 style="color: #1e293b; font-size: 38px; font-weight: 800; letter-spacing: 10px; margin: 0; font-family: 'Courier New', Courier, monospace;">${otp}</h1>
                        </div>

                        <p style="color: #9ca3af; font-size: 13px; text-align: center; margin-bottom: 30px;">
                            If you didn't request this code, you can safely ignore this email.
                        </p>

                        <div style="border-top: 1px solid #f3f4f6; padding-top: 20px; text-align: center;">
                            <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                                &copy; 2026 MediHelp Inc. All rights reserved.
                            </p>
                        </div>
                    </div>
                `,
            });

            res.status(201).json({ 
                message: 'User registered successfully. OTP sent to your email.',
                role: 'user'
            });
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                // Handle duplicate email error
                res.status(400).json({ message: 'This email is already registered.' });
            } else {
                console.error('Error during registration:', error);
                res.status(500).json({ message: 'Internal server error.' });
            }
        }
    }
);

module.exports = router;