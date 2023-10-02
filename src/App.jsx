import React from "react";
import {
  useLocation,
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import LoginPage from "./Pages/LoginPage";
import AdminPage from "./Pages/AdminPage";
import Department from "./Pages/DepartmentPage";
import Student from "./Pages/Student";
import Professor from "./Pages/ProfessorPage";

import StudentState from "./context/StudentState";
import CourseState from "./context/CourseState";
import DepartmentState from "./context/DepartmentState";

const App = () => {
  return (
    <StudentState>
      <CourseState>
        <DepartmentState>
          <Routes>
            <Route element={<AdminPage />} path="/admin/*"></Route>
            <Route element={<Department />} path="/department/*"></Route>
            <Route element={<Student />} path="/student/*"></Route>
            <Route element={<Professor />} path="/professor/*"></Route>
            <Route element={<LoginPage />} path="/"></Route>
          </Routes>
        </DepartmentState>
      </CourseState>
    </StudentState>
  );
};

export default App;
