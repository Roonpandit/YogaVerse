import React from "react";
import "./Challenges.css"

function ChallengeCard({ challenge }) {
  return (
    <div className="challenge-card">
      <div className="challenge-header">
        <div className="challenge-name">{challenge.name}</div>
        <div className="challenge-difficulty">
          Difficulty: {challenge.difficulty}
        </div>
      </div>
      <div className="challenge-description">{challenge.description}</div>
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
      <a href="#" className="join-button">
        Join Challenge
      </a>
    </div>
  );
}

function Challenges() {
  const challenges = [
    {
      name: "30-Day Flexibility",
      difficulty: "Medium",
      description:
        "Complete 30 flexibility-focused asanas in 30 days. Track your progress and rate each asana's difficulty.",
      progress: 40,
      completed: "12/30 days",
      participants: 16,
    },
    {
      name: "Balance Masters",
      difficulty: "Hard",
      description:
        "Master 15 balance poses with increasing difficulty levels. Share your progress and get feedback from the community.",
      progress: 20,
      completed: "3/15 poses",
      participants: 8,
    },
  ];

  return (
    <div className="challenges-container">
      {challenges.map((challenge, index) => (
        <ChallengeCard key={index} challenge={challenge} />
      ))}
    </div>
  );
}

export default Challenges;
