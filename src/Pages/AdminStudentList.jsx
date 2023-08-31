import React from 'react';
import LeftDepartment from '../Components/AdminNav';
import RightDepartment from './RightDepartment';

const Main = () => {
  return (
    <div>
      <div className='grid grid-cols-1 md:grid-cols-7 h-screen'>
        <div className='md:col-span-1'>
          <LeftDepartment />
        </div>
        <div className='md:col-span-6 mt-6'>
          <RightDepartment />
        </div>
      </div>
    </div>
  );
}

export default Main;
