import React from 'react';
import { useLocation, Routes, Route } from 'react-router-dom';
import LoginPage from './Pages/LoginPage';
import AdminPage from './Pages/AdminPage';
import Department from './Pages/DepartmentPage';
import Professor from './Pages/ProfessorPage';
import Form from './Pages/Form';
import StudentState from './context/StudentState';
import CourseState from './context/CourseState';
import DepartmentState from './context/DepartmentState';
import AuthState from './context/AuthState';
import ProtectedRoute from './ProtectedRoutes';
import ProfState from './context/ProfState';
const App = () => {
  return (
    <AuthState>
      <ProfState>
      <StudentState>
        <CourseState>
          <DepartmentState>
            <Routes>
              <Route element={<LoginPage />} path="/" />
              <Route element={<Form />} path="/TaForm" />
              <Route
                element={
                  <ProtectedRoute
                    element={<AdminPage />}
                    allowedRoles={['admin']}
                  />
                }
                path="/admin/*"
              />
              <Route
                element={
                  <ProtectedRoute
                    element={<Department />}
                    allowedRoles={['jm','admin']}
                  />
                }
                path="/department/*"
              />
              <Route
                element={
                  <ProtectedRoute
                    element={<Professor />}
                    allowedRoles={['professor','jm','admin']}
                  />
                }
                path="/professor/*"
              />
            </Routes>
          </DepartmentState>
        </CourseState>
      </StudentState>
      </ProfState>
    </AuthState>
  );
};

export default App;