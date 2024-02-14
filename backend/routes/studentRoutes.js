const express = require('express');
const { addStudent, getStudent, updateStudent, deleteStudent, getStudents } = require('../controllers/studentController');
const replaceAnyCourseMiddleware = require("../middleware/AnyCouse") // Import your middleware here
const router = express.Router();

// Apply middleware only to the addStudent route
router.route(":filter?").get(getStudents).post(replaceAnyCourseMiddleware, addStudent);
router.route("/:id").get(getStudent).put( updateStudent).delete(deleteStudent);

module.exports = router;
