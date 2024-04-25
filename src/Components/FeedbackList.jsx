import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import AuthContext from '../context/AuthContext';

const FeedbackList = () => {
  const { user } = useContext(AuthContext);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editableFeedbackId, setEditableFeedbackId] = useState(null);
  const [editedFeedback, setEditedFeedback] = useState({});

  const API = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchFeedbacks();
  }, [user]);

  const fetchFeedbacks = async () => {
    try {
      let response;
      if (user && user.role === 'professor') {
        response = await axios.get(`${API}/api/feedback/professor/${user.id}`);
      } else {
        response = await axios.get(`${API}/api/feedback/all`);
      }
      setFeedbacks(response.data.feedbacks);
      setLoading(false);
      console.log(feedbacks)
    } catch (error) {
      console.error("Error fetching feedbacks:", error);
      setLoading(false);
    }
  };

  const handleEditClick = (feedback) => {
    setEditedFeedback(feedback);
    setEditableFeedbackId(feedback._id);
  };

  const handleSave = async (feedback) => {
    try {
      const response = await axios.put(`${API}/api/feedback/${feedback._id}`, {
        overallGrade: editedFeedback.overallGrade,
        regularityInMeeting: editedFeedback.regularityInMeeting,
        attendanceInLectures: editedFeedback.attendanceInLectures,
        preparednessForTutorials: editedFeedback.preparednessForTutorials,
        timelinessOfTasks: editedFeedback.timelinessOfTasks,
        qualityOfWork: editedFeedback.qualityOfWork,
        attitudeCommitment: editedFeedback.attitudeCommitment,
        nominatedForBestTA: editedFeedback.nominatedForBestTA,
        comments: editedFeedback.comments
      });
      setEditableFeedbackId(null); // Resetting editableFeedbackId after saving
      fetchFeedbacks();
    } catch (error) {
      console.error("Error editing feedback:", error);
    }
  };

  const handleChange = (e, key) => {
    const value = e.target.value;
    setEditedFeedback(prevState => ({
      ...prevState,
      [key]: value
    }));
  };

  return (
    <div className='flex flex-col items-center'>
      <h2 className="text-xl font-bold mb-4">Feedback List</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className={`overflow-auto ${user && user.role !== 'admin' ? `max-w-full max-h-[82vh]` : `max-w-[80vw] max-h-[52vh]`} `}>
          <table className="w-full table-auto border-collapse border">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">Professor</th>
                <th className="border p-2">Student Roll No.</th>
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
                    <td className="border p-2">
                      {
                        feedback.professor.name
                      }
                    </td>
                    <td className="border p-2">
                        {feedback.student.rollNo}
                    </td>
                    <td className="border p-2">{feedback.student.name}</td>
                    <td className="border p-2">{feedback.course === null ? null : feedback.course.name}</td>
                    <td className="border p-2">
                      {editableFeedbackId === feedback._id ? (
                        <select value={editedFeedback.overallGrade} onChange={(e) => handleChange(e, 'overallGrade')}>
                          <option value="S">S</option>
                          <option value="X">X</option>
                        </select>
                      ) : (
                        feedback.overallGrade
                      )}
                    </td>
                    <td className="border p-2">
                      {editableFeedbackId === feedback._id ? (
                        <select value={editedFeedback.regularityInMeeting} onChange={(e) => handleChange(e, 'regularityInMeeting')}>
                          <option value="Average">Average</option>
                          <option value="Excellent">Excellent</option>
                          <option value="Very Good">Very Good</option>
                          <option value="Good">Good</option>
                          <option value="Below Average">Below Average</option>
                        </select>
                      ) : (
                        feedback.regularityInMeeting
                      )}
                    </td>
                    <td className="border p-2">

                      {editableFeedbackId === feedback._id ? (
                        <select value={editedFeedback.attendanceInLectures} onChange={(e) => handleChange(e, 'attendanceInLectures')}>
                          <option value="Average">Average</option>
                          <option value="Excellent">Excellent</option>
                          <option value="Very Good">Very Good</option>
                          <option value="Good">Good</option>
                          <option value="Below Average">Below Average</option>
                        </select>
                      ) : (
                        feedback.attendanceInLectures
                      )}
              
                    </td>
                    <td className="border p-2">
                      {editableFeedbackId === feedback._id ? (
                        <select value={editedFeedback.preparednessForTutorials} onChange={(e) => handleChange(e, 'preparednessForTutorials')}>
                          <option value="Average">Average</option>
                          <option value="Excellent">Excellent</option>
                          <option value="Very Good">Very Good</option>
                          <option value="Good">Good</option>
                          <option value="Below Average">Below Average</option>
                        </select>
                      ) : (
                        feedback.preparednessForTutorials
                      )}

                    </td>
                    <td className="border p-2">
                      {editableFeedbackId === feedback._id ? (
                        <select value={editedFeedback.timelinessOfTasks} onChange={(e) => handleChange(e, 'timelinessOfTasks')}>
                          <option value="Average">Average</option>
                          <option value="Excellent">Excellent</option>
                          <option value="Very Good">Very Good</option>
                          <option value="Good">Good</option>
                          <option value="Below Average">Below Average</option>
                        </select>
                      ) : (
                        feedback.timelinessOfTasks
                      )}
                    </td>
                    <td className="border p-2">
                      {editableFeedbackId === feedback._id ? (
                        <select value={editedFeedback.qualityOfWork} onChange={(e) => handleChange(e, 'qualityOfWork')}>
                          <option value="Average">Average</option>
                          <option value="Excellent">Excellent</option>
                          <option value="Very Good">Very Good</option>
                          <option value="Good">Good</option>
                          <option value="Below Average">Below Average</option>
                        </select>
                      ) : (
                        feedback.qualityOfWork
                      )}
                    
                    </td>
                    <td className="border p-2">
                      {editableFeedbackId === feedback._id ? (
                        <select value={editedFeedback.attitudeCommitment} onChange={(e) => handleChange(e, 'attitudeCommitment')}>
                          <option value="Average">Average</option>
                          <option value="Excellent">Excellent</option>
                          <option value="Very Good">Very Good</option>
                          <option value="Good">Good</option>
                          <option value="Below Average">Below Average</option>
                        </select>
                      ) : (
                        feedback.attitudeCommitment
                      )}
                      
                    </td>
                    <td className="border p-2">
                      {editableFeedbackId === feedback._id ? (
                        <select value={editedFeedback.nominatedForBestTA} onChange={(e) => handleChange(e, 'nominatedForBestTA')}>
                          <option value={false}>No</option>
                          <option value={true}>Yes</option>
                        </select>
                      ) : (
                        feedback.nominatedForBestTA ? 'Yes' : 'No'
                      )}
                      
                    </td>
                    <td className="border p-2">
                      {editableFeedbackId === feedback._id ? (
                        <input
                          type="text"
                          value={editedFeedback.comments}
                          onChange={(e) => handleChange(e, 'comments')}
                          className="border rounded px-2 py-1"
                        />
                      ) : (
                        feedback.comments
                      )}
                    </td>
                    {!user || (user && user.role !== 'admin') && (
                      <td className="border p-2">
                        {editableFeedbackId === feedback._id ? (
                          <div className='flex'>
                            <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline mr-1" onClick={() => handleSave(feedback)}>Submit</button>
                            <button className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline" onClick={() => setEditableFeedbackId(null)}>Cancel</button>
                          </div>
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
