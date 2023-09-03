const asyncHandler = require('express-async-handler');
const Course = require('../models/Course');

//@desc Get all courses
//@route GET /api/course
//@access public
const getAllCourses = asyncHandler((req, res) => {
    res.status(200).json({ message: "get all courses" });
});

//@desc Get course by ID
//@route GET /api/course/:id
//@access public
const getCourseByID = asyncHandler((req, res) => {
    res.status(200).json({ message: "get courses by id" });
});

//@desc Get course by department
//@route GET /api/course/dept/:id
//@access public
const getCourseByDept = asyncHandler((req, res) => {
    res.status(200).json({ message: "get courses by dept" });
});

//@desc Add new course
//@route POST /api/course
//@access public
const addCourse = asyncHandler((req, res) => {
    res.status(201).json({ message: "add new course" });
});

//@desc Update course data
//@route PUT /api/course/:id
//@access public
const updateCourse = asyncHandler((req, res) => {
    res.status(200).json({ message: "update course by id" });
});

//@desc Delete course by id
//@route DELETE /api/course/:id
//@access public
const deleteCourse = asyncHandler((req, res) => {
    res.status(200).json({ message: "delete course by id" });
});

module.exports = { getAllCourses, getCourseByID, getCourseByDept, addCourse, updateCourse, deleteCourse };