const express = require('express');
const router = express.Router();
const journalController = require('../controllers/journalController');

// Create journal
router.post('/', journalController.createJournal);
// Get user's journals
router.get('/user/:userId', journalController.getByUser);

module.exports = router;
