// //Original

// const express = require("express");
// const dotenv = require("dotenv");
// const bcrypt = require("bcrypt");
// const { body, validationResult } = require("express-validator");
// const cors = require('cors');

// dotenv.config();

// const sendOtpRoutes = require('./routes/sendOtp');
// const verifyOtpRoutes = require('./routes/verifyOtp');
// const registerRoutes = require('./controllers/registerController');
// const loginRoutes = require('./controllers/loginController');
// const userDetailsRoutes = require('./controllers/userDetails');
// const updateUserRoutes = require('./controllers/updateUserController');
// const changeEmailOtpRoutes = require('./routes/sendOtpForChangeEmail');

// const app = express();
// const PORT = process.env.PORT || 5000;

// // Middleware
// app.use(cors());
// app.use(express.json());

// // Routes
// app.get('/', (req, res) => {
//     res.send('Hello from Express backend!');
// });

// // Start server
// app.listen(5000, () => {
//     console.log(`Server running at http://localhost:${PORT}`);
// });

// // Use routes
// app.use('/api', sendOtpRoutes);
// app.use('/api', verifyOtpRoutes);
// app.use('/api', registerRoutes);
// app.use('/api', loginRoutes);
// app.use('/api', userDetailsRoutes);
// app.use('/api', updateUserRoutes);
// app.use('/api/change-email-otp', changeEmailOtpRoutes);


const express = require("express");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const { body, validationResult } = require("express-validator");
const cors = require('cors');
const mysql = require('mysql2/promise');

dotenv.config();

const sendOtpRoutes = require('./routes/sendOtp');
const verifyOtpRoutes = require('./routes/verifyOtp');
const registerRoutes = require('./controllers/registerController');
const loginRoutes = require('./controllers/loginController');
const userDetailsRoutes = require('./controllers/userDetails');
const updateUserRoutes = require('./controllers/updateUserController');
const changeEmailOtpRoutes = require('./routes/sendOtpForChangeEmail');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database pool for chatbot queries
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Chatbot endpoint
app.post('/api/parse-intent', async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: 'Text required' });
    
    const normalized = text.toLowerCase().trim();
    
    const [patterns] = await pool.query(`
      SELECT c.*, p.keyword FROM conditions c
      JOIN intent_patterns p ON c.id = p.condition_id
    `);
    
    let match = patterns.find(p => normalized.includes(p.keyword.toLowerCase()));
    
    if (!match) {
      const [general] = await pool.query("SELECT * FROM conditions WHERE condition_key = 'general_symptom'");
      match = general[0];
    }
    
    const [articles] = await pool.query(
      'SELECT title, url FROM related_articles WHERE condition_id = ?',
      [match.id]
    );
    
    const formatList = (text) => text ? text.split('\n').map(i => `- ${i}`).join('\n') : '';
    
    const responseText = `**Explanation**
${match.explanation || ''}

**Possible Causes**
${formatList(match.possible_causes)}

**Symptoms You May Experience**
${formatList(match.symptoms)}

**Suggested Action**
${match.suggested_action || ''}

**Reminder**
${match.reminder || ''}

**Source:** MedlinePlus

**Disclaimer:** ${match.disclaimer || ''}

**Related Articles**
${articles.map(a => `- [${a.title}](${a.url})`).join('\n')}`;
    
    res.json({
      text: responseText.trim(),
      link: match.source_url
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Routes
app.get('/', (req, res) => {
    res.send('Hello from Express backend!');
});

// Use existing routes
app.use('/api', sendOtpRoutes);
app.use('/api', verifyOtpRoutes);
app.use('/api', registerRoutes);
app.use('/api', loginRoutes);
app.use('/api', userDetailsRoutes);
app.use('/api', updateUserRoutes);
app.use('/api/change-email-otp', changeEmailOtpRoutes);

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});