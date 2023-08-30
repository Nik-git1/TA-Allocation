import React from 'react';


const LeftDepartment = () => {
  return (
    <div className='sidebar bg-gray-300'>
      <img className='iiitd-img h-16 w-full relative pt-5' src='./images/iiitd_img.png' alt='not available'/>
      <h4 className='text-center mt-4'>CSE<br/>Department</h4>
      <button className='left-dpt-button mt-4'>
        Courses List
      </button>
      <button className='left-dpt-button mt-2'>
        Something-1
      </button>
      <button className='left-dpt-button mt-2 mb-2'>
        Something-2
      </button>
    </div>
  );
};

export default LeftDepartment;
