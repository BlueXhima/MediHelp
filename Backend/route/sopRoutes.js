const express = require('express');
const router = express.Router();
const sopController = require('../controller/sopController');

// Public routes para sa First Aid Guide (SOP)
router.get('/all', sopController.getAllSop);
router.get('/category/:cat_id', sopController.getSopByCategory);
router.get('/:id', sopController.getSopById);

module.exports = router;