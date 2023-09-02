const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  Name: {
    type: String,
    required: true,
  },
  EmailID: {
    type: String,
    required: true,
    unique: true,
  },
  Gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'], // Adjust the enum values as needed
  },
  Program: {
    type: String,
    required: true,
  },
  Department: {
    type: String,
    required: true,
  },
  RollNo: {
    type: String,
    required: true,
    unique: true,
  },
  MandatoryTA: {
    type: Boolean,
    required: true,
    default:false,
  },
  Year: {
    type: Number,
    required: true,
  },
  Allocated: {
    type: Boolean,
    required: true,
    default:false, // Set a default value or adjust as needed
  },
});

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;
