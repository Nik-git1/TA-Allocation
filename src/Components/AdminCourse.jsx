import React, { useContext, useEffect } from 'react';
import CourseContext from '../context/CourseContext'; // Import the StudentContext

const CourseTable = () => {
  // Access the student data from the context
  const { course } = useContext(CourseContext);

  useEffect(() => {
    
  }, [course]);

  const renderHeaderRow = () => {
    if (course.length === 0) {
      // Render the header row with "XLSX Data" when there are no course
      return (
        <tr>
          <th className="bg-[#3dafaa] text-center font-bold p-2 text-white">
            XLSX Data
          </th>
        </tr>
      );
    } else {
      // Render the header row using course[0] when course are available
      return (
        <tr className="bg-[#3dafaa] text-white">
          {Object.values(course[0]).map((data, index) => (
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
        <tbody>
          {course.slice(1).map((student, index) => (
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

export default CourseTable;
