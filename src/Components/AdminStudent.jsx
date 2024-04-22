import React, { useContext, useEffect, useState } from "react";
import {
  AiOutlineSearch,
  AiOutlineSortAscending,
  AiOutlineSortDescending,
} from "react-icons/ai";
import ClipLoader from "react-spinners/ClipLoader";
import Swal from "sweetalert2";
import * as XLSX from "xlsx";
import StudentContext from "../context/StudentContext";

const Tablestudents = () => {
  const { students, updateStudent, deleteStudent } = useContext(StudentContext);
  const [editingRow, setEditingRow] = useState(-1);
  const [editingStudentIndex, setEditingStudentIndex] = useState();
  const [editedStudentData, setEditedStudentData] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [loader, setLoader] = useState(false);
  const customLabels = [
    "Name",
    "Email Id",
    "Roll No",
    "CGPA",
    "Program",
    "Department",
    "TA Type",
    /* 'TA Status',
    'TA Allotted', */
    "Dept Pref 1",
    "Grade Dept Pref 1",
    "Dept Pref 2",
    "Grade Dept Pref 2",
    "Other Pref 1",
    "Grade Other Pref 1",
    "Other Pref 2",
    "Grade Other Pref 2",
    "Other Pref 3",
    "Grade Other Pref 3",
    "Other Pref 4",
    "Grade Other Pref 4",
    "Other Pref 5",
    "Grade Other Pref 5",
    "Non-Prefs 1",
    "Non-Prefs 2",
    "Non-Prefs 3",
  ];
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });
  const [sortedStudent, setSortedStudent] = useState([]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleEdit = (rowIndex, ID) => {
    setEditingRow(rowIndex);
    let count = 0;
    for (const s of students) {
      if (s._id === ID) {
        break;
      }
      count++;
    }
    setEditingStudentIndex(count);
  };

  const handleSave = async (ID) => {
    setLoader(true);
    if (
      JSON.stringify(editedStudentData) ===
      JSON.stringify(students[editingStudentIndex])
    ) {
      handleCancel();
      return;
    }
    const originalStudentData = students[editingStudentIndex];
    const updatedData = {};

    for (const key in editedStudentData) {
      if (editedStudentData[key] !== originalStudentData[key]) {
        updatedData[key.toLowerCase()] = editedStudentData[key];
      }
    }
    const res = await updateStudent(ID, updatedData);
    setLoader(false);
    if (res.status === "Success") {
      Swal.fire("Updated!", "Student has been updated", "success");
    } else {
      Swal.fire("Oops!", res.message, "error");
    }
    handleCancel();
  };

  const handleCancel = () => {
    setEditingRow(-1);
    setEditedStudentData({});
  };

  const handleDelete = async (studentId) => {
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
        const res = await deleteStudent(studentId);
        if (res.status === "Success") {
          Swal.fire("Updated!", "Student has been deleted", "success");
        } else {
          Swal.fire("Oops!", res.message, "error");
        }
      }
    });
  };

  const handleInputChange = (e, key) => {
    const updatedData = { ...editedStudentData, [key]: e.target.value };
    setEditedStudentData(updatedData);
  };

  useEffect(() => {
    // This code will run after the state has been updated
    setEditedStudentData({ ...students[editingStudentIndex] });
  }, [editingStudentIndex]);

  useEffect(() => {
    setSortedStudent(extractedData);
  }, [students]);

  const extractedData = students.map((student) => {
    const formattedData = customLabels.map((label) => {
      if (label === "Name") {
        return student.name;
      } else if (label === "Email Id") {
        return student.emailId;
      } else if (label === "Roll No") {
        return student.rollNo;
      } else if (label === "CGPA") {
        return student.cgpa;
      } else if (label === "Program") {
        return student.program;
      } else if (label === "Department") {
        return student.department;
      } else if (label === "TA Type") {
        return student.taType;
      } else if (label === "TA Status") {
        return student.allocationStatus;
      } else if (label === "TA Allotted") {
        return student.allocatedTA;
      } else if (label.startsWith("Dept Pref ")) {
        const index = parseInt(label.replace("Dept Pref ", ""), 10) - 1;
        return index < student.departmentPreferences.length
          ? student.departmentPreferences[index].course
          : "";
      } else if (label.startsWith("Grade Dept Pref")) {
        const index = parseInt(label.replace("Grade Dept Pref ", ""), 10) - 1;
        return index < student.departmentPreferences.length
          ? student.departmentPreferences[index].grade
          : "";
      } else if (label.startsWith("Other Pref ")) {
        const index = parseInt(label.replace("Other Pref ", ""), 10) - 1;
        return index < student.nonDepartmentPreferences.length
          ? student.nonDepartmentPreferences[index].course
          : "";
      } else if (label.startsWith("Grade Other Pref")) {
        const index = parseInt(label.replace("Grade Other Pref ", ""), 10) - 1;
        return index < student.nonDepartmentPreferences.length
          ? student.nonDepartmentPreferences[index].grade
          : "";
      } else if (label.startsWith("Non-Prefs ")) {
        const index = parseInt(label.replace("Non-Prefs ", ""), 10) - 1;
        return index < student.nonPreferences.length
          ? student.nonPreferences[index]
          : "";
      }
      return "";
    });
    formattedData.push(student._id);
    return formattedData;
  });

  const filteredStudents =
    searchQuery === ""
      ? sortedStudent
      : sortedStudent.filter((student) => {
          const values = Object.values(student).join(" ").toLowerCase();
          return values.includes(searchQuery.toLowerCase());
        });

  const renderHeaderRow = () => {
    return (
      <tr className="bg-[#3dafaa] text-white">
        <th className="border p-2 text-center">S.No</th>
        {customLabels.map((label, index) => (
          <th className="border p-2 text-center" key={index}>
            <button
              className="w-full flex justify-center"
              onClick={() => handleSort(index)}
            >
              {label}
              {sortConfig.key === index &&
                (sortConfig.direction === "ascending" ? (
                  <AiOutlineSortAscending />
                ) : (
                  <AiOutlineSortDescending />
                ))}
            </button>
          </th>
        ))}
        <th className="border p-2 text-center">Actions</th>
      </tr>
    );
  };

  const renderRow = (data, index) => {
    const isEditing = index === editingRow;
    const editingRowClass = "bg-gray-300";

    return (
      <tr
        className={`text-center ${isEditing ? editingRowClass : ""}`}
        key={index}
      >
        <td className="border p-2">{index + 1}</td>
        {data.slice(0, 24).map((item, itemIndex) => (
          <td className="border p-2" key={itemIndex}>
            {isEditing ? (
              <input
                type="text"
                value={
                  editedStudentData[customLabels[itemIndex]] || data[itemIndex]
                }
                onChange={(e) => handleInputChange(e, customLabels[itemIndex])}
              />
            ) : (
              item
            )}
          </td>
        ))}
        <td className="border p-2">
          {isEditing ? (
            loader ? (
              <div className="flex justify-center">
                <ClipLoader
                  color={"#3dafaa"}
                  loading={loader}
                  size={100}
                  aria-label="Loading Spinner"
                  data-testid="loader"
                />
              </div>
            ) : (
              <div className="flex">
                <button
                  className="bg-green-500 text-white px-2 py-1 rounded-md flex items-center mr-1"
                  onClick={() => handleSave(data[24])}
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
            )
          ) : (
            <div className="flex">
              <button
                className="bg-blue-500 text-white px-2 py-1 rounded-md flex items-center mr-1"
                onClick={() => handleEdit(index, data[24])}
              >
                Edit
              </button>
              <button
                className="bg-red-500 text-white px-2 py-1 rounded-md flex items-center"
                onClick={() => handleDelete(data[24])}
              >
                Delete
              </button>
            </div>
          )}
        </td>
      </tr>
    );
  };

  const handleDownload = () => {
    const ws = XLSX.utils.json_to_sheet(filteredStudents);

    // Set custom headers as the first row
    const headers = [
      "Name",
      "Email Id",
      "Roll No",
      "CGPA",
      "Program",
      "Department",
      "TA Type",
      /*  'TA Status',
    'TA Allotted', */
      "Dept Pref 1",
      "Grade Dept Pref 1",
      "Dept Pref 2",
      "Grade Dept Pref 2",
      "Other Pref 1",
      "Grade Other Pref 1",
      "Other Pref 2",
      "Grade Other Pref 2",
      "Other Pref 3",
      "Grade Other Pref 3",
      "Other Pref 4",
      "Grade Other Pref 4",
      "Other Pref 5",
      "Non-Prefs 1",
      "Non-Prefs 2",
      "Non-Prefs 3",
    ]; // Replace with your custom headers
    XLSX.utils.sheet_add_aoa(ws, [customLabels], { origin: "A1" });

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Students");
    XLSX.writeFile(wb, "Students_Downloaded.xlsx");
  };

  const handleSort = (key) => {
    // Toggle the sorting direction if the same key is clicked again
    const direction =
      key === sortConfig.key && sortConfig.direction === "ascending"
        ? "descending"
        : "ascending";
    const sorted = [...sortedStudent].sort((a, b) => {
      const valueA = a[key].toString().toLowerCase();
      const valueB = b[key].toString().toLowerCase();
      if (valueA < valueB) {
        return direction === "ascending" ? -1 : 1;
      }
      if (valueA > valueB) {
        return direction === "ascending" ? 1 : -1;
      }
      return 0;
    });
    setSortConfig({ key, direction });
    setSortedStudent(sorted);
  };

  return (
    <div>
      <div className="flex mt-4 justify-between">
        <form className="w-[350px]">
          <div className="relative mr-2">
            <input
              type="search"
              placeholder="Search Students..."
              value={searchQuery}
              onChange={handleSearch}
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
      <div className="overflow-auto max-w-[80vw] max-h-[80vh] mt-4">
        <table className="w-full border-collapse border">
          <thead className="sticky top-0">{renderHeaderRow()}</thead>
          <tbody>
            {filteredStudents.map((data, index) => renderRow(data, index))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Tablestudents;
