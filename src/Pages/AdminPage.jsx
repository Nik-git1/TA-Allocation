import React from 'react';
import AdminNav from '../Components/AdminNavbar';
import SideBar from '../Components/Sidebar';
import AdminStudent from '../Components/AdminStudent';
import AdminCourse from '../Components/AdminCourse';
import Footer from '../Components/footer';
import { useLocation , BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Department from '../Components/DeptView';
import CoursePage from '../Components/coursePage'; // Import the CoursePage component

const AdminPage = () => {
  return (
    <div className=''>
      <AdminNav />
      <div className="flex">
        <div className="w-1/6 min-w-[300px] z-10">
          <SideBar />
        </div>
        <div className="flex-1">
          <Routes>
            <Route element={<AdminStudent />} path='/' />
            <Route element={<AdminCourse />} path='/course' />
            <Route element={<Department />} path='/allocate' />
            <Route element={<CoursePage />} path='/course/:courseName' /> {/* Add the dynamic route */}
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
