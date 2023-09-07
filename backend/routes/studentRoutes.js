const express = require('express');
const { getAllStudents, addStudent, getStudent, updateStudent, deleteStudent } = require('../controllers/studentController');
const router = express.Router();

router.route("/").get(getAllStudents).post(addStudent);
router.route("/:id").get(getStudent).put(updateStudent).delete(deleteStudent);

module.exports = router;