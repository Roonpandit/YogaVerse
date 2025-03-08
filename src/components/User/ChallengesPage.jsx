import React, { useState } from "react";
import Challenges from "./Challenges";
import NavUser from "./Nav-User";
import "./ChallengesPage.css";

function ChallengesPage() {
  const [activeTab, setActiveTab] = useState("active");

  const userChallenges = [
    {
      name: "30-Day Flexibility",
      difficulty: "Medium",
      description:
        "Complete 30 flexibility-focused asanas in 30 days. Track your progress and rate each asana's difficulty.",
      progress: 40,
      completed: "12/30 days",
      participants: 16,
    },
  ];

  const completedChallenges = [
    {
      name: "Morning Routine",
      difficulty: "Easy",
      description:
        "Complete a 10-minute morning yoga routine for 14 consecutive days.",
      progress: 100,
      completed: "14/14 days",
      participants: 32,
      completedDate: "April 10, 2025",
    },
  ];

  return (
    <>
      <NavUser />
      <main className="main-2">
        <h1 className="page-title">Challenges</h1>

        <div className="challenges-tabs">
          <button
            className={`tab-button ${activeTab === "active" ? "active" : ""}`}
            onClick={() => setActiveTab("active")}
          >
            My Active Challenges
          </button>
          <button
            className={`tab-button ${
              activeTab === "completed" ? "active" : ""
            }`}
            onClick={() => setActiveTab("completed")}
          >
            Completed Challenges
          </button>
          <button
            className={`tab-button ${activeTab === "discover" ? "active" : ""}`}
            onClick={() => setActiveTab("discover")}
          >
            Discover Challenges
          </button>
        </div>

        {activeTab === "active" && (
          <div className="active-challenges">
            <h2 className="section-title">Your Active Challenges</h2>
            <div className="challenges-container">
              {userChallenges.map((challenge, index) => (
                <div className="challenge-card" key={index}>
                  <div className="challenge-header">
                    <div className="challenge-name">{challenge.name}</div>
                    <div className="challenge-difficulty">
                      Difficulty: {challenge.difficulty}
                    </div>
                  </div>
                  <div className="challenge-description">
                    {challenge.description}
                  </div>
                  <div className="challenge-progress">
                    <div
                      className="progress-bar"
                      style={{ width: `${challenge.progress}%` }}
                    ></div>
                  </div>
                  <div className="challenge-stats">
                    <div>{challenge.completed}</div>
                    <div>{challenge.participants} participants</div>
                  </div>
                  <a href="#" className="view-more">
                    View Details
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "completed" && (
          <div className="completed-challenges">
            <h2 className="section-title">Your Completed Challenges</h2>
            <div className="challenges-container">
              {completedChallenges.map((challenge, index) => (
                <div className="challenge-card" key={index}>
                  <div className="challenge-header">
                    <div className="challenge-name">{challenge.name}</div>
                    <div className="challenge-difficulty">
                      Difficulty: {challenge.difficulty}
                    </div>
                  </div>
                  <div className="challenge-description">
                    {challenge.description}
                  </div>
                  <div className="challenge-progress">
                    <div
                      className="progress-bar"
                      style={{ width: `${challenge.progress}%` }}
                    ></div>
                  </div>
                  <div className="challenge-stats">
                    <div>Completed on {challenge.completedDate}</div>
                    <div>{challenge.participants} participants</div>
                  </div>
                  <div className="challenge-badge">
                    <span className="badge-icon">🏆</span>
                    <span>Challenge Completed!</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "discover" && (
          <div className="discover-challenges">
            <h2 className="section-title">Discover New Challenges</h2>
            <Challenges />
          </div>
        )}

        <div className="create-challenge-section">
          <h2 className="section-title">Create Your Own Challenge</h2>
          <form className="create-challenge-form">
            <div className="form-group">
              <label htmlFor="challenge-name">Challenge Name</label>
              <input
                type="text"
                id="challenge-name"
                placeholder="Enter a name for your challenge"
              />
            </div>
            <div className="form-group">
              <label htmlFor="challenge-description">Description</label>
              <textarea
                id="challenge-description"
                placeholder="Describe your challenge"
              ></textarea>
            </div>
            <div className="form-group">
              <label htmlFor="challenge-difficulty">Difficulty</label>
              <select id="challenge-difficulty">
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="challenge-duration">Duration (days)</label>
              <input
                type="number"
                id="challenge-duration"
                min="1"
                max="90"
                defaultValue="30"
              />
            </div>
            <button type="submit" className="create-button">
              Create Challenge
            </button>
          </form>
        </div>
      </main>
    </>
  );
}

export default ChallengesPage;
