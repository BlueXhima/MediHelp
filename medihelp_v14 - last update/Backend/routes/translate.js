// routes/translate.js
const express = require('express');
const router = express.Router();
const db = require('../config/db'); // Iyong database connection
const translate = require('google-translate-api-x');

router.get('/:id', async (req, res) => {
    const articleId = req.params.id;
    const targetLang = req.query.lang || 'en';

    try {
        const [rows] = await db.execute(`
            SELECT ga.*, ad.*, ac.category_name 
            FROM guidance_articles AS ga
            JOIN article_details AS ad ON ga.article_id = ad.article_id
            LEFT JOIN article_categories AS ac ON ga.cat_id = ac.category_id
            WHERE ga.article_id = ?`, [articleId]);

        if (rows.length === 0) return res.status(404).json({ message: "Article not found" });

        const data = rows[0];
        if (targetLang === 'en') return res.json(data);

        // Siguraduhin na ang mga itatranslate ay valid strings at hindi null
        const valuesToTranslate = [
            data.title || "",           // [0] Hero Title (Dynamic)
            data.full_content || "",    // [1] Main Body
            data.external_link || "",   // [2] External Link
            "Table of Contents",        // [3] Left Sidebar Header (Static)
            "Appearance",               // [4] Right Sidebar Header (Static)
            "Tools",                    // [5] Right Sidebar Header (Static)
            "Privacy policy",           // [6] Footer Link (Static)
            "About MediHelp",           // [7] Footer Link (Static)
            "Disclaimers",              // [8] Footer Link (Static)
            "Text Size",                // [9] Footer Link (Static)
            data.category_name || "",   // [10]
        ];
        
        // Option 1: Batch translation na may tolerance sa partial fails
        const translations = await translate(valuesToTranslate, { 
            to: targetLang, 
            format: 'html',
            rejectOnPartialFail: false // Hahayaan ang ibang fields kahit may mag-error na isa
        });

        // I-map ang resulta. Kung nag-null ang isa, gamitin ang original value bilang fallback.
        res.json({
            ...data,
            title: translations[0]?.text || data.title,
            full_content: translations[1]?.text || data.full_content,
            external_link: translations[2]?.text || data.external_link,
            // Ipadala ang UI translations pabalik sa frontend
            ui: {
                toc: translations[3]?.text || "Table of Contents",
                related: translations[4]?.text || "Appearance",
                tool: translations[5]?.text || "Tools",
                privacy: translations[6]?.text || "Privacy policy",
                about: translations[7]?.text || "About MediHelp",
                disclaimers: translations[8]?.text || "Disclaimers",
                size: translations[9]?.text || "Text Size",
            },
            category_name: translations[10]?.text || data.category_name,
        });

    } catch (error) {
        console.error("Translation API Error:", error.message); //
        res.status(500).json({ 
            error: "Translation service issue", 
            details: error.message 
        });
    }
});

module.exports = router;