const express = require('express');
const { getAllCourses, addCourse, getCourseByID, getCourseByDept, updateCourse, deleteCourse } = require('../controllers/courseController');
const router = express.Router();

router.route("/").get(getAllCourses).post(addCourse);
router.route("/:id").get(getCourseByID).put(updateCourse).delete(deleteCourse);
router.route("/dept/:id").get(getCourseByDept);

module.exports = router;