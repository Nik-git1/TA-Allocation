import React, { useState,useEffect } from 'react';
import { AiOutlineSearch } from 'react-icons/ai';
import "../App.css";
import * as XLSX from 'xlsx';

const Tablestudents = () => {
  const [isXlsxRead, setIsXlsxRead] = useState(false);
  const [xlsxData, setXlsxData] = useState([]); 
  const handleFileChange = (event) => {
    const file = event.target.files[0]; // Use event.target.files[0] to get the first selected file
    if (file) {
      const reader = new FileReader();

      reader.onload = (e) => {
        const data = e.target.result;
        const workbook = XLSX.read(data, { type: 'binary' });

        // Assuming the first sheet is the one you want
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];

        // Parse the sheet data as an array of objects (each row is an object)
        const sheetData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });

        // Set the parsed data in the component's state
        setXlsxData(sheetData);
        setIsXlsxRead(true); // Set the flag to indicate successful XLSX reading
      };

      reader.onerror = (error) => {
        console.error("Error reading XLSX:", error);
        setIsXlsxRead(false); // Set the flag to indicate unsuccessful XLSX reading
      };

      // Read the file as binary data
      reader.readAsBinaryString(file);
    }
  };

  const sendDataToBackend = (data) => {
    fetch('http://localhost:5000/api/auth/student', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data), // Send xlsxData directly
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        // Handle success
        console.log('Data sent successfully:', data);
      })
      .catch((error) => {
        // Handle error
        console.error('Error sending data:', error);
      });
  };
  // Assuming xlsxData is an array of arrays where the first row contains headers


  
  
  useEffect(() => {
    // Assuming xlsxData is an array of arrays where the first row contains headers
const transformedData = xlsxData.slice(1,4).map((row) => {
  const rowData = {};
  xlsxData[0].forEach((header, index) => {
    rowData[`"${header}"`] = row[index]; // Enclose field names in double quotes
  });
  return rowData;
});

    console.log(transformedData)
    
    // sendDataToBackend with the transformed data
    sendDataToBackend(transformedData);
  }, [xlsxData]);
  

  return (
    <div>
      <div className='flex justify-between items-center mt-8'>
        <form className='w-[500px] relative ml-3'>
          <div className='relative'>
            <input
              type="search"
              placeholder='Search Student..'
              className='w-full p-4 rounded-full h-10 border border-[#3dafaa] outline-none focus:border-[#3dafaa]'
            />
            <button className='absolute right-0 top-1/2 -translate-y-1/2 p-3 bg-[#3dafaa] rounded-full search-button'>
              <AiOutlineSearch />
            </button>
          </div>
        </form>
        <label className='bg-[#3dafaa] text-white px-4 py-2 rounded cursor-pointer font-bold'>
          Upload XLSX
          <input
            type="file"
            accept=".xlsx"
            className="hidden"
            onChange={handleFileChange}
          />
        </label>
      </div>
      <table className="w-full border-collapse border mt-4">
        <thead>
          <tr>
            <th colSpan={xlsxData[0]?.length} className="bg-[#3dafaa] text-center font-bold p-2 text-white">
              XLSX Data
            </th>
          </tr>
          {xlsxData.length > 0 && (
            <tr className="bg-[#3dafaa] text-white">
              {xlsxData[0].map((col, index) => (
                <th className='border p-2 text-center' key={index}>{col}</th>
              ))}
            </tr>
          )}
        </thead>
        <tbody>
          {xlsxData.slice(1).map((row, index) => (
            <tr className='text-center' key={index}>
              {row.map((data, ind) => (
                <td className='border p-2' key={ind}>{data}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Tablestudents;
