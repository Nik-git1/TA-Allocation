import React, { useContext, useEffect, useState } from 'react';
import CourseContext from '../context/CourseContext';
import { BiSolidEditAlt } from 'react-icons/bi';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { RxCross2 } from 'react-icons/rx';
import { PiCheckBold } from 'react-icons/pi';

const CourseTable = () => {
  const { course, setCourse } = useContext(CourseContext);
  const [editingRow, setEditingRow] = useState(-1); // -1 indicates no row is being edited

  const handleEdit = (rowIndex) => {
    setEditingRow(rowIndex);
  };

  const handleSave = (rowIndex) => {
    // Implement your save logic here
    // For demo purposes, we'll directly update the course data
    const updatedCourse = [...course];
    updatedCourse[rowIndex] = { ...course[rowIndex] }; // Clone the original data
    setCourse(updatedCourse);
    setEditingRow(-1); // Reset editing state
  };

  const handleCancel = () => {
    setEditingRow(-1);
  };

  const renderRow = (student, index) => {
    const isEditing = index === editingRow;

    return (
      <tr className='text-center' key={index}>
        {Object.keys(student).map((key, ind) => (
          <td className='border p-2' key={ind}>
            {isEditing ? (
              <input
                type='text'
                value={course[index][key]} // Use the course data for input value
                onChange={(e) => {
                  const updatedCourse = [...course];
                  updatedCourse[index][key] = e.target.value;
                  setCourse(updatedCourse);
                }}
              />
            ) : (
              course[index][key] // Use the course data for display
            )}
          </td>
        ))}
        <td className='border p-2'>
          {isEditing ? (
            <div className='flex'>
              <button
                className='bg-green-500 text-white px-2 py-1 rounded-md flex items-center mr-1'
                onClick={() => handleSave(index)}
              >
                <PiCheckBold /> Save
              </button>
              <button
                className='bg-red-500 text-white px-2 py-1 rounded-md flex items-center'
                onClick={handleCancel}
              >
                <RxCross2 /> Cancel
              </button>
            </div>
          ) : (
            <div className='flex'>
              <button
                className='bg-blue-500 text-white px-2 py-1 rounded-md flex items-center mr-1'
                onClick={() => handleEdit(index)}
              >
                <BiSolidEditAlt /> Edit
              </button>
              <button
                className='bg-red-500 text-white px-2 py-1 rounded-md flex items-center'
                onClick={() => handleDelete(index)}
              >
                <RiDeleteBin6Line /> Delete
              </button>
            </div>
          )}
        </td>
      </tr>
    );
  };

  const handleDelete = (rowIndex) => {
    // Implement your delete logic here
    // For demo purposes, we'll directly update the course data
    const updatedCourse = [...course];
    updatedCourse.splice(rowIndex, 1);
    setCourse(updatedCourse);
  };
  
  const renderHeaderRow = () => {
    if (course.length === 0) {
      return (
        <tr>
          <th className="bg-[#3dafaa] text-center font-bold p-2 text-white">
            XLSX Data
          </th>
        </tr>
      );
    } else {
      return (
        
        <tr className="bg-[#3dafaa] text-white">
          {Object.keys(course[0]).map((key, index) => (
            <th className='border p-2 text-center' key={index}>{key}</th>
          ))}
          <th className='border p-2 text-center'>Actions</th>
        </tr>
      );
    }
  };

  return (
    <div className='overflow-auto max-w-[1230px] max-h-[1000px] mt-4'>
      <table className='w-full border-collapse border'>
        <thead className='sticky top-0'>{renderHeaderRow()}</thead>
        <tbody>{course.map((student, index) => renderRow(student, index))}</tbody>
      </table>
    </div>
  );
};

export default CourseTable;