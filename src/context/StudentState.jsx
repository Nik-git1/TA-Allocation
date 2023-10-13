import React, { useState, useEffect } from "react";
import * as XLSX from 'xlsx';
import StudentContext from "./StudentContext";
import axios from 'axios';
const StudentState = (props) => {
  const initStudents = []; 
  const [students, setStudents] = useState(initStudents);
  const [log, setLog] = useState([])

  const logAction = (action,id,studentName,courseName) => {
    const timestamp = new Date().toLocaleString(); 
    const user = "Admin"; 
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
    getStudentsFromBackend();
  }, [])
  

  const getStudentsFromBackend = () => {
    axios
      .get('http://localhost:5001/api/student') // Replace with your actual API endpoint
      .then((response) => {
        let studentsFromBackend = response.data;
        console.log(studentsFromBackend)
        
        setStudents(studentsFromBackend);
      })
      .catch((error) => {
        console.error('Error fetching data from the backend:', error);
      });
  };

  const getStudentsFromFile = (event) => {
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
  
        // Extract the header row to dynamically map the fields.
        const headerRow = Object.keys(sheetData[0]);
  
        // Create an array of students based on the dynamically mapped fields.
        const students = sheetData.map((rowData) => {
          // Map the fields dynamically based on the header row.
          const student = {};
  
          headerRow.forEach((field) => {
            student[field] = rowData[field];
          });
  
          return student;
        });

        console.log(students)

        axios
          .post('http://localhost:5001/api/student', { students })
          .then((response) => {
            console.log('Data sent to the backend:', response.data);
            getStudentsFromBackend();
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
