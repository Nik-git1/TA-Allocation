import React, { useContext, useState, useEffect } from "react";
import CourseContext from "../context/CourseContext";
import DepartmentContext from "../context/DepartmentContext";
import { AiOutlineSearch } from "react-icons/ai";
import "../App.css";
import { Link, useNavigate } from "react-router-dom";

const AllocateHeader = () => {
  const [filteredCourses, setfilteredCourses] = useState([]);
  const { course, updateSelectedCourse } = useContext(CourseContext);
  const { selectedDepartment, updateSelectedDepartment } = useContext(
    DepartmentContext
  );

  const handleDepartmentChange = (event) => {
    updateSelectedDepartment(event.target.value);
  };

  return (
    <div>
      <div className="flex items-center mb-2">
        <h1 className="text-[#3dafaa] text-3xl font-bold mr-4">
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

      <div className="flex items-center mb-4">
        <form className="w-[500px] relative mr-3">
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
        <div className="flex ml-4">
          <h2 className="text-[#3dafaa] font-bold mr-1">
            Total Courses:
          </h2>
          <h2>{filteredCourses.length}</h2>
        </div>
        <div className="flex ml-4">
          <h2 className="text-[#3dafaa] font-bold mr-1">
            Non-allocated Courses:
          </h2>
          <h2>
            {/* Add logic to count courses with incomplete allocation */}
          </h2>
        </div>
        <div className="flex ml-4">
          <h2 className="text-[#3dafaa] font-bold mr-1">
            Allocated Courses:
          </h2>
          <h2>
            {/* Add logic to count courses with complete allocation */}
          </h2>
        </div>
      </div>
    </div>
  );
};

export default AllocateHeader;
