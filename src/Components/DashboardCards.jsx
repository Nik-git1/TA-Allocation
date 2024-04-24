import React, { useContext } from "react";
import CourseContext from "../context/CourseContext";

const DashboardCardList = () => {
  const { courses } = useContext(CourseContext);

  // Check if courses is undefined or empty
  if (!courses || courses.length === 0) {
    return <div className="font-bold text-3xl my-2">No courses available</div>;
  }

  const initialDepartmentData = {
    CSE: { count: 0, taRequired: 0, taAllocated: 0 },
    CB: { count: 0, taRequired: 0, taAllocated: 0 },
    MATHS: { count: 0, taRequired: 0, taAllocated: 0 },
    HCD: { count: 0, taRequired: 0, taAllocated: 0 },
    ECE: { count: 0, taRequired: 0, taAllocated: 0 },
    SSH: { count: 0, taRequired: 0, taAllocated: 0 },
  };

  const departmentData = courses.reduce(
    (acc, course) => {
      const department = course.department;

      if (initialDepartmentData.hasOwnProperty(department)) {
        acc[department].count += 1;
        acc[department].taRequired += course.taRequired || 0;

        // Ensure course.taAllocated is an array before accessing its length
        acc[department].taAllocated += Array.isArray(course.taAllocated)
          ? course.taAllocated.length
          : 0;
      }

      return acc;
    },
    { ...initialDepartmentData }
  );

  const departmentList = Object.keys(initialDepartmentData);

  return (
    <div className="grid lg:grid-cols-3 md:grid-cols-1 my-4 p-8 gap-6 max-h-[80vh] overflow-auto">
      {departmentList.map((department, index) => (
        <div
          key={index}
          className="w-[270px] h-[270px] border border-gray-300 hover:shadow-lg transition-transform transform hover:scale-105 rounded-lg flex flex-col"
        >
          <div className="h-[100px] w-full bg-[#3dafaa] text-white p-4 flex-4 rounded-t-lg">
            <h1 className="py-1 block mt-1 leading-tight font-semibold text-xl text-white hover:underline">
              {department} Department
            </h1>
            {/* Add department admin name or any other details as needed */}
            <h3 className="py-3 block mt-1 text-xs text-white font-normal hover:underline">
              Department Admin
            </h3>
          </div>

          <div className="p-3 py-4 flex-6 text-sm">
            <p className="mt-2 text-gray-700">
              Number of Courses: {departmentData[department].count}
            </p>
            <p className="mt-2 text-gray-700">
              Total TAs Needed: {departmentData[department].taRequired}
            </p>
            <p className="mt-2 text-gray-700">
              Total TAs Allocated: {departmentData[department].taAllocated}
            </p>
            {/* Add other department-specific details here */}
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardCardList;
