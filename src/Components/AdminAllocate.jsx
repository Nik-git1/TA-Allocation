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

  useEffect(() => {
    console.log(user.department);
  }, []);

  const allocateCourse = (course) => {
    var courseName = course.name;
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
          {Object.keys(departmentCourses[0]).map((key, index) =>
            // Use index to skip rendering the first column
            index !== 0 ? (
              <th className="border p-2 text-center" key={key}>
                {key}
              </th>
            ) : null
          )}
          <th className="border p-2 text-center">Actions</th>
        </tr>
      );
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredCourses = departmentCourses.filter(
    (course) =>
      (user.department === 'all' || course.department === user.department) &&
      course.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <AllocateHeader />
      <div className="flex items-center mb-4">
        <form className="w-[500px] relative mr-3">
          <div className="relative">
            <input
              type="search"
              placeholder="Search Course by name..."
              value={searchQuery}
              onChange={handleSearch}
              className="w-full p-4 rounded-full h-10 border border-[#3dafaa] outline-none focus.border-[#3dafaa]"
            />
            <button className="absolute right-0 top-1/2 -translate-y-1/2 p-3 bg-[#3dafaa] rounded-full search-button">
              <AiOutlineSearch />
            </button>
          </div>
        </form>
      </div>
      <div className="max-w-full max-h-[75vh] overflow-auto">
        <table className="border-collapse border w-full">
          <thead className="sticky top-0">{renderHeaderRow()}</thead>
          <tbody>
            {filteredCourses.map((row, index) => (
              <tr className="text-center" key={index}>
                {Object.values(row).map((data, ind) =>
                  ind !== 0 ? (
                    <td className="border p-2" key={ind}>
                      {data}
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
