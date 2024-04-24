import React, { useContext, useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import Swal from "sweetalert2";
import ProfContext from "../context/ProfContext"; // Assuming you have a ProfContext

const AdminProfessor = () => {
  const { professors, updateProfessor, deleteProfessor } =
    useContext(ProfContext);
  const [editingRow, setEditingRow] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const handleEdit = (row) => {
    setEditingRow(row);
  };

  const handleSave = async (row) => {
    const res = await updateProfessor(row._id, row);
    if (res.status === "Success") {
      Swal.fire("Updated!", "Professor has been Updated", "success");
    } else {
      Swal.fire("Oops!", res.message, "error");
    }
    handleCancel();
  };

  const handleCancel = () => {
    setEditingRow(null);
  };

  const handleDelete = async (professorId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const res = await deleteProfessor(professorId);
        if (res.status === "Success") {
          Swal.fire("Deleted!", "Professor has been deleted", "success");
        } else {
          Swal.fire("Oops!", res.message, "error");
        }
      }
    });
  };

  const handleInputChange = (e, key) => {
    if (key === "search") {
      setSearchTerm(e.target.value);
    } else {
      const updatedData = { ...editingRow, [key]: e.target.value };
      setEditingRow(updatedData);
    }
  };

  const renderRow = (professor, index) => {
    const editingRowClass = "bg-gray-300";

    const professorContent = Object.keys(professor).slice();
    return (
      <tr
        className={`text-center ${
          editingRow && editingRow._id === professor._id ? editingRowClass : ""
        }`}
        key={index}
      >
        <td className="border p-2">{index + 1}</td>
        {professorContent.slice(1, 3).map((key, ind) => (
          <td className="border p-2" key={ind}>
            {editingRow && editingRow._id === professor._id ? (
              <input
                type="text"
                value={editingRow[key] ?? professor[key]}
                onChange={(e) => handleInputChange(e, key)}
              />
            ) : (
              professor[key]
            )}
          </td>
        ))}
        <td className="border p-2">
          {editingRow && editingRow._id === professor._id ? (
            <div className="flex justify-center">
              <button
                className="bg-green-500 text-white px-2 py-1 rounded-md flex items-center mr-1"
                onClick={() => handleSave(editingRow)}
              >
                Save
              </button>
              <button
                className="bg-red-500 text-white px-2 py-1 rounded-md flex items-center"
                onClick={handleCancel}
              >
                Cancel
              </button>
            </div>
          ) : (
            <div className="flex justify-center">
              <button
                className="bg-blue-500 text-white px-2 py-1 rounded-md flex items-center mr-1"
                onClick={() => handleEdit(professor)}
              >
                Edit
              </button>
              <button
                className="bg-red-500 text-white px-2 py-1 rounded-md flex items-center"
                onClick={() => handleDelete(professor._id)}
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
    if (professors.length === 0) {
      return (
        <tr>
          <th className="bg-[#3dafaa] text-center font-bold p-2 text-white">
            No Professors
          </th>
        </tr>
      );
    } else {
      const professorKeys = Object.keys(professors[0]);

      return (
        <>
          <tr className="bg-[#3dafaa] text-white">
            <th className="border p-2 text-center">S.No</th>
            <th className="border p-2 text-center">Email ID</th>
            <th className="border p-2 text-center">Name</th>
            <th className="border p-2 text-center">Action</th>
          </tr>
        </>
      );
    }
  };

  const filteredProfessors = professors.filter((professor) => {
    const values = Object.values(professor).join(" ").toLowerCase();
    return values.includes(searchTerm.toLowerCase());
  });

  return (
    <div>
      <div className="flex mt-4 justify-between">
        <form className="w-[350px]">
          <div className="relative">
            <input
              type="search"
              placeholder="Search Faculty..."
              value={searchTerm}
              onChange={(e) => handleInputChange(e, "search")}
              className="w-full p-4 rounded-full h-10 border border-[#3dafaa] outline-none focus:border-[#3dafaa]"
            />
            <button className="absolute right-0 top-1/2 -translate-y-1/2 p-3 bg-[#3dafaa] rounded-full search-button">
              <AiOutlineSearch />
            </button>
          </div>
        </form>
        {/* Add any additional buttons or actions specific to professors */}
      </div>
      <div className="overflow-auto max-w-[80vw] max-h-[82vh] mt-2">
        <table className="w-full border-collapse border">
          <thead className="sticky top-0">{renderHeaderRow()}</thead>
          <tbody>
            {filteredProfessors
              .slice(0)
              .map((professor, index) => renderRow(professor, index))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminProfessor;
