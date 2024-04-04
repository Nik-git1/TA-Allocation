import React, { useContext, useState, useEffect } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import "../App.css";
import CourseContext from "../context/CourseContext";
import DepartmentContext from "../context/DepartmentContext";
import AllocateHeader from "./AllocateHeader";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";

const Department = () => {
  const { departmentCourses } = useContext(DepartmentContext);
  const { setSelectedCourse, selectedCourse } = useContext(CourseContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentRound, setCurrentRound] = useState(null);
  const [allocationStatus, setAllocationStatus] = useState('All');
  const header = ['Name','Code','Acronym','Department','Credits','Faculty','Total Students', 'TA Required','TA Allocated','Action'];

  const fetchCurrentRound = async () => {
    try {
      const response = await fetch(
        "http://localhost:5001/api/rd/currentround"
      );
      const data = await response.json();
      setCurrentRound(data.currentRound);
      console.log(currentRound)
    } catch (error) {
      console.error("Error fetching round status:", error);
    }
  };

  useEffect(() => {
    console.log(user.department);
    fetchCurrentRound();
  }, []);

  const allocateCourse = (course) => {
    let courseName = course.name;
    setSelectedCourse(course); //dont delete

    navigate(`${courseName}`);
  };

  const renderHeaderRow = () => {
    if (departmentCourses.length === 0) {
      return (
        <tr>
          <th className="bg-[#3dafaa] text-center font-bold p-2 text-white">
            Course Data
          </th>
        </tr>
      );
    } else {
      return (
        <tr className="bg-[#3dafaa] text-white">
          {header.map((key, index) =>
            // Use index to skip rendering the first column
              <th className="border p-2 text-center" key={key}>
                {key}
              </th>
            
          )}
        </tr>
      );
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredCourseByAllocationStatus = (departmentCourses) => {
    const courseList = [];
    if (allocationStatus === 'All'){
      return departmentCourses;
    }
    else if (allocationStatus === 'Over Allocation'){
      for (const course of departmentCourses){
        if(course.taAllocated.length > course.taRequired){
          courseList.push(course);
        }
      }
    }
    else if (allocationStatus === 'Under Allocation'){
      for (const course of departmentCourses){
        if(course.taAllocated.length < course.taRequired){
          courseList.push(course);
        }
      }
    }
    else if (allocationStatus === 'Complete Allocation'){
      for (const course of departmentCourses){
        if(course.taAllocated.length == course.taRequired){
          courseList.push(course);
        }
      }
    }
    return courseList;
  }

  const filteredCourses = filteredCourseByAllocationStatus(departmentCourses).filter(
    (course) =>
      (user.department === 'all' || course.department === user.department) &&
      (course.name.toLowerCase().includes(searchQuery.toLowerCase()) || course.acronym.toLowerCase().includes(searchQuery.toLowerCase()) || course.code.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleAllocationStatus = (event) => {
    setAllocationStatus(event.target.value);
  }

  return (
    <div>
      <AllocateHeader />
      <div className="flex items-center mb-4">
        <form className="w-[500px] relative mr-3">
          <div className="relative">
            <input
              type="search"
              placeholder="Search Course by Name/Code/Acronym..."
              value={searchQuery}
              onChange={handleSearch}
              className="w-full p-4 rounded-full h-10 border border-[#3dafaa] outline-none focus.border-[#3dafaa]"
            />
            <button className="absolute right-0 top-1/2 -translate-y-1/2 p-3 bg-[#3dafaa] rounded-full search-button">
              <AiOutlineSearch />
            </button>
          </div>
        </form>
        <div className="flex items-center">
          <p className="font-bold mr-1">Allocation Status:</p>
          <select name="" id=""
              className="px-2 py-2 border border-[#3dafaa] rounded inline-block"
              onChange={handleAllocationStatus}
          >
            <option value="All">All</option>
            <option value="Over Allocation" className="text-red-500">Over Allocation</option>
            <option value="Under Allocation" className="text-yellow-500">Under Allocation</option>
            <option value="Complete Allocation">Complete Allocation</option>
          </select>
        </div>
      </div>
      <div className="max-w-full max-h-[75vh] overflow-auto">
        <table className="border-collapse border w-full">
          <thead className="sticky top-0">{renderHeaderRow()}</thead>
          <tbody>
            {filteredCourses.map((row, index) => (
              <tr className="text-center" key={index}>
                {Object.values(row).map((data, ind) =>
                  ind !== 0 && ind !== 10 && ind !== 8 ? (
                    <td className={`border p-2 ${row.taAllocated.length > row.taRequired ? 'text-red-500' : (row.taAllocated.length < row.taRequired && currentRound >= 2 ? 'text-yellow-500' : 'text-black')}`} key={ind}>
                      {ind === 11 ? row.taAllocated.length : data}
                    </td>
                  ) : null
                )}
                <td className="border p-2">
                  <button
                    onClick={() => allocateCourse(row)}
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
    </div>
  );
};

export default Department;
