const express = require('express');
const router = express.Router();
const glossaryController = require('../controller/glossaryController');

// Public routes para sa Medical Glossary
router.get('/all', glossaryController.getAllGlossary);
router.get('/category/:cat_id', glossaryController.getGlossaryByCategory);
router.get('/:id', glossaryController.getGlossaryById);

module.exports = router;