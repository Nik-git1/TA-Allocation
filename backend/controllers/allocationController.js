const asyncHandler = require('express-async-handler');
const Allocation = require("../models/Allocation");

//@desc Get allocation by ID
//@route GET /api/allocation/:id
//@access public
const getAllocation = asyncHandler(async (req, res) => {
    const allocation = await Allocation.findOne({
        $or: [
            { code: req.params.id },
            { name: req.params.id },
            { acronym: req.params.id },
        ]
    });
    if (!allocation || allocation.length === 0) {
        res.status(404);
        throw new Error("No Allocation Found");
    }
    res.status(200).json(allocation);
});

//@desc Get filtered allocations
//@route GET /api/allocation?filters
//@access public
const getAllocations = asyncHandler(async (req, res) => {
    const { department, instructor, offeredTo, aboveHundred } = req.query;

    const filter = {};
    if (instructor) filter.program = instructor;
    if (department) filter.department = department;
    if (offeredTo) filter.offeredTo = offeredTo;
    if (aboveHundred) filter.aboveHundred = aboveHundred === 'true';

    const filteredAllocations = await Allocation.find(filter);
    res.status(200).json(filteredAllocations);
});

//@desc Add new allocation
//@route POST /api/allocation
//@access public
const addAllocation = asyncHandler(async (req, res) => {
    // req.body format
    // {department, code, name, instructor, acronym, offeredTo, aboveHundred}
    const { department, code, name, instructor, acronym, offeredTo, aboveHundred } = req.body;
    if (!name || !code || !instructor || !department || !acronym || !offeredTo) {
        res.status(400);
        throw new Error("Please fill all mandatory fields");
    }

    const allocation = await Allocation.create({ department, code, name, instructor, acronym, offeredTo, aboveHundred });
    res.status(201).json(allocation);
});

//@desc Update allocation data
//@route PUT /api/allocation/:id
//@access public
const updateAllocation = asyncHandler(async (req, res) => {
    const allocation = await Allocation.findOne({
        $or: [
            { code: req.params.id },
            { name: req.params.id },
            { acronym: req.params.id },
        ]
    });
    if (!allocation || allocation.length === 0) {
        res.status(404);
        throw new Error("No Allocation Found");
    }

    const updatedAllocation = await Allocation.findByIdAndUpdate(allocation.id, req.body, { new: true });
    res.status(200).json(updatedAllocation);
});

//@desc Delete allocation by id
//@route DELETE /api/allocation/:id
//@access public
const deleteAllocation = asyncHandler(async (req, res) => {
    const allocation = await Allocation.findOne({
        $or: [
            { code: req.params.id },
            { name: req.params.id },
            { acronym: req.params.id },
        ]
    });
    if (!allocation || allocation.length === 0) {
        res.status(404);
        throw new Error("No Allocation Found");
    }
    await Allocation.deleteOne({ _id: allocation.id });
    res.status(200).json(allocation);
});

module.exports = { getAllocation, addAllocation, updateAllocation, deleteAllocation, getAllocations };