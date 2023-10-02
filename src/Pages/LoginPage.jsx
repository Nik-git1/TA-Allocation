import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const LoginPage = () => {
  const [selectedOption, setSelectedOption] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // Initialize the navigate function

  const handleLoginOptionClick = (option) => {
    setSelectedOption(option);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Check if email and password are filled and a login option is selected
    if (email && password && selectedOption) {
      // Navigate to the selected option's URL
      navigate(`/${selectedOption}`);
    } else {
      alert("Please select an option, and fill in both email and password fields.");
    }
  };

  return (
    <div className="h-screen w-full flex justify-center items-center relative">
      <img
        src="./images/iiitdrndblock2.jpeg"
        className="h-full w-auto object-contain filter blur-sm absolute inset-0"
        alt="Sample image"
      />
      <div className="place-content-center relative z-10 flex flex-col justify-center">
        <form
          className="max-w-[700px] w-full mx-auto bg-white p-8 px-8 rounded-lg"
          onSubmit={handleSubmit}
        >
          <h2 className="text-4xl text-black font-bold text-center">SIGN IN</h2>
          <div className="flex-auto">
            <button
              className={`px-4 py-2 rounded-full cursor-pointer border ${
                selectedOption === 'admin' ? 'bg-[#3dafaa] text-white' : 'border-[#3dafaa] hover:bg-[#3dafaa] hover:text-white'
              } outline-none focus:border-[#3dafaa]`}
              onClick={() => handleLoginOptionClick('admin')}
            >
              Admin
            </button>
            <button
              className={`px-4 py-2 rounded-full cursor-pointer border ${
                selectedOption === 'department' ? 'bg-[#3dafaa] text-white' : 'border-[#3dafaa] hover:bg-[#3dafaa] hover:text-white mx-1'
              } outline-none focus:border-[#3dafaa]`}
              onClick={() => handleLoginOptionClick('department')}
            >
              Department
            </button>
            <button
              className={`px-4 py-2 rounded-full cursor-pointer border ${
                selectedOption === 'professor' ? 'bg-[#3dafaa] text-white' : 'border-[#3dafaa] hover:bg-[#3dafaa] hover:text-white'
              } outline-none focus:border-[#3dafaa]`}
              onClick={() => handleLoginOptionClick('professor')}
            >
              Professor
            </button>
          </div>
          <div className="flex flex-col text-black py-2">
            <label>Email Id</label>
            <input
              className="text-black rounded-lg bg-white mt-2 p-2 border-2 border-gray-500 focus:bg-gray-200 focus:outline-none"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="flex flex-col text-black py-2">
            <label>Password</label>
            <input
              className="text-black rounded-lg bg-white mt-2 p-2 border-2 border-gray-500 focus:bg-gray-200 focus:outline-none"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="flex justify-between text-gray-600 py-2">
            <p>Forgot Password</p>
          </div>
          <button
            type="submit"
            className="w-full my-5 py-2 bg-[#3dafaa] shadow-lg shadow-[#3dafaa]/50 hover:shadow-[#3dafaa]/40 text-white font-semibold rounded-lg"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
