// Backend/server.js

const express = require("express");
const dotenv = require("dotenv");
const cors = require('cors');
const path = require('path');

dotenv.config();

const sendOtpRoutes = require('./routes/sendOtp');
const verifyOtpRoutes = require('./routes/verifyOtp');
const registerRoutes = require('./controllers/registerController');
const loginRoutes = require('./controllers/loginController');
const userDetailsRoutes = require('./controllers/userDetails');
const updateUserRoutes = require('./controllers/updateUserController');
const changeEmailOtpRoutes = require('./routes/sendOtpForChangeEmail');
const articleRoutes = require('./routes/articleRoutes');
const userRoutes = require('./routes/userRoutes');

// Database connection - already promise-based from mysql2/promise
const db = require('./config/db');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Use routes
app.use('/api', sendOtpRoutes);
app.use('/api', verifyOtpRoutes);
app.use('/api', registerRoutes);
app.use('/api', loginRoutes);
app.use('/api', userDetailsRoutes);
app.use('/api', updateUserRoutes);
app.use('/api/change-email-otp', changeEmailOtpRoutes);
app.use('/api/articles', articleRoutes);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/users', userRoutes);

// ==========================================
// CHATBOT ENDPOINT - CLEAN DATABASE-FIRST APPROACH
// ==========================================
app.post('/api/parse-intent', async (req, res) => {
    const { text } = req.body;
    
    console.log('\n==========================================');
    console.log('Chatbot received:', text);
    
    // Validate input
    if (!text || typeof text !== 'string' || !text.trim()) {
        console.log('Invalid input received');
        return res.status(400).json({ 
            error: 'Please provide a valid symptom description',
            text: '**Explanation**\nI didn\'t receive any text to process.\n\n**Suggested Action**\nPlease describe your symptoms, for example: "I have a headache" or "chest pain"\n\n**Disclaimer:** Educational information only.'
        });
    }
    
    const lowerText = text.toLowerCase().trim();
    console.log('Processing:', lowerText);
    
    try {
        // Step 1: Load all intent patterns
        console.log('Step 1: Loading intent patterns...');
        const [patterns] = await db.query(`
            SELECT ip.condition_id, ip.keyword, c.condition_key
            FROM intent_patterns ip
            JOIN conditions c ON ip.condition_id = c.id
            ORDER BY LENGTH(ip.keyword) DESC
        `);
        
        console.log(`Loaded ${patterns.length} patterns`);
        
        // Step 2: Find best matching keyword
        let matchedConditionId = null;
        let matchedKeyword = null;
        
        for (const pattern of patterns) {
            if (lowerText.includes(pattern.keyword.toLowerCase())) {
                matchedConditionId = pattern.condition_id;
                matchedKeyword = pattern.keyword;
                console.log(`✓ Match: "${pattern.keyword}" → ${pattern.condition_key}`);
                break;
            }
        }
        
        // Step 3: Get condition from database
        let condition;
        let relatedArticles = [];
        
        if (matchedConditionId) {
            console.log(`Step 3a: Loading matched condition ID ${matchedConditionId}...`);
            const [rows] = await db.query('SELECT * FROM conditions WHERE id = ?', [matchedConditionId]);
            condition = rows[0];
            
            // Step 3b: Fetch related articles for this condition
            console.log(`Step 3b: Loading related articles for condition ${matchedConditionId}...`);
            const [articles] = await db.query(
                'SELECT title, url FROM related_articles WHERE condition_id = ?',
                [matchedConditionId]
            );
            relatedArticles = articles;
            console.log(`Found ${articles.length} related articles`);
        } else {
            console.log('Step 3b: No match found, loading general_symptom fallback...');
            const [rows] = await db.query("SELECT * FROM conditions WHERE condition_key = 'general_symptom'");
            condition = rows[0];
        }
        
        // Step 4: Validate we have a condition
        if (!condition) {
            console.error('ERROR: No condition found in database!');
            throw new Error('Database missing required condition data');
        }
        
        console.log('Using condition:', condition.condition_key);
        
        // Step 5: Build response from database (including related articles)
        const responseText = buildMedicalResponse(condition, relatedArticles);
        
        console.log('✓ Response built successfully');
        console.log('Length:', responseText.length, 'chars');
        console.log('==========================================\n');
        
        return res.json({
            text: responseText,
            link: condition.source_url || null
        });
        
    } catch (error) {
        console.error('\n==========================================');
        console.error('ERROR:', error.message);
        console.error('==========================================\n');
        
        // Only use hardcoded fallback for critical database failures
        return res.status(500).json({ 
            error: 'Service temporarily unavailable',
            text: '**Explanation**\nI\'m having trouble accessing my medical database right now.\n\n**Suggested Action**\nPlease try again in a moment. If the problem continues, the service may be down for maintenance.\n\n**Disclaimer:** Educational information only. Consult a doctor for personal advice.',
            link: null
        });
    }
});

// Helper: Build formatted medical response from condition data
function buildMedicalResponse(condition, relatedArticles = []) {
    let text = '';
    
    // 1. Explanation (always required)
    text += `**Explanation**\n${condition.explanation || 'No explanation available'}\n\n`;
    
    // 2. Possible Causes (only if data exists)
    if (condition.possible_causes?.trim()) {
        const causes = condition.possible_causes
            .split('\n')
            .map(c => c.trim())
            .filter(c => c.length > 0);
        
        if (causes.length > 0) {
            text += `**Possible Causes**\n${causes.map(c => `• ${c}`).join('\n')}\n\n`;
        }
    }
    
    // 3. Symptoms (only if data exists)
    if (condition.symptoms?.trim()) {
        const symptoms = condition.symptoms
            .split('\n')
            .map(s => s.trim())
            .filter(s => s.length > 0);
        
        if (symptoms.length > 0) {
            text += `**Symptoms You May Experience**\n${symptoms.map(s => `• ${s}`).join('\n')}\n\n`;
        }
    }
    
    // 4. Suggested Action (only if data exists)
    if (condition.suggested_action?.trim()) {
        text += `**Suggested Action**\n${condition.suggested_action}\n\n`;
    }
    
    // 5. Reminder (only if data exists - skip for fallback)
    if (condition.reminder?.trim()) {
        text += `**Reminder**\n${condition.reminder}\n\n`;
    }
    
    // 6. Related Articles (NEW - from database)
    if (relatedArticles.length > 0) {
        text += `**Related Articles**\n`;
        relatedArticles.forEach(article => {
            text += `• [${article.title}](${article.url})\n`;
        });
        text += `\n`;
    }
    
    // 7. Source (only if URL exists)
    if (condition.source_url?.trim()) {
        text += `**Source:** ${condition.source_url}\n`;
    }
    
    // 8. Disclaimer (always required)
    text += `**Disclaimer:** ${condition.disclaimer || 'Educational information only. Consult a doctor for personal advice.'}`;
    
    return text.trim();
}

// ==========================================
// DEBUG ENDPOINTS (Optional - for testing)
// ==========================================

// Test database connection
app.get('/api/test-db', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT 1 as test, NOW() as time');
        res.json({ 
            status: 'connected', 
            test: rows[0].test,
            serverTime: rows[0].time
        });
    } catch (error) {
        res.status(500).json({ 
            status: 'error', 
            message: error.message 
        });
    }
});

// Check database contents
app.get('/api/debug/db', async (req, res) => {
    try {
        const [conditions] = await db.query('SELECT COUNT(*) as count FROM conditions');
        const [patterns] = await db.query('SELECT COUNT(*) as count FROM intent_patterns');
        const [general] = await db.query("SELECT condition_key, explanation FROM conditions WHERE condition_key = 'general_symptom'");
        
        res.json({
            conditions: conditions[0].count,
            patterns: patterns[0].count,
            generalSymptomExists: general.length > 0,
            generalSymptomPreview: general[0]?.explanation?.substring(0, 100) + '...'
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Basic route
app.get('/', (req, res) => {
    res.send('MediHelp API Server Running');
});

// Start server
app.listen(PORT, () => {
    console.log(`\n========================================`);
    console.log(`Server: http://localhost:${PORT}`);
    console.log(`Test DB: http://localhost:${PORT}/api/test-db`);
    console.log(`Debug: http://localhost:${PORT}/api/debug/db`);
    console.log(`========================================\n`);
});