import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from 'sweetalert2';

const StudentForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    emailId: "",
    rollNo: "",
    program: "",
    department: "",
    taType: "",
    cgpa: "",
    departmentPreferences: [
      { course: "", grade: "" },
      { course: "", grade: "" },
    ],
    nonDepartmentPreferences: [
      { course: "", grade: "" },
      { course: "", grade: "" },
      { course: "", grade: "" },
      { course: "", grade: "" },
      { course: "", grade: "" },
    ],
    nonPreferences: ["", "", ""],
  });

  const [courses, setCourses] = useState([]);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("");

  useEffect(() => {
    // Fetch course data from the backend API
    axios
      .get("http://localhost:5001/api/course")
      .then((response) => {
        setCourses(response.data);
      })
      .catch((error) => {
        console.error("Error fetching courses:", error);
      });
  }, []);

  const handleChange = (event, index, section) => {
    const { name, value } = event.target;
    // console.log(name);
    // console.log(value);
    // console.log(event);
    const updatedFormData = { ...formData };
    if (
      section === "departmentPreferences" ||
      section === "nonDepartmentPreferences"
    ) {
      updatedFormData[section][index][name] = value;
      if (name === "course") {
        setSelectedCourses([...selectedCourses, value]);
      }
    } else {
      updatedFormData[name] = value;
      // console.log(updatedFormData);
    }

    // console.log(selectedCourses);
    setFormData(updatedFormData);
    // console.log(formData);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // Create a JSON object from your form data
    const studentData = {
      name: formData.name,
      emailId: formData.emailId,
      rollNo: formData.rollNo,
      program: formData.program,
      department: formData.department,
      taType: formData.taType,
      cgpa: formData.cgpa,
      departmentPreferences: formData.departmentPreferences,
      nonDepartmentPreferences: formData.nonDepartmentPreferences,
      nonPreferences: formData.nonPreferences,
    };

    // Send a POST request to the API endpoint
    axios
      .post("http://localhost:5001/api/student", studentData)
      .then((response) => {
        // Handle success, e.g., display a success message
        console.log("Student data submitted successfully:", response.data);

        Swal.fire('Submitted!', "Form Submitted Successfully", 'success');
      })
      .catch((error) => {
        // Handle any errors that occur during the POST request
        console.error("Error submitting student data:", error);
      });
  };

  const handleDepartmentChange = (event) => {
    const { value } = event.target;
    setSelectedDepartment(value);
  };

  return (
    <div className="flex justify-center items-center relative">
      <img
        src="./images/iiitdrndblock2.jpeg"
        className="h-full w-auto object-contain filter blur-sm absolute inset-0"
        alt="Sample image"
      />
    <div className=" mx-auto z-10 bg-white px-4 pb-4 border-4 mt-4 border-[#3dafaa] shadow-xl max-h-[97vh] overflow-auto">
      <div className="flex justify-center sticky top-0 bg-white">
        <h2 className="text-3xl font-bold mb-2  text-[#3dafaa]">TA Form</h2>
      </div>
      <h2 className="text-2xl font-bold mb-2 mt-4">Student Information</h2>
      <form onSubmit={handleSubmit}>
        {/* Name */}
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 font-bold">
            Name:
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Email Id */}
        <div className="mb-4">
          <label htmlFor="emailId" className="block text-gray-700 font-bold">
            Email Id:
          </label>
          <input
            type="email"
            id="emailId"
            name="emailId"
            value={formData.emailId}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Roll No */}
        <div className="mb-4">
          <label htmlFor="rollNo" className="block text-gray-700 font-bold">
            Roll No:
          </label>
          <input
            type="text"
            id="rollNo"
            name="rollNo"
            value={formData.rollNo}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Program */}
        <div className="mb-4">
          <label htmlFor="program" className="block text-gray-700 font-bold">
            Program:
          </label>
          <select
            id="program"
            name="program"
            value={formData.program}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="">Select Program</option>
            <option value="B.Tech 3rd Year">B.Tech 3rd Year</option>
            <option value="B.Tech 4th Year">B.Tech 4th Year</option>
            <option value="M.Tech">M.Tech</option>
            <option value="PhD">PhD</option>
          </select>
        </div>

        {/* Department */}
        <div className="mb-4">
          <label htmlFor="department" className="block text-gray-700 font-bold">
            Department:
          </label>
          <select
            id="department"
            name="department"
            value={formData.department}
            onChange={(e) => {
              handleChange(e); // Call the general handleChange function
              handleDepartmentChange(e); // Call the specific handleDepartmentChange function
            }}
            className="w-full p-2 border rounded"
          >
            <option value="">Select Department</option>
            <option value="Math">Math</option>
            <option value="CSE">CSE</option>
            <option value="ECE">ECE</option>
            <option value="HCD">HCD</option>
            {/* Add more department options here */}
          </select>
        </div>

        {/* TA Type */}
        <div className="mb-4">
          <label htmlFor="taType" className="block text-gray-700 font-bold">
            TA Type:
          </label>
          <select
            id="taType"
            name="taType"
            value={formData.taType}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="">Select TA Type</option>
            <option value="Credit">Credit</option>
            <option value="Paid">Paid</option>
            <option value="Voluntary">Voluntary</option>
          </select>
        </div>

        {/* CGPA */}
        <div className="mb-4">
          <label htmlFor="cgpa" className="block text-gray-700 font-bold">
            CGPA:
          </label>
          <input
            type="number"
            id="cgpa"
            name="cgpa"
            value={formData.cgpa}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Department Preferences */}
        <div className="mb-4">
          <h3 className="text-xl font-bold mb-2">Department Preferences</h3>
          {formData.departmentPreferences.map((pref, index) => (
            <div key={index} className="mb-4">
              <label htmlFor="course" className="block text-gray-700 font-bold">
                Course {index + 1}:
              </label>
              <select
                id={`deptCourse-${index}`}
                name="course"
                value={pref.course}
                onChange={(e) =>
                  handleChange(e, index, "departmentPreferences")
                }
                className="w-full p-2 border rounded"
              >
                <option key="default" value="">
                  Select Department Course
                </option>
                {/* Filter courses based on the selected department */}
                {courses
                  .filter((course) => course.department === selectedDepartment)
                  .map((filteredCourse) => (
                    <option
                      key={filteredCourse._id}
                      value={filteredCourse._id}
                      disabled={selectedCourses.includes(filteredCourse._id)}
                    >
                      {filteredCourse.name}
                    </option>
                ))}
              </select>
              <label
                htmlFor={`deptGrade-${index}`}
                className="block text-gray-700 font-bold mt-2"
              >
                Grade:
              </label>
              <select
                id={`deptGrade-${index}`}
                value={pref.grade}
                name="grade"
                onChange={(e) =>
                  handleChange(e, index, "departmentPreferences")
                }
                className="w-full p-2 border rounded"
              >
                <option value="">Select Grade</option>
                <option value="A+(10)">A+(10)</option>
                <option value="A(10)">A(10)</option>
                {/* Add more grade options here */}
              </select>
            </div>
          ))}
        </div>

        {/* Non-Department Preferences */}
        <div className="mb-4">
          <h3 className="text-xl font-bold mb-2">Non-Department Preferences</h3>
          {formData.nonDepartmentPreferences.map((pref, index) => (
            <div key={index} className="mb-4">
              <label
                htmlFor="course"
                className="block text-gray-700 font-bold"
              >
                Course {index + 1}:
              </label>
              <select
                id={`nonDeptCourse-${index}`}
                value={pref.course}
                name="course"
                onChange={(e) =>
                  handleChange(e, index, "nonDepartmentPreferences")
                }
                className="w-full p-2 border rounded"
              >
                <option value="">Select Non-Department Course</option>
                {courses.map((course) => (
                  <option
                    key={course._id}
                    value={course._id}
                    disabled={selectedCourses.includes(course._id)}
                  >
                    {course.name}
                  </option>
                ))}
              </select>
              <label
                htmlFor={`nonDeptGrade-${index}`}
                className="block text-gray-700 font-bold mt-2"
              >
                Grade:
              </label>
              <select
                id={`nonDeptGrade-${index}`}
                value={pref.grade}
                name="grade"
                onChange={(e) =>
                  handleChange(e, index, "nonDepartmentPreferences")
                }
                className="w-full p-2 border rounded"
              >
                <option value="">Select Grade</option>
                <option value="A+(10)">A+(10)</option>
                <option value="A(10)">A(10)</option>
                {/* Add more grade options here */}
              </select>
            </div>
          ))}
        </div>

        {/* Non-Preferences */}
        <div>
          <h3>Non-Preferences</h3>
          {formData.nonPreferences.map((course, index) => (
            <div key={index}>
              <select
                value={course}
                onChange={(e) => {
                  const nonPrefs = [...formData.nonPreferences];
                  nonPrefs[index] = e.target.value;
                  setSelectedCourses([...selectedCourses, e.target.value]);
                  setFormData({ ...formData, nonPreferences: nonPrefs });
                }}
                className="p-2 border rounded-md mb-2"
              >
                <option value="">Select Non-Preference Course</option>
                {courses.map((course) => (
                  <option
                    key={course._id}
                    value={course._id}
                    disabled={selectedCourses.includes(course._id)}
                  >
                    {course.name}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
        <div className="flex justify-end">
          <button type="submit" className="bg-[#3dafaa] text-white p-2 rounded">
            Submit
          </button>
        </div>
      </form>
    </div>
    </div>
  );
};

export default StudentForm;