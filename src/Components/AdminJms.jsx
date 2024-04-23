import React, { useContext, useState } from "react";
import DepartmentContext from "../context/DepartmentContext";
import { AiOutlineSearch, AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";
import Swal from 'sweetalert2';

const AdminJms = () => {
  const { departments, setSelectedDepartment, departmentCourses } = useContext(
    DepartmentContext
  );
  const [searchTerm, setSearchTerm] = useState("");

  const handleDepartmentSelect = (department) => {
    Swal.fire({
      title: 'Are you sure?',
      text: `You are about to select the department: ${department}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, select it!',
    }).then((result) => {
      if (result.isConfirmed) {
        setSelectedDepartment(department);
        Swal.fire('Selected!', `You have selected the department: ${department}`, 'success');
      }
    });
  };

  const handleEditDepartment = (department) => {
    // Implement edit functionality, e.g., redirect to an edit page

  };

  const handleDeleteDepartment = (department) => {
    Swal.fire({
      title: 'Are you sure?',
      text: `You are about to delete the department: ${department}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        // Implement delete functionality, e.g., make an API call to delete the department

        // You can refresh the department list or take other actions after deletion
        Swal.fire('Deleted!', `Department ${department} has been deleted.`, 'success');
      }
    });
  };

  const renderRow = (department, index) => {
    return (
      <tr key={index} className="text-center">
        <td className="border p-2">{index + 1}</td>
        <td
          className="border p-2 cursor-pointer hover:underline"
         
        >
          {department}
        </td>
        <td className="border p-2">
          <div className="flex justify-center">
            <button
              className="bg-blue-500 text-white px-2 py-1 rounded-md flex items-center mr-1"
              onClick={() => handleEditDepartment(department)}
            >
              <AiOutlineEdit />Edit
            </button>
            <button
              className="bg-red-500 text-white px-2 py-1 rounded-md flex items-center"
              onClick={() => handleDeleteDepartment(department)}
            >
              <AiOutlineDelete /> Delete
            </button>
          </div>
        </td>
      </tr>
    );
  };

  const renderHeaderRow = () => {
    return (
      <tr className="bg-[#3dafaa] text-white">
        <th className="border p-2 text-center">S.No</th>
        <th className="border p-2 text-center">Department</th>
        <th className="border p-2 text-center">Actions</th>
      </tr>
    );
  };

  const filteredDepartments = departments.filter((department) =>
    department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="flex mt-4 justify-between">
        <form className="w-[350px]">
          <div className="relative">
            <input
              type="search"
              placeholder="Search Department..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-4 rounded-full h-10 border border-[#3dafaa] outline-none focus:border-[#3dafaa]"
            />
            <button className="absolute right-0 top-1/2 -translate-y-1/2 p-3 bg-[#3dafaa] rounded-full search-button">
              <AiOutlineSearch />
            </button>
          </div>
        </form>
      </div>
      <div className="overflow-auto max-w-[80vw] max-h-[82vh] mt-2">
        <table className="w-full border-collapse border">
          <thead className="sticky top-0">{renderHeaderRow()}</thead>
          <tbody>
            {filteredDepartments.map((department, index) =>
              renderRow(department, index)
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminJms;
