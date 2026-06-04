const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

const transporter = nodemailer.createTransport({
    host: '://gmail.com', // Mas stable ito kaysa sa "service" property
    port: 465,              // Gamitin ang 465 para sa secure connection (SSL)
    secure: true,           // true para sa port 465, false para sa port 587
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    },
});

// MAGDAGDAG NG TEST LOG: Para malaman agad kung connected sa email server kapag nag-start ang backend
transporter.verify((error, success) => {
    if (error) {
        console.error('❌ Mailer Configuration Error:', error.message);
    } else {
        console.log('✅ Mailer Server is ready to take messages!');
    }
});

module.exports = transporter;
