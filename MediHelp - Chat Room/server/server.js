import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Store OTPs temporarily (in production, use a database)
const otpStore = new Map();

// Generate 6-digit OTP
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// Configure email service (using Gmail or your email provider)
const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    },
});

// Send OTP endpoint
app.post('/api/send-otp', async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ success: false, message: 'Email is required' });
        }

        // Generate OTP
        const otp = generateOTP();
        
        // Store OTP with 10-minute expiry
        otpStore.set(email, {
            otp,
            expiresAt: Date.now() + 10 * 60 * 1000,
        });

        // Send email
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Your MediHelp OTP',
            html: `
                <div style="font-family: 'Segoe UI', Arial, sans-serif; background: #f9fafb; padding: 30px; max-width: 400px; margin: auto; border-radius: 12px; border: 1px solid #e5e7eb;">
                    <h2 style="color: #111827; text-align: center; margin-bottom: 10px;">🔐 Your OTP Code</h2>
                    
                    <p style="color: #374151; text-align: center; margin: 0 0 20px;">
                        Use this one-time code to securely sign in to <strong>MediHelp</strong>:
                    </p>
                    
                    <div style="background: #ffffff; padding: 20px; border-radius: 10px; text-align: center; box-shadow: 0 2px 6px rgba(0,0,0,0.05); margin-bottom: 20px;">
                        <h1 style="color: #2563eb; font-size: 32px; letter-spacing: 8px; margin: 0;">${otp}</h1>
                    </div>
                    
                    <p style="color: #6b7280; font-size: 13px; text-align: center; margin: 0;">
                        ⏳ This code will expire in <strong>10 minutes</strong>.
                    </p>
                </div>
            `,
        });

        res.json({ success: true, message: 'OTP sent successfully' });
    } catch (error) {
        console.error('Error sending OTP:', error);
        res.status(500).json({ success: false, message: 'Failed to send OTP' });
    }
});

// Verify OTP endpoint
app.post('/api/verify-otp', (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({ success: false, message: 'Email and OTP are required' });
        }

        const storedData = otpStore.get(email);

        if (!storedData) {
            return res.status(400).json({ success: false, message: 'OTP not found or expired' });
        }

        if (Date.now() > storedData.expiresAt) {
            otpStore.delete(email);
            return res.status(400).json({ success: false, message: 'OTP has expired' });
        }

        if (storedData.otp !== otp) {
            return res.status(400).json({ success: false, message: 'Invalid OTP' });
        }

        // OTP is valid, delete it
        otpStore.delete(email);

        res.json({ success: true, message: 'OTP verified successfully' });
    } catch (error) {
        console.error('Error verifying OTP:', error);
        res.status(500).json({ success: false, message: 'Failed to verify OTP' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
