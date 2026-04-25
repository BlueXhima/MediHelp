const express = require('express');
const router = express.Router();
const articleController = require('../controllers/articleController');

router.get('/featured', articleController.getFeaturedArticles);
router.get('/all', articleController.getAllArticles);
router.get('/categories', articleController.getCategories);
router.get('/:id', articleController.getArticleById);

// NEW: Endpoints for Visit Tracking and History
// POST - Kapag clinick ang article
router.post('/record-visit', articleController.recordArticleVisit);

// GET - Para i-display ang history sa modal/sidebar
router.get('/history/:userId', articleController.getUserHistory);

router.post('/update-progress', articleController.updateReadingProgress);

router.post('/history/purge/:userId', articleController.purgeReadingHistory);
router.get('/history/archives/:userId', articleController.getArchivedHistory);
router.post('/history/restore/:archiveId', articleController.restoreHistory);
router.post('/history/restore-all/:userId', articleController.restoreAllArchives);
router.delete('/history/archive/:archiveId', articleController.deleteArchiveRecord);
router.delete('/history/archive-all/:userId', articleController.deleteAllArchives);
router.post('/history/archive-single/:historyId', articleController.archiveSingleHistory);

// Library / Saved Articles Endpoints
router.post('/save-toggle', articleController.toggleSaveArticle);
router.get('/save-status/:userId/:articleId', articleController.checkSaveStatus);
router.get('/library/:userId', articleController.getSavedArticles);
router.delete('/library/clear/:userId', articleController.clearSavedLibrary);

module.exports = router;