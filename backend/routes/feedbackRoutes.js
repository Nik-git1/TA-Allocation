// feedbackRoutes.js
const express = require('express');
const router = express.Router();
const { startFeedback, editFeedbackById, getFeedbacksByProfessorId, getAllFeedbacks ,closeFeedback,getFeedbackStatus} = require('../controllers/feedbackController');

router.get('/start', startFeedback);
router.put('/:id', editFeedbackById);
router.get('/professor/:professorId', getFeedbacksByProfessorId);
router.get('/all', getAllFeedbacks);
router.get('/status', getFeedbackStatus);
router.post('/end', closeFeedback);

module.exports = router;
