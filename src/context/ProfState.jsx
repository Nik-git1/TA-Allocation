import React, { createContext, useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import ProfContext from './ProfContext';
import axios from 'axios';

const ProfState = (props) => {
  const initProfessors = [];
  const [professors, setProfessors] = useState(initProfessors);
//   const [selectedProfessor, setSelectedProfessor] = useState(null); //might be redundant

  useEffect(() => {
    getProfessorsFromBackend();
  }, []);

  const getProfessorsFromBackend = () => {
    axios
      .get('http://localhost:5001/api/professor') // Replace with your actual API endpoint
      .then((response) => {
        let professorsFromBackend = response.data;
        setProfessors(professorsFromBackend);
      })
      .catch((error) => {
        console.error('Error fetching professors from the backend:', error);
      });
  };

  const filterProfessorsByDepartment = async (department) => {
    try {
      const response = await axios.get(`http://localhost:5001/api/professor?department=${department}`);
      if (response.status === 200) {
        const filteredProfessors = response.data;
        // Update the local state with the filtered professors
        setProfessors(filteredProfessors);
      } else {
        console.error('Failed to fetch filtered professors from the backend');
      }
    } catch (error) {
      console.error('Error fetching filtered professors:', error);
    }
  };

  const getProfessorFromFile = (event) => {
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
  
        const professors = sheetData.map((rowData) => {
          const professor = {};
          headerRow.forEach((field) => {
            professor[field] = rowData[field];
          });
          return professor;
        });
  
        axios
          .post('http://localhost:5001/api/professor', professors)
          .then((response) => {
            getProfessorsFromBackend();
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
  

  const deleteProfessor = (professorId) => {
    axios
      .delete(`http://localhost:5001/api/professor/${professorId}`)
      .then((response) => {
        getProfessorsFromBackend(); // Fetch updated professor data after deletion
      })
      .catch((error) => {
        console.error('Error deleting professor:', error);
      });
  };

  const updateProfessor = async (professorId, updatedData) => {
    try {
      const response = await axios.put(`http://localhost:5001/api/professor/${professorId}`, updatedData);
      if (response.status === 200) {
        // Professor data updated successfully
        // You can choose to update the local state if needed
        getProfessorsFromBackend(); // Fetch updated data from the backend
      } else {
        console.error("Failed to update professor data on the backend");
      }
    } catch (error) {
      console.error("Error updating professor data:", error);
    }
  };

  return (
    <ProfContext.Provider
      value={{
        professors,
        updateProfessor,
        deleteProfessor,
        getProfessorFromFile,
        filterProfessorsByDepartment,
      }}
    >
      {props.children}
    </ProfContext.Provider>
  );
};

export default ProfState;