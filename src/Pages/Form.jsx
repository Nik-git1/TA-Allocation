import axios from "axios";
import CryptoJS from "crypto-js";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";
import Swal from "sweetalert2";

import Select from "react-select";

const StudentForm = () => {
  const [formOpened, setFormOpened] = useState(true);
  const location = useLocation();
  const [email, setEmail] = useState(location.state?.email || "your email id");
  const encryptedEmail = location.state?.encryptedEmail || "NA";
  const studentExistDepartment = location.state?.department || "";
  const studentExist = location.state?.studentExist;

  const API = import.meta.env.VITE_API_URL;

  const studentExistData = studentExist || {
    name: "",
    rollNo: "",
    program: "",
    department: "",
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
  };

  const secretKey = "your-secret-key"; // Use the same secret key used for encryption
  const decryptedEmail = CryptoJS.AES.decrypt(
    encryptedEmail,
    secretKey
  ).toString(CryptoJS.enc.Utf8);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: studentExistData.name,
    emailId: email,
    rollNo: studentExistData.rollNo,
    program: studentExistData.program,
    department: studentExistDepartment,
    taType: studentExistData.taType,
    cgpa: studentExistData.cgpa,
    departmentPreferences:
      studentExistData.departmentPreferences.length === 0
        ? [
            { course: "", grade: "" },
            { course: "", grade: "" },
          ]
        : studentExistData.departmentPreferences,
    nonDepartmentPreferences:
      studentExistData.nonDepartmentPreferences.length === 0
        ? [
            { course: "", grade: "" },
            { course: "", grade: "" },
            { course: "", grade: "" },
            { course: "", grade: "" },
            { course: "", grade: "" },
          ]
        : studentExistData.nonDepartmentPreferences,
    nonPreferences:
      studentExistData.nonPreferences.length === 0
        ? ["", "", ""]
        : studentExistData.nonPreferences,
  });

  const [courses, setCourses] = useState([]);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState(
    formData.department
  );

  useEffect(() => {
    // Fetch course data from the backend API
    axios
      .get(`${API}/api/course`)
      .then((response) => {
        setCourses(response.data);
      })
      .catch((error) => {
        console.error("Error fetching courses:", error);
      });

    axios
      .get(`${API}/api/form`)
      .then((response) => {
        setFormOpened(response.data.state);
      })
      .catch((error) => {
        console.error("Error fetching courses:", error);
      });
  }, []);

  const getCoursesOptions = (selectedDepartment, member) => {
    const filteredCourses = courses.filter((course) => {
      if (member === "department") {
        return course.department === selectedDepartment;
      } else {
        return course.department !== selectedDepartment;
      }
    });

    return filteredCourses.map((course) => ({
      label: `${course.code} \u00a0\u00a0${course.name}-(${course.acronym}) \u00a0\u00a0\u00a0\u00a0${course.professor}`,
      value: course.name,
    }));
  };

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
      formData.rollNo.length > 8 ||
      formData.rollNo.length < 7 // Check length
      // Check pattern
    ) {
      alert("Invalid roll number");
      return;
    }

    if (
      !/^(PhD|MT\d|\d{3})/.test(formData.rollNo) &&
      !/^(phd|mt\d|\d{3})/.test(formData.rollNo)
    ) {
      alert("Roll number should start with either phd, mt or with numeric");
      return;
    }

    if (email === "your email id") {
      alert("please visit login page and generate valid otp for your email Id");
      return;
    }

    if (email !== decryptedEmail) {
      alert("Invalid email");
      return;
    }

    if (!decryptedEmail.endsWith("@iiitd.ac.in")) {
      alert("Only IIITD Students allowed");
      return;
    }

    if (!formOpened) {
      alert("Form Closed");
      return;
    }

    if (formData.cgpa > 10) {
      alert("Invalid CGPA");
      return;
    }

    if (!formData.program.startsWith("B.Tech")) {
      formData.taType = "Paid";
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
        if (value.length === 3) {
          return value.every((pref) => pref !== "");
        }
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
      if (studentExist == null) {
        // Send a POST request to the API endpoint
        await axios
          .post(`${API}/api/student`, studentData)
          .then((response) => {
            setLoading(false);
            Swal.fire(
              "Submitted!",
              "Form Submitted Successfully",
              "success"
            ).then((result) => {
              if (result.isConfirmed) {
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
            `${API}/api/student/${studentExist._id}`,
            studentData
          )
          .then((response) => {
            setLoading(false);
            Swal.fire(
              "Submitted!",
              "Form Submitted Successfully",
              "success"
            ).then((result) => {
              if (result.isConfirmed) {
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
    } else {
      alert("Please fill in all the fields :)");
    }
  };

  const handleDepartmentChange = (event) => {
    const { value } = event.target;
    setSelectedDepartment(value);

    const updatedFormData = { ...formData };
    updatedFormData.departmentPreferences = formData.departmentPreferences.map(
      (pref) => ({ course: null, grade: pref.grade })
    );
    setFormData(updatedFormData);
  };

  const handleChangeSelect = (selectedOption, index, section) => {
    const updatedFormData = { ...formData };

    if (
      section === "departmentPreferences" ||
      section === "nonDepartmentPreferences"
    ) {
      updatedFormData[section][index].course = selectedOption.value;
    }

    setFormData(updatedFormData);
  };

  return (
    <>
      {loading ? (
        <div className="flex justify-center items-center">
          <ClipLoader
            color={"#3dafaa"}
            loading={loading}
            size={100}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        </div>
      ) : formOpened ? (
        <div className="flex justify-center items-center relative">
          <img
            src="./images/iiitdrndblock2.jpeg"
            className="h-full w-auto object-contain filter blur-sm absolute inset-0"
            alt="Sample image"
          />
          <div className=" mx-auto z-10 bg-white px-4 pb-4 border-4 mt-4 border-[#3dafaa] shadow-xl max-h-[97vh] overflow-auto">
            <div className="flex justify-center sticky top-0 bg-white">
              <h2 className="text-3xl font-bold mb-2  text-[#3dafaa]">
                TA Form
              </h2>
            </div>
            <h2 className="text-2xl font-bold mb-2 mt-4">
              Student Information
            </h2>
            <form onSubmit={handleSubmit}>
              {/* Email Id */}
              <div className="mb-4">
                <label
                  htmlFor="emailId"
                  className="block text-gray-700 font-bold"
                >
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
                <label
                  htmlFor="rollNo"
                  className="block text-gray-700 font-bold"
                >
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
                <label
                  htmlFor="program"
                  className="block text-gray-700 font-bold"
                >
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
                <label
                  htmlFor="taType"
                  className="block text-gray-700 font-bold"
                >
                  TA Type:
                </label>
                <select
                  id="taType"
                  name="taType"
                  value={formData.taType}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  disabled={!formData.program.startsWith("B.Tech")}
                >
                  {/* Rendering options based on condition */}
                  {formData.program.startsWith("B.Tech") ? (
                    <>
                      <option value="">Select TA Type</option>
                      <option value="Credit">Credit</option>
                      <option value="Paid">Paid</option>
                      <option value="Voluntary">Voluntary</option>
                    </>
                  ) : (
                    <>
                      <option value="Paid">Paid</option>
                    </>
                  )}
                </select>
              </div>

              {/* CGPA */}
              <div className="mb-4">
                <label htmlFor="cgpa" className="block text-gray-700 font-bold">
                  CGPA: (Must have two digits before and after decimal eg:
                  XX.XX)
                </label>
                <input
                  type="text"
                  pattern="^\d{2}\.\d{2}$"
                  inputMode="numeric"
                  id="cgpa"
                  name="cgpa"
                  value={formData.cgpa}
                  onChange={handleChange}
                  onKeyPress={(e) => {
                    const allowedChars = /^[0-9.]$/;
                    if (!allowedChars.test(e.key)) {
                      e.preventDefault();
                    }
                  }}
                  className="w-full p-2 border rounded"
                />
              </div>

              {/* Department Preferences */}

              {/* Department Preferences */}
              <div className="mb-4">
                <h3 className="text-xl font-bold mb-2">
                  Department Preferences
                </h3>
                {formData.departmentPreferences.map((pref, index) => (
                  <div key={index} className="mb-4">
                    <label
                      htmlFor="course"
                      className="block text-gray-700 font-bold"
                    >
                      Preference {index + 1}:
                    </label>
                    <Select
                      id={`deptCourse-${index}`}
                      name="course"
                      value={
                        formData.departmentPreferences[index].course
                          ? {
                              label:
                                formData.departmentPreferences[index].course,
                              value:
                                formData.departmentPreferences[index].course,
                            }
                          : null
                      }
                      options={getCoursesOptions(
                        selectedDepartment,
                        "department"
                      )}
                      onChange={(selectedOption) =>
                        handleChangeSelect(
                          selectedOption,
                          index,
                          "departmentPreferences"
                        )
                      }
                      className="w-full p-2 border rounded"
                    />

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
                      <option value="B-(7)">B-(7)</option>
                      <option value="C(6)">C(6)</option>
                      <option value="C-(5)">C-(5)</option>
                      <option value="D(4)">D(4)</option>
                      <option valie="Course Not Done"> Course Not Done </option>
                    </select>
                  </div>
                ))}
              </div>

              {/* Non-Department Preferences */}
              <div className="mb-4">
                <h3 className="text-xl font-bold mb-2">Other Preferences</h3>
                {formData.nonDepartmentPreferences.map((pref, index) => (
                  <div key={index} className="mb-4">
                    <label
                      htmlFor="course"
                      className="block text-gray-700 font-bold"
                    >
                      Preference {index + 1}:
                    </label>
                    <Select
                      id={`nonDeptCourse-${index}`}
                      name="course"
                      value={
                        formData.nonDepartmentPreferences[index].course
                          ? {
                              label:
                                formData.nonDepartmentPreferences[index].course,
                              value:
                                formData.nonDepartmentPreferences[index].course,
                            }
                          : null
                      }
                      options={getCoursesOptions(
                        selectedDepartment,
                        "non-department"
                      )}
                      onChange={(selectedOption) =>
                        handleChangeSelect(
                          selectedOption,
                          index,
                          "nonDepartmentPreferences"
                        )
                      }
                      className="w-full p-2 border rounded"
                    />

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
                      <option value="B-(7)">B-(7)</option>
                      <option value="C(6)">C(6)</option>
                      <option value="C-(5)">C-(5)</option>
                      <option value="D(4)">D(4)</option>
                      <option valie="Course Not Done"> Course Not Done </option>
                      {/* Add more grade options here */}
                    </select>
                  </div>
                ))}
              </div>

              {/* Non-Preferences */}
              <div>
                <h3 className="text-xl font-bold mb-2">Non-Preferences</h3>
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
                        >
                          {`${filteredCourse.code} \u00a0\u00a0${filteredCourse.name}-(${filteredCourse.acronym}) \u00a0\u00a0\u00a0\u00a0${filteredCourse.professor}`}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
              <button
                type="submit"
                className="bg-[#3dafaa] text-white px-4 py-2 mt-4 rounded font-semibold"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      ) : (
        <h2 className="text-center text-3xl text-red-600 mt-20">Form Closed</h2>
      )}
    </>
  );
};

export default StudentForm;
