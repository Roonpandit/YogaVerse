import React, { useState, useEffect } from 'react';
import NavUser from './Nav-User';

function Classes() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [yogaTypes, setYogaTypes] = useState([]); // Main Yoga Types (e.g., Hatha Yoga)
  const [selectedYogaIndex, setSelectedYogaIndex] = useState(null);
  const [detailedPoses, setDetailedPoses] = useState([]); // Yoga Poses inside Yoga Type

  // Define category API endpoints
  const categoryEndpoints = {
    "All Yoga Poses": "https://projects-b8a50-default-rtdb.asia-southeast1.firebasedatabase.app/Yoga/classes/all-yoga-poses.json",
    "Difficulty Levels": "https://projects-b8a50-default-rtdb.asia-southeast1.firebasedatabase.app/Yoga/classes/yoga-levels.json",
    "Body Parts": "https://projects-b8a50-default-rtdb.asia-southeast1.firebasedatabase.app/Yoga/classes/body_parts_yoga.json",
    "Life Style": "https://projects-b8a50-default-rtdb.asia-southeast1.firebasedatabase.app/Yoga/classes/life-style-yoga.json"
  };

  // Fetch all categories
  useEffect(() => {
    setCategories(Object.keys(categoryEndpoints));
  }, []);

  // Fetch main yoga types when a category is selected
  const handleCategoryClick = async (category) => {
    setSelectedCategory(category);
    setSelectedYogaIndex(null); // Reset yoga type selection
    setDetailedPoses([]); // Reset detailed poses

    const response = await fetch(categoryEndpoints[category]);
    const data = await response.json();
    setYogaTypes(data || []);
  };

  // Toggle detailed poses when a yoga type is selected
  const handleYogaTypeClick = async (index) => {
    if (selectedYogaIndex === index) {
      // Hide poses if the same yoga type is clicked again
      setSelectedYogaIndex(null);
      setDetailedPoses([]);
    } else {
      // Fetch poses for the selected yoga type
      setSelectedYogaIndex(index);
      const response = await fetch(`https://projects-b8a50-default-rtdb.asia-southeast1.firebasedatabase.app/Yoga/classes/all-yoga-poses/${index}/scheduled.json`);
      const data = await response.json();
      setDetailedPoses(data || []);
    }
  };

  return (
    <div>
      <NavUser />
      <h1>Yoga Classes</h1>

      {/* Display Categories */}
      <div>
        {categories.map((category, index) => (
          <button key={index} onClick={() => handleCategoryClick(category)}>
            {category}
          </button>
        ))}
      </div>

      {/* Display Main Yoga Types (e.g., Hatha Yoga) */}
      {selectedCategory && (
        <div>
          <h2>{selectedCategory}</h2>
          {yogaTypes.map((yogaType, index) => (
            <div key={index} style={{ cursor: 'pointer', border: '1px solid #ccc', padding: '10px', margin: '10px' }}>
              <img src={yogaType.image} alt={yogaType.name} width="200" />
              <h3>{yogaType.name}</h3>
              <p><strong>Description:</strong> {yogaType.description}</p>
              <p><strong>Total Time:</strong> {yogaType.time_taken}</p>

              {/* "See All Yoga" Button (Toggles Poses) */}
              <button onClick={() => handleYogaTypeClick(index)}>
                {selectedYogaIndex === index ? "Hide Yoga Poses" : "See All Yoga"}
              </button>

              {/* Show Yoga Poses if this yoga type is selected */}
              {selectedYogaIndex === index && detailedPoses.length > 0 && (
                <div>
                  <h2>Yoga Poses for {yogaType.name}</h2>
                  {detailedPoses.map((pose, poseIndex) => (
                    <div key={poseIndex} style={{ border: '1px solid #ddd', padding: '10px', margin: '10px' }}>
                      <img src={pose.image} alt={pose.english_name} width="200" />
                      <h3>{pose.english_name} ({pose.sanskrit_name})</h3>
                      <p><strong>Category:</strong> {pose.category}</p>
                      <p><strong>Description:</strong> {pose.description}</p>
                      <p><strong>Benefits:</strong> {pose.benefits}</p>
                      <p><strong>Target:</strong> {pose.target}</p>
                      <p><strong>Time:</strong> {pose.time}</p>
                      <p><strong>Steps:</strong> {pose.steps}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Classes;