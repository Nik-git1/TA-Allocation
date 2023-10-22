// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const FormComponent = () => {
//   const [formData, setFormData] = useState({
//     name: "",
//     emailId: "",
//     rollNo: "",
//     program: "",
//     department: "",
//     taType: "",
//     cgpa: "",
//     departmentPreferences: [
//       { course: "", grade: "" },
//       { course: "", grade: "" },
//     ],
//     nonDepartmentPreferences: [
//       { course: "", grade: "" },
//       { course: "", grade: "" },
//       { course: "", grade: "" },
//       { course: "", grade: "" },
//       { course: "", grade: "" },
//     ],
//     nonPreferences: ["", "", ""],
//   });

//   const [courses, setCourses] = useState([]);
  
//   useEffect(() => {
//     // Fetch course data from the backend API
//     axios.get("http://localhost:5001/api/course")
//       .then(response => {
//         setCourses(response.data);
//       })
//       .catch(error => {
//         console.error("Error fetching courses:", error);
//       // });
//   }, []);

//   const handleChange = (event, index, section) => {
//     const { name, value } = event.target;
//     const updatedFormData = { ...formData };

//     if (section === 'departmentPreferences' || section === 'nonDepartmentPreferences') {
//       updatedFormData[section][index][name] = value;
//     } else {
//       updatedFormData[name] = value;
//     }

//     setFormData(updatedFormData);
//   };

//   const handleSubmit = (event) => {
//     event.preventDefault();
//     // Add code to submit the form data to your backend here
//   };

//   return (
//     <div className="container mx-auto p-4">
//       <form onSubmit={handleSubmit}>
//         <div className="mb-4">
//           <label htmlFor="name">Name</label>
//           <input
//             type="text"
//             name="name"
//             value={formData.name}
//             onChange={(e) => handleChange(e, null, null)}
//             className="p-2 border rounded-md"
//           />
//         </div>
        
//         {/* Add more form fields for other inputs using a similar structure */}
        
//         {/* Course preferences */}
//         <div className="mb-4">
//           <label>Department Preferences</label>
//           {formData.departmentPreferences.map((preference, index) => (
//             <div key={index}>
//               <select
//                 name="course"
//                 value={preference.course}
//                 onChange={(e) => handleChange(e, index, 'departmentPreferences')}
//                 className="p-2 border rounded-md"
//               >
//                 <option value="">Select a course</option>
//                 {courses.map((course) => (
//                   <option key={course.id} value={course.name}>
//                     {course.name}
//                   </option>
//                 )}
//               </select>
//               <input
//                 type="text"
//                 name="grade"
//                 value={preference.grade}
//                 onChange={(e) => handleChange(e, index, 'departmentPreferences')}
//                 className="p-2 border rounded-md"
//               />
//             </div>
//           ))}
//         </div>
        
//         {/* Non-department preferences */}
//         <div className="mb-4">
//           <label>Non-Department Preferences</label>
//           {formData.nonDepartmentPreferences.map((preference, index) => (
//             <div key={index}>
//               <select
//                 name="course"
//                 value={preference.course}
//                 onChange={(e) => handleChange(e, index, 'nonDepartmentPreferences')}
//                 className="p-2 border rounded-md"
//               >
//                 <option value="">Select a course</option>
//                 {courses.map((course) => (
//                   <option key={course.id} value={course.name}>
//                     {course.name}
//                   </option>
//                 )}
//               </select>
//               <input
//                 type="text"
//                 name="grade"
//                 value={preference.grade}
//                 onChange={(e) => handleChange(e, index, 'nonDepartmentPreferences')}
//                 className="p-2 border rounded-md"
//               />
//             </div>
//           ))}
//         </div>
        
//         {/* Add more form fields for non-preferences using a similar structure */}
        
//         <button type="submit" className="bg-blue-500 text-white p-2 rounded-md">
//           Submit
//         </button>
//       </form>
//     </div>
//   );
// };

// export default FormComponent;
