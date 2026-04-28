const express = require('express');
const router = express.Router();
const articleController = require('../controllers/articleController');
const verifyToken = require('../middleware/auth');

// Protected Routes (Kailangan ng Login/Token)
// Ginagamit natin ang verifyToken middleware bago ang bawat controller

// --- History Endpoints ---
router.post('/record-visit', verifyToken, articleController.recordArticleVisit);
router.get('/history', verifyToken, articleController.getUserHistory);
router.get('/history/archives', verifyToken, articleController.getArchivedHistory);
router.post('/update-progress', verifyToken, articleController.updateReadingProgress);

// Inalis natin ang :userId dito dahil kukunin na sa req.user.UserID sa controller
router.post('/history/purge', verifyToken, articleController.purgeReadingHistory);
router.post('/history/restore-all', verifyToken, articleController.restoreAllArchives);
router.delete('/history/archive-all', verifyToken, articleController.deleteAllArchives);

// Ang mga may specific ID (archiveId/historyId) ay kailangan pa rin para malaman kung alin ang gagalawin
router.post('/history/restore/:archiveId', verifyToken, articleController.restoreHistory);
router.delete('/history/archive/:archiveId', verifyToken, articleController.deleteArchiveRecord);
router.post('/history/archive-single/:historyId', verifyToken, articleController.archiveSingleHistory);

// --- Library / Saved Articles Endpoints ---
router.post('/save-toggle', verifyToken, articleController.toggleSaveArticle);
router.get('/library', verifyToken, articleController.getSavedArticles);
router.delete('/library/clear', verifyToken, articleController.clearSavedLibrary);

// Exception: check-save-status (Kailangan pa rin ang articleId para malaman kung saved na ang specific article)
router.get('/save-status/:articleId', verifyToken, articleController.checkSaveStatus);

// Public Routes (Kahit sino pwedeng makakita)
router.get('/featured', articleController.getFeaturedArticles);
router.get('/all', articleController.getAllArticles);
router.get('/categories', articleController.getCategories);
router.get('/:id', articleController.getArticleById);

module.exports = router;