const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

const transporter = nodemailer.createTransport({
    host: '://gmail.com', // Siguraduhing '://gmail.com' ito, HINDI '://gmail.com'
    port: 465,              // SSL Port ng Gmail
    secure: true,           // Naka-on ang SSL security
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD, // Dikit-dikit na 16-character string na walang space
    },
});

// Ito ang magpapakita sa Railway logs mo kung nababasa na ang keys
transporter.verify((error, success) => {
    if (error) {
        console.error('❌ Mailer Connection Failed:', error.message);
        console.log(`🔍 Debug Railway Variables -> EMAIL_USER: ${process.env.EMAIL_USER ? 'May laman' : 'WALANG LAMAN'}, EMAIL_PASSWORD: ${process.env.EMAIL_PASSWORD ? 'May laman' : 'WALANG LAMAN'}`);
    } else {
        console.log('✅ Mailer Connection Successful! Ready na si MediHelp mag-send.');
    }
});

module.exports = transporter;
