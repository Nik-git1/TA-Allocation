import React, { useState,useContext,useEffect } from "react";
import CourseContext from '../context/CourseContext';

const Form = () => {
  const [program, setProgram] = useState({
    btech_3rd: null,
    btech_4th: null,
  });
  const { course, setCourse } = useContext(CourseContext);
  console.log(course);
  const handleProgramChange = (e) => {
    const { name, checked } = e.target;

    // If one checkbox is checked, uncheck the other one
    if (name === "btech_3rd" && checked) {
      setProgram({
       btech_3rd: true,
       btech_4th: false,
      });
    } else if (name === "btech_4th" && checked) {
      setProgram({
       btech_3rd: false,
       btech_4th: true,
      });
    } else {
      setProgram({
        ...program,
        [name]: checked,
      });
    }
  };
  const isNoneChecked = program.btech_3rd === null && program.btech_4th === null;
  const [emailId, setEmailId] = useState(null);
  const [name, setName] = useState(null);
  const [rollNo, setRollNo] = useState(null);
  const [department, setDepartment] = useState("Select Your Dept.");
  const [cgpa, setCGPA] = useState(null);
  const [taType, setTaType] = useState("Select Your Ta Type");

  const courseList = [
    "IP","MATHS1","IHCI","COMM","DC","AP","DBMS","ADA","ML","FCS"
  ]

  const [SelectedCourses, setSelectedCourses] = useState({
    course1: "",
    course2: "",
    course3: "",
    course4: "",
    course5: "",
    course6: "",
    course7: "",
    course8: "",
    course9: "",
    course10: "",
  });

  const handleSelect = (e, courseNumber) => {
    const value = e.target.value;
    setSelectedCourses((prev) => ({ ...prev, [courseNumber]: value }));
  };

  const filteredCourseList1 = courseList.filter(course => 
    course !== SelectedCourses.course2 && course !== SelectedCourses.course3 && course !== SelectedCourses.course4
    && course !== SelectedCourses.course5 && course !== SelectedCourses.course6 && course !== SelectedCourses.course7
    && course !== SelectedCourses.course8 && course !== SelectedCourses.course9 && course !== SelectedCourses.course10
  );

  const filteredCourseList2 = courseList.filter(course => 
    course !== SelectedCourses.course1 && course !== SelectedCourses.course3 && course !== SelectedCourses.course4
    && course !== SelectedCourses.course5 && course !== SelectedCourses.course6 && course !== SelectedCourses.course7
    && course !== SelectedCourses.course8 && course !== SelectedCourses.course9 && course !== SelectedCourses.course10
  );

  const filteredCourseList3 = courseList.filter(course => 
    course !== SelectedCourses.course1 && course !== SelectedCourses.course2 && course !== SelectedCourses.course4
    && course !== SelectedCourses.course5 && course !== SelectedCourses.course6 && course !== SelectedCourses.course7
    && course !== SelectedCourses.course8 && course !== SelectedCourses.course9 && course !== SelectedCourses.course10
  );

  const filteredCourseList4 = courseList.filter(course => 
    course !== SelectedCourses.course1 && course !== SelectedCourses.course2 && course !== SelectedCourses.course3
    && course !== SelectedCourses.course5 && course !== SelectedCourses.course6 && course !== SelectedCourses.course7
    && course !== SelectedCourses.course8 && course !== SelectedCourses.course9 && course !== SelectedCourses.course10
  );

  const filteredCourseList5 = courseList.filter(course => 
    course !== SelectedCourses.course1 && course !== SelectedCourses.course2 && course !== SelectedCourses.course3
    && course !== SelectedCourses.course4 && course !== SelectedCourses.course6 && course !== SelectedCourses.course7
    && course !== SelectedCourses.course8 && course !== SelectedCourses.course9 && course !== SelectedCourses.course10
  );

  const filteredCourseList6 = courseList.filter(course => 
    course !== SelectedCourses.course1 && course !== SelectedCourses.course2 && course !== SelectedCourses.course3
    && course !== SelectedCourses.course4 && course !== SelectedCourses.course5 && course !== SelectedCourses.course7
    && course !== SelectedCourses.course8 && course !== SelectedCourses.course9 && course !== SelectedCourses.course10
  );

  const filteredCourseList7 = courseList.filter(course => 
    course !== SelectedCourses.course1 && course !== SelectedCourses.course2 && course !== SelectedCourses.course3
    && course !== SelectedCourses.course4 && course !== SelectedCourses.course5 && course !== SelectedCourses.course6
    && course !== SelectedCourses.course8 && course !== SelectedCourses.course9 && course !== SelectedCourses.course10
  );

  const filteredCourseList8 = courseList.filter(course => 
    course !== SelectedCourses.course1 && course !== SelectedCourses.course2 && course !== SelectedCourses.course3
    && course !== SelectedCourses.course4 && course !== SelectedCourses.course5 && course !== SelectedCourses.course6
    && course !== SelectedCourses.course7 && course !== SelectedCourses.course9 && course !== SelectedCourses.course10
  );

  const filteredCourseList9 = courseList.filter(course => 
    course !== SelectedCourses.course1 && course !== SelectedCourses.course2 && course !== SelectedCourses.course3
    && course !== SelectedCourses.course4 && course !== SelectedCourses.course5 && course !== SelectedCourses.course6
    && course !== SelectedCourses.course7 && course !== SelectedCourses.course8 && course !== SelectedCourses.course10
  );

  const filteredCourseList10 = courseList.filter(course => 
    course !== SelectedCourses.course1 && course !== SelectedCourses.course2 && course !== SelectedCourses.course3
    && course !== SelectedCourses.course4 && course !== SelectedCourses.course5 && course !== SelectedCourses.course6
    && course !== SelectedCourses.course7 && course !== SelectedCourses.course8 && course !== SelectedCourses.course9
  );

  const [formContent, setFormContent] = useState(true);

  const handleBackClick = () => {
    setFormContent(true)
  }

  const handleNextClick = () => {
    if (emailId !== null && name !== null && rollNo !== null && department !== "Select Your dept." && taType !== "Select Your Ta Type" && cgpa !== null &&isNoneChecked !== true) {
        console.log("hello")
        // console.log(department)
        setFormContent(false)   
    }
    else{

      alert("Please fill all the fields")
    }
  }
  return (
    <div className="h-screen flex flex-col items-center overflow-auto">
      {/* <img
        src="./images/iiitdrndblock2.jpeg"
        className="h-full w-auto object-contain filter blur-sm absolute inset-0"
        alt="Sample image"
      /> */}
      <style>
        {`
          body {
            background-image: url(${"./images/iiitdrndblock2.jpeg"});
            background-size: cover;
            background-position: center;
            background-repeat:no-repeat;
            background-attachment: fixed;
            backdrop-filter: blur(4px);
          }
        `}
      </style>
      <div className="bg-white rounded mt-6 flex flex-col items-center z-10 overflow-auto max-h-screen">
        <h2 className="font-bold text-[#3dafaa] text-xl mx-6 mt-4 sticky top-0">TA Preference Form</h2>
        {formContent ?(
          <form className="mb-2 mx-2 w-[300px] overflow-auto max-h-screen">
            <div className="flex flex-col text-black py-1">
              <label className="font-bold">Email Id</label>
              <input
                className="text-black rounded-lg bg-white mt-2 p-1 border-2 border-gray-500 focus:bg-gray-200 focus:outline-none"
                type="email"
                onChange={(e) => setEmailId(e.target.value)}
                defaultValue = {emailId}
              />
            </div>
            <div className="flex flex-col text-black py-1">
              <label className="font-bold">Name</label>
              <input
                className="text-black rounded-lg bg-white mt-2 p-1 border-2 border-gray-500 focus:bg-gray-200 focus:outline-none"
                type="text"
                onChange={(e) => setName(e.target.value)}
                defaultValue = {name}
              />
            </div>
            <div className="flex flex-col text-black py-1">
              <label className="font-bold">Roll no.</label>
              <input
                className="text-black rounded-lg bg-white mt-2 p-1 border-2 border-gray-500 focus:bg-gray-200 focus:outline-none"
                type="number"
                onChange={(e) => setRollNo(e.target.value)}
                defaultValue = {rollNo}
              />
            </div>
            <div className="flex flex-col text-black py-1">
              <label className="font-bold">Department</label>
              <select
                className="text-black rounded-lg bg-white mt-2 p-1 border-2 border-gray-500 focus:bg-gray-200 focus:outline-none"
                onChange={(e) => setDepartment(e.target.value)}
                value={department}
              >
                <option value="">Select Your Dept.</option>
                <option value="Math">Math</option>
                <option value="CSE">CSE</option>
                <option value="ECE">ECE</option>
                <option value="HCD">HCD</option>
                <option value="CB">CB</option>
                <option value="SSH">SSH</option>
              </select>
            </div>
            <div className="flex flex-col text-black py-1">
              <label className="font-bold">Current CGPA</label>
              <input
                className="text-black rounded-lg bg-white mt-2 p-1 border-2 border-gray-500 focus:bg-gray-200 focus:outline-none"
                type="number"
                onChange={(e) => setCGPA(e.target.value)}
                defaultValue = {cgpa}
              />
            </div>
            <div className="flex flex-col text-black py-1">
              <label className="font-bold">Program</label>
            </div>
            <div className="mt-1">
              <label className="">
                <input
                  type="checkbox"
                  name="btech_3rd"
                  checked={program.btech_3rd === true}
                  onChange={handleProgramChange}
                />
                B.Tech. 3rd Year
              </label>
            </div>
            <div>
              <label>
                <input
                  type="checkbox"
                  name="btech_4th"
                  checked={program.btech_4th === true}
                  onChange={handleProgramChange}
                />
                B.Tech. 4th Year
              </label>
            </div>
            <div className="flex flex-col text-black py-2">
              <label className="font-bold">TA Type</label>
              <select
                className="text-black rounded-lg bg-white mt-2 p-1 border-2 border-gray-500 focus:bg-gray-200 focus:outline-none"
                onChange={(e) => setTaType(e.target.value)}
                value={taType}
              >
                <option value="">Select Your Ta Type</option>
                <option value="Math">Credit Basis</option>
                <option value="CSE">Paid Basis</option>
                <option value="ECE">Voluntary</option>
              </select>
            </div>
            
          </form>
        ):
        <form className="mb-2 mx-2 w-[300px] overflow-auto max-h-screen">
          <p className="font-bold mt-2">3 Courses where you don't wish to be a TA:</p>
          <div className="flex flex-col  py-1">
            <label className="text-gray-500">Course 1</label>
            <select
              className="text-black rounded-lg bg-white mt-2 p-1 border-2 border-gray-500 focus:bg-gray-200 focus:outline-none max-h-[50px] overflow-auto"
              value={SelectedCourses.course1}
              onChange={(e) => handleSelect(e, "course1")}
            >
              <option disabled hidden value="">
                Choose a course
              </option>
              <optgroup label="Courses">

                {filteredCourseList1.map((course, index) => (
                  <option key={index} value={course}>
                    {course}
                  </option>
                ))}
              </optgroup>
            </select>
          </div>
          <div className="flex flex-col  py-1">
            <label className="text-gray-500">Course 2</label>
            <select
              className="text-black rounded-lg bg-white mt-2 p-1 border-2 border-gray-500 focus:bg-gray-200 focus:outline-none"
              value={SelectedCourses.course2}
              onChange={(e) => handleSelect(e, "course2")}
            >
              <option disabled hidden value="">
                Choose a course
              </option>
              <optgroup label="Courses">
                {filteredCourseList2.map((course, index) => (
                  <option key={index} value={course}>
                    {course}
                  </option>
                ))}
              </optgroup>
            </select>
          </div>
          <div className="flex flex-col  py-1">
            <label className="text-gray-500">Course 3</label>
            <select
              className="text-black rounded-lg bg-white mt-2 p-1 border-2 border-gray-500 focus:bg-gray-200 focus:outline-none"
              value={SelectedCourses.course3}
              onChange={(e) => handleSelect(e, "course3")}
            >
              <option disabled hidden value="">
                Choose a course
              </option>
              <optgroup label="Courses">
                {filteredCourseList3.map((course, index) => (
                  <option key={index} value={course}>
                    {course}
                  </option>
                ))}
              </optgroup>
            </select>
          </div>
          <p className="font-bold mt-2">Prefered Courses</p>
          <div className="flex flex-col  py-1">
            <label className="text-gray-500">Course 1 (Department Only)</label>
            <select
              className="text-black rounded-lg bg-white mt-2 p-1 border-2 border-gray-500 focus:bg-gray-200 focus:outline-none"
              value={SelectedCourses.course4}
              onChange={(e) => handleSelect(e, "course4")}
            >
              <option disabled hidden value="">
                Choose a course
              </option>
              <optgroup label="Courses">
                {filteredCourseList4.map((course, index) => (
                  <option key={index} value={course}>
                    {course}
                  </option>
                ))}
              </optgroup>
            </select>
          </div>
          <div className="flex flex-col  py-1">
            <label className="text-gray-500">Course 2 (Department Only)</label>
            <select
              className="text-black rounded-lg bg-white mt-2 p-1 border-2 border-gray-500 focus:bg-gray-200 focus:outline-none"
              value={SelectedCourses.course5}
              onChange={(e) => handleSelect(e, "course5")}
            >
              <option disabled hidden value="">
                Choose a course
              </option>
              <optgroup label="Courses">
                {filteredCourseList5.map((course, index) => (
                  <option key={index} value={course}>
                    {course}
                  </option>
                ))}
              </optgroup>
            </select>
          </div>
          <div className="flex flex-col  py-1">
            <label className="text-gray-500">Course 3</label>
            <select
              className="text-black rounded-lg bg-white mt-2 p-1 border-2 border-gray-500 focus:bg-gray-200 focus:outline-none"
              value={SelectedCourses.course6}
              onChange={(e) => handleSelect(e, "course6")}
            >
              <option disabled hidden value="">
                Choose a course
              </option>
              <optgroup label="Courses">
                {filteredCourseList6.map((course, index) => (
                  <option key={index} value={course}>
                    {course}
                  </option>
                ))}
              </optgroup>
            </select>
          </div>
          <div className="flex flex-col  py-1">
            <label className="text-gray-500">Course 4</label>
            <select
              className="text-black rounded-lg bg-white mt-2 p-1 border-2 border-gray-500 focus:bg-gray-200 focus:outline-none"
              value={SelectedCourses.course7}
              onChange={(e) => handleSelect(e, "course7")}
            >
              <option disabled hidden value="">
                Choose a course
              </option>
              <optgroup label="Courses">
                {filteredCourseList7.map((course, index) => (
                  <option key={index} value={course}>
                    {course}
                  </option>
                ))}
              </optgroup>
            </select>
          </div>
          <div className="flex flex-col  py-1">
            <label className="text-gray-500">Course 5</label>
            <select
              className="text-black rounded-lg bg-white mt-2 p-1 border-2 border-gray-500 focus:bg-gray-200 focus:outline-none"
              value={SelectedCourses.course8}
              onChange={(e) => handleSelect(e, "course8")}
            >
              <option disabled hidden value="">
                Choose a course
              </option>
              <optgroup label="Courses">
                {filteredCourseList8.map((course, index) => (
                  <option key={index} value={course}>
                    {course}
                  </option>
                ))}
              </optgroup>
            </select>
          </div>
          <div className="flex flex-col  py-1">
            <label className="text-gray-500">Course 6</label>
            <select
              className="text-black rounded-lg bg-white mt-2 p-1 border-2 border-gray-500 focus:bg-gray-200 focus:outline-none"
              value={SelectedCourses.course9}
              onChange={(e) => handleSelect(e, "course9")}
            >
              <option disabled hidden value="">
                Choose a course
              </option>
              <optgroup label="Courses">
                {filteredCourseList9.map((course, index) => (
                  <option key={index} value={course}>
                    {course}
                  </option>
                ))}
              </optgroup>
            </select>
          </div>
          <div className="flex flex-col  py-1">
            <label className="text-gray-500">Course 7</label>
            <select
              className="text-black rounded-lg bg-white mt-2 p-1 border-2 border-gray-500 focus:bg-gray-200 focus:outline-none"
              value={SelectedCourses.course10}
              onChange={(e) => handleSelect(e, "course10")}
            >
              <option disabled hidden value="">
                Choose a course
              </option>
              <optgroup label="Courses">
                {filteredCourseList10.map((course, index) => (
                  <option key={index} value={course}>
                    {course}
                  </option>
                ))}
              </optgroup>
            </select>
          </div>
        </form>
        }
      </div>
      {!formContent ?(
        <div className="flex justify-center space-x-4">
          <button className="bg-[#3dafaa] text-white py-1 px-3 mt-2 rounded-lg" onClick={handleBackClick}>
            Back
          </button>
          <button className="bg-[#3dafaa] text-white py-1 px-3 mt-2 rounded-lg">
            Submit
          </button>
        </div>
        ):
        <button className="bg-[#3dafaa] text-white py-1 px-3 mt-2 rounded-lg" onClick={handleNextClick}>
          Next
        </button>
        }
    </div>
  );
};

export default Form;
