import React from "react";

export default function Test() {

  return (
    <div className="h-screen w-full flex justify-center items-center relative">
      <img
        src="./images/iiitdrndblock2.jpeg"
        className="h-full w-auto object-contain filter blur-sm absolute inset-0"
        alt="Sample image"
      />
      <div className="place-content-center relative z-10 flex flex-col justify-center">
        <form className='max-w-[700px] w-full mx-auto bg-white p-8 px-8 rounded-lg'>
          <h2 className='text-4x1 text-black font-bold text-center'>SIGN IN</h2>
          <div className='flex flex-col text-black py-2'>
            <label>Email Id</label>
            <input className='w-[260px] text-black rounded-lg bg-white mt-2 p-2 border-2 border-gray-500 focus:bg-gray-200 focus:outline-none' type="email" />
          </div>
          <div className='flex flex-col text-black py-2'>
            <label>Password</label>
            <input className='text-black rounded-lg bg-white mt-2 p-2 border-2 border-gray-500 focus:bg-gray-200 focus:outline-none' type="password" />
          </div>
          <div className='flex justify-between text-gray-600 py-2'>
            <p>Forgot Password</p>
          </div>
          <button 
          type="submit"
          className='w-full my-5 py-2 bg-[#3dafaa] shadow-lg shadow-[#3dafaa]/50 hover:shadow-[#3dafaa]/40 text-white font-semibold rounded-lg'>Sign In</button>
        </form>
      </div>
    </div>
  );
}
