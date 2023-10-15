import React, { useContext, useEffect, useState } from "react";
import CourseContext from "../context/CourseContext";
import StudentContext from "../context/StudentContext";
import axios from "axios";

const CoursePage = () => {
  const { selectedCourse } = useContext(CourseContext);
  const { students } = useContext(StudentContext);
  const [button, setbutton] = useState(false);

  const [studentLists, setStudentLists] = useState({ allocatedToThisCourse: [], availableStudents: [] });

  const calculateStudentLists = () => {
    // Filter students based on their allocation status and the selected course
    const allocatedToThisCourse = students.filter(
      (student) => student.allocationStatus === 1 && student.allocatedTA === selectedCourse.name
    );

    const availableStudents = students.filter(
      (student) => student.allocationStatus !== 1 || student.allocatedTA !== selectedCourse.name
    );

    setStudentLists({ allocatedToThisCourse, availableStudents });
  };
  useEffect(() => {
    calculateStudentLists();
    // No need to console.log(studentLists) here
}, [button]);

// Use another useEffect to monitor the studentLists state
useEffect(() => {
    console.log(studentLists); // Check if the state has been updated
}, [studentLists]);

// Rest of your component remains the same


  const handleAllocate = (studentId) => {
    // Make a POST request to allocate the student
    axios
      .post("http://localhost:5001/api/al/allocation", {
        studentId,
        courseId: selectedCourse._id,
      })
      .then((response) => {
        // Allocation was successful
        console.log("Student allocated successfully");
        // Toggle the button state to trigger recalculation
         setbutton((prevState) => !prevState);
      })
      .catch((error) => {
        // Handle any errors, e.g., display an error message
        console.error("Error allocating student:", error);
      });
  };

  const handleDeallocate = (studentId) => {
    // Make a POST request to deallocate the student
    axios
      .post("http://localhost:5001/api/al/deallocation", {
        studentId,
      })
      .then((response) => {
        // Allocation was successful
        console.log("Student deallocated successfully");
        // Toggle the button state to trigger recalculation
        setbutton((prevState) => !prevState);
      })
      
      .catch((error) => {
        // Handle any errors, e.g., display an error message
        console.error("Error deallocating student:", error);
      });
  };

  return (
    <div>
      <h1 className="text-3xl font-bold m-5">{selectedCourse.name}</h1>

      <div className="m-5">
        <h2 className="text-2xl font-bold mb-2">Allocated Students to This Course</h2>
        <table className="w-full border-collapse border">
          <thead>
            <tr className="bg-gray-200 text-gray-700">
              <th className="border p-2">Name</th>
              <th className="border p-2">Email</th>
              <th className="border p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {studentLists.allocatedToThisCourse.map((student) => (
              <tr key={student._id} className="text-center">
                <td className="border p-2">{student.name}</td>
                <td className="border p-2">{student.emailId}</td>
                <td className="border p-2">
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded cursor-pointer font-bold"
                    onClick={() => handleDeallocate(student._id)}
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
        <h2 className="text-2xl font-bold mb-2">Available Students</h2>
        <table className="w-full border-collapse border">
          <thead>
            <tr className="bg-gray-200 text-gray-700">
              <th className="border p-2">Name</th>
              <th className="border p-2">Email</th>
              <th className="border p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {studentLists.availableStudents.map((student) => (
              <tr key={student._id} className="text-center">
                <td className="border p-2">{student.name}</td>
                <td className="border p-2">{student.emailId}</td>
                <td className="border p-2">
                  <button
                    className={`${
                      student.allocationStatus === 1 && student.allocatedTA !== selectedCourse.name
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-[#3dafaa] cursor-pointer"
                    } text-white px-4 py-2 rounded font-bold`}
                    onClick={() => handleAllocate(student._id)}
                    disabled={student.allocationStatus === 1 && student.allocatedTA !== selectedCourse.name}
                  >
                    {student.allocationStatus === 1 && student.allocatedTA !== selectedCourse.name
                      ? "Allocated"
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
