import React from 'react';
import { Link } from 'react-router-dom';

const SideBar = () => {
  return (
    <div className='bg-[#3dafaa] h-screen text-center max-w-[95%] mt-4'>
      <div className='flex flex-col'>
        <Link to="/admin/dashboard" className='bg-[#3dafaa] p-2 h-16 hover:bg-[rgb(50,140,135)] focus:bg-[rgb(50,140,135)] text-white font-bold'>
          Dashboard
        </Link>
        <hr className='border-t-2' />
        <Link to="/admin/" className='bg-[#3dafaa] h-16 p-2 hover:bg-[rgb(50,140,135)] focus:bg-[rgb(50,140,135)] text-white font-bold'>
          Student Lists
        </Link>
        <hr className='border-t-2' />
        <Link to="/admin/course" className='bg-[#3dafaa] p-2 h-16 hover:bg-[rgb(50,140,135)] focus:bg-[rgb(50,140,135)] text-white font-bold'>
          Course Lists
        </Link>
        <hr className='border-t-2' />
        {/* <Link to="/admin/department" className='bg-[#3dafaa] p-2 h-16 hover:bg-[rgb(50,140,135)] focus:bg-[rgb(50,140,135)] text-white font-bold'>
          Allocate
        </Link>
        <hr className='border-t-2' /> */}
        {/* <Link to="/admin/log" className='bg-[#3dafaa] p-2 h-16 hover:bg-[rgb(50,140,135)] focus:bg-[rgb(50,140,135)] text-white font-bold'>
          Logs
        </Link>
        <hr className='border-t-2' /> */}
        <Link to="/admin/professors" className='bg-[#3dafaa] p-2 h-16 hover:bg-[rgb(50,140,135)] focus:bg-[rgb(50,140,135)] text-white font-bold'>
          Professor Lists
        </Link>
        <hr className='border-t-2' />
        <Link to="/admin/jms" className='bg-[#3dafaa] p-2 h-16 hover:bg-[rgb(50,140,135)] focus:bg-[rgb(50,140,135)] text-white font-bold'>
          JMs Lists
        </Link>
        <hr className='border-t-2' />


      </div>
    </div>
  );
};

export default SideBar;
