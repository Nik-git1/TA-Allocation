import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

import CourseContext from '../context/CourseContext';
const ProfessorCourses = () => {
  const [departmentCourses, setDepartmentCourses] = useState([]);
  const navigate = useNavigate();
  
  const {setSelectedCourse,selectedCourse} = useContext(CourseContext)
  const { user } = useContext(AuthContext);

  // Fetch courses from the backend
  useEffect(() => {
    console.log(user);
  
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
        console.log(data.courses);
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
    console.log('Allocate course:', courseName);
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

      <div className="max-w-[80vw] max-h-[78vh] overflow-auto mt-4">
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

export default ProfessorCourses;
