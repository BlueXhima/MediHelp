// Backend/src/config/mailer.js
const axios = require('axios');

const sendEmailViaGoogle = async (to, subject, htmlBody) => {
    const scriptUrl = process.env.GOOGLE_SCRIPT_URL;
    if (!scriptUrl) {
        throw new Error("GOOGLE_SCRIPT_URL is missing in environment variables.");
    }

    // Ipinapasa ang data papunta sa iyong Google Apps Script via POST request
    const response = await axios.post(scriptUrl, {
        to,
        subject,
        htmlBody
    });

    // Sinisigurong nag-success ang pagpapadala ng GmailApp sa kabila
    if (!response.data || response.data.success !== true) {
        throw new Error(response.data?.error || "Google Script failed to send email.");
    }

    return response.data;
};

module.exports = sendEmailViaGoogle;
