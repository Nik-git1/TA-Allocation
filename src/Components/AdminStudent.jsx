import React, { useContext, useEffect } from 'react';
import StudentContext from '../context/StudentContext'; // Import the StudentContext

const Tablestudents = () => {
  // Access the student data from the context
  const { students } = useContext(StudentContext);

  useEffect(() => {
    console.log(students[0]);
  }, [students]);

  const renderHeaderRow = () => {
    if (students.length === 0) {
      // Render the header row with "XLSX Data" when there are no students
      return (
        <tr>
          <th className="bg-[#3dafaa] text-center font-bold p-2 text-white">
            XLSX Data
          </th>
        </tr>
      );
    } else {
      // Render the header row using students[0] when students are available
      return (
        <tr className="bg-[#3dafaa] text-white">
          {Object.values(students[0]).map((data, index) => (
            <th className='border p-2 text-center' key={index}>{data}</th>
          ))}
        </tr>
      );
    }
  };

  return (
    
    <div className='overflow-auto max-w-[1230px] max-h-[1000px] mt-4'>
      
      <table className="w-full border-collapse border">
        <thead className='sticky top-0'>
          {renderHeaderRow()}
        </thead>
        <tbody className='overflow-auto'>
          {students.slice(1).map((student, index) => (
            <tr className='text-center' key={index}>
              {Object.values(student).map((data, ind) => (
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