const asyncHandler = require('express-async-handler');
const Allocation = require('../models/Allocation');

//@desc Get all allocations
//@route GET /api/allocation
//@access public
const getAllAllocations = asyncHandler((req, res) => {
    res.status(200).json({ message: "get all allocations" });
});

//@desc Get allocation by ID
//@route GET /api/allocation/:id
//@access public
const getAllocation = asyncHandler((req, res) => {
    res.status(200).json({ message: "get allocations by id" });
});

//@desc Add new allocation
//@route POST /api/allocation
//@access public
const addAllocation = asyncHandler((req, res) => {
    res.status(201).json({ message: "add new allocation" });
});

//@desc Update allocation data
//@route PUT /api/allocation/:id
//@access public
const updateAllocation = asyncHandler((req, res) => {
    res.status(200).json({ message: "update allocation by id" });
});

//@desc Delete allocation by id
//@route DELETE /api/allocation/:id
//@access public
const deleteAllocation = asyncHandler((req, res) => {
    res.status(200).json({ message: "delete allocation by id" });
});

module.exports = { getAllAllocations, getAllocation, addAllocation, updateAllocation, deleteAllocation };