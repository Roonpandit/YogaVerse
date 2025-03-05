import React, { useState, useEffect } from "react";
import NavUser from "./Nav-User";
import "./Classes.css";

function Classes() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [yogaTypes, setYogaTypes] = useState([]);
  const [selectedYogaIndex, setSelectedYogaIndex] = useState(null);
  const [detailedPoses, setDetailedPoses] = useState([]);
  const [selectedPose, setSelectedPose] = useState(null); // For Modal

  const categoryEndpoints = {
    "All Yoga Poses":
      "https://projects-b8a50-default-rtdb.asia-southeast1.firebasedatabase.app/Yoga/classes/all-yoga-poses.json",
    "Difficulty Levels":
      "https://projects-b8a50-default-rtdb.asia-southeast1.firebasedatabase.app/Yoga/classes/yoga-levels.json",
    "Body Parts":
      "https://projects-b8a50-default-rtdb.asia-southeast1.firebasedatabase.app/Yoga/classes/body_parts_yoga.json",
    "Life Style":
      "https://projects-b8a50-default-rtdb.asia-southeast1.firebasedatabase.app/Yoga/classes/life-style-yoga.json",
  };

  useEffect(() => {
    setCategories(Object.keys(categoryEndpoints));
  }, []);

  const handleCategoryClick = async (category) => {
    setSelectedCategory(category);
    setSelectedYogaIndex(null);
    setDetailedPoses([]);

    const response = await fetch(categoryEndpoints[category]);
    const data = await response.json();
    setYogaTypes(data || []);
  };

  const handleYogaTypeClick = async (index) => {
    if (selectedYogaIndex === index) {
      setSelectedYogaIndex(null);
      setDetailedPoses([]);
    } else {
      setSelectedYogaIndex(index);
      const response = await fetch(
        `https://projects-b8a50-default-rtdb.asia-southeast1.firebasedatabase.app/Yoga/classes/all-yoga-poses/${index}/scheduled.json`
      );
      const data = await response.json();
      setDetailedPoses(data || []);
    }
  };

  return (
    <div className="classes">
      <NavUser />
      <h1 className="title">Yoga Classes</h1>

      <div className="category-container">
        {categories.map((category, index) => (
          <button
            key={index}
            className="category-button"
            onClick={() => handleCategoryClick(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {selectedCategory && (
        <div className="yoga-types">
          <h2 className="category-title">{selectedCategory}</h2>
          {yogaTypes.map((yogaType, index) => (
            <div key={index} className="yoga-type-card">
              <img
                src={yogaType.image}
                alt={yogaType.name}
                className="yoga-image"
              />
              <h3>{yogaType.name}</h3>
              <p>
                <strong>Description:</strong> {yogaType.description}
              </p>
              <p>
                <strong>Total Time:</strong> {yogaType.time_taken}
              </p>

              <button
                className="toggle-button"
                onClick={() => handleYogaTypeClick(index)}
              >
                {selectedYogaIndex === index
                  ? "Hide Yoga Poses"
                  : "See All Yoga"}
              </button>
              {selectedYogaIndex === index && detailedPoses.length > 0 && (
                <div>
                  <h2 className="pose-title">Yoga Poses for {yogaType.name}</h2>
                  <div className="pose-container">
                    {detailedPoses.map((pose, poseIndex) => (
                      <div key={poseIndex} className="pose-card">
                        <h3>
                          {pose.english_name} ({pose.sanskrit_name})
                        </h3>
                        <button
                          className="details-button"
                          onClick={() => setSelectedPose(pose)}
                        >
                          See Details
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Modal Popup for Pose Details */}
      {selectedPose && (
        <div className="modal">
          <div className="modal-content">
            <span
              className="close-button"
              onClick={() => setSelectedPose(null)}
            >
              &times;
            </span>
            <h2>
              {selectedPose.english_name} ({selectedPose.sanskrit_name})
            </h2>
            <img
              src={selectedPose.image}
              alt={selectedPose.english_name}
              className="modal-image"
            />
            <p>
              <strong> Total Time:</strong> {selectedPose.time}
            </p>
            <p>
              <strong>Category:</strong> {selectedPose.category}
            </p>
            <p>
              <strong>Description:</strong> {selectedPose.description}
            </p>
            <p>
              <strong>Benefits:</strong> {selectedPose.benefits}
            </p>
            <p>
              <strong>Target:</strong> {selectedPose.target}
            </p>
            <p>
              <strong>Steps:</strong> {selectedPose.steps}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Classes;
