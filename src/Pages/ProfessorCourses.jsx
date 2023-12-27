import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

import CourseContext from '../context/CourseContext';
const ProfessorCourses = ( ) => {
  const location = useLocation();
  const profName = location.state?.name || "Professor";
  const [departmentCourses, setDepartmentCourses] = useState([]);
  const navigate = useNavigate();
  const {setSelectedCourse} = useContext(CourseContext)
  
  const { user } = useContext(AuthContext);

  // Fetch courses from the backend
  useEffect(() => {  
    // Fetch courses from the backend
    const fetchCourses = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/course/professor', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ professor: user.id }),
        });
  
        const data = await response.json();
        setDepartmentCourses(data.courses); // Assuming data is an array of courses
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };
  
    fetchCourses();
  }, [user]); // Include user in the dependency array to avoid missing dependency warning
  
      
  const allocateCourse = (course) => {
    var courseName = course.name;
    setSelectedCourse(course)
    navigate(`${courseName}`);
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
          <th className="border p-2 text-center">Name</th>
          <th className="border p-2 text-center">Code</th>
          <th className="border p-2 text-center">Acronym</th>
          <th className="border p-2 text-center">Credits</th>
          <th className="border p-2 text-center">Total Students</th>
          <th className="border p-2 text-center">TA Student Ratio</th>
          <th className="border p-2 text-center">TA Required</th>
          <th className="border p-2 text-center">Actions</th>
        </tr>
      );
    }
  };

  return (
  <div>
 <div className='m-4' style={{ fontSize: '48px' }}>Welcome {profName}</div>

    <div className="max-w-[100vw] max-h-[78vh] overflow-auto mt-4">
      <table className="border-collapse border w-full" style={{ width: '100%' }}>
        <thead className="sticky top-0">{renderHeaderRow()}</thead>
        <tbody>
          {departmentCourses.map((row, index) => (
            <tr className="text-center" key={index}>
              <td className="border p-2">{row.name}</td>
              <td className="border p-2">{row.code}</td>
              <td className="border p-2">{row.acronym}</td>
              <td className="border p-2">{row.credits}</td>
              <td className="border p-2">{row.totalStudents}</td>
              <td className="border p-2">{row.taStudentRatio}</td>
              <td className="border p-2">{row.taRequired}</td>
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
export default ProfessorCourses;
