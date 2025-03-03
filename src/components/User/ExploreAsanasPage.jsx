import React, { useState } from "react";
import NavUser from "./Nav-User";
import "./ExploreAsanasPage.css"
function AsanaCard({ asana }) {
  return (
    <div className="asana-card">
      <div className="asana-header">
        <h3 className="asana-title">{asana.name}</h3>
        <span className={`asana-difficulty difficulty-${asana.difficulty}`}>
          {asana.difficulty}
        </span>
      </div>
      <div className="asana-description">{asana.description}</div>
      <div className="asana-benefits">
        <h4>Benefits:</h4>
        <ul>
          {asana.benefits.map((benefit, index) => (
            <li key={index}>{benefit}</li>
          ))}
        </ul>
      </div>
      <div className="asana-actions">
        <button className="log-button">Log Practice</button>
        <button className="save-button">Save</button>
      </div>
    </div>
  );
}

function ExploreAsanasPage() {
  const [filterDifficulty, setFilterDifficulty] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const asanas = [
    {
      name: "Downward-Facing Dog (Adho Mukha Svanasana)",
      difficulty: 2,
      description:
        "A common pose in many yoga sequences that stretches and strengthens the entire body.",
      benefits: [
        "Strengthens arms and legs",
        "Stretches shoulders, hamstrings, and calves",
        "Energizes the body",
      ],
    },
    {
      name: "Warrior I (Virabhadrasana I)",
      difficulty: 2,
      description:
        "A standing pose that strengthens the legs and opens the hips and chest.",
      benefits: [
        "Strengthens legs and core",
        "Opens hips and chest",
        "Improves focus and balance",
      ],
    },
    {
      name: "Tree Pose (Vrikshasana)",
      difficulty: 2,
      description: "A standing balance pose that improves focus and stability.",
      benefits: [
        "Improves balance",
        "Strengthens legs and core",
        "Enhances focus and concentration",
      ],
    },
    {
      name: "Crow Pose (Bakasana)",
      difficulty: 4,
      description:
        "An arm balance that builds strength in the arms, wrists, and core.",
      benefits: [
        "Strengthens arms and wrists",
        "Builds core strength",
        "Improves balance and focus",
      ],
    },
    {
      name: "Headstand (Sirsasana)",
      difficulty: 5,
      description:
        "An advanced inversion that requires strength, balance, and proper alignment.",
      benefits: [
        "Strengthens shoulders and core",
        "Improves circulation",
        "Builds confidence",
      ],
    },
    {
      name: "Lotus Pose (Padmasana)",
      difficulty: 3,
      description:
        "A seated meditation pose that requires open hips and flexibility in the knees.",
      benefits: [
        "Opens hips",
        "Stretches knees and ankles",
        "Creates a stable base for meditation",
      ],
    },
  ];

  const filteredAsanas = asanas.filter((asana) => {
    const matchesDifficulty =
      filterDifficulty === "all" ||
      asana.difficulty === parseInt(filterDifficulty);
    const matchesSearch = asana.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesDifficulty && matchesSearch;
  });

  return (
    <>
      <NavUser />
      <div className="Aasan">
        <h1 className="page-title">Explore Asanas</h1>

        <div className="asana-filters">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search asanas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="filter-container">
            <label htmlFor="difficulty-filter">Difficulty:</label>
            <select
              id="difficulty-filter"
              value={filterDifficulty}
              onChange={(e) => setFilterDifficulty(e.target.value)}
            >
              <option value="all">All Levels</option>
              <option value="1">Level 1 - Beginner</option>
              <option value="2">Level 2 - Easy</option>
              <option value="3">Level 3 - Intermediate</option>
              <option value="4">Level 4 - Advanced</option>
              <option value="5">Level 5 - Expert</option>
            </select>
          </div>
        </div>

        <div className="asanas-container">
          {filteredAsanas.map((asana, index) => (
            <AsanaCard key={index} asana={asana} />
          ))}
        </div>
      </div>
    </>
  );
}

export default ExploreAsanasPage;
