const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');

// Import Controllers
const authCtrl = require('../controller/authController');
const securityCtrl = require('../controller/securityController');
const emailCtrl = require('../controller/emailUpdateController');
const { googleLogin } = require('../controller/googleLoginController');

// Rate Limiter
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20, // Taasan para hindi maunahan ang frontend countdown
    message: { error: "Too many login attempts. Try again later." }
});

// Authentication Routes
router.post('/login', loginLimiter, authCtrl.login);
router.post('/logout', authCtrl.logout);
router.get('/verify-session', authCtrl.verifySession);
router.post('/google-login', googleLogin);

// Security & Account Update Routes
router.post('/send-security-alert', securityCtrl.sendSecurityAlert);
router.put('/change-email', emailCtrl.changeEmail);

module.exports = router;