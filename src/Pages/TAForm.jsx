import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Select from "react-select";
import Swal from "sweetalert2";
import * as Yup from "yup";

import CryptoJS from "crypto-js";
import ClipLoader from "react-spinners/ClipLoader";
const validationSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  rollNo: Yup.string()
    .matches(/^(PhD|MT\d|\d{3})/, "Invalid roll number")
    .required("Roll No is required"),
  program: Yup.string().required("Program is required"),
  department: Yup.string().required("Department is required"),
  taType: Yup.string().required("TA Type is required"),
  cgpa: Yup.number().typeError("Invalid CGPA").max(10, "Invalid CGPA"),
});

const API = import.meta.env.VITE_API_URL;

const StudentForm = () => {
  const [formOpened, setFormOpened] = useState(true);
  const location = useLocation();
  const [email, setEmail] = useState(location.state?.email || "your email id");
  const encryptedEmail = location.state?.encryptedEmail || "NA";
  const studentExistDepartment = location.state?.department || "";
  const studentExist = location.state?.studentExist;
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
  const [dataCorrect, setDataCorrect] = useState(false);
  const handleDataCorrectChange = () => {
    setDataCorrect(!dataCorrect);
  };

  const isAnyFieldEmpty = () => {
    for (const key in formData) {
      if (
        formData[key] &&
        (formData[key] === "" || formData[key].length === 0)
      ) {
        return true;
      }
    }
    return !dataCorrect;
  };

  useEffect(() => {
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
    if (studentExist) {
      for (const i of studentExist.departmentPreferences) {
        selectedCourses.push(i.course);
      }
      for (const i of studentExist.nonDepartmentPreferences) {
        selectedCourses.push(i.course);
      }
      for (const i of studentExist.nonPreferences) {
        selectedCourses.push(i);
      }
    }
  }, []);

  const handleChange = (event, index, section) => {
    const { name, value } = event.target;

    var courseId = courses.find((course) => course.name === value)?._id;

    const updatedFormData = { ...formData };

    if (
      section === "departmentPreferences" ||
      section === "nonDepartmentPreferences"
    ) {
      const prevSelectedCourse = updatedFormData[section][index][name];
      if (name === "grade") {
        updatedFormData[section][index][name] = value;
      } else {
        updatedFormData[section][index][name] = courseId;
      }

      const updatedSelectedCourses = selectedCourses.filter(
        (course) => course !== prevSelectedCourse
      );

      if (courseId !== "") {
        updatedSelectedCourses.push(courseId);
      }
      setSelectedCourses(updatedSelectedCourses);
    } else if (section === "nonPreferences") {
      const prevSelectedCourse = updatedFormData[section][index];
      updatedFormData[section][index] = courseId;
      const updatedSelectedCourses = selectedCourses.filter(
        (course) => course !== prevSelectedCourse
      );

      if (courseId !== "") {
        updatedSelectedCourses.push(courseId);
      }
      setSelectedCourses(updatedSelectedCourses);
    } else {
      updatedFormData[name] = value;
      if (name == "program" && !value.startsWith("B.Tech")) {
        updatedFormData["taType"] = "Paid";
      }
    }

    setFormData(updatedFormData);
  };

  const handleSubmit = async () => {
    event.preventDefault();
    try {
      // Validate form data using Yup
      await validationSchema.validate(formData, { abortEarly: false });

      if (email === "your email id") {
        alert(
          "please visit login page and generate valid otp for your email Id"
        );
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

      for (const pref of formData.departmentPreferences) {
        if (pref.course === "" || pref.grade === "") {
          alert("Please fill in all Department Preferences");
          return;
        }
      }
      for (const pref of formData.nonDepartmentPreferences) {
        if (pref.course === "" || pref.grade === "") {
          alert("Please fill in all Non-Department Preferences");
          return;
        }
      }

      for (const pref of formData.nonPreferences) {
        if (pref === "") {
          alert("Please fill in all Non-Preferences");
          return;
        }
      }

      setLoading(true);

      const apiUrl =
        studentExist == null
          ? `${API}/api/student`
          : `${API}/api/student/${studentExist._id}`;

      // Send data to server
      const response = await axios({
        method: studentExist == null ? "post" : "put",
        url: apiUrl,
        data: formData, // Changed from studentData to formData
      });

      setLoading(false);
      Swal.fire("Submitted!", "Form Submitted Successfully", "success").then(
        (result) => {
          if (result.isConfirmed) {
            // Do something after form submission if needed
          }
        }
      );
    } catch (error) {
      setLoading(false);
      if (error.name === "ValidationError") {
        // Handle Yup validation errors
        let errorMessage = "<ul>"; // Opening unordered list tag
        error.inner.forEach((e) => {
          errorMessage += `<li>${e.message}</li>`; // Adding each error message as list item
        });
        errorMessage += "</ul>"; // Closing unordered list tag
        console.error("Validation errors:", errorMessage);

        Swal.fire({
          icon: "error",
          title: "Validation Error!",
          html: errorMessage, // Display formatted error messages
        });
      } else {
        console.error("Error submitting student data:", error);
        Swal.fire("Error!", "Failed to submit form", "error");
      }
    }
  };

  const handleDepartmentChange = (event) => {
    const { value } = event.target;
    setSelectedDepartment(value);
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
            <div className="z-30 flex justify-center sticky top-0 bg-white">
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
                <Select
                  id="program"
                  name="program"
                  value={{
                    value: formData.program ? formData.program : "",
                    label: formData.program
                      ? formData.program
                      : "Select Program",
                  }}
                  className="w-full border rounded"
                  options={[
                    { value: "B.Tech 3rd Year", label: "B.Tech 3rd Year" },
                    { value: "B.Tech 4th Year", label: "B.Tech 4th Year" },
                    { value: "M.Tech 1st Year", label: "M.Tech 1st Year" },
                    { value: "M.Tech 2nd Year", label: "M.Tech 2nd Year" },
                    { value: "PhD", label: "PhD" },
                  ]}
                  onChange={(selectedOption) =>
                    handleChange({
                      target: {
                        name: "program",
                        value: selectedOption ? selectedOption.value : "",
                      },
                    })
                  }
                />
              </div>

              {/* Department */}
              <div className="mb-4">
                <label
                  htmlFor="department"
                  className="block text-gray-700 font-bold"
                >
                  Department:
                </label>
                <Select
                  id="department"
                  name="department"
                  value={{
                    value: formData.department ? formData.department : "",
                    label: formData.department
                      ? formData.department
                      : "Select Department",
                  }}
                  className="w-full border rounded"
                  options={[
                    { value: "CSE", label: "CSE" },
                    { value: "MATHS", label: "MATHS" },
                    { value: "HCD", label: "HCD" },
                    { value: "ECE", label: "ECE" },
                    { value: "CB", label: "CB" },
                    { value: "SSH", label: "SSH" },
                  ]}
                  onChange={(selectedOption) => {
                    handleChange({
                      target: {
                        name: "department",
                        value: selectedOption ? selectedOption.value : "",
                      },
                    });
                    handleDepartmentChange({
                      target: {
                        name: "department",
                        value: selectedOption ? selectedOption.value : "",
                      },
                    });
                  }}
                />
              </div>

              {/* TA Type */}
              <div className="mb-4">
                <label
                  htmlFor="taType"
                  className="block text-gray-700 font-bold"
                >
                  TA Type:
                </label>

                <Select
                  id="taType"
                  name="taType"
                  value={{
                    value: formData.taType ? formData.taType : "",
                    label: formData.taType
                      ? formData.taType
                      : "Select TAship Type",
                  }}
                  className="w-full border rounded"
                  disabled={!formData.program.startsWith("B.Tech")}
                  options={
                    formData.program.startsWith("B.Tech")
                      ? [
                          { value: "Credit", label: "Credit" },
                          { value: "Paid", label: "Paid" },
                          { value: "Voluntary", label: "Voluntary" },
                        ]
                      : [{ value: "Paid", label: "Paid" }]
                  }
                  onChange={(selectedOption) => {
                    handleChange({
                      target: {
                        name: "taType",
                        value: selectedOption ? selectedOption.value : "",
                      },
                    });
                  }}
                />
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
              <div className="mb-4">
                <h3 className="text-xl font-bold mb-2">
                  Department Preferences
                </h3>
                {formData.departmentPreferences.map((pref, index) => (
                  <div key={index} className="mb-4">
                    <label
                      htmlFor={`deptCourse-${index}`}
                      className="block text-gray-700 font-bold"
                    >
                      Preference {index + 1}:
                    </label>
                    <Select
                      id={`deptCourse-${index}`}
                      options={[
                        ...courses
                          .filter(
                            (course) => course.department === selectedDepartment
                          )
                          .sort((a, b) => a.acronym.localeCompare(b.acronym))
                          .map((filteredCourse) => ({
                            value: filteredCourse.name, // Use the _id as the value
                            label: (
                              <div>
                                <div>{`${filteredCourse.code} ${filteredCourse.name}`}</div>
                                <div
                                  style={{
                                    fontStyle: "italic",
                                    fontSize: "0.8rem",
                                  }}
                                >
                                  {`(${filteredCourse.acronym}) - ${filteredCourse.professor}`}
                                </div>
                              </div>
                            ),
                            isDisabled: selectedCourses.includes(
                              filteredCourse._id
                            ),
                          })),
                      ]}
                      value={{
                        value: pref.course ? pref.course : "", // Use pref.course if it exists
                        label: pref.course ? (
                          <div>
                            {/* Print the value of pref here */}

                            <div>{`${
                              courses.find(
                                (course) => course._id === pref.course
                              )?.code
                            } ${
                              courses.find(
                                (course) => course._id === pref.course
                              )?.name
                            }`}</div>
                            <div
                              style={{
                                fontStyle: "italic",
                                fontSize: "0.8rem",
                              }}
                            >
                              {`(${
                                courses.find(
                                  (course) => course._id === pref.course
                                )?.acronym
                              }) - ${
                                courses.find(
                                  (course) => course._id === pref.course
                                )?.professor
                              }`}
                            </div>
                          </div>
                        ) : (
                          "Select Preferred Course"
                        ),
                      }}
                      onChange={(selectedOption) =>
                        handleChange(
                          {
                            target: {
                              name: "course",
                              value: selectedOption ? selectedOption.value : "", // Use selected option value
                            },
                          },
                          index,
                          "departmentPreferences"
                        )
                      }
                      className="w-full"
                    />

                    <label
                      htmlFor={`deptGrade-${index}`}
                      className="block text-gray-700 font-bold mt-2"
                    >
                      Grade:
                    </label>
                    <Select
                      id={`deptGrade-${index}`}
                      options={[
                        { value: "A+(10)", label: "A+(10)" },
                        { value: "A(10)", label: "A(10)" },
                        { value: "A-(9)", label: "A-(9)" },
                        { value: "B(8)", label: "B(8)" },
                        { value: "B-(7)", label: "B-(7)" },
                        { value: "C(6)", label: "C(6)" },
                        { value: "C-(5)", label: "C-(5)" },
                        { value: "D(4)", label: "D(4)" },
                        { value: "Course Not Done", label: "Course Not Done" },
                      ]}
                      value={{
                        value: pref.grade ? pref.grade : "",
                        label: pref.grade ? pref.grade : "Select Grade",
                      }}
                      onChange={(selectedOption) =>
                        handleChange(
                          {
                            target: {
                              name: "grade",
                              value: selectedOption ? selectedOption.value : "",
                            },
                          },
                          index,
                          "departmentPreferences"
                        )
                      }
                      className="w-full"
                    />
                  </div>
                ))}
              </div>

              {/* Non-Department Preferences */}
              <div className="mb-4">
                <h3 className="text-xl font-bold mb-2">Other Preferences</h3>
                {formData.nonDepartmentPreferences.map((pref, index) => (
                  <div key={index} className="mb-4">
                    <label
                      htmlFor={`nonDeptCourse-${index}`}
                      className="block text-gray-700 font-bold"
                    >
                      Preference {index + 1}:
                    </label>
                    <Select
                      id={`nonDeptCourse-${index}`}
                      options={
                        selectedDepartment
                          ? [
                              ...courses
                                .sort((a, b) =>
                                  a.acronym.localeCompare(b.acronym)
                                )
                                .map((filteredCourse) => ({
                                  value: filteredCourse.name,
                                  label: (
                                    <div>
                                      <div>{`${filteredCourse.code} ${filteredCourse.name}`}</div>
                                      <div
                                        style={{
                                          fontStyle: "italic",
                                          fontSize: "0.8rem",
                                        }}
                                      >
                                        {`(${filteredCourse.acronym}) - ${filteredCourse.professor}`}
                                      </div>
                                    </div>
                                  ),
                                  isDisabled: selectedCourses.includes(
                                    filteredCourse._id
                                  ),
                                })),
                            ]
                          : []
                      }
                      value={{
                        value: pref.course ? pref.course : "", // Use pref.course if it exists
                        label: pref.course ? (
                          <div>
                            <div>{`${
                              courses.find(
                                (course) => course._id === pref.course
                              )?.code
                            } ${
                              courses.find(
                                (course) => course._id === pref.course
                              )?.name
                            }`}</div>
                            <div
                              style={{
                                fontStyle: "italic",
                                fontSize: "0.8rem",
                              }}
                            >
                              {`(${
                                courses.find(
                                  (course) => course._id === pref.course
                                )?.acronym
                              }) - ${
                                courses.find(
                                  (course) => course._id === pref.course
                                )?.professor
                              }`}
                            </div>
                          </div>
                        ) : (
                          "Select Preferred Course"
                        ),
                      }}
                      onChange={(selectedOption) =>
                        handleChange(
                          {
                            target: {
                              name: "course",
                              value: selectedOption ? selectedOption.value : "",
                            },
                          },
                          index,
                          "nonDepartmentPreferences"
                        )
                      }
                      className="w-full"
                    />
                    <label
                      htmlFor={`nonDeptGrade-${index}`}
                      className="block text-gray-700 font-bold mt-2"
                    >
                      Grade:
                    </label>
                    <Select
                      id={`nonDeptGrade-${index}`}
                      options={[
                        { value: "A+(10)", label: "A+(10)" },
                        { value: "A(10)", label: "A(10)" },
                        { value: "A-(9)", label: "A-(9)" },
                        { value: "B(8)", label: "B(8)" },
                        { value: "B-(7)", label: "B-(7)" },
                        { value: "C(6)", label: "C(6)" },
                        { value: "C-(5)", label: "C-(5)" },
                        { value: "D(4)", label: "D(4)" },
                        { value: "Course Not Done", label: "Course Not Done" },
                      ]}
                      value={{
                        value: pref.grade ? pref.grade : "",
                        label: pref.grade ? pref.grade : "Select Grade",
                      }}
                      onChange={(selectedOption) =>
                        handleChange(
                          {
                            target: {
                              name: "grade",
                              value: selectedOption ? selectedOption.value : "",
                            },
                          },
                          index,
                          "nonDepartmentPreferences"
                        )
                      }
                      className="w-full"
                    />
                  </div>
                ))}
              </div>

              <div>
                <h3 className="text-xl font-bold mb-2">Non-Preferences</h3>
                {formData.nonPreferences.map((pref, index) => (
                  <div key={index}>
                    <Select
                      options={
                        selectedDepartment
                          ? [
                              ...courses
                                .sort((a, b) =>
                                  a.acronym.localeCompare(b.acronym)
                                )
                                .map((filteredCourse) => ({
                                  value: filteredCourse.name,
                                  label: (
                                    <div>
                                      <div>{`${filteredCourse.code} ${filteredCourse.name}`}</div>
                                      <div
                                        style={{
                                          fontStyle: "italic",
                                          fontSize: "0.8rem",
                                        }}
                                      >
                                        {`(${filteredCourse.acronym}) - ${filteredCourse.professor}`}
                                      </div>
                                    </div>
                                  ),
                                  isDisabled: selectedCourses.includes(
                                    filteredCourse._id
                                  ),
                                })),
                            ]
                          : []
                      }
                      onChange={(selectedOption) =>
                        handleChange(
                          {
                            target: {
                              name: "course",
                              value: selectedOption ? selectedOption.value : "",
                            },
                          },
                          index,
                          "nonPreferences"
                        )
                      }
                      value={{
                        value: pref ? pref : "", // Use pref.course if it exists
                        label: pref ? (
                          <div>
                            <div>{`${
                              courses.find((course) => course._id === pref)
                                ?.code
                            } ${
                              courses.find((course) => course._id === pref)
                                ?.name
                            }`}</div>
                            <div
                              style={{
                                fontStyle: "italic",
                                fontSize: "0.8rem",
                              }}
                            >
                              {`(${
                                courses.find((course) => course._id === pref)
                                  ?.acronym
                              }) - ${
                                courses.find((course) => course._id === pref)
                                  ?.professor
                              }`}
                            </div>
                          </div>
                        ) : (
                          "Select Non-Preferred Course"
                        ),
                      }}
                      className="border rounded-md mb-2"
                    />
                  </div>
                ))}
              </div>
              <div className="mb-4">
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    className="form-checkbox h-5 w-5 text-[#3dafaa]"
                    checked={dataCorrect}
                    onChange={handleDataCorrectChange}
                  />
                  <span className="ml-2 text-gray-700">
                    I am committed to fulfilling my TA duties once assigned and
                    will not opt out thereafter. <br />
                    Prior to commencing my TA responsibilities, I will ensure to
                    complete the requisite TA training. <br />I hereby confirm
                    the accuracy of the provided data to the best of my
                    knowledge.
                  </span>
                </label>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className={`p-2 rounded ${
                    isAnyFieldEmpty()
                      ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                      : "bg-[#3dafaa] text-white"
                  }`}
                  disabled={isAnyFieldEmpty()}
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center">
          <h2 className="text-8xl font-bold mb-2  text-[#3dafaa]">
            Form Closed
          </h2>
        </div>
      )}
    </>
  );
};

export default StudentForm;
