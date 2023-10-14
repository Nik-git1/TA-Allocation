import React, { useContext, useState, useEffect } from "react";
import CourseContext from "../context/CourseContext";
import StudentContext from "../context/StudentContext";
import DepartmentContext from "../context/DepartmentContext";
import Swal from "sweetalert2";

const CoursePage = () => {
  const { selectedCourse, selectedCourseTA } = useContext(CourseContext);
  const { students } = useContext(StudentContext);
  const { selectedDepartment } = useContext(DepartmentContext);
  const [clickedStudentName, setClickedStudentName] = useState(null);
  const [allocatedStudents, setAllocatedStudents] = useState([]);
  const [columnHeaders, setColumnHeaders] = useState([]);

  useEffect(() => {
    const updatedAllocatedStudents = students.filter(
      (student) =>
        student.department === selectedDepartment &&
        student.allocated === "Yes" &&
        student.course === selectedCourse
    );
    setAllocatedStudents(updatedAllocatedStudents);
    // Extract column headers dynamically from the first student object (assuming it's present)
    if (students.length > 0) {
      const firstStudent = students[0];
      const headers = Object.keys(firstStudent);
      setColumnHeaders(headers);
    }
  }, [students, selectedDepartment, selectedCourse]);

  const renderColumnHeaders = (headers) => (
    <tr className="bg-[#3dafaa] text-white">
      {headers.map((header) => (
        <th className="border p-2 text-center" key={header}>
          {header}
        </th>
      ))}
      <th className="border p-2 text-center">Action</th>
    </tr>
  );

  return (
    <div style={{ maxHeight: "900px", overflow: "auto" }}>
      <h1 className="text-[#3dafaa] text-3xl font-bold m-5">
        {selectedCourse}
      </h1>

      <div className="m-5">
        <h2 className="text-[#3dafaa] text-2xl font-bold mb-2">
          Allocated Students
        </h2>
        <table className="w-full border-collapse border">
          <thead>{renderColumnHeaders(columnHeaders)}</thead>
          <tbody>
            {allocatedStudents.map((student, index) => (
              <tr className="text-center" key={index}>
                {columnHeaders.map((header) => (
                  <td className="border p-2" key={header}>
                    {student[header]}
                  </td>
                ))}
                <td className="border p-2">
                  <button
                    onClick={() => DeAllocate(student.id, student.name)}
                    className={`bg-[#ff0909] text-white px-4 py-2 rounded cursor-pointer font-bold`}
                  >
                    Deallocate
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="m-5">
        <h2 className="text-[#3dafaa] text-2xl font-bold mb-2">
          Available Students
        </h2>
        <table className="w-full border-collapse border">
          <thead>{renderColumnHeaders(columnHeaders)}</thead>
          <tbody>
            {students.map((student, index) => (
              <tr className="text-center" key={index}>
                {columnHeaders.map((header) => (
                  <td className="border p-2" key={header}>
                    {student[header]}
                  </td>
                ))}
                <td className="border p-2">
                  <button
                    onClick={() => Allocate(student.id, student.name)}
                    className={`bg-[#3dafaa] text-white px-4 py-2 rounded cursor-pointer font-bold`}
                    disabled={student.allocated === "Yes"}
                  >
                    {student.allocated === "Yes"
                      ? `Allocated to ${student.allocatedTo}`
                      : "Allocate"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CoursePage;
