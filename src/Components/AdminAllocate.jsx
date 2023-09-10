import React, { useContext, useState, useEffect } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import "../App.css";
import { Link, useNavigate } from "react-router-dom"; // Import Link and useHistory
import CourseContext from "../context/CourseContext";
import DepartmentContext from "../context/DepartmentContext"; 
import AllocateHeader from "./AllocateHeader";

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

  const renderHeaderRow = () => {
    if (course.length === 0) {
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
          {Object.values(course[0]).map((data, index) => (
            <th className='border p-2 text-center' key={index}>{data}</th>
          ))}
          <th className='border p-2 text-center'>Actions</th>
        </tr>
      );
    }
  };

  return (
    <div>
      <AllocateHeader/>
      <div className="max-w-[83vw] max-h-[1500px] overflow-auto mt-4 ">
        <table className="border-collapse border">
        <thead className='sticky top-0'>{renderHeaderRow()}</thead>
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
    </div>
  );
};

export default Department;
