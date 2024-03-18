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
    setEditableFeedbackId(feedback.id);
  };

  const handleSave = async (feedback, rating, description) => {
    if (user && user.role === 'admin') {
      console.log("Admin cannot edit feedback");
      return;
    }
    try {
      const response = await axios.put(`http://localhost:5001/api/feedback/${feedback._id}`, {
        rating,
        description
      });
      console.log(response.data.message);
      setEditableFeedbackId(null); // Resetting editableFeedbackId after saving
      // Update the feedbacks state to reflect changes
      setFeedbacks(prevFeedbacks => prevFeedbacks.map(item => item.id === feedback.id ? { ...item, rating, description } : item));
    } catch (error) {
      console.error("Error editing feedback:", error);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Feedback List</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="overflow-auto max-w-full">
          <table className="w-full table-auto border-collapse border">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">Professor</th>
                <th className="border p-2">Student ID</th>
                <th className="border p-2">Student</th>
                <th className="border p-2">Course</th>
                <th className="border p-2">Rating</th>
                <th className="border p-2">Comments</th>
                {!user || (user && user.role !== 'admin') && <th className="border p-2">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {feedbacks.length === 0 ? (
                <tr>
                  <td colSpan="4" className="border p-4 text-center">No feedbacks available.</td>
                </tr>
              ) : (
                feedbacks.map((feedback) => (
                  <tr key={feedback.id}>
                    <td className="border p-2">{feedback.professor.name}</td>
                    <td className="border p-2">{feedback.student.rollNo}</td>
                    <td className="border p-2">{feedback.student.name}</td>
                    <td className="border p-2">{feedback.course.name}</td>
                    <td className="border p-2">
                      {editableFeedbackId === feedback.id ? (
                        <input
                          type="number"
                          className="w-20 p-1 border rounded"
                          value={feedback.rating}
                          onChange={(e) => setFeedbacks(prevFeedbacks => prevFeedbacks.map(item => item.id === feedback.id ? { ...item, rating: e.target.value } : item))}
                        />
                      ) : (
                        feedback.rating
                      )}
                    </td>
                    <td className="border p-2">
                      {editableFeedbackId === feedback.id ? (
                        <input
                          type="text"
                          className="w-full p-1 border rounded"
                          value={feedback.description}
                          onChange={(e) => setFeedbacks(prevFeedbacks => prevFeedbacks.map(item => item.id === feedback.id ? { ...item, description: e.target.value } : item))}
                        />
                      ) : (
                        feedback.description
                      )}
                    </td>
                    {!user || (user && user.role !== 'admin') && (
                      <td className="border p-2">
                        {editableFeedbackId === feedback.id ? (
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
