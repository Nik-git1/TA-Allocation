const asyncHandler = require('express-async-handler');
const Course = require("../models/Course");

//@desc Get course by ID
//@route GET /api/course/:id
//@access public
const getCourse = asyncHandler(async (req, res) => {
    const course = await Course.findOne({
        $or: [
            { code: req.params.id },
            { name: req.params.id },
            { acronym: req.params.id },
        ]
    });
    if (!course || course.length === 0) {
        res.status(404);
        throw new Error("No Course Found");
    }
    res.status(200).json(course);
});

//@desc Get filtered courses
//@route GET /api/course?filters
//@access public
const getCourses = asyncHandler(async (req, res) => {
    const { department, instructor, offeredTo, aboveHundred } = req.query;

    const filter = {};
    if (instructor) filter.program = instructor;
    if (department) filter.department = department;
    if (offeredTo) filter.offeredTo = offeredTo;
    if (aboveHundred) filter.aboveHundred = aboveHundred === 'true';

    const filteredCourses = await Course.find(filter);
    res.status(200).json(filteredCourses);
});

//@desc Add new course
//@route POST /api/course
//@access public
const addCourse = asyncHandler(async (req, res) => {
    // req.body format
    // {department, code, name, instructor, acronym, offeredTo, aboveHundred}
    const { department, code, name, instructor, acronym, offeredTo, aboveHundred } = req.body;
    if (!name || !code || !instructor || !department || !acronym || !offeredTo) {
        res.status(400);
        throw new Error("Please fill all mandatory fields");
    }

    const course = await Course.create({ department, code, name, instructor, acronym, offeredTo, aboveHundred });
    res.status(201).json(course);
});

//@desc Update course data
//@route PUT /api/course/:id
//@access public
const updateCourse = asyncHandler(async (req, res) => {
    const course = await Course.findOne({
        $or: [
            { code: req.params.id },
            { name: req.params.id },
            { acronym: req.params.id },
        ]
    });
    if (!course || course.length === 0) {
        res.status(404);
        throw new Error("No Course Found");
    }

    const updatedCourse = await Course.findByIdAndUpdate(course.id, req.body, { new: true });
    res.status(200).json(updatedCourse);
});

//@desc Delete course by id
//@route DELETE /api/course/:id
//@access public
const deleteCourse = asyncHandler(async (req, res) => {
    const course = await Course.findOne({
        $or: [
            { code: req.params.id },
            { name: req.params.id },
            { acronym: req.params.id },
        ]
    });
    if (!course || course.length === 0) {
        res.status(404);
        throw new Error("No Course Found");
    }
    await Course.deleteOne({ _id: course.id });
    res.status(200).json(course);
});

module.exports = { getCourse, addCourse, updateCourse, deleteCourse, getCourses };