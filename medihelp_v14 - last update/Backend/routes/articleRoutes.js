const express = require('express');
const router = express.Router();
const articleController = require('../controllers/articleController');

router.get('/featured', articleController.getFeaturedArticles);
router.get('/all', articleController.getAllArticles);
router.get('/categories', articleController.getCategories);
router.get('/:id', articleController.getArticleById);

module.exports = router;