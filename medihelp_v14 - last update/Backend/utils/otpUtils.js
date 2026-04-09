// Utility for OTP management
const otpStore = new Map();

function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

module.exports = { otpStore, generateOTP };