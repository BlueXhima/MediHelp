const express = require("express");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const { body, validationResult } = require("express-validator");
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

// Routes
app.get('/', (req, res) => {
    res.send('Hello from Express backend!');
});

// Start server
app.listen(5000, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});