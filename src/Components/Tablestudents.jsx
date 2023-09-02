import React, { useState } from 'react';
import { AiOutlineSearch } from 'react-icons/ai';
import "../App.css";
import Papa from 'papaparse';

const Tablestudents = () => {
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
        },
        error: (error) => {
          console.error("Error reading CSV:", error);
          setIsCsvRead(false); // Set the flag to indicate unsuccessful CSV reading
        },
      });
    }
  };

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
          Upload
          <input
            type="file"
            accept=".csv"
            className="hidden"
            onChange={handleFileChange}
          />
        </label>
      </div>
      <table className="w-full border-collapse border mt-4">
        <thead>
          <tr>
            <th colSpan={csvData[0]?.length} className="bg-[#3dafaa] text-center font-bold p-2 text-white">
              CSV Data
            </th>
          </tr>
          {csvData.length > 0 && (
            <tr className="bg-[#3dafaa] text-white">
              {csvData[0].map((col, index) => (
                <th className='border p-2 text-center' key={index}>{col}</th>
              ))}
            </tr>
          )}
        </thead>
        <tbody>
          {csvData.slice(1).map((row, index) => (
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
