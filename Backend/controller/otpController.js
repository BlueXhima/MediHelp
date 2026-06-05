const { generateOTP, otpStore } = require('../utils/otpUtils');
const sendEmailViaGoogle = require('../config/mailer');
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

        // PINALITAN ANG NODEMAILER AT MAILJET NG GOOGLE APP SCRIPT
        await sendEmailViaGoogle(
            normalizedEmail,
            `New Verification Code: ${otp}`,
            `
            <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #f0f0f0; border-radius: 10px;">
                <h2 style="color: #6d28d9; text-align: center;">Welcome to MediHelp!</h2>
                <p>Hello,</p>
                <p>Use the code below to complete your verification identity:</p>
                <div style="background: #f3f4f6; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
                    <h1 style="letter-spacing: 5px; color: #1f2937; margin: 0;">${otp}</h1>
                </div>
                <p style="font-size: 12px; color: #6b7280; text-align: center;">This code will expire in 1 minute.</p>
            </div>
            `
        );

        return res.status(200).json({ success: true, message: 'OTP sent successfully' });
    } catch (error) {
        // Sinalo ang Mailjet Specific Error para sa mas malinis na debugging logs
        console.error('Google Script OTP Send Error:', error.message);
        return res.status(500).json({ success: false, message: 'Failed to send OTP' });
    }
};

exports.verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body; // 'email' dito ay yung New Email
        if (!email || !otp) return res.status(400).json({ success: false, message: 'Required fields missing.' });

        const normalizedEmail = email.toLowerCase().trim();
        const otpData = otpStore.get(normalizedEmail);

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
            await dbconnection.query(
                'UPDATE users SET isVerified = 1 WHERE Email = ?',
                [normalizedEmail]
            );
        }

        // 3. Pagkatapos ng update, kunin ang user details para sa JWT (existing logic mo)
        const [users] = await dbconnection.query(
            'SELECT UserID, FirstName, LastName, RoleID, Email FROM users WHERE Email = ?',
            [normalizedEmail]
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
                expiresIn: '24h' 
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
            role: user.RoleID === 1 ? 'admin' : 'user', // Isinama ang role parameter para alam ng frontend kung saan magre-redirect (dashboard o admin)
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
