import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';

const FeedbackList = () => {
  const { user } = useContext(AuthContext);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

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
      console.log(feedbacks)
      setLoading(false);
    } catch (error) {
      console.error("Error fetching feedbacks:", error);
      setLoading(false);
    }
  };

  const handleEdit = async (id, rating, description) => {
    if (user && user.role === 'admin') {
      console.log("Admin cannot edit feedback");
      return;
    }
    try {
      const response = await axios.put(`http://localhost:5001/api/feedback/${id}`, {
        rating,
        description
      });
      console.log(response.data.message);
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
                <th className="border p-2">Professor </th>
                <th className="border p-2">Student ID</th>
                <th className="border p-2">Student  </th>
                <th className="border p-2">Course </th>
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
                      {user && user.role !== 'admin' ? (
                        <input
                          type="number"
                          className="w-20 p-1 border rounded"
                          value={feedback.rating}
                          onChange={(e) => handleEdit(feedback.id, e.target.value, feedback.description)}
                        />
                      ) : (
                        feedback.rating
                      )}
                    </td>
                    <td className="border p-2">
                      {user && user.role !== 'admin' ? (
                        <input
                          type="text"
                          className="w-full p-1 border rounded"
                          value={feedback.description}
                          onChange={(e) => handleEdit(feedback.id, feedback.rating, e.target.value)}
                        />
                      ) : (
                        feedback.description
                      )}
                    </td>
                    {!user || (user && user.role !== 'admin') && (
                      <td className="border p-2">
                        <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline" onClick={() => handleEdit(feedback.id, feedback.rating, feedback.description)}>Save</button>
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
