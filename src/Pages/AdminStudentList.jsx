import React from 'react'
import "../App.css"
import LeftDepartment from '../Components/AdminNav'
import RightDepartment from './RightDepartment'


const Main = () => {
  return (
    <div>
      <div className='grid-container'>
        <div className='column left-container-dpt'>
            <LeftDepartment/>
        </div>
        <div className='column right-container-dpt'>
            <RightDepartment/>
        </div>    
      </div>
    </div>
  )
}

export default Main
