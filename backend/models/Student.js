const mongoose = require( 'mongoose' );

const studentSchema = new mongoose.Schema( {
    name: {
        type: String,
        required: true,
    },
    emailId: {
        type: String,
        required: true,
        unique: true,
    },
    rollNo: {
        type: String,
        required: true,
        unique: true,
    },
    program: {
        type: String,
        enum: [ 'B.Tech 3rd Year', 'B.Tech 4th Year', 'M.Tech', 'PhD' ],
        required: true,
    },
    department: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'JM',
        required: true,
    },
    taType: {
        type: String,
        required: true,
        default: 'Credit',
        enum: [ 'Credit', 'Paid', 'Voluntary' ],
    },
    allocationStatus: {
        // Status = 0 => Not Allocated
        // Status = 1 => Allocated but Not Confirmed yet by Student
        // Status = 2 => Confirmed and Allocation freezed
        type: Number,
        default: 0,
        enum: [ 0, 1, 2 ],
    },
    allocatedTA: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
    },
    cgpa: {
        type: Number,
        min: 0,
        max: 10,
    },
    departmentPreferences: {
        type: [ {
            course: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Course',
            },
            grade: {
                type: String,
                enum: [ 'A+(10)', 'A(10)', 'A-(9)', 'B(8)', 'B-(7)', 'C(6)', 'C-(5)', 'D(4)', 'F(2)', 'Course Not Done' ],
            }
        } ],
        validate: {
            validator: function ( prefs )
            {
                return prefs.length === 2;
            },
            message: 'Enter exactly 2 departmental course preferences',
        },
    },
    nonDepartmentPreferences: {
        type: [ {
            course: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Course',
            },
            grade: {
                type: String,
                enum: [ 'A+(10)', 'A(10)', 'A-(9)', 'B(8)', 'B-(7)', 'C(6)', 'C-(5)', 'D(4)', 'F(2)', 'Course Not Done' ],
            }
        } ],
        validate: {
            validator: function ( prefs )
            {
                return prefs.length === 5;
            },
            message: 'Enter exactly 5 non departmental course preferences',
        },
    },
    nonPreferences: {
        type: [ {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Course',
        } ],
        validate: {
            validator: function ( prefs )
            {
                return prefs.length === 3;
            },
            message: 'Enter exactly 3 not preferenced courses',
        },
    },
} );

module.exports = mongoose.model( 'Student', studentSchema );