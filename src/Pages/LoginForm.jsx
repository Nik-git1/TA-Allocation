
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginForm = ({ loginOption }) => {
    const navigateTo = useNavigate();
  const [name, setName] = useState('');

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    navigateTo(`/${loginOption}`);
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Login as {loginOption}:</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={handleNameChange}
          className="border rounded-md p-2 mb-4"
          required
        />
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline-blue active:bg-blue-700"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
