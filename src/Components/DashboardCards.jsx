import React from 'react'

const DashboardCardList = () => {
  const list = [
    {dept_name : "CSE",dept_admin_name:"Name",total_courses: 10,total_ta_needed: 100,total_ta_alloted: 72,ta_lef:28},
    {dept_name : "CB",dept_admin_name:"Name",total_courses: 10,total_ta_needed: 100,total_ta_alloted: 72,ta_lef:28},
    {dept_name : "MATHS",dept_admin_name:"Name",total_courses: 10,total_ta_needed: 100,total_ta_alloted: 72,ta_lef:28},
    {dept_name : "HCD",dept_admin_name:"Name",total_courses: 10,total_ta_needed: 100,total_ta_alloted: 72,ta_lef:28},
    {dept_name : "ECE",dept_admin_name:"Name",total_courses: 10,total_ta_needed: 100,total_ta_alloted: 72,ta_lef:28},
    {dept_name : "SSH",dept_admin_name:"Name",total_courses: 10,total_ta_needed: 100,total_ta_alloted: 72,ta_lef:28},

  ]

  return (

    <div className="grid lg:grid-cols-3 md:grid-cols-1 my-4 p-8 gap-6">
      {list.map((item, index)=>(
        <div key={index} className="w-[270px] h-[270px] border border-gray-300 hover:shadow-lg transition-transform transform hover:scale-105 rounded-lg flex flex-col">
          <div className="h-[100px] w-full bg-[#3dafaa] text-white p-4 flex-4 rounded-t-lg">
            <h1 className="py-1 block mt-1 leading-tight font-semibold text-xl text-white hover:underline">{item.dept_name} Deparment</h1>
            <h3 className="py-3 block mt-1 text-xs text-white font-normal hover:underline">{item.dept_admin_name}</h3>
          </div>
          
          <div className="p-3 py-4 flex-6 text-sm">
            <p className='mt-2 text-gray-700'>Number of Courses: {item.total_courses}</p>
            <p className='mt-2 text-gray-700'>Total TAs Needed: {item.total_ta_needed}</p>
            <p className='mt-2 text-gray-700'>Total TAs Alloted: {item.total_ta_alloted}</p>
            <p className='mt-2 text-gray-700'>TAs Left: {item.ta_lef}</p>
          </div>
        </div>
      ))}
    </div>
  )
}



export default DashboardCardList
