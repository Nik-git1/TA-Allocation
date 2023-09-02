const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  Department: {
    type: String,
    required: true,
  },
  CourseCode: {
    type: String,
    required: true,
  },
  CourseName: {
    type: String,
    required: true,
  },
  Instructor: {
    type: String,
    required: true,
  },
  Accronym: {
    type: String,
    required: true,
  },
  OfferedTo: {
    type: String,
    required: true,
  },
  Above100: {
    type: Boolean,
    required: true,
  },
  Allocated: {
    type: Number,
    default: 0, // Set a default value or adjust as needed
  },
});

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;
