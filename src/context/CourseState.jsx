// CourseContext.js
import React, { createContext, useContext, useState,useEffect } from 'react';
import CourseContext from "./CourseContext";
import * as XLSX from 'xlsx';
const CourseState = (props)=> {
  const initCourse =[];
  const [course, setCourse] = useState(initCourse);

  const [selectedCourse,setSelectedCourse] = useState("CSE");

  const getCourse = (event) => {
    const file = event.target.files[0]; // Use event.target.files[0] to get the first selected file
    if (file) {
      const reader = new FileReader();

      reader.onload = (e) => {
        const data = e.target.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const sheetData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });

        setCourse(sheetData);
      };
      reader.onerror = (error) => {
        console.error("Error reading XLSX:", error);
      };
      reader.readAsBinaryString(file);
    }
  };

  const updateSelectedCourse = (courseName) => {
    console.log(courseName)
    setSelectedCourse(courseName);
  };


  useEffect(() => {
    console.log(selectedCourse);
  }, [selectedCourse]);


  return (
    <CourseContext.Provider value={{ course, getCourse,selectedCourse,updateSelectedCourse }}>
      {props.children}
    </CourseContext.Provider>
  );
}

export default CourseState
