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
        // 1. INPUT VALIDATION & SANITIZATION
        body('FirstName').trim().notEmpty().withMessage('First name is required.'),
        body('LastName').trim().notEmpty().withMessage('Last name is required.'),
        body('Email').isEmail().normalizeEmail().withMessage('Invalid email address.'),
        body('Password')
            .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long.')
            .matches(/\d/).withMessage('Password must contain at least one number.')
            .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter.')
            .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter.'),
        
        // NEW: Server-side check para sa Confirm Password (Security measure)
        body('confirmPassword').custom((value, { req }) => {
            if (value !== req.body.Password) {
                throw new Error('Passwords do not match.');
            }
            return true;
        }),

        // NEW: Server-side check para sa Terms and Conditions (Compliance check)
        body('agreedToTerms').custom((value) => {
            if (value !== true) {
                throw new Error('You must agree to the Terms and Privacy Policy.');
            }
            return true;
        }),
    ],
    async (req, res) => {
        // I-check kung may validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { FirstName, LastName, Email, Password } = req.body;

        try {
            // 2. EMAIL PRE-CHECK (Security & Performance)
            // Chine-check muna kung existing na ang email bago mag-hash ng password
            const [existingUser] = await dbconnection.query(
                'SELECT UserID FROM users WHERE Email = ?',
                [Email]
            );

            if (existingUser.length > 0) {
                return res.status(400).json({ message: 'This email is already registered.' });
            }

            // 3. SECURE PASSWORD HASHING
            // Gamit ang salt rounds na 12 para mas matibay laban sa brute force
            const hashedPassword = await bcrypt.hash(Password, 12);

            // 4. ROLE IDENTIFICATION
            const [roleResult] = await dbconnection.query(
                'SELECT RoleID FROM role WHERE RoleName = ?',
                ['user']
            );

            if (roleResult.length === 0) {
                return res.status(500).json({ error: "System Error: Role 'user' not found." });
            }

            const roleID = roleResult[0].RoleID;

            // 5. ATOMIC REGISTRATION FLOW (Transaction-like safety)
            // Generate OTP muna
            const otp = generateOTP();

            try {
                // I-send muna ang email. Kapag nag-fail ang mailer, hindi mase-save ang user sa DB.
                // Iwas "zombie" accounts na hindi ma-verify.
                await transporter.sendMail({
                    from: `"MediHelp Team" <${process.env.EMAIL_USER}>`,
                    to: Email,
                    subject: `Verification Code: ${otp}`,
                    html: `
                        <div style="font-family: 'Inter', -apple-system, sans-serif; background-color: #f9fafb; padding: 60px 20px; color: #374151; line-height: 1.5;">
                            <div style="max-width: 480px; margin: 0 auto; background-color: #ffffff; border-radius: 24px; padding: 40px; border: 1px solid #f3f4f6; shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);">
                                
                                <!-- Brand Header -->
                                <div style="text-align: center; margin-bottom: 32px;">
                                    <div style="display: inline-block; width: 64px; height: 64px; background-color: #eff6ff; border-radius: 16px; margin-bottom: 12px; padding: 12px; box-sizing: border-box;">
                                        <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiMyNTYzZWIiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cGF0aCBkPSJNNC44IDIuM0EuMy4zIDAgMSAwIDUgMkg0YTIgMiAwIDAgMC0yIDJ2NWE2IDYgMCAwIDAgNiA2djBhNiA2IDAgMCAwIDYtNlY0YTIgMiAwIDAgMC0yLTJoLTFhLjIuMiAwIDEgMCAuMy4zIj48L3BhdGg+PHBhdGggZD0iTTggMTV2MWE2IDYgMCAwIDAgNiA2djBhNiA2IDAgMCAwIDYtNnYtNCI+PC9wYXRoPjxjaXJjbGUgY3g9IjIwIiBjeT0iMTAiIHI9IjIiPjwvY2lyY2xlPjwvc3ZnPg==" 
                                            alt="MediHelp Logo" 
                                            style="width: 100%; height: auto; display: block;" />
                                    </div>
                                    <h2 style="margin: 0; font-size: 20px; font-weight: 800; color: #111827; letter-spacing: -0.025em;">MediHelp</h2>
                                </div>

                                <!-- Message Body -->
                                <div style="text-align: left; margin-bottom: 32px;">
                                    <p style="font-size: 15px; font-weight: 600; color: #111827; margin-bottom: 8px;">Hello ${FirstName},</p>
                                    <p style="font-size: 14px; color: #6b7280; margin: 0;">
                                        To complete your secure registration, please use the 6-digit verification code provided below.
                                    </p>
                                </div>

                                <!-- Minimalist OTP Box -->
                                <div style="background-color: #f8fafc; border-radius: 16px; padding: 32px; text-align: center; border: 1px solid #e5e7eb; margin-bottom: 24px;">
                                    <span style="display: block; font-size: 11px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 12px;">Verification Code</span>
                                    <h1 style="font-family: 'Courier New', monospace; font-size: 40px; font-weight: 800; letter-spacing: 8px; color: #2563eb; margin: 0;">${otp}</h1>
                                </div>

                                <!-- Security Note -->
                                <p style="font-size: 12px; color: #9ca3af; text-align: center; margin-bottom: 32px;">
                                    This code will expire in <span style="color: #4b5563; font-weight: 600;">1 minute</span>. If you didn't request this, please ignore this email.
                                </p>

                                <div style="border-top: 1px solid #f3f4f6; padding-top: 24px; text-align: center;">
                                    <p style="font-size: 11px; font-weight: 700; color: #d1d5db; text-transform: uppercase; letter-spacing: 0.05em; margin: 0;">
                                        © 2026 MediHelp Philippines
                                    </p>
                                    <p style="font-size: 11px; color: #d1d5db; margin: 4px 0 0 0;">Imus, Cavite</p>
                                </div>

                            </div>
                        </div>
                    `
                });

                // Insert user into the database
                await dbconnection.query(
                    'INSERT INTO users (FirstName, LastName, Email, Password, RoleID, created_date, created_time, updated_date, updated_time) VALUES (?, ?, ?, ?, ?, CURDATE(), CURTIME(), NULL, NULL)',
                    [FirstName, LastName, Email, hashedPassword, roleID]
                );

                // --- MAP STORAGE UPDATE ---
                otpStore.set(Email, {
                    otp,
                    expiresAt: Date.now() + 1 * 60 * 1000 // Valid for 1 minute
                }); 

                res.status(201).json({ 
                    message: 'User registered successfully. Please verify your email.',
                    role: 'user',
                    user: { firstName: FirstName, lastName: LastName }
                });

            } catch (mailError) {
                console.error('Mailer Error:', mailError);
                return res.status(500).json({ message: 'Failed to send verification email. Please try again.' });
            }

        } catch (error) {
            console.error('Error during registration process:', error);
            res.status(500).json({ message: 'Internal server error.' });
        }
    }
);

module.exports = router;