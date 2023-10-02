import React from "react";
import Allocate from "../Components/AdminAllocate";
import {
  useLocation,
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import CoursePage from '../Components/CoursePage';
const Department = () => {
  return (
    <>
      <Allocate />
      <Routes>
      <Route element={<CoursePage />} path="/department/course/:courseName" />

      </Routes>
    </>
  );
};

export default Department;
