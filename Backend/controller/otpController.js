const { generateOTP, otpStore } = require('../utils/otpUtils');
const mailjet = require('../config/mailer');
const jwt = require('jsonwebtoken');
const dbconnection = require('../config/db');

exports.sendOtp = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ message: 'Email is required' });

        const normalizedEmail = email.toLowerCase().trim();

        // --- OTP COOLDOWN VALIDATION ---
        const existingOtp = otpStore.get(normalizedEmail );
        if (existingOtp) {
            const now = Date.now();
            // Check if the current time is still before the expiration (60 seconds)
            if (now < existingOtp.expiresAt) {
                const secondsLeft = Math.ceil((existingOtp.expiresAt - now) / 1000);
                return res.status(429).json({ 
                    success: false, 
                    message: `Please wait ${secondsLeft} seconds before requesting a new code.` 
                });
            }
        }
        // --------------------------------------

        const otp = generateOTP();
        // Set expiry to 1 minute (60,000ms)
        otpStore.set(normalizedEmail , { otp, expiresAt: Date.now() + 1 * 60 * 1000}); // Valid for 1 minute

        // ✅ PINALITAN ANG NODEMAILER NG MAILJET REST API REQUEST
        await mailjet
            .post("send", { version: 'v3.1' })
            .request({
                Messages: [
                    {
                        From: {
                            Email: "medihelp241@gmail.com", // Ang iyong verified Mailjet Sender address
                            Name: "MediHelp Team"
                        },
                        To: [
                            {
                                Email: normalizedEmail
                            }
                        ],
                        Subject: `New Verification Code: ${otp}`,
                        HTMLPart: `
                            <div style="font-family: 'Inter', -apple-system, sans-serif; background-color: #f9fafb; padding: 60px 20px; color: #374151; line-height: 1.5;">
                                <div style="max-width: 480px; margin: 0 auto; background-color: #ffffff; border-radius: 24px; padding: 40px; border: 1px solid #f3f4f6;">
                                    
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
                                        <p style="font-size: 15px; font-weight: 600; color: #111827; margin-bottom: 8px;">Hello!</p>
                                        <p style="font-size: 14px; color: #6b7280; margin: 0;">
                                            We received a request to verify your identity. Please use the 6-digit verification code provided below to continue.
                                        </p>
                                    </div>

                                    <!-- Minimalist OTP Box[cite: 12] -->
                                    <div style="background-color: #f8fafc; border-radius: 16px; padding: 32px; text-align: center; border: 1px solid #e5e7eb; margin-bottom: 24px;">
                                        <span style="display: block; font-size: 11px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 12px;">Verification Code</span>
                                        <h1 style="font-family: 'Courier New', monospace; font-size: 40px; font-weight: 800; letter-spacing: 8px; color: #2563eb; margin: 0;">${otp}</h1>
                                    </div>

                                    <!-- Security Note -->
                                    <p style="font-size: 12px; color: #9ca3af; text-align: center; margin-bottom: 32px;">
                                        This code will expire in <span style="color: #4b5563; font-weight: 600;">1 minute</span>. If you didn't request this code, you can safely ignore this email.
                                    </p>

                                    <!-- Footer[cite: 12] -->
                                    <div style="border-top: 1px solid #f3f4f6; padding-top: 24px; text-align: center;">
                                        <p style="font-size: 11px; font-weight: 700; color: #d1d5db; text-transform: uppercase; letter-spacing: 0.05em; margin: 0;">
                                            © 2026 MediHelp Philippines
                                        </p>
                                        <p style="font-size: 11px; color: #d1d5db; margin: 4px 0 0 0;">Imus, Cavite</p>
                                    </div>

                                </div>
                            </div>
                        `
                    }
                ]
            });

        return res.status(200).json({ success: true, message: 'OTP sent successfully' });
    } catch (error) {
        // Sinalo ang Mailjet Specific Error para sa mas malinis na debugging logs
        console.error('Mailjet OTP Send Error:', error.statusCode, error.message);
        return res.status(500).json({ success: false, message: 'Failed to send OTP' });
    }
};

exports.verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body; // 'email' dito ay yung New Email
        if (!email || !otp) return res.status(400).json({ success: false, message: 'Required fields missing.' });

        const normalizedEmail = email.toLowerCase().trim();
        const otpData = otpStore.get(email);

        // 1. I-validate ang OTP (existing logic mo)
        if (!otpData || otpData.otp !== otp || Date.now() > otpData.expiresAt) {
            return res.status(400).json({ success: false, message: 'Invalid or expired OTP.' });
        }

        // 2. BAGONG DAGDAG: I-update ang database para maging Verified na ang user
        // Kung ito ay Email Change (may oldEmail), i-update ang email at isVerified
        if (otpData.isEmailChange && otpData.oldEmail) {
            await dbconnection.query(
                'UPDATE users SET Email = ?, isVerified = 1 WHERE Email = ?',
                [normalizedEmail, otpData.oldEmail.toLowerCase().trim()]
            );
        } else {
            // Kung normal registration, i-verify lang ang kasalukuyang email
            await dbconnection.query(
                'UPDATE users SET isVerified = 1 WHERE Email = ?',
                [normalizedEmail ]
            );
        }

        // 3. Pagkatapos ng update, kunin ang user details para sa JWT (existing logic mo)
        const [users] = await dbconnection.query(
            'SELECT UserID, FirstName, LastName, RoleID, Email FROM users WHERE Email = ?',
            [normalizedEmail ]
        );

        if (users.length === 0) {
            return res.status(404).json({ success: false, message: 'User record not found.' });
        }

        const user = users[0];

        // 1. Generate Short-lived Access Token
        const token = jwt.sign(
            { 
                UserID: user.UserID, 
                Email: user.Email, 
                Role: user.RoleID 
            },
            process.env.JWT_SECRET,
            { 
                expiresIn: '15m' // 15 mins lang
            }
        );

        // 2. Generate Long-lived Refresh Token
        const refreshToken = jwt.sign(
            { 
                UserID: user.UserID 
            },
            process.env.JWT_REFRESH_SECRET, // Ibang secret dapat ito
            { expiresIn: '7d' } // 7 days
        );

        // 3. I-store ang Refresh Token sa Secure Cookie
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true, // true kung naka HTTPS
            sameSite: 'none',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });
        otpStore.delete(email);

        // 3.1 I-store ang Access Token sa Secure Cookie
        res.cookie('token', token, {
            httpOnly: true, // Secure laban sa XSS
            secure: true, 
            sameSite: 'none',
            maxAge: 24 * 60 * 60 * 1000 // 24 hours
        });

        otpStore.delete(normalizedEmail);
        // 4. I-send ang Access Token sa JSON response (o pwede ring cookie)
        return res.status(200).json({ 
            success: true, 
            user: { 
                firstName: user.FirstName, 
                lastName: user.LastName,
                // email: user.Email 
            }
        });

    } catch (error) {
        console.error('Verification Error:', error);
        return res.status(500).json({ success: false, message: 'Internal server error.' });
    }
};
