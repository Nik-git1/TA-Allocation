import React from "react";
import { AiOutlineSearch } from 'react-icons/ai';
import "../App.css";

import CourseNavBar from "../Components/CourseNavBar";
const Course = (props) => {

    return(
        <div>
            <div className='grid grid-cols-1 md:grid-cols-7 h-screen'>
                <div className='md:col-span-1'>
                     <CourseNavBar/>
                </div>
                <div className='md:col-span-6 mt-6'>
                    <div className="mb-10 text-center">
                        <h1 className="text-[#3dafaa] text-2xl font-bold">Course Name</h1>
                    </div>
                    <div className="flex justify-between items-center mx-2">
                        <div>
                            <button className="rounded-full border border-[#3dafaa] text-[#3dafaa] px-5 focus:bg-[#3dafaa] focus:text-white hover:bg-[#3dafaa] hover:text-white mr-2">
                                UG
                            </button>
                            <button className="rounded-full border border-[#3dafaa] text-[#3dafaa] px-5 focus:bg-[#3dafaa] focus:text-white hover:bg-[#3dafaa] hover:text-white">
                                PG
                            </button>
                        </div>
                        <form className='w-[500px] relative'>
                            <div className='relative'>
                                <input
                                type="search"
                                placeholder='Search Student...'
                                className='w-full p-4 rounded-full h-10 border border-[#3dafaa] outline-none focus:border-[#3dafaa]'
                                />
                                <button className='absolute right-0 top-1/2 -translate-y-1/2 p-3 bg-[#3dafaa] rounded-full search-button'>
                                <AiOutlineSearch />
                                </button>
                            </div>
                        </form>
                    </div>
                    <table className="w-full border-collapse border mt-2">
                        <thead>
                        <tr>
                            <th colSpan={props.header.length} className="bg-[#3dafaa] text-center font-bold p-2 text-white sticky -top-10">
                            UG STUDENTS
                            </th>
                        </tr>
                        {props.header.length > 0 && (
                            <tr className="bg-[#3dafaa] text-white">
                            {props.header.map((col, index) => (
                                <th className='border p-2 text-center' key={index}>{col}</th>
                            ))}
                            </tr>
                        )}
                        </thead>
                        <tbody>
                        {props.row.map((row, index) => (
                            <tr className='text-center' key={index}>
                            {props.row.map((data, ind) => (
                                <td className='border p-2' key={ind}>{data}</td>
                            ))}
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default Course;