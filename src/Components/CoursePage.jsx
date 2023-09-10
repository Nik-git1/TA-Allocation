import React, { useContext, useState, useEffect } from "react";
import CourseContext from "../context/CourseContext";
import StudentContext from "../context/StudentContext";
import DepartmentContext from "../context/DepartmentContext";

const CoursePage = () => {
  const { selectedCourse,selectedCourseTA } = useContext(CourseContext);
  const { students, allocateStudent, deallocateStudent } = useContext(
    StudentContext
  );
  const { selectedDepartment } = useContext(DepartmentContext);
  const [clickedStudentName, setClickedStudentName] = useState(null);
  const [allocatedStudents, setAllocatedStudents] = useState([]);

  // useEffect to update allocatedStudents when students array changes
  useEffect(() => {
    const updatedAllocatedStudents = students.filter(
      (student) =>
        student[2] === selectedDepartment &&
        student[3] === "Yes" &&
        student[4] === selectedCourse
    );
    setAllocatedStudents(updatedAllocatedStudents);
  }, [students, selectedDepartment, selectedCourse]);

  const Allocate = (id) => {
    console.log(allocatedStudents.length)
    if(allocatedStudents.length < selectedCourseTA){
      console.log(id);
     allocateStudent(id, selectedCourse);
      setClickedStudentName(id);
    }else{
      console.log("max TAs reached")
    }
    
  };

  const DeAllocate = (id) => {
    console.log("in" + id);
    deallocateStudent(id, selectedCourse);
    setClickedStudentName(id);
  };

  useEffect(() => {
    console.log(selectedCourseTA)
  }, [allocatedStudents]);

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
          <thead>
            <tr className="bg-[#3dafaa] text-white">
              <th className="border p-2 text-center">ID</th>
              <th className="border p-2 text-center">Name</th>
              <th className="border p-2 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {allocatedStudents.map((student, index) => (
              <tr className="text-center" key={index}>
                <td className="border p-2">{student[0]}</td>
                <td className="border p-2">{student[1]}</td>
                <td className="border p-2">
                  <button
                    onClick={() => DeAllocate(student[0])}
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
          <thead>
            <tr className="bg-[#3dafaa] text-white">
              <th className="border p-2 text-center">ID</th>
              <th className="border p-2 text-center">Name</th>
              <th className="border p-2 text-center">Course</th>
              <th className="border p-2 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student, index) => (
              <tr className="text-center" key={index}>
                <td className="border p-2">{student[0]}</td>
                <td className="border p-2">{student[1]}</td>
                <td className="border p-2">
                  <button
                    onClick={() => Allocate(student[0])}
                    className={`bg-[#3dafaa] text-white px-4 py-2 rounded cursor-pointer font-bold`}
                    disabled={student[3] === "Yes"}
                  >
                    {student[3] === "Yes"
                      ? `Allocated to ${student[4]}`
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
