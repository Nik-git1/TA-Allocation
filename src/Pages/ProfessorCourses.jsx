import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { GoDotFill } from "react-icons/go";
import { useLocation, useNavigate } from "react-router-dom";
import FeedbackList from "../Components/FeedbackList";
import AuthContext from "../context/AuthContext";
import CourseContext from "../context/CourseContext";

const ProfessorCourses = () => {
  const location = useLocation();
  const profName = location.state?.name || "Faculty";
  const [departmentCourses, setDepartmentCourses] = useState([]);
  const [feedbackForm, setFeedbackForm] = useState(false);
  const navigate = useNavigate();
  const { setSelectedCourse } = useContext(CourseContext);
  const [currentRound, setCurrentRound] = useState(null);
  const { user } = useContext(AuthContext);

  const API = import.meta.env.VITE_API_URL;

  const fetchCurrentRound = async () => {
    try {
      const response = await fetch(`${API}/api/rd/currentround`);
      const data = await response.json();
      setCurrentRound(data.currentRound);
    } catch (error) {
      console.error("Error fetching round status:", error);
    }
  };

  // Fetch courses from the backend
  useEffect(() => {
    // Fetch courses from the backend
    const fetchCourses = async () => {
      try {
        const response = await fetch(`${API}/api/course/professor`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ professor: user.id }),
        });

        const data = await response.json();
        setDepartmentCourses(data.courses); // Assuming data is an array of courses
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchCourses();
    getFeedbackFormStatus();
    fetchCurrentRound();
  }, [user]); // Include user in the dependency array to avoid missing dependency warning

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.replace(API);
  };

  const getFeedbackFormStatus = () => {
    axios
      .get(`${API}/api/feedback/status`)
      .then((response) => {
        setFeedbackForm(response.data.active);
        // Log the updated feedback form status
      })
      .catch((error) => {
        console.error("Error fetching feedback form status:", error);
      });
  };

  const allocateCourse = (course) => {
    var courseName = course.name;
    setSelectedCourse(course);
    navigate(`${courseName}`);
  };

  const renderHeaderRow = () => {
    if (departmentCourses.length === 0) {
      return (
        <tr>
          <th className="bg-[#3dafaa] text-center font-bold p-2 text-white">
            Course Data
          </th>
        </tr>
      );
    } else {
      return (
        <tr className="bg-[#3dafaa] text-white">
          <th className="border p-2 text-center">Name</th>
          <th className="border p-2 text-center">Code</th>
          <th className="border p-2 text-center">Acronym</th>
          <th className="border p-2 text-center">Credits</th>
          <th className="border p-2 text-center">Total Students</th>
          <th className="border p-2 text-center">TA Student Ratio</th>
          <th className="border p-2 text-center">TA Required</th>
          <th className="border p-2 text-center">Actions</th>
        </tr>
      );
    }
  };

  return (
    <div>
      <div className="flex justify-between">
        <div className="flex">
          <div className="m-4" style={{ fontSize: "48px" }}>
            Welcome {profName}
          </div>
          <div className="flex items-center">
            <p className="text-[#3dafaa] text-2xl font-bold mr-2">
              Ongoing Round:
            </p>
            <p className=" text-2xl flex mr-1">Round</p>
            <p className=" text-2xl flex">{currentRound}</p>
          </div>
          <p className="flex items-center ml-2 mb-2 text-3xl">|</p>
          <div className="flex ml-2 items-center">
            <p className="text-red-500">
              <GoDotFill />
            </p>
            <p className="mr-2">Red courses are overallocated</p>
            {currentRound >= 2 ? (
              <>
                <p className="text-yellow-500">
                  <GoDotFill />
                </p>
                <p className="">Yellow courses are underallocated</p>
              </>
            ) : null}
          </div>
        </div>
        <div className="flex items-center">
          <button
            className="rounded-full bg-[#3dafaa] text-white py-2 px-6 hover:bg-red-500 font-bold mr-2"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>

      <div className="max-w-[100vw] max-h-[78vh] overflow-auto mt-4">
        <table
          className="border-collapse border w-full"
          style={{ width: "100%" }}
        >
          <thead className="sticky top-0">{renderHeaderRow()}</thead>
          <tbody>
            {departmentCourses.map((row, index) => (
              <tr className="text-center" key={index}>
                <td className="border p-2">{row.name}</td>
                <td className="border p-2">{row.code}</td>
                <td className="border p-2">{row.acronym}</td>
                <td className="border p-2">{row.credits}</td>
                <td className="border p-2">{row.totalStudents}</td>
                <td className="border p-2">{row.taStudentRatio}</td>
                <td className="border p-2">{row.taRequired}</td>
                <td className="border p-2">
                  <button
                    onClick={() => allocateCourse(row)}
                    className="bg-[#3dafaa] text-white px-4 py-2 rounded cursor-pointer font-bold"
                  >
                    Allocate
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {feedbackForm && <FeedbackList />}
    </div>
  );
};
export default ProfessorCourses;
