import React, { useContext, useState } from 'react';
import StudentContext from '../context/StudentContext';

const Tablestudents = () => {
  const { students, updateStudent, deleteStudent } = useContext(StudentContext);
  const [editingRow, setEditingRow] = useState(-1);
  const [editedStudentData, setEditedStudentData] = useState({});

  const handleEdit = (rowIndex) => {
    setEditingRow(rowIndex);
    setEditedStudentData({ ...students[rowIndex] });
  };

  const handleSave = async (rowIndex) => {
    if (JSON.stringify(editedStudentData) === JSON.stringify(students[rowIndex])) {
      handleCancel();
      return;
    }

    await updateStudent(students[rowIndex]._id, editedStudentData);
    handleCancel();
  };

  const handleCancel = () => {
    setEditingRow(-1);
    setEditedStudentData({});
  };

  const handleDelete = async (studentId) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      await deleteStudent(studentId);
    }
  };

  const handleInputChange = (e, key) => {
    const updatedData = { ...editedStudentData, [key]: e.target.value };
    setEditedStudentData(updatedData);
  };

  const renderRow = (student, index) => {
    const isEditing = index === editingRow;
    const editingRowClass = 'bg-gray-300';

    return (
      <tr className={`text-center ${isEditing ? editingRowClass : ''}`} key={index}>
        {Object.keys(student).map((key, ind) => (
          <td className='border p-2' key={ind}>
            {isEditing ? (
              <input
                type='text'
                value={editedStudentData[key] || student[key]}
                onChange={(e) => handleInputChange(e, key)}
              />
            ) : (
              student[key]
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
                Save
              </button>
              <button
                className='bg-red-500 text-white px-2 py-1 rounded-md flex items-center'
                onClick={handleCancel}
              >
                Cancel
              </button>
            </div>
          ) : (
            <div className='flex'>
              <button
                className='bg-blue-500 text-white px-2 py-1 rounded-md flex items-center mr-1'
                onClick={() => handleEdit(index)}
              >
                Edit
              </button>
              <button
                className='bg-red-500 text-white px-2 py-1 rounded-md flex items-center'
                onClick={() => handleDelete(student._id)}
              >
                Delete
              </button>
            </div>
          )}
        </td>
      </tr>
    );
  };

  const renderHeaderRow = () => {
    if (students.length === 0) {
      return (
        <tr>
          <th className="bg-[#3dafaa] text-center font-bold p-2 text-white">
           No students 
          </th>
        </tr>
      );
    } else {
      return (
        <tr className="bg-[#3dafaa] text-white">
          {Object.keys(students[0]).map((key, index) => (
            <th className='border p-2 text-center' key={index}>{key}</th>
          ))}
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
          {students.slice(0).map((student, index) => (
            renderRow(student, index)
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Tablestudents;
