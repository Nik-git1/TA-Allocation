import React from 'react';
import {AiOutlineSearch} from 'react-icons/ai'
import "../App.css"

const Tablestudents = (props) => {
  return (
    <div>
      <form className='w-[500px] relative mt-6 ml-3'>
        <div className='relative'>
          <input type="search" placeholder='Search Student..' className='w-full p-4 rounded-full h-10 border border-[#3dafaa] outline-none focus:border-[#3dafaa]' />
          <button className='absolute right-0 top-1/2 -translate-y-1/2 p-3 bg-[#3dafaa] rounded-full search-button'>
                <AiOutlineSearch />
          </button>
        </div>
      </form>
      <table className="w-full border-collapse border mt-4">
        <thead>
          <tr>
            <th colSpan={props.table_cols.length} className="bg-[#3dafaa] text-center font-bold p-2 text-white">
              {props.table_heading}
            </th>
          </tr>
          <tr className="bg-[#3dafaa] text-white">
            {props.table_cols.map((col, index) => (
              <th className='border p-2 text-center' key={index}>{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {props.table_rows.map((row, index) => (
            <tr className='text-center' key={index}>
              {row.map((data, ind) => (
                <td className='border p-2' key={ind}>{data}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>


  );
};

export default Tablestudents;
