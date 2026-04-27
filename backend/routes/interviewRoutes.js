const express = require('express');
const router = express.Router();
const interviewController = require('../controllers/interviewController');

router.post('/start', interviewController.startInterview);
router.post('/answer', interviewController.submitAnswer);
router.get('/feedback/:id', interviewController.getFinalFeedback);

module.exports = router;
