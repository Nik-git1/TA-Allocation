import React, { createContext, useState, useEffect } from 'react';
import DepartmentContext from './DepartmentContext';
import axios from 'axios';

const DepartmentState = (props) => {
  const initDepartments = ["CSE", "CSD", "CSB"]; // Initialize your department data as needed
  const [departments, setDepartments] = useState(initDepartments);
  const [selectedDepartment, setSelectedDepartment] = useState("CSE");
  const [departmentCourses, setDepartmentCourses] = useState([]); // New state for department-specific courses


  // Function to fetch department-specific courses
  const fetchDepartmentCourses = async (department) => {
    try {
      const response = await axios.get(`http://localhost:5001/api/course?department=${department}`);
      setDepartmentCourses(response.data);
      console.log(departmentCourses)
    } catch (error) {
      console.error('Error fetching department courses:', error);
    }
  };

  useEffect(() => {
    console.log(selectedDepartment)
    fetchDepartmentCourses(selectedDepartment);
  }, [selectedDepartment]);

  return (
    <DepartmentContext.Provider value={{ departments , setSelectedDepartment, departmentCourses }}>
      {props.children}
    </DepartmentContext.Provider>
  );
};

export default DepartmentState;
