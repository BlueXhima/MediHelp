const express = require("express");
const dotenv = require("dotenv");
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');
const morgan = require('morgan'); // Logger middleware
const helmet = require('helmet'); // Security headers
const compression = require('compression'); // Response compression

// 1. Load Environment Variables
dotenv.config();

// 2. Import Middlewares & Routes
const loginRoutes = require('./route/loginRoutes');
const registerRoutes = require('./route/registerRoutes');
const passwordRoutes = require('./route/passwordRoutes');
const profileRoutes = require('./route/profileRoutes');
const articleRoutes = require('./route/articleRoutes');
const glossaryRoutes = require('./route/glossaryRoutes');
const sopRoutes = require('./route/sopRoutes');
const infographicRoutes = require('./route/infographicRoutes');
const contactSupportRoutes = require('./route/contactRoutes');
const translateRoutes = require('./route/translateRoutes');
const userDetailsRoutes = require('./controller/userDetailController');

const verifyToken = require('./middleware/auth');
require('./utils/cleanupTask');

const app = express();
const PORT = process.env.PORT || 8080;

// ==========================================================\
// MIDDLEWARES (Global Configurations)
// ==========================================================\
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" } // Pinapayagan ang frontend na i-access ang images
}));
app.use(compression()); // Para mas mabilis ang loading ng API responses
app.use(morgan('dev')); // Makikita ang requests sa terminal (e.g., GET /api/login 200)

// CORS Configuration
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173', 
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(cookieParser());

// FIX: Inilagay ang Static Files routing DITO (Bago mag-verifyToken)
// Para ma-access ng frontend ang profile pictures nang walang 401 Unauthorized block
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// ==========================================================\
// ROUTES
// ==========================================================\

// Public Routes (Kahit walang login, pwedeng ma-access)
app.use('/api', loginRoutes);
app.use('/api', registerRoutes);
app.use('/api', passwordRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/glossary', glossaryRoutes);
app.use('/api/sop', sopRoutes);
app.use('/api/infographics', infographicRoutes);
app.use('/api', contactSupportRoutes);
app.use('/api', translateRoutes);

// Protected Routes (Dadaan muna sa verifyToken bago ma-access)
// Ang lahat ng nasa loob ng userDetailsRoutes at profileRoutes ay ligtas na ngayon
app.use('/api', verifyToken, userDetailsRoutes); 
app.use('/api', verifyToken, profileRoutes);


// Root Route (Para sa Health Check ng Server)
app.get('/', (req, res) => {
    res.send('MediHelp Backend is running smoothly!');
});

// ==========================================================\
// START SERVER
// ==========================================================\
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
