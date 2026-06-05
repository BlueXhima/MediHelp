// Backend/src/config/mailer.js

const Mailjet = require('node-mailjet');

if (!process.env.MAILJET_API_KEY || !process.env.MAILJET_SECRET_KEY) {
    console.error("❌ ERROR: Mailjet API keys are missing in environment variables!");
}

const mailjet = Mailjet.apiConnect(
    process.env.MAILJET_API_KEY,
    process.env.MAILJET_SECRET_KEY
);

module.exports = mailjet;