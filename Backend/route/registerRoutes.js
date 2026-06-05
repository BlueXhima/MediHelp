const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const rateLimit = require('express-rate-limit');

// Import the two separate controllers
const registerController = require('../controller/registerController');
const changeEmailController = require('../controller/changeEmailController');
const otpCtrl = require('../controller/otpController');

// Middleware for validation
// registerRoutes.js - Middleware Section
const validateRegister = [
    body('FirstName')
        .trim()
        .notEmpty().withMessage('First name is required.')
        .escape(), // Ine-encode ang special characters tulad ng < > & " '
    body('LastName')
        .trim()
        .notEmpty().withMessage('Last name is required.')
        .escape(), // Ine-encode ang special characters
    body('Email')
        .isEmail().withMessage('Invalid email.')
        .normalizeEmail() // Ginagawang lowercase at tinatanggal ang dots sa Gmail (e.g., j.doe@gmail -> jdoe@gmail)
        .trim(),
    body('Password')
        .isLength({ min: 8 }).withMessage('Min 8 characters.'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
        next();
    }
];

// 1. Limiter para sa Pag-send ng OTP (Protection laban sa Spam/SMS-Email bombing)
const sendOtpLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minuto
    max: 3, // Limitahan sa 3 requests kada 15 mins para iwas spam
    message: {
        success: false,
        message: 'OTP request limit exceeded. Please try again after 15 minutes.'
    },
    standardHeaders: true, 
    legacyHeaders: false,
    // Patayin ang strict checking para hindi mag-crash sa Railway environment
    validate: { xForwardedForHeader: false }, 
});

// 2. Limiter para sa Pag-verify (Protection laban sa Brute Force/Hula)
const verifyOtpLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minuto
    max: 5, // 5 attempts lang
    message: {
        success: false,
        message: 'Too many incorrect attempts. Please try again after 15 minutes.'
    },
    standardHeaders: true,
    legacyHeaders: false,
    // Patayin ang strict checking para hindi mag-crash sa Railway environment
    validate: { xForwardedForHeader: false }, 
});

// POST /api/register
router.post('/register', validateRegister, registerController.registerUser);
router.post('/refresh', registerController.refreshToken);

// PUT /api/change-email
router.put('/change-email', changeEmailController.changeEmail);

// OTP Routes
router.post('/send-otp', sendOtpLimiter, otpCtrl.sendOtp);
router.post('/verify-otp', verifyOtpLimiter, otpCtrl.verifyOtp);

module.exports = router;
