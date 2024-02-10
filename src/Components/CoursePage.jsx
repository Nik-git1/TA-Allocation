import React, { useContext, useEffect, useState } from "react";
import CourseContext from "../context/CourseContext";
import Swal from 'sweetalert2';
import { useParams, useNavigate, useLocation } from "react-router-dom";
import StudentContext from "../context/StudentContext";
import axios from "axios";
import AuthContext from "../context/AuthContext";
import * as XLSX from 'xlsx';
import { AiOutlineSearch } from 'react-icons/ai';

const CoursePage = () => {
  const { selectedCourse } = useContext(CourseContext);
  const { students } = useContext(StudentContext);
  const [button, setbutton] = useState(false);
  const {user} = useContext(AuthContext)
  const { courseName } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [allocatedToThisCourse, setAllocatedToThisCourse] = useState([]);
  const [availableStudents, setAvailableStudents] = useState([]);
  const [allocated, setAllocated] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentRound, setCurrentRound] = useState(null);

  useEffect(() => {
    if (!selectedCourse || selectedCourse.name !== courseName) {
      // Redirect to the professor page if conditions are met
      const currentPath = location.pathname;
      const lastIndexOfSlash = currentPath.lastIndexOf('/');

  
      if (lastIndexOfSlash !== -1) {
        // Extract the modified path
        const modifiedPath = currentPath.substring(0, lastIndexOfSlash);
  
        // Navigate to the modified path
        navigate(modifiedPath);
      }
    }
    // When the component mounts, sort students into allocated and available lists
    const studentsAllocatedToCourse = students.filter(
      (student) =>
        student.allocationStatus === 1 &&
        student.allocatedTA === selectedCourse.name
    );

    const studentsAvailableForAllocation = students.filter(
      (student) =>
        student.allocationStatus !== 1 ||
        student.allocatedTA !== selectedCourse.name
    );

    const fetchCurrentRound = async () => {
      try {
        const response = await fetch("http://localhost:5001/api/rd/currentround");
        const data = await response.json();
        setCurrentRound(data.currentRound); 
      } catch (error) {
        console.error("Error fetching round status:", error);
      }
    };

    fetchCurrentRound();

    setAllocatedToThisCourse(studentsAllocatedToCourse);
    setAvailableStudents(studentsAvailableForAllocation);
  }, [selectedCourse, students]);

  const handleAllocate = (studentId) => {
    // Make a POST request to allocate the student
    axios
      .post("http://localhost:5001/api/al/allocation", {
        studentId,
        courseId: selectedCourse._id,
        allocatedByID : user.id,
        allocatedBy: user.role
      })
      .then((response) => {
        // Allocation was successful

        // Move the student from available to allocated
        const studentToAllocate = availableStudents.find(
          (student) => student._id === studentId
        );

        setAllocatedToThisCourse((prevAllocated) => [
          ...prevAllocated,
          studentToAllocate,
        ]);
        setAvailableStudents((prevAvailable) =>
          prevAvailable.filter((student) => student._id !== studentId)
        );

        // Toggle the button state to trigger recalculation
        setbutton((prevState) => !prevState);
      })
      .catch((error) => {
        if(error.message === 'Request failed with status code 400'){
          Swal.fire("Can't Allocate", 'TA limit exceeded.', 'error');
        }
        console.error("Error allocating student:", error);
      });
  };

  const handleDeallocate = (studentId) => {
    // Make a POST request to deallocate the student
    axios
      .post("http://localhost:5001/api/al/deallocation", {
        studentId: studentId,
        deallocatedByID : user.id,
        deallocatedBy: user.role

      })
      .then((response) => {
        // Deallocation was successful
        console.log(response)
        // Move the student from allocated to available
        const studentToDeallocate = allocatedToThisCourse.find(
          (student) => student._id === studentId
        );

        setAvailableStudents((prevAvailable) => [
          ...prevAvailable,
          studentToDeallocate,
        ]);
        setAllocatedToThisCourse((prevAllocated) =>
          prevAllocated.filter((student) => student._id !== studentId)
        );

        // Toggle the button state to trigger recalculation
        setbutton((prevState) => !prevState);
      })
      .catch((error) => {
        // Handle any errors, e.g., display an error message
        console.error("Error deallocating student:", error);
      });
  };

  if (!selectedCourse) {
    // Render a message or UI indicating that the course data is not available
    return <div>Course data is not available.</div>;
  }

  const handleRenderAllocatedTable = async() => {
    setAllocated(1);
  }

  const handleRenderAvailableStudentTable = async() => {
    setAllocated(0);
  }

  const handleRenderAllocatedToOthersTable = async() => {
    setAllocated(2);
  }

  const handleDownload = () => {
    const dataToDownload = allocated
      ? allocatedToThisCourse.map(({ _id, allocationStatus, __v, ...rest }) => rest)  // Exclude _id and allocationStatus from allocatedToThisCourse
      : availableStudents.map(({ _id, allocationStatus, __v, ...rest }) => rest);   // Exclude _id and allocationStatus from availableStudents
  
    const ws = XLSX.utils.json_to_sheet(dataToDownload);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Students');
    XLSX.writeFile(wb, `${selectedCourse.name}_${allocated ? 'Allocated' : 'Available'}_Students.xlsx`);
  };
  
  const filterStudents = (studentsList) => {
    return studentsList.filter((student) =>
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.emailId.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredStudents = filterStudents(
    allocated === 1 ? allocatedToThisCourse : availableStudents
  );

  const renderAllocatedRow = (student) => {
    let pref = 'NA';
    let count = 1;
    for(const i of student.departmentPreferences){
      if(i.course === selectedCourse.name){
        pref = 'Department Preference';
        break;
      }
    }
    for(const i of student.nonDepartmentPreferences){
      if(pref !== 'NA'){
        break;
      }
      if(i.course === selectedCourse.name){
        pref = `Preference ${count}`;
        break;
      }
      count++;
    }
    return (
      <tr className="text-center">
        <td className="border p-2">{student.name}</td>
        <td className="border p-2">{student.emailId}</td>
        {currentRound  === 1 ? (null) : (
          <>
          <td className="border p-2">{student.cgpa}</td>
          <td className="border p-2">Grade</td>
          <td className="border p-2">{pref}</td>
          </>
        )}
        <td className="border p-2">
          <button
            className="bg-red-500 text-white px-4 py-2 rounded cursor-pointer font-bold"
            onClick={() => handleDeallocate(student._id)}
          >
            Deallocate
          </button>
        </td>
      </tr>
    );
  };

  const renderAvailableRow = (student) => {
    let department = student.department === selectedCourse.department;
    let pref = 'NA';
    let count = 1;
    for(const i of student.departmentPreferences){
      if(i.course === selectedCourse.name){
        pref = 'Department Preference';
        break;
      }
    }
    for(const i of student.nonDepartmentPreferences){
      if(pref !== 'NA'){
        break;
      }
      if(i.course === selectedCourse.name){
        pref = `Preference ${count}`;
        break;
      }
      count++;
    }
    return (
      <>
      {pref !== 'NA' || department || currentRound !== 2 ? (
        student.allocationStatus === 0 ? (
        <tr className="text-center">
          <td className="border p-2">{student.name}</td>
          <td className="border p-2">{student.emailId}</td>
          {currentRound  === 1 ? (null) : (
            <>
            <td className="border p-2">{student.cgpa}</td>
            <td className="border p-2">Grade</td>
            <td className="border p-2">{pref}</td>
            </>
          )}
          <td className="border p-2">
            <button
              className={`${
                student.allocationStatus === 1 &&
                student.allocatedTA !== selectedCourse.name
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#3dafaa] cursor-pointer"
              } text-white px-4 py-2 rounded font-bold`}
              onClick={() => handleAllocate(student._id)}
              disabled={
                student.allocationStatus === 1 &&
                student.allocatedTA !== selectedCourse.name
              }
            >
              Allocate
            </button>
          </td>
        </tr>
      ) : (null)) : (null)}
      </>
    );
  }

  const renderAllocatedToOthers = (student) => {
    
    let department = student.department === selectedCourse.department;
    let pref = 'NA';
    let count = 1;
    for(const i of student.departmentPreferences){
      if(i.course === selectedCourse.name){
        pref = 'Department Preference';
        break;
      }
    }
    for(const i of student.nonDepartmentPreferences){
      if(pref !== 'NA'){
        break;
      }
      if(i.course === selectedCourse.name){
        pref = `Preference ${count}`;
        break;
      }
      count++;
    }
    return (
      <>
      {
        student.allocationStatus === 1 && student.allocatedTA !== selectedCourse.name ? (
          <tr className="text-center">
          <td className="border p-2">{student.name}</td>
          <td className="border p-2">{student.emailId}</td>
          {currentRound  === 1 ? (null) : (
            <>
            <td className="border p-2">{student.cgpa}</td>
            <td className="border p-2">Grade</td>
            <td className="border p-2">{pref}</td>
            </>
          )}
          <td className="border p-2">
            {student.allocatedTA}    
          </td>
        </tr>          
        ) : (null)    
      }
      </>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold m-5">{selectedCourse.name}</h1>
      <div className="flex justify-between">
        <div className="flex">
          <button
            type="button"
            className={`px-4 py-1 rounded-full cursor-pointer border border-[#3dafaa] ${
              allocated === 0 ? 'bg-[#3dafaa] text-white' : 'text-[#3dafaa]'
            } hover:bg-[#3dafaa] hover:text-white mr-4`}
            onClick={handleRenderAvailableStudentTable}
          >
            Available Student
          </button>
          <button
            type="button"
            className={`px-4 py-1 rounded-full cursor-pointer border border-[#3dafaa] ${
              allocated === 1 ? 'bg-[#3dafaa] text-white' : 'text-[#3dafaa]'
            } hover:bg-[#3dafaa] hover:text-white mr-2`}
            onClick={handleRenderAllocatedTable}
          >
            Student Allocated to {selectedCourse.acronym}
          </button>
          <button
            type="button"
            className={`px-4 py-1 rounded-full cursor-pointer border border-[#3dafaa] ${
              allocated === 2 ? 'bg-[#3dafaa] text-white' : 'text-[#3dafaa]'
            } hover:bg-[#3dafaa] hover:text-white mr-2`}
            onClick={handleRenderAllocatedToOthersTable}
          >
            Student Allocated to others
          </button>
  
          <form className="w-[350px]">
            <div className="relative mr-2">
              <input
                type="search"
                placeholder="Search Student..."
                className="w-full p-4 rounded-full h-10 border border-[#3dafaa] outline-none focus:border-[#3dafaa]"
                value={searchQuery}
                onChange={handleSearch}
              />
              <button className="absolute right-0 top-1/2 -translate-y-1/2 p-3 bg-[#3dafaa] rounded-full search-button">
                <AiOutlineSearch />
              </button>
            </div>
          </form>
        </div>
        <button
          className="bg-[#3dafaa] text-white px-4 py-2 rounded cursor-pointer font-bold mr-6"
          onClick={handleDownload}
        >
          Download
        </button>
      </div>
  
      {allocated === 1 && (
        <div className="m-5">
          <h2 className="text-2xl font-bold mb-2">Allocated Students to {courseName}</h2>
          <div className="overflow-auto max-h-[65vh]">
            <table className="w-full border-collapse border">
              <thead>
                <tr className="bg-gray-200 text-gray-700">
                  <th className="border p-2">Name</th>
                  <th className="border p-2">Email</th>
                  {currentRound !== 1 && (
                    <>
                      <th className="border p-2">CGPA</th>
                      <th className="border p-2">Grade</th>
                      <th className="border p-2">Preference</th>
                    </>
                  )}
                  <th className="border p-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student) => renderAllocatedRow(student))}
              </tbody>
            </table>
          </div>
        </div>
      )}
  
      {allocated === 0 && (
        <div className="m-5">
          <h2 className="text-2xl font-bold mb-2">Available Students</h2>
          <div className="overflow-auto max-h-[65vh]">
            <table className="w-full border-collapse border">
              <thead className="sticky top-0">
                <tr className="bg-gray-200 text-gray-700">
                  <th className="border p-2">Name</th>
                  <th className="border p-2">Email</th>
                  {currentRound !== 1 && (
                    <>
                      <th className="border p-2">CGPA</th>
                      <th className="border p-2">Grade</th>
                      <th className="border p-2">Preference</th>
                    </>
                  )}
                  <th className="border p-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student) => renderAvailableRow(student))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {allocated === 2 && (
        <div className="m-5">
          <h2 className="text-2xl font-bold mb-2">Allocated to others courses</h2>
          <div className="overflow-auto max-h-[65vh]">
            <table className="w-full border-collapse border">
              <thead className="sticky top-0">
                <tr className="bg-gray-200 text-gray-700">
                  <th className="border p-2">Name</th>
                  <th className="border p-2">Email</th>
                  {currentRound !== 1 && (
                    <>
                      <th className="border p-2">CGPA</th>
                      <th className="border p-2">Grade</th>
                      <th className="border p-2">Preference</th>
                    </>
                  )}
                  <th className="border p-2">Allocated To</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student) => renderAllocatedToOthers(student))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );  
};

export default CoursePage;
