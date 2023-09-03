import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';

import Course from './Pages/CourseView';
import Department from './Components/DeptView';
import Admin from './Pages/AdminPage';

import StudentState from './context/StudentState';
import CourseState from './context/CourseState';
import DepartmentState from './context/DepartmentState';

function App() {
 
  return (
    <>
    <DepartmentState>
      <CourseState>
        <StudentState>
          {/* <Department header={Header} row={Row} /> */}
          {/* <Course header={Header} row={Row} /> */}
          <Admin />
        </StudentState>
      </CourseState>
      </DepartmentState>
    </>
  );
}

export default App;
