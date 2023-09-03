import React from 'react';
import { Link } from 'react-router-dom';

const SideBar = () => {
  return (
    <div className='bg-[#3dafaa] h-screen w-auto sticky top-28 overflow-x-auto'>
      <div className='bg-white h-4'></div>
      <div className='flex flex-col'>
        <Link to="/dashboard" className='bg-[#3dafaa]   p-2 h-16 hover:bg-[rgb(50,140,135)] focus:bg-[rgb(50,140,135)] text-white font-bold'>
          Dashboard
        </Link>
        <hr className='border-t-2' />
        <Link to="/" className='bg-[#3dafaa] h-16 p-2 hover:bg-[rgb(50,140,135)] focus:bg-[rgb(50,140,135)] text-white font-bold'>
          Student Lists
        </Link>
        <hr className='border-t-2' />
        <Link to="/course" className='bg-[#3dafaa] p-2 h-16 hover:bg-[rgb(50,140,135)] focus:bg-[rgb(50,140,135)] text-white font-bold'>
          Course Lists
        </Link>
        <hr className='border-t-2' />
        <Link to="/allocate" className='bg-[#3dafaa] p-2 h-16 hover:bg-[rgb(50,140,135)] focus:bg-[rgb(50,140,135)] text-white font-bold'>
          Allocate
        </Link>
        <hr className='border-t-2' />
      </div>
    </div>
  );
};

export default SideBar;