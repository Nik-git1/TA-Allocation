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
  const [selectedFile, setSelectedFile] = useState(null);

  
  return (
    <div className='right-dpt'>
        <div className='flex justify-between items-center'>
          <h3 className='font-bold'>Eligble Students of Monsoon 2023</h3>
          <label className='bg-[#3dafaa] text-white px-4 py-2 rounded cursor-pointer font-bold'>
            Upload
            <input type="file" accept=".csv" className="hidden"  /> 
            {/* onchange handle file upload */}
          </label>
        </div>
        <Tablestudents table_cols = {cols} table_heading = {table_heading_two} table_rows = {table_rows}/>
        <Tablestudents table_cols = {cols} table_heading = {table_heading_three} table_rows = {table_rows}/>        
    </div>
  )
}

export default RightDepartment
