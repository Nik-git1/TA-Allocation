import React, { useState,useContext } from "react";
import CourseContext from '../context/CourseContext';

const Form = () => {
  const [program, setProgram] = useState({
   btech_3rd: false,
   btech_4th: false,
  });
  const { course, setCourse } = useContext(CourseContext);
  console.log(course);
  const handleProgramChange = (e) => {
    const { name, checked } = e.target;

    // If one checkbox is checked, uncheck the other one
    if (name === "btech_3rd" && checked) {
      setProgram({
       btech_3rd: true,
       btech_4th: false,
      });
    } else if (name === "btech_4th" && checked) {
      setProgram({
       btech_3rd: false,
       btech_4th: true,
      });
    } else {
      setProgram({
        ...program,
        [name]: checked,
      });
    }
  };

  return (
    <div className="h-screen flex flex-col items-center">
      {/* <img
        src="./images/iiitdrndblock2.jpeg"
        className="h-full w-auto object-contain filter blur-sm absolute inset-0"
        alt="Sample image"
      /> */}
      <style>
        {`
          body {
            background-image: url(${"./images/iiitdrndblock2.jpeg"});
            background-size: cover;
            background-position: center;
            background-repeat:no-repeat;
            background-attachment: fixed;
            backdrop-filter: blur(4px);
          }
        `}
      </style>
      <div className="bg-white rounded mt-6 flex flex-col items-center z-10 overflow-auto max-h-screen">
        <h2 className="font-bold text-[#3dafaa] text-xl mx-6 mt-4 sticky top-0">TA Preference Form</h2>
        <form className="mb-2 mx-2 w-[300px] overflow-auto max-h-screen">
          <div className="flex flex-col text-black py-1">
            <label className="font-bold">Email Id</label>
            <input
              className="text-black rounded-lg bg-white mt-2 p-1 border-2 border-gray-500 focus:bg-gray-200 focus:outline-none"
              type="email"
            />
          </div>
          <div className="flex flex-col text-black py-1">
            <label className="font-bold">Name</label>
            <input
              className="text-black rounded-lg bg-white mt-2 p-1 border-2 border-gray-500 focus:bg-gray-200 focus:outline-none"
              type="text"
            />
          </div>
          <div className="flex flex-col text-black py-1">
            <label className="font-bold">Roll no.</label>
            <input
              className="text-black rounded-lg bg-white mt-2 p-1 border-2 border-gray-500 focus:bg-gray-200 focus:outline-none"
              type="number"
            />
          </div>
          <div className="flex flex-col text-black py-1">
            <label className="font-bold">Department</label>
            <select
              className="text-black rounded-lg bg-white mt-2 p-1 border-2 border-gray-500 focus:bg-gray-200 focus:outline-none"
            >
              <option value="Math">Math</option>
              <option value="CSE">CSE</option>
              <option value="ECE">ECE</option>
              <option value="HCD">HCD</option>
              <option value="CB">CB</option>
              <option value="SSH">SSH</option>
            </select>
          </div>
          <div className="flex flex-col text-black py-1">
            <label className="font-bold">Current CGPA</label>
            <input
              className="text-black rounded-lg bg-white mt-2 p-1 border-2 border-gray-500 focus:bg-gray-200 focus:outline-none"
              type="number"
            />
          </div>
          <div className="flex flex-col text-black py-1">
            <label className="font-bold">Program</label>
          </div>
          <div className="mt-1">
            <label className="">
              <input
                type="checkbox"
                name="btech_3rd"
                checked={program.btech_3rd}
                onChange={handleProgramChange}
              />
              B.Tech. 3rd Year
            </label>
          </div>
          <div>
            <label>
              <input
                type="checkbox"
                name="btech_4th"
                checked={program.btech_4th}
                onChange={handleProgramChange}
              />
              B.Tech. 4th Year
            </label>
          </div>
          <div className="flex flex-col text-black py-2">
            <label className="font-bold">TA Type</label>
            <select
              className="text-black rounded-lg bg-white mt-2 p-1 border-2 border-gray-500 focus:bg-gray-200 focus:outline-none"
            >
              <option value="Math">Credit Basis</option>
              <option value="CSE">Paid Basis</option>
              <option value="ECE">Voluntary</option>
            </select>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Form;
