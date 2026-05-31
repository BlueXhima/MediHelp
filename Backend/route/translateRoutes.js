// routes/translate.js
// routes/translate.js
const express = require('express');
const router = express.Router();
const db = require('../config/db');
const translate = require('google-translate-api-x');
const rateLimit = require('express-rate-limit'); // Import the library

// 1. Define the rate limit rule
const translationLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: {
        error: "Too many translation requests from this IP, please try again after 15 minutes"
    },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

router.post('/process', translationLimiter, async (req, res) => {
    const { text, targetLang } = req.body;

    try {
        const resTranslate = await translate(text, { 
            to: targetLang, 
            format: 'html',
            rejectOnPartialFail: false 
        });

        // FIX: Check kung ang t ay hindi null bago i-access ang .text
        const translatedArray = Array.isArray(resTranslate) 
            ? resTranslate.map((t, index) => {
                if (!t || !t.text) return text[index]; // Ibalik ang original kung nag-error ang Google
                return t.text;
            }) 
            : (resTranslate ? resTranslate.text : text);

        res.json({ translatedText: translatedArray });

    } catch (error) {
        console.error("Translation Error:", error);
        res.status(500).json({ error: "Translation failed" });
    }
});

module.exports = router;