const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  'S.No.': {
    type: String,
    default: '',
  },
  'Year': {
    type: String,
    default: '',
  },
  'Semester': {
    type: String,
    default: '',
  },
  'Department': {
    type: String,
    default: '',
  },
  'Course Code': {
    type: String,
    default: '',
  },
  'Course Name': {
    type: String,
    default: '',
  },
  'Instructor': {
    type: String,
    default: '',
  },
  'Accronym': {
    type: String,
    default: '',
  },
  'Credits': {
    type: Number,
    default: 0,
  },
  'Offered To': {
    type: String,
    default: '',
  },
  'Nomenclature': {
    type: String,
    default: '',
  },
  'Ratio': {
    type: String,
    default: '1:1',
  },
  'Divided by': {
    type: Number,
    default: 1,
  },
  'Pre-registration': {
    type: Number,
    default: 0,
  },
  'Final reg after add drop': {
    type: Number,
    default: 0,
  },
  'TA Requirement': {
    type: Number,
    default: 0,
  },
  'B.Tech. TA Allocated': {
    type: Number,
    default: 0,
  },
  'M.Tech. & Ph.D. TA Allocated': {
    type: Number,
    default: 0,
  },
  'Round 1Allocated': {
    type: Number,
    default: 0,
  },
  'Total TA Allocated': {
    type: Number,
    default: 0,
  },
  'Excess/Short TA': {
    type: Number,
    default: 0,
  },
});

const Student_Round1 = mongoose.model('Student_Round1', studentSchema);

module.exports = Student_Round1;
