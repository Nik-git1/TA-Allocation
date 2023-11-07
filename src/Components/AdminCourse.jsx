import React, { useContext, useEffect, useState } from 'react';
import CourseContext from '../context/CourseContext';


const CourseTable = () => {
  const { courses, updateCourse, deleteCourse } = useContext(CourseContext);
  const [editingRow, setEditingRow] = useState(-1); // -1 indicates no row is being edited
  const [editedCourseData, setEditedCourseData] = useState({});

  const handleEdit = (rowIndex) => {
    setEditingRow(rowIndex);
    setEditedCourseData({ ...courses[rowIndex] });
  };

  const handleSave = async (rowIndex) => {
    if (JSON.stringify(editedCourseData) === JSON.stringify(courses[rowIndex])) {
      handleCancel();
      return;
    }
    const originalCourseData = courses[rowIndex]; 
    const updatedData = {};
  
    for (const key in editedCourseData) {
      if (editedCourseData[key] !== originalCourseData[key]) {
        updatedData[key] = editedCourseData[key]; // Add changed field to updatedData
      }
    }
    await updateCourse(courses[rowIndex]._id, updatedData);
  
    handleCancel();
  };

  const handleCancel = () => {
    setEditingRow(-1);
    setEditedCourseData({});
  };


  const handleDelete = async (courseId) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      await deleteCourse(courseId);
    }
  };

  const handleInputChange = (e, key) => {
    const updatedData = { ...editedCourseData, [key]: e.target.value };
    setEditedCourseData(updatedData);
  };

  const renderRow = (course, index) => {
    const isEditing = index === editingRow;
    const editingRowClass = 'bg-gray-300';

    return (
      <tr className={`text-center ${isEditing ? editingRowClass : ''}`} key={index}>
        {Object.keys(course).map((key, ind) => (
          <td className='border p-2' key={ind}>
            {isEditing ? (
              <input
                type='text'
                value={editedCourseData[key] ?? course[key]}
                onChange={(e) => handleInputChange(e, key)}
              />
            ) : (
              course[key]
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
                onClick={() => handleDelete(course._id)}
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
    if (courses.length === 0) {
      return (
        <tr>
          <th className="bg-[#3dafaa] text-center font-bold p-2 text-white">
           No Courses 
          </th>
        </tr>
      );
    } else {
      return (
        <tr className="bg-[#3dafaa] text-white">
          {Object.keys(courses[0]).map((key, index) => (
            <th className='border p-2 text-center' key={index}>{key}</th>
          ))}
          <th className='border p-2 text-center'>Action</th>
        </tr>
      );
    }
  };

  return (
    <div className='overflow-auto max-w-[95%] max-h-[25%] mt-4'>
      <table className="w-full border-collapse border">
        <thead className='sticky top-0'>
          {renderHeaderRow()}
        </thead>
        <tbody>
          {courses.slice(0).map((course, index) => (
            renderRow(course, index)
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CourseTable;
