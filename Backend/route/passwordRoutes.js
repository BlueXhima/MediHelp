const express = require('express');
const router = express.Router();
const passwordController = require('../controller/passwordController');

// Route para sa pag-request ng link
router.post('/forgot-password', passwordController.requestReset);

// Route para sa pag-update ng password
router.post('/reset-password', passwordController.resetPassword);

module.exports = router;