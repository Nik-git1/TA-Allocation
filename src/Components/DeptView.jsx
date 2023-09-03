import React, { useContext, useState, useEffect } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import "../App.css";
import { Link, useNavigate } from "react-router-dom"; // Import Link and useHistory
import CourseContext from "../context/CourseContext";
import DepartmentContext from "../context/DepartmentContext"; 
const Department = () => {
  const [filteredCourses, setfilteredCourses] = useState([])
  const { course, updateSelectedCourse } = useContext(CourseContext);
  const {selectedDepartment ,updateSelectedDepartment } = useContext(DepartmentContext)
  let navigateTo = useNavigate();// Get the history object

  const handleDepartmentChange = (event) => {
    updateSelectedDepartment(event.target.value);
  };

  useEffect(() => {
    if (course && course.length > 1) {
      const filtered = course.filter((c) => c[3] === selectedDepartment);
      setfilteredCourses(filtered);
    }
  }, [selectedDepartment, course]);

  // Function to update selected course and route to the course page
  const allocateCourse = (courseName) => {
    updateSelectedCourse(courseName);
    navigateTo(`/course/${courseName}`);
  };

  return (
    <div>
      <div className="text-left ml-10">
        <div className="mb-10 mt-4 text-left">
          <h1 className="text-[#3dafaa] text-3xl font-bold">
            {selectedDepartment} DEPARTMENT
          </h1>
          <div className="mt-2">
            <select
              className="px-4 py-2 border border-[#3dafaa] rounded"
              value={selectedDepartment}
              onChange={handleDepartmentChange}
            >
              <option value="CSE">CSE</option>
              <option value="MATHS">MATHS</option>
              <option value="HCD">HCD</option>
            </select>
          </div>
        </div>

        <div className="flex justify-between ml-5 mr-20">
          <div className="flex">
            <h2 className="text-[#3dafaa] font-bold mr-1">
              Total Number of Courses:
            </h2>
            <h2>{filteredCourses.length}</h2>
          </div>
          <div className="flex">
            <h2 className="text-[#3dafaa] font-bold ml-4 mr-1">
              Courses with incomplete allocation:
            </h2>
            <h2>
              {/* Add logic to count courses with incomplete allocation */}
            </h2>
          </div>
        </div>
        <div className="flex mb-3 ml-5">
          <h2 className="text-[#3dafaa] font-bold mr-1">
            Courses with complete Allocation:
          </h2>
          <h2>{/* Add logic to count courses with complete allocation */}</h2>
        </div>
        <div>
          <form className="w-[500px] relative ml-3">
            <div className="relative">
              <input
                type="search"
                placeholder="Search Course.."
                className="w-full p-4 rounded-full h-10 border border-[#3dafaa] outline-none focus:border-[#3dafaa]"
              />
              <button className="absolute right-0 top-1/2 -translate-y-1/2 p-3 bg-[#3dafaa] rounded-full search-button">
                <AiOutlineSearch />
              </button>
            </div>
          </form>
        </div>
      </div>

      <table className="w-full border-collapse border mt-4">
        <thead>
          <tr>
            <th
              colSpan={filteredCourses.length}
              className="bg-[#3dafaa] text-center font-bold p-2 text-white sticky -top-10"
            >
              Courses
            </th>
          </tr>
          {filteredCourses.length > 0 && (
            <tr className="bg-[#3dafaa] text-white">
              {Object.keys(filteredCourses[0]).map((col, index) => (
                <th className="border p-2 text-center" key={index}>
                  {col}
                </th>
              ))}
            </tr>
          )}
        </thead>
        <tbody>
          {filteredCourses.map((row, index) => (
            <tr className="text-center" key={index}>
              {Object.values(row).map((data, ind) => (
                <td className="border p-2" key={ind}>
                  {data}
                </td>
              ))}
              <td className="border p-2">
                <button
                  onClick={() => allocateCourse(row[5])} // Assuming course name is in the 6th column (index 5)
                  className="bg-[#3dafaa] text-white px-4 py-2 rounded cursor-pointer font-bold"
                >
                  Allocate
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Department;
