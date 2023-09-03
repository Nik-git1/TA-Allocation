import React, { useState, useEffect } from "react";
import * as XLSX from 'xlsx';
import StudentContext from "./StudentContext";

const StudentState = (props) => {
  const initStudents = []; 
  const [students, setStudents] = useState(initStudents);

  const getStudentsFromFile = (event) => {
    const file = event.target.files[0]; // Use event.target.files[0] to get the first selected file
    if (file) {
      const reader = new FileReader();

      reader.onload = (e) => {
        const data = e.target.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const firstSheet = workbook.Sheets[workbook.SheetNames[1]];
        const sheetData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });

        setStudents(sheetData);
      };
      reader.onerror = (error) => {
        console.error("Error reading XLSX:", error);
      };
      reader.readAsBinaryString(file);
    }
  };

  const allocateStudent = (studentId, courseName) => {
    const updatedStudents = students.map((student) => {
      if (student[0] === studentId) {
        student[3] = "Yes"; 
        student[4] = courseName; 
      }
      return student;
    });
    setStudents(updatedStudents);
  };

  useEffect(() => {
    console.log(students);
  }, [students]);

  return (
    <StudentContext.Provider
      value={{ students, getStudentsFromFile,allocateStudent }}
    >
      {props.children}
    </StudentContext.Provider>
  );
};

export default StudentState;
