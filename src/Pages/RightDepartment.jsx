import React, { useState } from 'react';
import Tablestudents from '../Components/Tablestudents';
import Papa from 'papaparse';

let cols = [
    "s.no", "name", "department", "CGPA", "email-id", "batch",
    "pref-1", "pref-2", "pref-3", "pref-4", "pref-5", "pref-6", "pref-7"];
let table_heading_two = "PG Students"
let table_heading_three = "UG Students"

let table_rows = [
    [1,'JohnJohnJohn Doe','Computer Science','5','hello@gmail.com','2023','Preference 1','Preference 1','Preference 1','Preference 1','Preference 1','Preference 1','Preference 1'],
    [1,'JohnJohnJohn Doe','Computer Science','5','hello@gmail.com','2023','Preference 1','Preference 1','Preference 1','Preference 1','Preference 1','Preference 1','Preference 1']
    ]

const RightDepartment = () => {
    const [isCsvRead, setIsCsvRead] = useState(false); 
    const [csvData, setCsvData] = useState([]); // State to hold parsed CSV data

    const handleFileChange = (event) => {
      const file = event.target.files[0];
      if (file) {
        Papa.parse(file, {
          complete: (result) => {
              // result.data contains the parsed CSV data as an array of arrays
              setCsvData(result.data);
              setIsCsvRead(true); // Set the flag to indicate successful CSV reading
              // console.log('CSV file successfully read:', result.data);
          },
          error: (error) => {
              console.error("Error reading CSV:", error);
              setIsCsvRead(false); // Set the flag to indicate unsuccessful CSV reading
          },
        });
      }
    };

  
  return (
    <div className='mt-2'>
      <h3 className='font-bold ml-2'>Eligble Students of Monsoon 2023</h3>
      <Tablestudents/>      
    </div>
  )
}

export default RightDepartment
