import React, { createContext, useState, useEffect } from "react";
import DepartmentContext from "./DepartmentContext";
import axios from "axios";

const DepartmentState = (props) => {
  // Initialize your department data as needed
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState();
  const [departmentCourses, setDepartmentCourses] = useState([]); // New state for department-specific courses

  // Function to fetch department-specific courses
  const fetchDepartmentCourses = async (department) => {
    try {
      const response = await axios.get(
        `http://localhost:5001/api/course?department=${department}`
      );
      setDepartmentCourses(response.data);
    } catch (error) {
      console.error("Error fetching department courses:", error);
    }
  };

  const fetchDepartment = async () => {
    try {
      const response = await axios.get(`http://localhost:5001/api/department`);

      const departmentList = response.data.map((item) => item.department);
      console.log(departmentList)

      setDepartments(departmentList);
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  };

  useEffect(() => {
    fetchDepartment();
    fetchDepartmentCourses(selectedDepartment);
  }, [selectedDepartment]);

  return (
    <DepartmentContext.Provider
      value={{ departments, setSelectedDepartment, departmentCourses }}
    >
      {props.children}
    </DepartmentContext.Provider>
  );
};

export default DepartmentState;
