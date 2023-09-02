const mongoose = require('mongoose');

const allocationSchema = new mongoose.Schema({
  StudentName: {
    type: String,
    required: true,
  },
  EmailID: {
    type: String,
    required: true,
  },
  RollNo: {
    type: String,
    required: true,
  },
  StudentDepartment: {
    type: String,
    required: true,
  },
  CourseDepartment: {
    type: String,
    required: true,
  },
  AllocatedOn: {
    type: Date,
    default: Date.now, // Set a default value to the current date and time
  },
  CourseName: {
    type: String,
    required: true,
  },
  CourseCode: {
    type: String,
    required: true,
  },
});

const Allocation = mongoose.model('Allocation', allocationSchema);

module.exports = Allocation;
