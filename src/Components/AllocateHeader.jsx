import React, { useContext, useState, useEffect } from "react";
import CourseContext from "../context/CourseContext";
import DepartmentContext from "../context/DepartmentContext";
import { AiOutlineSearch } from "react-icons/ai";
import "../App.css";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";

const AllocateHeader = () => {
  const [filteredCourses, setfilteredCourses] = useState([]);
  const { course, updateSelectedCourse } = useContext(CourseContext);
  const { user } = useContext(AuthContext);
  const { departments, selectedDepartment, setSelectedDepartment } =
    useContext(DepartmentContext);

  const handleDepartmentChange = (event) => {
    setSelectedDepartment(event.target.value);
  };

  return (
    <div className="m-10">
      <div className="flex items-center mb-2">
        <h1 className="text-[#3dafaa] text-3xl font-bold mr-4">
          {selectedDepartment} DEPARTMENT
        </h1>
        <div className="mt-2">
          <select
            className="px-4 py-2 border border-[#3dafaa] rounded"
            value={user.role === "admin" ? selectedDepartment : user.department}
            onChange={handleDepartmentChange}
            disabled={user.role !== "admin"}
          >
            <option value="All">All</option>
            {departments.map((department) => (
              <option key={department} value={department}>
                {department}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex items-center mb-4">
        <form className="w-[500px] relative mr-3">
          <div className="relative">
            <input
              type="search"
              placeholder="Search Course.."
              className="w-full p-4 rounded-full h-10 border border-[#3dafaa] outline-none focus.border-[#3dafaa]"
            />
            <button className="absolute right-0 top-1/2 -translate-y-1/2 p-3 bg-[#3dafaa] rounded-full search-button">
              <AiOutlineSearch />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AllocateHeader;
