import React, { useContext, useEffect, useState } from 'react';
import CourseContext from '../context/CourseContext';
import { BiSolidEditAlt } from 'react-icons/bi';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { RxCross2 } from 'react-icons/rx';
import { PiCheckBold } from 'react-icons/pi';
import Swal from 'sweetalert2'

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

  const handleDelete = (rowIndex) => {
    // Implement your delete logic here
    // For demo purposes, we'll directly update the course data
    const updatedCourse = [...course];
    updatedCourse.splice(rowIndex, 1);
    setCourse(updatedCourse);
  };

  const deleteAlert = (rowIndex) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        handleDelete(rowIndex);
        Swal.fire(
          'Deleted!',
          'Your file has been deleted.',
          'success'
        )
      }
    })
  }

  const renderRow = (student, index) => {
    // Skip the first row in the table body
    if (index === 0) {
      return null;
    }
  
    const isEditing = index === editingRow;
    const editingRowClass = 'bg-gray-300'; // Define the CSS class for the editing row background color
  
    return (
      <tr className={`text-center ${isEditing ? editingRowClass : ''}`} key={index}>
        {Object.keys(student).map((key, ind) => (
          <td className='border p-2' key={ind}>
            {isEditing ? (
              <input
                type='text'
                value={course[index][key]}
                onChange={(e) => {
                  const updatedCourse = [...course];
                  updatedCourse[index][key] = e.target.value;
                  setCourse(updatedCourse);
                }}
              />
            ) : (
              course[index][key]
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
                onClick={() => deleteAlert(index)}
              >
                <RiDeleteBin6Line /> Delete
              </button>
            </div>
          )}
        </td>
      </tr>
    );
  };
  

  const renderHeaderRow = () => {
    if (course.length === 0) {
      return (
        <tr>
          <th className="bg-[#3dafaa] text-center font-bold p-2 text-white">
            Course Data
          </th>
        </tr>
      );
    } else {
      return (
        <tr className="bg-[#3dafaa] text-white">
          {Object.values(course[0]).map((data, index) => (
            <th className='border p-2 text-center' key={index}>{data}</th>
          ))}
          <th className='border p-2 text-center'>Actions</th>
        </tr>
      );
    }
  };

  return (
    <div className='overflow-auto max-w-[83vw] max-h-[1000px] mt-4'>
      <table className='w-full border-collapse border'>
        <thead className='sticky top-0'>{renderHeaderRow()}</thead>
        <tbody>{course.slice(1).map((student, index) => renderRow(student, index))}</tbody>
      </table>
    </div>
  );
};

export default CourseTable;
