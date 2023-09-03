// DepartmentContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import DepartmentContext from './DepartmentContext'
// Create a new context for department-related data

const DepartmentState = (props) => {
  const initDepartment = []; // Initialize your department data as needed
  const [departments, setDepartments] = useState(initDepartment);
  const [selectedDepartment,setSelectedDepartment] = useState("CSE");


  const updateSelectedDepartment = (department) => {
    console.log(department)
    setSelectedDepartment(department);
  };
 
  return (
    <DepartmentContext.Provider value={{ departments,selectedDepartment,updateSelectedDepartment }}>
      {props.children}
    </DepartmentContext.Provider>
  );
};

export default DepartmentState;
