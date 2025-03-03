import React from "react";
import NavUser from "./Nav-User";
import "./Groups.css"
function AsanaItem({ difficulty, name, user }) {
  return (
    <div className="asana-item">
      <span className={`asana-difficulty difficulty-${difficulty}`}>
        {difficulty}
      </span>
      <span className="asana-name">{name}</span>
      <span className="asana-user">by {user}</span>
    </div>
  );
}

function GroupCard({ group, type }) {
  return (
    <>
      <div className="group-card">
        <div className="group-header">
          <div className="group-name">{group.name}</div>
          <div className="group-members">{group.members} members</div>
        </div>
        <div className="group-activity">
          {group.activities.map((activity, index) => (
            <AsanaItem
              key={index}
              difficulty={activity.difficulty}
              name={activity.name}
              user={activity.user}
            />
          ))}
        </div>
        {type === "active" ? (
          <a href="#" className="view-more">
            View All Activity
          </a>
        ) : (
          <a href="#" className="join-button">
            Join Group
          </a>
        )}
      </div>
    </>
  );
}

function Groups({ type }) {
  const activeGroups = [
    {
      name: "Morning Yogis",
      members: 18,
      activities: [
        { difficulty: 3, name: "Warrior III", user: "Maya J." },
        { difficulty: 4, name: "Crow Pose", user: "Alex S." },
      ],
    },
    {
      name: "Flexibility Masters",
      members: 12,
      activities: [
        { difficulty: 5, name: "Full Split", user: "Raj K." },
        { difficulty: 4, name: "King Pigeon", user: "Sarah L." },
      ],
    },
    {
      name: "Mindful Flow",
      members: 24,
      activities: [
        { difficulty: 2, name: "Tree Pose", user: "David W." },
        { difficulty: 3, name: "Half Moon", user: "Kira T." },
      ],
    },
  ];

  const popularGroups = [
    {
      name: "Advanced Yogis",
      members: 42,
      activities: [{ difficulty: 5, name: "Peacock Pose", user: "Elena R." }],
    },
    {
      name: "Beginner Friendly",
      members: 78,
      activities: [{ difficulty: 1, name: "Mountain Pose", user: "Sam T." }],
    },
  ];

  const groups = type === "active" ? activeGroups : popularGroups;

  return (
    <div className="groups-container">
      {groups.map((group, index) => (
        <GroupCard key={index} group={group} type={type} />
      ))}
    </div>
  );
}

export default Groups;
