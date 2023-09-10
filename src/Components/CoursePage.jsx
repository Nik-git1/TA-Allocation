import React, { useContext, useState, useEffect } from "react";
import CourseContext from "../context/CourseContext";
import StudentContext from "../context/StudentContext";
import DepartmentContext from "../context/DepartmentContext";

const CoursePage = () => {
  const { selectedCourse } = useContext(CourseContext);
  const { students, allocateStudent } = useContext(StudentContext);
  const { selectedDepartment } = useContext(DepartmentContext);
  const [clickedStudentName, setClickedStudentName] = useState(null);

  const allocatedStudents = students.filter(
    (student) =>
    student[2] === selectedDepartment 
    // student[3] === "Yes" && 
    // student[4] === selectedCourse
  );

  const availableStudents = students.filter(
    (student) =>
      student[2] === selectedDepartment
      //  && 
      // student[3] === "No" 
  );

  const handleStudentIdClick = (id) => {
    console.log(id)
    allocateStudent(id,selectedCourse);
    setClickedStudentName(id);
  };


  useEffect(() => {
    console.log(students)
  }, [students]);

  return (
    <div>
      <h1 className="text-[#3dafaa] text-3xl font-bold m-5">
        {selectedCourse}
      </h1>

      <div className="m-5">
        <h2 className="text-[#3dafaa] text-2xl font-bold mb-2">
          Allocated Students
        </h2>
        <table className="w-full border-collapse border">
          <thead>
            <tr className="bg-[#3dafaa] text-white">
              <th className="border p-2 text-center">ID</th>
              <th className="border p-2 text-center">Name</th>
            </tr>
          </thead>
          <tbody>
            {allocatedStudents.map((student, index) => (
              <tr className="text-center" key={index}>
                <td className="border p-2">{student[0]}</td>
                <td className="border p-2">
                  <button
                    onClick={() => handleStudentIdClick(student[0])}
                    className="bg-[#3dafaa] text-white px-4 py-2 rounded cursor-pointer font-bold"
                  >
                    {student[1]}
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
          <thead>
            <tr className="bg-[#3dafaa] text-white">
              <th className="border p-2 text-center">ID</th>
              <th className="border p-2 text-center">Name</th>
            </tr>
          </thead>
          <tbody>
            {availableStudents.map((student, index) => (
              <tr className="text-center" key={index}>
                <td className="border p-2">{student[0]}</td>
                <td className="border p-2">
                  <button
                    onClick={() => handleStudentIdClick(student[0])}
                    className="bg-[#3dafaa] text-white px-4 py-2 rounded cursor-pointer font-bold"
                  >
                    {student[1]}
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
