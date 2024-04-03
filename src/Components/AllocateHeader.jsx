import React, { useContext, useState, useEffect } from "react";
import CourseContext from "../context/CourseContext";
import DepartmentContext from "../context/DepartmentContext";
import "../App.css";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import { GoDotFill } from "react-icons/go";

const AllocateHeader = () => {
  const [filteredCourses, setfilteredCourses] = useState([]);
  const { course, updateSelectedCourse } = useContext(CourseContext);
  const { user } = useContext(AuthContext);
  const { departments, selectedDepartment, setSelectedDepartment } = useContext(DepartmentContext);
  const [currentRound, setCurrentRound] = useState(null);

  const handleDepartmentChange = (event) => {
    setSelectedDepartment(event.target.value);
  };

  useEffect(() => {
    const fetchCurrentRound = async () => {
      try {
        const response = await fetch(
          "http://localhost:5001/api/rd/currentround"
        );
        const data = await response.json();
        setCurrentRound(data.currentRound);
      } catch (error) {
        console.error("Error fetching round status:", error);
      }
    };
    fetchCurrentRound();
  });

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.replace("http://localhost:5173");
  };

  return (
    <div className="mb-2 flex justify-between">
      <div className="flex">
        <div>
          <div className="flex items-center mb-2 mr-4">
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

        <div className="flex items-center">
          <p className="text-[#3dafaa] text-2xl font-bold mr-2">
            Ongoing Round:
          </p>
          <p className=" text-2xl flex mr-1">
            Round
          </p>
          <p className=" text-2xl flex">
            {currentRound}
          </p>
        </div>
        <p className="flex items-center ml-2 mb-2 text-3xl">|</p>
        <div className="flex ml-2 items-center">
          <p className="text-red-500"><GoDotFill/></p>
          <p className="mr-2">Red courses are overallocated</p>
          {currentRound >= 2 ? (
            <>
            <p className="text-yellow-500"><GoDotFill/></p>
            <p className="">Yellow courses are underallocated</p>
            </>
          ) : null}
          
        </div>
      </div>
      {user.role !== 'admin' ?
        <div className="flex items-center">
          <button className='rounded-full bg-[#3dafaa] text-white py-2 px-6 hover:bg-red-500 font-bold mr-2'
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
        : null
      }
    </div>
  );
};

export default AllocateHeader;
