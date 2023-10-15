import React, { useContext, useState } from 'react';
import { AiOutlineSearch } from 'react-icons/ai';
import '../App.css';
import CourseContext from '../context/CourseContext';
import DepartmentContext from '../context/DepartmentContext';
import AllocateHeader from './AllocateHeader';
import { useNavigate } from "react-router-dom"; 

const Department = () => {

  const { departmentCourses } = useContext(DepartmentContext);
  const {setSelectedCourse,selectedCourse} = useContext(CourseContext)
  const navigate = useNavigate();

  const allocateCourse = (course) => {
    var courseName = course.name
    setSelectedCourse(course);
    navigate(`/admin/course/${courseName}`);
  };

  const renderHeaderRow = () => {
    if (departmentCourses.length === 0) {
      return (
        <tr>
          <th className="bg-[#3dafaa] text-center font-bold p-2 text-white">Course Data</th>
        </tr>
      );
    } else {
      return (
        <tr className="bg-[#3dafaa] text-white">
          {Object.keys(departmentCourses[0]).map((key) => (
            <th className="border p-2 text-center" key={key}>
              {key}
            </th>
          ))}
          <th className="border p-2 text-center">Actions</th>
        </tr>
      );
    }
  };

  return (
    <div>
      <AllocateHeader />
      <div className="max-w-[83vw] max-h-[1500px] overflow-auto mt-4">
        <table className="border-collapse border">
          <thead className="sticky top-0">{renderHeaderRow()}</thead>
          <tbody>
            {departmentCourses.map((row, index) => (
              <tr className="text-center" key={index}>
                {Object.values(row).map((data, ind) => (
                  <td className="border p-2" key={ind}>
                    {data}
                  </td>
                ))}
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
