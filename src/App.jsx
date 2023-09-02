import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'

import Main from './Pages/AdminStudentList';
import Department from './Pages/Deptview';
let Header = ['S.No.', 'Course Name', 'Course Code', 'Prof Name', 'Semester', 'TA Required', 'TA Allocated','Allocate']
let Row = ['1','AP','CSE325','Arnav','3','25','10',<button className='bg-[#3dafaa] text-white px-4 py-2 rounded cursor-pointer font-bold'>Allocate</button>]
function App() {
  return (
    <>
   <Department header = {Header} row = {Row}/>
    </>
  );
}

export default App
