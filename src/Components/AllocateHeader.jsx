import React, { useContext, useState, useEffect } from "react";
import CourseContext from "../context/CourseContext";
import DepartmentContext from "../context/DepartmentContext";
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
    <div className="mb-2">
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

      
    </div>
  );
};

export default AllocateHeader;
