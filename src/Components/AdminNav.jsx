import React from 'react';


const LeftDepartment = () => {
  return (
    <div className='bg-white h-screen w-auto'>
      <img className='h-16 w-full relative pt-5' src='./images/iiitd_img.png' alt='not available'/>
      <h4 className='text-center mt-4 font-bold'>CSE<br/>Department</h4>
      <div className='mt-4 flex flex-col'>
        <button className='mb-1 bg-[#3dafaa] h-16 hover:bg-[rgb(50,140,135)] focus:bg-[rgb(50,140,135)]'>Dash Board</button>        
        <button className='mb-1 bg-[#3dafaa] h-16 hover:bg-[rgb(50,140,135)] focus:bg-[rgb(50,140,135)]'>Student Lists</button>
        <button className='mb-1 bg-[#3dafaa] h-16 hover:bg-[rgb(50,140,135)] focus:bg-[rgb(50,140,135)]'>Rounds</button>
      </div>
      <div className='bg-[#3dafaa] h-full hover:bg-[rgb(50,140,135)]'></div>
    </div>
  );
};

export default LeftDepartment;
