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
        enum: [ 'B.Tech 3rd Year', 'B.Tech 4th Year', 'M.Tech 1st Year', 'M.Tech 2nd Year', 'PhD' ],
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
        default: null,
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
                required: function() {
                    // Only required if a specific course is selected
                    return this.course !== 'any';
                },

            },
            grade: {
                type: String,
                enum: [ 'A+(10)', 'A(10)', 'A-(9)', 'B(8)', 'B-(7)', 'C(6)', 'C-(5)', 'D(4)', 'Course Not Done' ],
            }
        } ],
        validate: [
            {
                validator: function ( prefs )
                {
                    return prefs.length <= 2;
                },
                message: 'Enter atmost 2 departmental course preferences',
            },
            {
                validator: async function (prefs) {
                
                    const student = this;
                    const departmentsMatch = await Promise.all(prefs.map(async (pref) => {
                        // Check if the course field is present
                       
                        if (!pref.course) {
                            const dummyObjectId = new mongoose.Types.ObjectId();
                            pref.course = dummyObjectId
                            console.log(pref)
                            // If course is not assigned (e.g., "any" is selected), skip the validation for this preference
                            return true;
                        }else{
                            console.log(pref)
                        const course = await mongoose.model('Course').findById(pref.course);
                        return course && course.department.equals(student.department);}
                    }));
                    console.log(departmentsMatch)
                    return departmentsMatch.every((match) => match === true);
                },
                
                message: 'Course department must match student department for all courses in department preferences',
            },
        ],
    },
    nonDepartmentPreferences: {
        type: [{
            course: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Course',
                required: function() {
                    // Only required if a specific course is selected
                    return this.course !== 'any';
                },
            },
            grade: {
                type: String,
                enum: ['A+(10)', 'A(10)', 'A-(9)', 'B(8)', 'B-(7)', 'C(6)', 'C-(5)', 'D(4)', 'Course Not Done'],
            },
            
        }
    ], validate: [
        {
            validator: function ( prefs )
            {
                return prefs.length <= 8;
            },
            message: 'Enter atmost 8 non-departmental course preferences',
        },
        {
            validator: async function (prefs) {
            
                const student = this;
                const nondepartmentsMatch = await Promise.all(prefs.map(async (pref) => {
                    // Check if the course field is present
                   
                    if (!pref.course) {
                        const dummyObjectId = new mongoose.Types.ObjectId();
                        pref.course = dummyObjectId
                        console.log(pref)
                        // If course is not assigned (e.g., "any" is selected), skip the validation for this preference
                        return true;
                    }else{
                       
                    return true;}
                }));
                console.log(nondepartmentsMatch)
                return nondepartmentsMatch.every((match) => match === true);
            },
            
            message: 'Course department must match student department for all courses in department preferences',
        },
    ],
    },
    nonPreferences: {
        type: [ {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Course',
        } ],
        validate: {
            validator: function ( prefs )
            {
                return prefs.length <= 3;
            },
            message: 'Enter atmost 3 not preferenced courses',
        },
    },
} );

module.exports = mongoose.model( 'Student', studentSchema );