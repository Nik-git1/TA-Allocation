import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';

const FeedbackList = () => {
  const { user } = useContext(AuthContext);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editableFeedbackId, setEditableFeedbackId] = useState(null);

  useEffect(() => {
    fetchFeedbacks();
  }, [user]);

  const fetchFeedbacks = async () => {
    try {
      let response;
      if (user && user.role === 'professor') {
        response = await axios.get(`http://localhost:5001/api/feedback/professor/${user.id}`);
      } else {
        response = await axios.get(`http://localhost:5001/api/feedback/all`);
      }
      setFeedbacks(response.data.feedbacks);

      setLoading(false);
    } catch (error) {
      console.error("Error fetching feedbacks:", error);
      setLoading(false);
    }
  };

  const handleEditClick = (feedback) => {
    setEditableFeedbackId(feedback._id);
  };

  const handleSave = async (feedback, rating, description) => {
    if (user && user.role === 'admin') {

      return;
    }
    try {
      const response = await axios.put(`http://localhost:5001/api/feedback/${feedback._id}`, {
        rating,
        description
      });

      setEditableFeedbackId(null); // Resetting editableFeedbackId after saving
      // Update the feedbacks state to reflect changes
      setFeedbacks(prevFeedbacks => prevFeedbacks.map(item => item._id === feedback._id ? { ...item, rating, description } : item));
    } catch (error) {
      console.error("Error editing feedback:", error);
    }
  };

  return (
    <div className='flex flex-col items-center'>
      <h2 className="text-xl font-bold mb-4">Feedback List</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="overflow-auto max-w-[80vw] max-h-[82vh]">
          <table className="w-full table-auto border-collapse border">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">Professor</th>
                <th className="border p-2">Student ID</th>
                <th className="border p-2">Student Name</th>
                <th className="border p-2">Course</th>
                <th className="border p-2">Overall Grade</th>
                <th className="border p-2">Regularity in Meeting</th>
                <th className="border p-2">Attendance in Lectures</th>
                <th className="border p-2">Preparedness for Tutorials</th>
                <th className="border p-2">Timeliness of Tasks</th>
                <th className="border p-2">Quality of Work</th>
                <th className="border p-2">Attitude/Commitment</th>
                <th className="border p-2">Nominated for Best TA</th>
                <th className="border p-2">Comments</th>
                {!user || (user && user.role !== 'admin') && <th className="border p-2">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {feedbacks.length === 0 ? (
                <tr>
                  <td colSpan="12" className="border p-4 text-center">No feedbacks available.</td>
                </tr>
              ) : (
                feedbacks.map((feedback) => (
                  <tr key={feedback._id}>
                    <td className="border p-2">{feedback.professor.name}</td>
                    <td className="border p-2">{feedback.student.rollNo}</td>
                    <td className="border p-2">{feedback.student.name}</td>
                    <td className="border p-2">{feedback.course.name}</td>
                    <td className="border p-2">{feedback.overallGrade}</td>
                    <td className="border p-2">{feedback.regularityInMeeting}</td>
                    <td className="border p-2">{feedback.attendanceInLectures}</td>
                    <td className="border p-2">{feedback.preparednessForTutorials}</td>
                    <td className="border p-2">{feedback.timelinessOfTasks}</td>
                    <td className="border p-2">{feedback.qualityOfWork}</td>
                    <td className="border p-2">{feedback.attitudeCommitment}</td>
                    <td className="border p-2">{feedback.nominatedForBestTA ? 'Yes' : 'No'}</td>

                    <td className="border p-2">{feedback.comments}</td>


                    {!user || (user && user.role !== 'admin') && (
                      <td className="border p-2">
                        {editableFeedbackId === feedback._id ? (
                          <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline" onClick={() => handleSave(feedback, feedback.rating, feedback.description)}>Submit</button>
                        ) : (
                          <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline" onClick={() => handleEditClick(feedback)}>Edit</button>
                        )}
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default FeedbackList;
