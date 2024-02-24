import { useContext,useEffect, useState } from 'react';
import StudentContext from '../context/StudentContext'
import CourseContext from '../context/CourseContext'
import ProfContext from '../context/ProfContext';
import { useLocation } from 'react-router-dom';

const AdminNav = () => {
  // Define the function to handle file changes (you'll need to implement this function)
  
  let {getStudentsFromFile} =useContext(StudentContext)
  let {getCourseFromFile } = useContext(CourseContext)
  let {getProfessorFromFile} = useContext(ProfContext);
  const handleFileChange = (event) => {
    if(isCourseRoute){
      getCourseFromFile(event)
    }else if(isStudentRoute){
      getStudentsFromFile(event);
    }
    else if(isProfessor){
      getProfessorFromFile(event)
    }
  };
  const location = useLocation();
  const isCourseRoute = location.pathname === '/admin/course';
  const isAllocate = location.pathname === '/admin/allocate';
  const isDashboard = location.pathname === '/admin/dashboard';
  const isLogs = location.pathname === '/admin/log';
  const isDepartment = location.pathname === '/admin/department';
  const isStudentRoute = location.pathname === '/admin/';
  const isProfessor = location.pathname === '/admin/professors';
  
  const [title,setTitle] = useState('Eligible Students of Monsoon 2023');
  const [buttontext, setButtonText] = useState('Student');

  const updateButton = () => {
    if(isCourseRoute){
      setButtonText('Course');
    }
    else if(isStudentRoute){
      setButtonText('Student')
    }
    else if(isProfessor){
      setButtonText('Professor');
    }
  }

  const updateTitle = () => {
    if(isDepartment || isCourseRoute){
      setTitle("Available Courses");
    }
    else{
      setTitle("Eligible Students of Winter 2024");
    }
  }

  useEffect(() => {
    updateTitle();
    updateButton();
  }, [isAllocate,isCourseRoute,isProfessor]);

  const renderSearchBarAndUploadButton = () => {
    if (!isCourseRoute && !isStudentRoute && !isProfessor) {
      return null;
    } else {
      return (
        <div className="flex items-center justify-end mt-4">
          {/* CSE Department */}
          
          <div className='justify-between flex'>
            {/* Upload XLSX button */}
            <label className="bg-[#3dafaa] text-white px-4 py-2 rounded cursor-pointer font-bold">
              Upload {buttontext} XLSX
              <input
                type="file"
                accept=".xlsx"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>
          </div>
        </div>
      );
    }
  };
  

  return (
    <div className="bg-white flex justify-between">
      <div className="flex items-center">
        {/* Image */}
        <img className="h-16 relative pt-5" src="/images/iiitd_img.png" alt="not available" />

        {/* Text beside the image */}
        <div className="ml-2 flex items-center">
          <h3 className="font-bold text-center">{title}</h3>
        </div>
      </div>

      {/* Second row */}
      <div className='mr-6'>
        {renderSearchBarAndUploadButton()}
      </div>
    </div>
  );
};

export default AdminNav;