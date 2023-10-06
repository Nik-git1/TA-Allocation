const express = require('express');
const router = express.Router();
const { adminLogin, JMLogin, ProfessorLogin, createAdmin } = require('../controllers/authController');

// Login routes
router.route('/admin').post(adminLogin);
router.route('/login/JM').post(JMLogin);
router.route('/login/Professor').post(ProfessorLogin);

// Create admin route
router.route('/create').post(createAdmin);

module.exports = router;
