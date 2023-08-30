import React from 'react';


const Tablestudents = (props) => {
  return (
    <div>
      <table className="w-full border-collapse border mt-8">
        <thead>
          <tr>
            <th colSpan={props.table_cols.length} className="bg-gray-300 text-center font-bold p-2">
              {props.table_heading}
            </th>
          </tr>
          <tr className="bg-gray-300">
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
