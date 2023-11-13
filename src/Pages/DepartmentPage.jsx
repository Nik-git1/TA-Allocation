import React from "react";
import Allocate from "../Components/AdminAllocate";
import {
  useLocation,
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import CoursePage from "../Components/CoursePage";
const Department = () => {
  return (
    <>
      <Routes>
        <Route element={<Allocate />} path="/"></Route>
        <Route element={<CoursePage />} path="/:courseName" />
      </Routes>
    </>
  );
};

export default Department;
