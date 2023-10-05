const express = require("express")
const router =express.Router();

const {adminLogin , JMLogin ,ProfessorLogin} = require('../controllers/authController');

router.route("/login/admin").post(adminLogin)
router.route("/login/JM").post(JMLogin)
router.route("/login/Professor").post(ProfessorLogin)