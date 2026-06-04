const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,             // Palitan ang 465 ng 587
    secure: false,          // Gawing false para sa port 587 (gagamit ito ng STARTTLS)
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD, // Dito mo ilalagay ang BAGONG dikit-dikit na password
    },
    tls: {
        rejectUnauthorized: false // Pinipigilan nito ang mga SSL/TLS restrictions sa hosting provider
    }
});

transporter.verify((error, success) => {
    if (error) {
        console.error('❌ Transporter Verification Failed:', error.message);
    } else {
        console.log('✅ Success! Transporter is bypass-ready and connected.');
    }
});

module.exports = transporter;
