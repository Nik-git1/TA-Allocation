import React, { useEffect, useState,useContext } from 'react';
import axios from 'axios';
import StudentContext from '../context/StudentContext';
const AdminLog = () => {
  const { logs } = useContext(StudentContext);
  const headers = ['Student ID', 'Student Name', 'Action', 'User', 'Timestamp', 'Course']

  const renderHeaderRow = () => {
    return (
      <tr className="bg-[#3dafaa] text-white">
        {
          headers.map((header, index) => (
            <th className="border p-2 text-center" key={index}>{header}</th>
          ))
        }
        {/* <th className="border p-2 text-center">Student ID</th>
        <th className="border p-2 text-center">Student Name</th>
        <th className="border p-2 text-center">Action</th>
        <th className="border p-2 text-center">User</th>
        <th className="border p-2 text-center">Timestamp</th>
        <th className="border p-2 text-center">Course</th> */}
      </tr>
    );
  };

  const renderLogRow = (logEntry, index) => (
    <tr className="text-center" key={index}>
      <td className="border p-2">{logEntry.student.rollNo}</td>
      <td className="border p-2">{logEntry.student.name}</td>
      <td className="border p-2">{logEntry.action}</td>
      <td className="border p-2">{logEntry.userRole}</td>
      <td className="border p-2">{new Date(logEntry.timestamp).toLocaleString()}</td>
      <td className="border p-2">{logEntry.course && logEntry.course.name}</td>
    </tr>
  );
  
  

  return (
    <div className="overflow-auto max-w-[83vw] max-h-[86vh] mt-4">
      <table className="w-full border-collapse border">
        <thead className="sticky top-0">{renderHeaderRow()}</thead>
        <tbody>
          {console.log(logs)}
          {logs.map((logEntry, index) =>
            renderLogRow(logEntry, index)
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdminLog;
