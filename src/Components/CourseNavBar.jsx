import React from 'react';


const CourseNavBar = () => {
  return (
    <div className='bg-[#3dafaa] h-screen w-auto'>
      <div className='bg-white'>
        <img className='h-16 w-full relative pt-5' src='./images/iiitd_img.png' alt='not available'/>
        <h4 className='text-center mt-4 font-bold'>CSE<br/>Department</h4>
      </div>
      <div className='bg-white h-4'></div>
      <div className='flex flex-col'>
        <button className='bg-[#3dafaa] h-16 hover:bg-[rgb(50,140,135)] focus:bg-[rgb(50,140,135)] text-white font-bold'>Unallocated Students</button>        
        <hr className='border-t-2'/>
        <button className='bg-[#3dafaa] h-16 hover:bg-[rgb(50,140,135)] focus:bg-[rgb(50,140,135)] text-white font-bold'>Allocated Students for this Course</button>
        <hr className='border-t-2'/>
      </div>
    </div>
  );
};

export default CourseNavBar;
