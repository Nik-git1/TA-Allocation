import React, { useContext, useEffect, useState } from 'react';
import StudentContext from '../context/StudentContext';

const AdminLog = () => {
  const { log } = useContext(StudentContext);
  const [logData, setLogData] = useState(log); // Store log data in local state

  // Update local state when log data changes
  useEffect(() => {
    setLogData(log);
  }, [log]);

  // Define the header row for the log table
  const renderHeaderRow = () => {
    return (
      <tr className="bg-[#3dafaa] text-white">
        <th className="border p-2 text-center">Student ID</th>
        <th className="border p-2 text-center">Student Name</th>
        <th className="border p-2 text-center">Action</th>
        <th className="border p-2 text-center">User</th>
        <th className="border p-2 text-center">Timestamp</th>
        <th className="border p-2 text-center">Course</th>
      </tr>
    );
  };

  const renderLogRow = (logEntry, index) => (
    <tr className="text-center" key={index}>
      <td className="border p-2">{logEntry.id}</td>
      <td className="border p-2">{logEntry.studentName}</td>
      <td className="border p-2">{logEntry.action}</td>
      <td className="border p-2">{logEntry.user}</td>
      <td className="border p-2">{logEntry.timestamp}</td>
      <td className="border p-2">{logEntry.courseName}</td>
    </tr>
  );

  return (
    <div className="overflow-auto max-w-[83vw] max-h-[1000px] mt-4">
      <table className="w-full border-collapse border">
        <thead className="sticky top-0">{renderHeaderRow()}</thead>
        <tbody>
          {logData.map((logEntry, index) =>
            renderLogRow(logEntry, index) // Use logData to render log entries
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdminLog;
