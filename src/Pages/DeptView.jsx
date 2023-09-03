import React from "react";
import { AiOutlineSearch } from 'react-icons/ai';
import "../App.css";

const Department = (props) => {


  return (
    <div className="">
      <div className="mb-10 mt-4 text-center">
        <h1 className="text-[#3dafaa] text-3xl font-bold">CSE DEPARTMENT</h1>
      </div>
      <div className="flex justify-between ml-5 mr-20">
        <div className="flex">
          <h2 className="text-[#3dafaa] font-bold mr-1">Total Number of Courses:</h2>
          <h2>20</h2>
        </div>
        <div className="flex">
          <h2 className="text-[#3dafaa] font-bold ml-4 mr-1">Courses with incomplete allocation:</h2>
          <h2>20</h2>
        </div>
      </div>
      <div className="flex mb-3 ml-5">
        <h2 className="text-[#3dafaa] font-bold mr-1">Courses with complete Allocation:</h2>
        <h2>0</h2>
      </div>
      <div>
      <form className='w-[500px] relative ml-3'>
          <div className='relative'>
            <input
              type="search"
              placeholder='Search Course..'
              className='w-full p-4 rounded-full h-10 border border-[#3dafaa] outline-none focus:border-[#3dafaa]'
            />
            <button className='absolute right-0 top-1/2 -translate-y-1/2 p-3 bg-[#3dafaa] rounded-full search-button'>
              <AiOutlineSearch />
            </button>
          </div>
        </form>
      </div>
      <table className="w-full border-collapse border mt-4">
        <thead>
          <tr>
            <th colSpan={props.header.length} className="bg-[#3dafaa] text-center font-bold p-2 text-white sticky -top-10">
              Courses
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
  );
}

export default Department;
