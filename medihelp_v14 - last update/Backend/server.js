const express = require("express");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const { body, validationResult } = require("express-validator");
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');

dotenv.config();

const verifyToken = require('./middleware/auth');

const sendOtpRoutes = require('./routes/sendOtp');
const verifyOtpRoutes = require('./routes/verifyOtp');
const registerRoutes = require('./controllers/registerController');
const loginRoutes = require('./controllers/loginController');
const userDetailsRoutes = require('./controllers/userDetails');
const updateUserRoutes = require('./controllers/updateUserController');
const changeEmailOtpRoutes = require('./routes/sendOtpForChangeEmail');
const articleRoutes = require('./routes/articleRoutes');
const userRoutes = require('./routes/userRoutes');
const translateRoutes = require('./routes/translate');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser());

// Middleware
app.use(cors({
    origin: 'http://localhost:5173', // Siguraduhing tugma sa port ng React mo
    credentials: true, // PINAKAMAHALAGA: Para payagan ang pagpasa ng cookies
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Use routes
app.use('/api', sendOtpRoutes);
app.use('/api', verifyOtpRoutes);
app.use('/api', registerRoutes);
app.use('/api', loginRoutes);
app.use('/api', verifyToken, userDetailsRoutes); 
app.use('/api', verifyToken, updateUserRoutes);
app.use('/api/change-email-otp', changeEmailOtpRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/translate', translateRoutes);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/users', userRoutes);

// Routes
app.get('/', (req, res) => {
    res.send('Hello from Express backend!');
});

// Start server
app.listen(5000, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});