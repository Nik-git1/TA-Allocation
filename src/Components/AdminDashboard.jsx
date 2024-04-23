import React, { useState, useEffect } from "react";
import DashboardCardList from "./DashboardCards"; // Import your DashboardCardList component
import axios from "axios";

const Dashboard = () => {
  const [currentRound, setCurrentRound] = useState(null);
  const [formOpened, setFormOpened] = useState(true);
  const [feedbackForm, setFeedbackForm] = useState(false)
  useEffect(() => {
    // Fetch the current round status from your backend when the component mounts
    getRound();
    getFeedbackFormStatus();
    axios
      .get("http://localhost:5001/api/form")
      .then((response) => {
        setFormOpened(response.data.state);
      })
      .catch((error) => {
        console.error("Error fetching courses:", error);
      });
  }, []);

  const getRound = () => {
    fetch("http://localhost:5001/api/rd/currentround")
      .then((response) => response.json())
      .then((data) => {
        setCurrentRound(data.currentRound);

      })
      .catch((error) => console.error("Error fetching round status: " + error));
  };

  const toggleRound = () => {
    if (currentRound !== null) {
      // If a round is ongoing, end it
      endCurrentRound();
    } else {
      // If no round is ongoing, start a new round
      startNewRound();
    }
  };

  const startNewRound = () => {
    // Send a POST request to start a new round
    fetch("http://localhost:5001/api/rd/startround", { method: "POST" })
      .then((response) => {
        if (response.status === 201) {
          return response.json();
        } if (response.status === 400) {
          alert('An ongoing round already exists.')
          return response.json();
        }
        else{
          alert('Internal server error')
          return response.json();
        }
      })
      .then((data) => {
        // Update the current round status with the new round number
        setCurrentRound(data.currentRound);
        getRound();
      })
      .catch((error) => { 
        console.error("Error starting a new round: " + error);
      });
  };

  const endCurrentRound = () => {
    // Send a POST request to end the current round
    fetch("http://localhost:5001/api/rd/endround", { method: "POST" })
      .then((response) => {
        if (response.status === 200){
          return response.json()
        }
        if (response.status === 400){
          alert('No ongoing round found')
          return response.json()
        }
        else {
          alert('Internal server error')
          return
        }
      })
      .then(() => {
        // Update the current round status to indicate no ongoing round
        setCurrentRound(null);
        getRound();
      })
      .catch((error) => {
        alert(error.message);
        console.error("Error ending the current round: " + error)
      });
  };

  const resetRounds = () => {
    // Send a POST request to reset rounds
    fetch("http://localhost:5001/api/rd/resetrounds", { method: "POST" })
      .then((response) => response.json())
      .then(() => {
        // Handle success (e.g., show a success message)

        setCurrentRound(null); // Reset current round information

        getRound();
      })
      .catch((error) => {
        // Handle errors (e.g., show an error message)
        console.error("Error resetting rounds: " + error);
      });
  };

  const startNewSemester = () => {
    // Send a DELETE request to start a new semester
    fetch("http://localhost:5001/api/rd/semester", { method: "DELETE" })
      .then((response) => response.json())
      .then(() => {
        // Handle success (e.g., show a success message)

        setCurrentRound(null); // Reset current round information

        getRound();
      })
      .catch((error) => {
        // Handle errors (e.g., show an error message)
        console.error("Error starting a new semester: " + error);
      });
  };

  const openForm = async () => {
    const response = await fetch(`http://localhost:5001/api/form/changeState`, { method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ state: true}) }); 
        // Reload the page after the form state is changed
        window.location.reload();
  }

  const closeForm = async () => {
    const response = await fetch(`http://localhost:5001/api/form/changeState`, { method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ state: false}) }); 
        // Reload the page after the form state is changed
        window.location.reload();
  }

  const startFeedback = () => {
    fetch("http://localhost:5001/api/feedback/start", { method: "GET" })
      .then((response) => {
        if (response.status === 200) {

          // Perform any necessary actions after successful feedback generation
          getFeedbackFormStatus(); // Update feedback form status after starting feedback
        } else {
          console.error("Failed to initiate feedback generation");
        }
      })
      .catch((error) => {
        console.error("Error initiating feedback generation:", error);
      });
  };
  
  const getFeedbackFormStatus = () => {
    axios
      .get("http://localhost:5001/api/feedback/status")
      .then((response) => {
        setFeedbackForm(response.data.active);
        // Log the updated feedback form status
      })
      .catch((error) => {
        console.error("Error fetching feedback form status:", error);
      });
  };
  
  const closeFeedbackForm = () => {
    axios
      .post("http://localhost:5001/api/feedback/end")
      .then((response) => {
        if (response.status === 200) {

          getFeedbackFormStatus();
          // Perform any necessary actions after successful closing of feedback form
        } else {
          console.error("Failed to close feedback form");
        }
      })
      .catch((error) => {
        console.error("Error closing feedback form:", error);
      });
  };
  

  return (
    <div>
      <div className="mb-4 space-x-4 flex">
        {formOpened ? (
          <button
            onClick={closeForm}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Close TA Form
          </button>
        ) : (
          <button
            onClick={openForm}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Open TA Form
          </button>
        )}
        <div className="font-bold text-2xl">
          {formOpened ? "Form is opened" : "Form is closed"}
        </div>
      </div>
  
      <div className="flex">
        <p className="font-bold text-2xl">Ongoing Round:</p>
        <p className="text-2xl ml-2">{currentRound === null ? 'No Round is going on' : currentRound}</p>
      </div>
  
      <div className="flex mt-3">
        <button
          onClick={toggleRound}
          className={currentRound === null ? "bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 mr-4 rounded focus:outline-none focus:shadow-outline w-32" : "w-32 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 mr-4 rounded focus:outline-none focus:shadow-outline"}
        >
          {currentRound === null ? "Start Round" : "End Round"}
        </button>
        <button
          onClick={resetRounds}
          className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 mr-4 rounded focus:outline-none focus:shadow-outline"
        >
          Reset Rounds
        </button>
        <button
          onClick={startNewSemester}
          disabled
          className="bg-black text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-4"
        >
          New Semester
        </button>
        {feedbackForm ? (
          <button
            onClick={closeFeedbackForm}
            className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-4"
          >
            End Feedback Form
          </button>
        ) : (
          <button
            onClick={startFeedback}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-4"
          >
            Start Feedback Form
          </button>
        )}
      </div>
  
      {/* Include your DashboardCardList component here */}
      <DashboardCardList />
    </div>
  );
  
  
};

export default Dashboard;
