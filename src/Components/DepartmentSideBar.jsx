import React from 'react'

const DepartmentSideBar = () => {

    const API = import.meta.env.VITE_API_URL;

    const handleLogout = () => {
        localStorage.removeItem("token");
        window.location.replace(API);
    };
    return (
        <div className="bg-[#3dafaa] h-screen text-center max-w-[95%] mt-4">
            <div className="flex flex-col">
                <Link
                to="/admin/"
                className="bg-[#3dafaa] p-2 h-16 hover:bg-[rgb(50,140,135)] focus:bg-[rgb(50,140,135)] text-white font-bold"
                >
                Dashboard
                </Link>
                <hr className="border-t-2" />
                <Link
                to="/admin/student"
                className="bg-[#3dafaa] h-16 p-2 hover:bg-[rgb(50,140,135)] focus:bg-[rgb(50,140,135)] text-white font-bold"
                >
                Students
                </Link>
                <hr className="border-t-2" />
                <Link
                to="/admin/course"
                className="bg-[#3dafaa] p-2 h-16 hover:bg-[rgb(50,140,135)] focus:bg-[rgb(50,140,135)] text-white font-bold"
                >
                Courses
                </Link>
                <hr className="border-t-2" />
                <Link
                to="/admin/department"
                className="bg-[#3dafaa] p-2 h-16 hover:bg-[rgb(50,140,135)] focus:bg-[rgb(50,140,135)] text-white font-bold"
                >
                Allocate
                </Link>
                <hr className="border-t-2" />
                <Link
                to="/admin/professors"
                className="bg-[#3dafaa] p-2 h-16 hover:bg-[rgb(50,140,135)] focus:bg-[rgb(50,140,135)] text-white font-bold"
                >
                Faculty
                </Link>
                {/* <hr className='border-t-2' />
                <Link to="/admin/jms" className='bg-[#3dafaa] p-2 h-16 hover:bg-[rgb(50,140,135)] focus:bg-[rgb(50,140,135)] text-white font-bold'>
                Departments
                </Link> */}
                <hr className="border-t-2" />
                <Link
                to="/admin/logs"
                className="bg-[#3dafaa] p-2 h-16 hover:bg-[rgb(50,140,135)] focus:bg-[rgb(50,140,135)] text-white font-bold"
                >
                Logs
                </Link>
                <hr className="border-t-2" />
                <Link
                to="/admin/feedback"
                className="bg-[#3dafaa] p-2 h-16 hover:bg-[rgb(50,140,135)] focus:bg-[rgb(50,140,135)] text-white font-bold"
                >
                Feedback
                </Link>
                <hr className="border-t-2" />
                <button
                className="bg-[#3dafaa] p-2 h-16 hover:bg-[rgb(50,140,135)] focus:bg-[rgb(50,140,135)] text-white font-bold"
                onClick={handleLogout}
                >
                Logout
                </button>
                <hr className="border-t-2" />
            </div>
        </div>
    )
}

export default DepartmentSideBar
