import React, { useContext, useEffect, useState } from 'react';
import CourseContext from '../context/CourseContext';
import Swal from 'sweetalert2';
import { AiOutlineSearch } from 'react-icons/ai';
import * as XLSX from 'xlsx';

const CourseTable = () => {
  const { courses, updateCourse, deleteCourse } = useContext(CourseContext);
  const [editingRow, setEditingRow] = useState(null); 
  // const [editedCourseData, setEditedCourseData] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const columnName = {
    name: 'Name',
    code: 'Code',
    acronym: 'Acronym',
    department: 'Department',
    credits: 'Credits',
    professor: 'Professor',
    totalStudents: 'Total Students',
    taStudentRatio: 'Ta Student Ratio',
    taRequired: 'Ta Required'
  }

/*   useEffect(() => {
    setEditedCourseData({});
  }, [editingRow]);*/

  const handleEdit = (row) => {
    setEditingRow(row);
    // setEditedCourseData({ ...courses[rowIndex] });
  };

  const handleSave = async (row) => {
 /*    if (JSON.stringify(editedCourseData) === JSON.stringify(courses[rowIndex])) {
      handleCancel();
      return;
    } */
/*     const originalCourseData = courses[rowIndex];
    const updatedData = {};

    for (const key in editedCourseData) {
      if (editedCourseData[key] !== originalCourseData[key]) {
        updatedData[key] = editedCourseData[key]; // Add changed field to updatedData
      }
    } */
    await updateCourse(row._id, row);
    Swal.fire('Updated!', 'Course has been Updated', 'success');
    handleCancel();
  };

  const handleCancel = () => {
    setEditingRow(null);
    // setEditedCourseData({});
  };

  const handleDelete = async (courseId) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        deleteCourse(courseId);
        Swal.fire('Deleted!', 'Course has been deleted', 'success');
      }
    });
  };

  const handleInputChange = (e, key) => {
    if (key === 'search') {
      setSearchTerm(e.target.value);
    } else {
      const updatedData = { ...editingRow, [key]: e.target.value };
      setEditingRow(updatedData);
      // setEditedCourseData(updatedData);
    }
  };

  const renderRow = (course, index) => {
    // const isEditing = index === editingRow;
    const editingRowClass = 'bg-gray-300';
    // console.log("Editing row: ", editingRow);
    // console.log("Course: ", course);
    const courseContent = Object.keys(course);
    return (
      <tr className={`text-center ${editingRow && editingRow._id === course._id? editingRowClass : ''}`} key={index}>
        <td className='border p-2'>{index + 1}</td>
        {courseContent.slice(1,10).map((key, ind) => (
          <td className='border p-2' key={ind}>
            {editingRow && editingRow._id === course._id? (
              <input
                type='text'
                value = {editingRow[key]?? course[key]}
                // value={editedCourseData[key] ?? course[key]}
                onChange={(e) => handleInputChange(e, key)}
              />
            ) : (
              course[key]
            )}
          </td>
        ))}
        <td className='border p-2'>
          {editingRow && editingRow._id === course._id? (
            <div className='flex'>
              <button
                className='bg-green-500 text-white px-2 py-1 rounded-md flex items-center mr-1'
                onClick={() => handleSave(editingRow)}
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
                onClick={() => handleEdit(course)}
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
      const courseKeys = Object.keys(courses[0]);

      return (
        <>
          <tr className="bg-[#3dafaa] text-white">
            <th className='border p-2 text-center'>S.No</th>
            {courseKeys.slice(1,10).map((key, index) => (
              <th className='border p-2 text-center' key={index}>{columnName[key]}</th>
            ))}
            <th className='border p-2 text-center'>Action</th>
          </tr>
        </>
      );
    }
  };

  const handleDownload = () => {
    // Assuming filteredCourses is an array of objects representing rows with columns
  
    // Function to remove first and last keys/columns from an object
    const removeFirstLastColumns = obj => {
      const keys = Object.keys(obj);
      const modifiedObj = {};
      for (let i = 1; i < keys.length - 1; i++) {
        modifiedObj[keys[i]] = obj[keys[i]];
      }
      return modifiedObj;
    };
  
    // Remove first and last columns from each row in filteredCourses
    const modifiedCourses = filteredCourses.map(course => removeFirstLastColumns(course));
  
    const ws = XLSX.utils.json_to_sheet(modifiedCourses);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Courses');
    XLSX.writeFile(wb, 'Courses_Downloaded.xlsx');
  };
  

  const filteredCourses = courses.filter((course) => {
    const values = Object.values(course).join(' ').toLowerCase();
    return values.includes(searchTerm.toLowerCase());
  });

  return (
    <div>
      <div className='flex mt-4 justify-between'>
        <form className="w-[350px]">
          <div className="relative">
            <input
              type="search"
              placeholder='Search Course...'
              value={searchTerm}
              onChange={(e) => handleInputChange(e, 'search')}
              className="w-full p-4 rounded-full h-10 border border-[#3dafaa] outline-none focus:border-[#3dafaa]"
            />
            <button className="absolute right-0 top-1/2 -translate-y-1/2 p-3 bg-[#3dafaa] rounded-full search-button">
              <AiOutlineSearch />
            </button>
          </div>
        </form>
        <button
          className="bg-[#3dafaa] text-white px-4 py-2 rounded cursor-pointer font-bold mr-6"
          onClick={handleDownload}
        >
          Download
        </button>
      </div>
      <div className='overflow-auto max-w-[80vw] max-h-[82vh] mt-2'>
        <table className="w-full border-collapse border">
          <thead className='sticky top-0'>
            {renderHeaderRow()}
          </thead>
          <tbody>
            {filteredCourses.slice(0).map((course, index) => (
              renderRow(course, index)
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CourseTable;
