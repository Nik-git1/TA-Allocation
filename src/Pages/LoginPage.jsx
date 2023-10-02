import React, { useState } from 'react';
import LoginForm from './LoginForm';

const LoginPage = () => {
  const [selectedOption, setSelectedOption] = useState('');

  const handleLoginOptionClick = (option) => {
    setSelectedOption(option);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md">
        <h1 className="text-2xl font-semibold mb-4">Login as:</h1>
        <div className="space-y-4">
          <button
            onClick={() => handleLoginOptionClick('admin')}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline-blue active:bg-blue-700"
          >
            Admin
          </button>
          <button
            onClick={() => handleLoginOptionClick('department')}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline-green active:bg-green-700"
          >
            Department
          </button>
          <button
            onClick={() => handleLoginOptionClick('professor')}
            className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline-yellow active:bg-yellow-700"
          >
            Professor
          </button>
          <button
            onClick={() => handleLoginOptionClick('student')}
            className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline-indigo active:bg-indigo-700"
          >
            Student
          </button>
        </div>
      </div>
      {selectedOption && <LoginForm loginOption={selectedOption} />}
    </div>
  );
};

export default LoginPage;
