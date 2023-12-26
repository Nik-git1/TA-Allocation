import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useLocation } from "react-router-dom";
import CryptoJS from "crypto-js";
import ClipLoader from "react-spinners/ClipLoader";

const StudentForm = () => {
  const location = useLocation();
  const [email, setEmail] = useState(location.state?.email || "your email id");
  const encryptedEmail = location.state?.encryptedEmail || "NA";
  const studentExist = location.state?.studentExist;
  const secretKey = "your-secret-key"; // Use the same secret key used for encryption
  const decryptedEmail = CryptoJS.AES.decrypt(
    encryptedEmail,
    secretKey
  ).toString(CryptoJS.enc.Utf8);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    emailId: email,
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
    const updatedFormData = { ...formData };

    if (
      section === "departmentPreferences" ||
      section === "nonDepartmentPreferences"
    ) {
      const prevSelectedCourse = updatedFormData[section][index][name];
      updatedFormData[section][index][name] = value;

      const updatedSelectedCourses = selectedCourses.filter(
        (course) => course !== prevSelectedCourse
      );

      if (value !== "") {
        updatedSelectedCourses.push(value);
      }

      setSelectedCourses(updatedSelectedCourses);
    } else if (section === "nonPreferences") {
      const prevSelectedCourse = updatedFormData[section][index];
      updatedFormData[section][index] = value;
      const updatedSelectedCourses = selectedCourses.filter(
        (course) => course !== prevSelectedCourse
      );

      if (value !== "") {
        updatedSelectedCourses.push(value);
      }
      setSelectedCourses(updatedSelectedCourses);
    } else {
      updatedFormData[name] = value;
    }

    setFormData(updatedFormData);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Additional validation for Roll No length and pattern
    if (
      (formData.rollNo.length !== 7 && formData.rollNo.length !== 8) || // Check length
      !/^(PhD|MT\d|\d{3})/.test(formData.rollNo) // Check pattern
    ) {
      alert("Invalid roll number");
      return;
    }

    if (email === "your email id") {
      alert(
        "please visite login page and generate valid otp for your email Id"
      );
      return;
    }

    if (email !== decryptedEmail) {
      alert("Invalid email");
      return;
    }

    if (!decryptedEmail.endsWith("iiitd.ac.in")) {
      alert("Only IIITD Students allowed");
      return;
    }

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

    const allValuesNotEmpty = Object.values(studentData).every((value) => {
      if (Array.isArray(value)) {
        // If the property is an array, check each element in the array
        return value.every((pref) => pref.course !== "" && pref.grade !== "");
      } else if (typeof value === "object" && value !== null) {
        // If the property is an object (nested object), recursively check its values
        return Object.values(value).every(
          (v) =>
            v !== "" &&
            (Array.isArray(v)
              ? v.every((pref) => pref.course !== "" && pref.grade !== "")
              : true)
        );
      } else {
        // For other properties, just check if the value is not an empty string
        return value !== "";
      }
    });

    if (allValuesNotEmpty) {
      setLoading(true);
      if (studentExist === null) {
        // Send a POST request to the API endpoint
        await axios
          .post("http://localhost:5001/api/student", studentData)
          .then((response) => {
            setLoading(false);
            Swal.fire("Submitted!", "Form Submitted Successfully", "success").then((result) => {
              if (result.isConfirmed) {
                window.location.replace("http://localhost:5001");
              }
            });
          })
          .catch((error) => {
            setLoading(false);
            alert("Internal server erro, error status: ", error.status);
            // Handle any errors that occur during the POST request
            console.error("Error submitting student data:", error);
          });
      } else {
        // Send a PUT request to the API endpoint
        await axios
          .put(
            `http://localhost:5001/api/student/${studentExist._id}`,
            studentData
          )
          .then((response) => {
            setLoading(false);
            Swal.fire("Submitted!", "Form Submitted Successfully", "success").then((result) => {
              if (result.isConfirmed) {
                window.location.replace("http://localhost:5001");
              }
            });
          })
          .catch((error) => {
            setLoading(false);
            alert("Internal server error, error status: ", error.status);
            // Handle any errors that occur during the POST request
            console.error("Error submitting student data:", error);
          });
      }
      setEmail("your email id");
      delete location.state.email;
    } else {
      alert("Please fill in all the fields :)");
    }
  };

  const handleDepartmentChange = (event) => {
    const { value } = event.target;
    setSelectedDepartment(value);
  };

  return (
    <>
    {
      loading ? (
        <div className="flex justify-center items-center">
          <ClipLoader
            color={"#3dafaa"}
            loading={loading}
            size={100}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        </div>
      )
      : (

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
              {/* Email Id */}
              <div className="mb-4">
                <label htmlFor="emailId" className="block text-gray-700 font-bold">
                  Email Id:
                </label>
                <input
                  type="email"
                  id="emailId"
                  name="emailId"
                  value={email}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  disabled // Make the input disabled
                />
              </div>
    
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
                  <option value="M.Tech 1st Year">M.Tech 1st Year</option>
                  <option value="M.Tech 2nd Year">M.Tech 2nd Year</option>
                  <option value="PhD">PhD</option>
                </select>
              </div>
    
              {/* Department */}
              <div className="mb-4">
                <label
                  htmlFor="department"
                  className="block text-gray-700 font-bold"
                >
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
                  <option value="MATHS">Maths</option>
                  <option value="CSE">CSE</option>
                  <option value="ECE">ECE</option>
                  <option value="HCD">HCD</option>
                  <option value="CB">CB</option>
                  <option value="SSH">SSH</option>
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
                  onKeyPress={(e) => {
                    // Allow only non-negative numbers
                    if (e.key === "-" || e.key === "e" || e.key === "E") {
                      e.preventDefault();
                    }
                  }}
                  onInput={(e) => {
                    // Prevent negative values when using increment/decrement buttons
                    const value = e.target.value;
                    if (parseFloat(value) < 0) {
                      e.target.value = "0";
                      setFormData((prevFormData) => ({
                        ...prevFormData,
                        cgpa: "0",
                      }));
                    }
                  }}
                  className="w-full p-2 border rounded"
                />
              </div>
    
              {/* Department Preferences */}
              <div className="mb-4">
                <h3 className="text-xl font-bold mb-2">Department Preferences</h3>
                {formData.departmentPreferences.map((pref, index) => (
                  <div key={index} className="mb-4">
                    <label
                      htmlFor="course"
                      className="block text-gray-700 font-bold"
                    >
                      Preference {index + 1}:
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
                        .filter(
                          (course) => course.department === selectedDepartment
                        )
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
                      <option value="A-(9)">A-(9)</option>
                      <option value="B(8)">B(8)</option>
                      {/* Add more grade options here */}
                    </select>
                  </div>
                ))}
              </div>
    
              {/* Non-Department Preferences */}
              <div className="mb-4">
                <h3 className="text-xl font-bold mb-2">
                  Non-Department Preferences
                </h3>
                {formData.nonDepartmentPreferences.map((pref, index) => (
                  <div key={index} className="mb-4">
                    <label
                      htmlFor="course"
                      className="block text-gray-700 font-bold"
                    >
                      Preference {index + 1}:
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
                      {/* Filter courses based on the selected department */}
                      {courses
                        .filter(
                          (course) => course.department !== selectedDepartment
                        )
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
                      <option value="A-(9)">A-(9)</option>
                      <option value="B(8)">B(8)</option>
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
                      onChange={(e) => handleChange(e, index, "nonPreferences")}
                      className="p-2 border rounded-md mb-2"
                    >
                      <option value="">Select Non-Preference Course</option>
                      {courses.map((filteredCourse) => (
                        <option
                          key={filteredCourse._id}
                          value={filteredCourse._id}
                          disabled={selectedCourses.includes(filteredCourse._id)}
                        >
                          {filteredCourse.name}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-[#3dafaa] text-white p-2 rounded"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )
    }
    </>
  );
};

export default StudentForm;
