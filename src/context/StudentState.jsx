import axios from "axios";
import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import * as XLSX from "xlsx";
import StudentContext from "./StudentContext";

const API = import.meta.env.VITE_API_URL;

const socket = io(`${API}`);

const StudentState = (props) => {
  const [students, setStudents] = useState([]);
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    getStudentsFromBackend();
    getLogsFromBackend();

    socket.on("studentUpdated", (updatedStudent) => {
      setStudents((prevStudents) =>
        prevStudents.map((student) =>
          student._id === updatedStudent._id ? updatedStudent : student
        )
      );
    });

    socket.on("studentsAdded", (newStudents) => {
      setStudents((prevStudents) => [...prevStudents, ...newStudents]);
    });

    socket.on("studentDeleted", (deletedStudentId) => {
      setStudents((prevStudents) =>
        prevStudents.filter((student) => student._id !== deletedStudentId)
      );
    });

    socket.on("liveLogs", (newLog) => {
      setLogs((prevLogs) => [...prevLogs, newLog]);
    });

    return () => {
      socket.off("studentUpdated");
      socket.off("studentAdded");
      socket.off("studentDeleted");
    };
  }, []);

  const updateStudent = async (studentId, updatedData) => {
    try {
      const response = await axios.put(
        `${API}/api/student/${studentId}`,
        updatedData
      );
      if (response.status != 200) {
        console.error("Failed to update student data on the backend");
        return {
          status: "Failed",
          message: "Failed to update student data on the backend",
        };
      } else {
        return { status: "Success" };
      }
    } catch (error) {
      console.error("Error updating student data:", error);
      return { status: "Failed", message: "Error updating student data" };
    }
  };

  const deleteStudent = async (studentId) => {
    try {
      await axios.delete(`${API}/api/student/${studentId}`);
      return { status: "Success" };
    } catch (error) {
      console.error("Error deleting student:", error);
      return { status: "Failed", message: "Error deleting student" };
    }
  };

  const getStudentsFromBackend = () => {
    axios
      .get(`${API}/api/student`)
      .then((response) => {
        let studentsFromBackend = response.data;
        setStudents(studentsFromBackend);
      })
      .catch((error) => {
        console.error("Error fetching data from the backend:", error);
      });
  };

  const getStudentsFromFile = (event, setLoading) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();

      reader.onload = (e) => {
        const data = e.target.result;
        const workbook = XLSX.read(data, { type: "binary" });
        const sheetName = workbook.SheetNames[0]; // Assuming the data is in the first sheet.
        const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

        if (sheetData.length === 0) {
          console.error("No data found in the XLSX file.");
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
          .post(`${API}/api/student`, students)
          .then(() => {
            setLoading(false);
            window.location.reload();
          })
          .catch((error) => {
            console.error("Error sending data to the backend:", error);
            setLoading(false);
            window.location.reload();
          });
      };
      reader.onerror = (error) => {
        console.error("Error reading XLSX:", error);
      };
      reader.readAsBinaryString(file);
    }
  };

  const getLogsFromBackend = () => {
    axios
      .get(`${API}/api/al/logs`) // Replace with your actual API endpoint for logs
      .then((response) => {
        const logsFromBackend = response.data;
        setLogs(logsFromBackend);
      })
      .catch((error) => {
        console.error("Error fetching logs from the backend:", error);
      });
  };

  return (
    <StudentContext.Provider
      value={{
        students,
        logs,
        getStudentsFromFile,
        updateStudent,
        deleteStudent,
        getStudentsFromBackend,
      }}
    >
      {props.children}
    </StudentContext.Provider>
  );
};

export default StudentState;
