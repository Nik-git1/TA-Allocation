const asyncHandler = require('express-async-handler');
const Student = require("../models/Student");

//@desc Get student by ID
//@route GET /api/student/:id
//@access public
const getStudent = asyncHandler(async (req, res) => {
    const student = await Student.findOne({
        $or: [
            { emailId: req.params.id },
            { rollNo: req.params.id },
        ]
    });
    if (!student || student.length === 0) {
        res.status(404);
        throw new Error("No Student Found");
    }
    res.status(200).json(student);
});

//@desc Get filtered students
//@route GET /api/student?filters
//@access public
const getStudents = asyncHandler(async (req, res) => {
    const { program, department, year, gender, mandatoryTa, allocated } = req.query;

    const filter = {};
    if (program) filter.program = program;
    if (department) filter.department = department;
    if (gender) filter.gender = gender;
    if (mandatoryTa) filter.mandatoryTa = mandatoryTa === 'true';
    if (allocated) filter.allocated = allocated === 'true';
    if (year) filter.year = parseInt(year);

    const filteredStudents = await Student.find(filter);
    res.status(200).json(filteredStudents);
});

//@desc Add new student
//@route POST /api/student
//@access public
const addStudent = asyncHandler(async (req, res) => {
    // req.body format
    // {name, emailId, gender, program, department, rollNo, mandatoryTa, year, allocated}
    const { name, emailId, gender, program, department, rollNo, mandatoryTa, year, allocated } = req.body;
    if (!name || !emailId || !program || !department || !rollNo || !year) {
        res.status(400);
        throw new Error("Please fill all mandatory fields");
    }

    const student = await Student.create({ name, emailId, gender, program, department, rollNo, mandatoryTa, year, allocated });
    res.status(201).json(student);
});

//@desc Update student data
//@route PUT /api/student/:id
//@access public
const updateStudent = asyncHandler(async (req, res) => {
    const student = await Student.findOne({
        $or: [
            { emailId: req.params.id },
            { rollNo: req.params.id },
        ]
    });
    if (!student || student.length === 0) {
        res.status(404);
        throw new Error("No Student Found");
    }

    const updatedStudent = await Student.findByIdAndUpdate(student.id, req.body, { new: true });
    res.status(200).json(updatedStudent);
});

//@desc Delete student by id
//@route DELETE /api/student/:id
//@access public
const deleteStudent = asyncHandler(async (req, res) => {
    const student = await Student.findOne({
        $or: [
            { emailId: req.params.id },
            { rollNo: req.params.id },
        ]
    });
    if (!student || student.length === 0) {
        res.status(404);
        throw new Error("No Student Found");
    }
    await Student.deleteOne({ _id: student.id });
    res.status(200).json(student);
});

module.exports = { getStudent, addStudent, updateStudent, deleteStudent, getStudents };