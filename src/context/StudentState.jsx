import React, { useState, useEffect } from "react";
import * as XLSX from 'xlsx';
import StudentContext from "./StudentContext";
import axios from 'axios';

const StudentState = (props) => {
  const initStudents = [];
  const [students, setStudents] = useState(initStudents);

  const updateStudent = async (studentId, updatedData) => {
    try {
      const response = await axios.put(`http://localhost:5001/api/student/${studentId}`, updatedData);
      if (response.status === 200) {
        // Student data updated successfully
        // You can choose to update the local state if needed
        getStudentsFromBackend(); // Fetch updated data from the backend
      } else {
        console.error("Failed to update student data on the backend");
      }
    } catch (error) {
      console.error("Error updating student data:", error);
    }
  };

  const deleteStudent = (studentId) => {
    axios
      .delete(`http://localhost:5001/api/student/${studentId}`)
      .then((response) => {
        console.log('Student deleted:', response.data);
        getStudentsFromBackend(); // Fetch updated student data after deletion
      })
      .catch((error) => {
        console.error('Error deleting student:', error);
      });
  };

  const getStudentsFromBackend = () => {
    axios
      .get('http://localhost:5001/api/student') // Replace with your actual API endpoint
      .then((response) => {
        let studentsFromBackend = response.data;
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

        const headerRow = Object.keys(sheetData[0]);

        const students = sheetData.map((rowData) => {
          const student = {};
          headerRow.forEach((field) => {
            student[field] = rowData[field];
          });
          return student;
        });

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

  useEffect(() => {
    getStudentsFromBackend();
  }, []);

  return (
    <StudentContext.Provider
      value={{ students, getStudentsFromFile, updateStudent,deleteStudent  }}
    >
      {props.children}
    </StudentContext.Provider>
  );
};

export default StudentState;
