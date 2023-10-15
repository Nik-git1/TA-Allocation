import React, { useState, useEffect } from "react";
import DashboardCardList from "./DashboardCards"; // Import your DashboardCardList component

const Dashboard = () => {
  const [currentRound, setCurrentRound] = useState(null);

  useEffect(() => {
    // Fetch the current round status from your backend when the component mounts
    getRound();
  }, []);

  const getRound = () => {
    fetch("http://localhost:5001/api/rd/currentround")
      .then((response) => response.json())
      .then((data) => {
        setCurrentRound(data.currentRound);
        console.log(currentRound);
      })
      .catch((error) => console.error("Error fetching round status: " + error));
  };

  const startNewRound = () => {
    // Send a POST request to start a new round
    fetch("http://localhost:5001/api/rd/startround", { method: "POST" })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        // Update the current round status with the new round number
        setCurrentRound(data.currentRound);
        getRound();
      })
      .catch((error) => console.error("Error starting a new round: " + error));
  };

  const endCurrentRound = () => {
    // Send a POST request to end the current round
    fetch("http://localhost:5001/api/rd/endround", { method: "POST" })
      .then((response) => response.json())
      .then(() => {
        // Update the current round status to indicate no ongoing round
        setCurrentRound(null);
        getRound();
      })
      .catch((error) =>
        console.error("Error ending the current round: " + error)
      );
  };

  const resetRounds = () => {
    // Send a POST request to reset rounds
    fetch("http://localhost:5001/api/rd/resetrounds", { method: "POST" })
      .then((response) => response.json())
      .then(() => {
        // Handle success (e.g., show a success message)
        console.log("All rounds have been reset.");
        setCurrentRound(null); // Reset current round information

        getRound();
      })
      .catch((error) => {
        // Handle errors (e.g., show an error message)
        console.error("Error resetting rounds: " + error);
      });
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">
        Current Round:{" "}
        {currentRound !== null ? currentRound : "No round is ongoing"}
      </h2>
      <div className="mb-4 space-x-4">
        <button
          onClick={startNewRound}
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Start Round
        </button>
        <button
          onClick={endCurrentRound}
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          End Round
        </button>
        <button
          onClick={resetRounds}
          className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Reset Rounds
        </button>
      </div>

      {/* Include your DashboardCardList component here */}
      <DashboardCardList />
    </div>
  );
};

export default Dashboard;
