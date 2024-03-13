import React from "react";
import CoursePage from "../Components/CoursePage";
import {
  useLocation,
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import ProfessorCourses from "./ProfessorCourses";
import FeedbackList from "../Components/FeedbackList";
const ProfessorPage = () => {
  return (
    <Routes>
      <Route element={<ProfessorCourses />} path="/"></Route>
      <Route element={<CoursePage />} path="/:courseName" />
      
    </Routes>
  );
};

export default ProfessorPage;
