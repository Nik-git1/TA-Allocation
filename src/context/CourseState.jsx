import React, { createContext, useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import CourseContext from './CourseContext';
import axios from 'axios';

const CourseState = (props) => {
  const initCourses = [];
  const [courses, setCourses] = useState(initCourses);
  const [ selectedCourse , setSelectedCourse] = useState(); //might be redundant
 
  const API = import.meta.env.VITE_API_URL

  useEffect(() => {
    getCoursesFromBackend();
    
  }, []);

  const filterCoursesByDepartment = async (department) => {
    try {
      const response = await axios.get(`${API}/api/course?department=${department}`);
      if (response.status === 200) {
        const filteredCourses = response.data;
        // Update the local state with the filtered courses
        setDepartmentCourses(filteredCourses);
      } else {
        console.error('Failed to fetch filtered courses from the backend');
      }
    } catch (error) {
      console.error('Error fetching filtered courses:', error);
    }
  };
  

  const getCoursesFromBackend = () => {
    axios
      .get(`${API}/api/course`) // Replace with your actual API endpoint
      .then((response) => {
        let coursesFromBackend = response.data;
        setCourses(coursesFromBackend);
      })
      .catch((error) => {
        console.error('Error fetching courses from the backend:', error);
      });
  };

  const getCourseFromFile = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();

      reader.onload = (e) => {
        const data = e.target.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0]; // Assuming the data is in the first sheet.
        const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

        if (sheetData.length === 0) {
          console.error('No data found in the XLSX file.');
          return;
        }

        const headerRow = Object.keys(sheetData[0]);

        const courses = sheetData.map((rowData) => {
          const courses = {};
          headerRow.forEach((field) => {
            courses[field] = rowData[field];
          });
          return courses;
        });

        axios
          .post('http://localhost:5001/api/course', courses )
          .then((response) => {
            getCoursesFromBackend();
          })
          .catch((error) => {
            console.error('Error sending data to the backend:', error);
          });
      };
      reader.onerror = (error) => {
        console.error('Error reading XLSX:', error);
      };
      reader.readAsBinaryString(file);
    }
  };


  const deleteCourse = (CourseId) => {
    axios
      .delete(`http://localhost:5001/api/course/${CourseId}`)
      .then((response) => {
  
        getCoursesFromBackend(); // Fetch updated student data after deletion
        return { status: 'Success' };
      })
      .catch((error) => {
        console.error('Error deleting course:', error);
        return { status: 'Failed', message: 'Error deleting course data' };
      });
  };

  const updateCourse = async (courseId, updatedData) => {

    try {
      const response = await axios.put(`http://localhost:5001/api/course/${courseId}`, updatedData);
      if (response.status === 200) {
        // Student data updated successfully
        // You can choose to update the local state if needed
        getCoursesFromBackend(); // Fetch updated data from the backend
        return { status: 'Success' };
      } else {
        console.error("Failed to update course data on the backend");
        return { status: 'Failed', message: 'Failed to update course data on the backend' };
      }
    } catch (error) {
      console.error("Error updating course data:", error);
      return { status: 'Failed', message: 'Error updating course data' };
      
    }
  };

  useEffect(() => {
    getCoursesFromBackend();
  }, []);

  return (
    <CourseContext.Provider
      value={{
        courses,
        updateCourse,
        deleteCourse,
        getCourseFromFile,
        filterCoursesByDepartment,
        setSelectedCourse,
        selectedCourse
      }}
    >
      {props.children}
    </CourseContext.Provider>
  );
};

export default CourseState;
