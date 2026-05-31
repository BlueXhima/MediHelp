const express = require('express');
const router = express.Router();
const infographicController = require('../controller/infographicController');

// Public routes para sa Visual Infographics
router.get('/all', infographicController.getAllInfographics);
router.get('/category/:cat_id', infographicController.getInfographicsByCategory);
router.get('/:id', infographicController.getInfographicById);

module.exports = router;