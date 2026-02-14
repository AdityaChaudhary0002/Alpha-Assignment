const express = require('express');
const router = express.Router();
const { generateQuestions, submitInterview, getInterview } = require('../controllers/interviewController');
const { requireAuth } = require('../middlewares/clerkAuthMiddleware');

router.post('/generate', requireAuth, generateQuestions);
router.post('/submit', requireAuth, submitInterview);
router.get('/:id', requireAuth, getInterview);

module.exports = router;
