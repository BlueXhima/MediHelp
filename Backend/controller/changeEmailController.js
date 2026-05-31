// changeEmailController.js
const dbconnection = require('../config/db');
const { generateOTP, otpStore } = require("../utils/otpUtils");
const transporter = require("../config/mailer");

exports.changeEmail = async (req, res) => {
    const { oldEmail, newEmail } = req.body;

    if (!oldEmail || !newEmail) {
        return res.status(400).json({ success: false, message: 'Both emails are required.' });
    }

    try {
        // 1. Check kung ginagamit na ng iba yung NEW email
        const [existingUser] = await dbconnection.query('SELECT UserID FROM users WHERE Email = ?', [newEmail]);
        if (existingUser.length > 0) {
            return res.status(400).json({ success: false, message: 'This new email is already registered.' });
        }

        // 2. Generate OTP
        const otp = generateOTP();
        const expiresAt = Date.now() + 1 * 60 * 1000; // 1 minute

        // // 2. UPDATE DATABASE AGAD (Para sa verification logic mamaya)
        // Note: Update lang natin yung email, pero hindi pa verified status.
        // await dbconnection.query('UPDATE users SET Email = ? WHERE Email = ?', [newEmail, oldEmail]);
        
        // 3. Send to NEW email
        await transporter.sendMail({
            from: '"MediHelp Support" <medihelp.verify@gmail.com>',
            to: newEmail,
            subject: 'Verify Your New Email Address',
            html: `<h1>Your OTP is: ${otp}</h1>` // Simplify for testing
        });

        // 4. Store in OTP Map 
        // We store the 'newEmail' so we know what to update later in the verify step
        otpStore.set(newEmail, {
            otp,
            expiresAt,
            oldEmail, // Dito natin tinatandaan kung kaninong account ito
            isEmailChange: true // Flag para malaman ng verify controller na update ito
        });

        res.status(200).json({ 
            success: true, 
            expiresAt: expiresAt,
            message: 'Email updated and OTP sent to new email.' 
        });

    } catch (error) {
        console.error('Change Email Error:', error);
        res.status(500).json({ success: false, message: 'Failed to process email change.' });
    }
};