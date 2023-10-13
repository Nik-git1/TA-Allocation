import React, { useContext, useEffect, useState } from 'react';
import StudentContext from '../context/StudentContext'; // Import the StudentContext
import { BiSolidEditAlt } from 'react-icons/bi';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { RxCross2 } from 'react-icons/rx';
import { PiCheckBold } from 'react-icons/pi';
import Swal from 'sweetalert2'

const Tablestudents = () => {
  // Access the student data from the context
  const { students,setStudents } = useContext(StudentContext);
  const [editingRow, setEditingRow] = useState(-1);

  const handleEdit = (rowIndex) => {
    setEditingRow(rowIndex);
  };

  const handleSave = (rowIndex) => {
  
    const updatedStudent = [...students];
    updatedStudent[rowIndex] = { ...students[rowIndex] }; // Clone the original data
    setStudents(updatedStudent);
    setEditingRow(-1); // Reset editing state
  };

  const handleCancel = () => {
    setEditingRow(-1);
  };

  const handleDelete = (rowIndex) => {
    const updatedStudent = [...students];
    updatedStudent.splice(rowIndex, 1);
    setStudents(updatedStudent);
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
                value={students[index][key]}
                onChange={(e) => {
                  const updatedStudent = [...students];
                  updatedStudent[index][key] = e.target.value;
                  setStudents(updatedStudent);
                }}
              />
            ) : (
              students[index][key]
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
          <th className='border p-2 text-center'>Action</th>
        </tr>
      );
    }
  };

  return (
    
    <div className='overflow-auto max-w-[83vw] max-h-[1000px] mt-4'>
      
      <table className="w-full border-collapse border">
        <thead className='sticky top-0'>
          {renderHeaderRow()}
        </thead>
        <tbody>
          {students.slice(1).map((student, index) => (
            renderRow(student, index)
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Tablestudents;