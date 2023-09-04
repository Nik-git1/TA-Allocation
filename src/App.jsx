import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'

import Course from './Pages/CourseView';
import Department from './Pages/Deptview';
import Main from './Pages/AdminStudentList'
let Header = [
  "s.no", "name", "department", "CGPA", "email-id", "batch",
  "pref-1", "pref-2", "pref-3", "pref-4", "pref-5", "pref-6", "pref-7","Allocation"];
let Row = ['1','John Wick','CSE','3','john@gmal.com','2024','P1','P2','P3','P4','P5','P6','P7',<button className='bg-[#3dafaa] text-white px-4 py-2 rounded cursor-pointer font-bold'>Allocate</button>]
function App() {
  return (
    <>
      {/* <Department header = {Header} row ={Row}/> */}
      <Main/>
    </>
  );
}

export default App
