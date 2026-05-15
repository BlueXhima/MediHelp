const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    },
});

// MAGDAGDAG NG VERIFICATION LOG
transporter.verify((error, success) => {
    if (error) {
        console.log("❌ Mailer Error:", error);
    } else {
        console.log("✅ Mailer is ready to send emails");
    }
});

module.exports = transporter;