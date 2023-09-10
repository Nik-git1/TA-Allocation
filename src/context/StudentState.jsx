import React, { useState, useEffect } from "react";
import * as XLSX from 'xlsx';
import StudentContext from "./StudentContext";

const StudentState = (props) => {
  const initStudents = []; 
  const [students, setStudents] = useState(initStudents);
  const [log, setLog] = useState([])

  const logAction = (action,id,studentName,courseName) => {
    const timestamp = new Date().toLocaleString(); // Format the timestamp

    const user = "Admin"; // Replace with actual student data or identifier
    // Create a new log entry
    const logEntry = {
      id,
      studentName,
      action,
      user,
      timestamp,
      courseName, 
    };
    // Update the log state with the new entry by appending it to the existing log array
    setLog((prevLog) => [...prevLog, logEntry]);

    console.log(log)
  };

  useEffect(() => {
    console.log(log)
  }, [log])
  

  

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

  const deallocateStudent = (studentId) => {
    const updatedStudents = students.map((student) => {
      if (student[0] === studentId) {
        student[3] = "No"; 
        student[4] = 'null'; 
      }
      return student;
    });
    setStudents(updatedStudents);
  };

  return (
    <StudentContext.Provider
      value={{ students,getStudentsFromFile,allocateStudent,setStudents,deallocateStudent,logAction,log }}
    >
      {props.children}
    </StudentContext.Provider>
  );
};

export default StudentState;
