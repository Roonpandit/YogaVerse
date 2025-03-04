import React, { useEffect, useState } from "react";
import { auth } from "../Login/firebase/firebase-config";
import "./Aasan.css";
import NavAdmin from "./Nav-Admin";

function Aasan() {
  const [poses, setPoses] = useState([]);
  const [filteredPoses, setFilteredPoses] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPose, setSelectedPose] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newPose, setNewPose] = useState({
    english_name: "",
    sanskrit_name: "",
    sanskrit_name_adapted: "",
    translation_name: "",
    pose_description: "",
    pose_benefits: "",
    url_png: "",
  });

  const posesPerPage = 10;

  useEffect(() => {
    fetch(
      "https://projects-b8a50-default-rtdb.asia-southeast1.firebasedatabase.app/Yoga/aasan.json"
    )
      .then((response) => response.json())
      .then((data) => {
        if (data && typeof data === "object") {
          const posesArray = Object.values(data);
          setPoses(posesArray);
          setFilteredPoses(posesArray);
          setCurrentPage(1);
        }
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  useEffect(() => {
    const filtered = poses.filter(
      (pose) =>
        pose.sanskrit_name_adapted
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        pose.english_name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredPoses(filtered);
    setCurrentPage(1);
  }, [searchQuery, poses]);

  const totalPages = Math.ceil(filteredPoses.length / posesPerPage) || 1;

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [filteredPoses, totalPages, currentPage]);

  const indexOfLastPose = currentPage * posesPerPage;
  const indexOfFirstPose = indexOfLastPose - posesPerPage;
  const currentPoses = filteredPoses.slice(indexOfFirstPose, indexOfLastPose);

  const handleAddPose = () => {
    // Check if all required fields are filled
    if (
      !newPose.english_name ||
      !newPose.sanskrit_name ||
      !newPose.sanskrit_name_adapted ||
      !newPose.translation_name ||
      !newPose.pose_description ||
      !newPose.pose_benefits ||
      !newPose.url_png
    ) {
      alert("All fields are required!");
      return;
    }

    // Check if selectedPose exists (this would mean we are updating an existing pose)
    if (selectedPose) {
      console.log("Attempting to update pose:", selectedPose);

      // Find the pose by the english_name in the local state to update it
      const existingPose = poses.find(
        (pose) =>
          pose.english_name.toLowerCase() === newPose.english_name.toLowerCase()
      );

      if (existingPose) {
        console.log("Found existing pose to update:", existingPose);

        // Update the existing pose using its ID in the database
        fetch(
          `https://projects-b8a50-default-rtdb.asia-southeast1.firebasedatabase.app/Yoga/aasan/${existingPose.id}.json`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(newPose), // Update data with the newPose
          }
        )
          .then((response) => {
            if (!response.ok) {
              throw new Error("Failed to update pose in database");
            }
            return response.json();
          })
          .then(() => {
            console.log("Pose successfully updated in database");

            // Update the pose locally in the state
            setPoses((prevPoses) =>
              prevPoses.map((pose) =>
                pose.english_name.toLowerCase() ===
                newPose.english_name.toLowerCase()
                  ? { ...pose, ...newPose } // Update pose data in state
                  : pose
              )
            );
            setFilteredPoses((prevPoses) =>
              prevPoses.map((pose) =>
                pose.english_name.toLowerCase() ===
                newPose.english_name.toLowerCase()
                  ? { ...pose, ...newPose } // Update filtered poses as well
                  : pose
              )
            );
            console.log("Pose updated locally:", newPose);
          })
          .catch((error) => {
            console.error("Error updating pose:", error);
          });
      } else {
        console.log(
          "Pose not found with the given English name:",
          newPose.english_name
        );
        alert("Pose not found with the given English name.");
      }
    } else {
      // If no pose is selected, create a new pose in the database
      fetch(
        "https://projects-b8a50-default-rtdb.asia-southeast1.firebasedatabase.app/Yoga/aasan.json",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newPose), // Send new pose data
        }
      )
        .then((response) => response.json())
        .then((data) => {
          // Add the new pose to the UI after it is successfully added
          setPoses((prevPoses) => [
            ...prevPoses,
            { id: data.name, ...newPose }, // Add new pose with generated id
          ]);
          setFilteredPoses((prevPoses) => [
            ...prevPoses,
            { id: data.name, ...newPose }, // Update filtered poses
          ]);
          console.log("New pose added:", newPose);
        })
        .catch((error) => {
          console.error("Error adding new pose:", error);
        });
    }

    // Reset form after saving
    setNewPose({
      english_name: "",
      sanskrit_name: "",
      sanskrit_name_adapted: "",
      translation_name: "",
      pose_description: "",
      pose_benefits: "",
      url_png: "",
    });

    setShowAddModal(false); // Close modal
    setSelectedPose(null); // Reset selectedPose after saving
  };

  const handleEditPose = (pose) => {
    setSelectedPose(pose);
    setNewPose({
      english_name: pose.english_name,
      sanskrit_name: pose.sanskrit_name,
      sanskrit_name_adapted: pose.sanskrit_name_adapted,
      translation_name: pose.translation_name,
      pose_description: pose.pose_description,
      pose_benefits: pose.pose_benefits,
      url_png: pose.url_png,
    });
    setShowAddModal(true); // Show the modal to edit the pose
  };

  return (
    <div className="admin-page">
      <NavAdmin />
      <section className="hero">
        <h1>Transform Your Yoga Journey Together</h1>
        <p>
          Track your progress, share your achievements, and challenge your
          friends. Join our vibrant community to gamify your wellness journey
          and discover new asanas.
        </p>
      </section>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search Aasan..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <button className="add-btn" onClick={() => setShowAddModal(true)}>
        Add New Aasan
      </button>

      <div className="poses-container">
        {currentPoses.map((pose, index) => (
          <div key={index} className="pose-card">
            <img
              src={pose.url_png || "fallback-image-url.png"} // Provide a fallback image URL
              alt={pose.english_name}
              className="pose-image"
            />
            <h3>{pose.sanskrit_name_adapted}</h3>
            <div className="pose-actions">
              <button
                onClick={() => setSelectedPose(pose)}
                className="see-more"
              >
                See More
              </button>
              <button onClick={() => handleEditPose(pose)} className="see-more">
                Edit Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}

      {selectedPose && (
        <div className="modal-overlay" onClick={() => setSelectedPose(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="close-btn" onClick={() => setSelectedPose(null)}>
              &times;
            </span>
            <h2>
              {selectedPose.sanskrit_name_adapted} ({selectedPose.english_name})
            </h2>
            <img
              src={selectedPose.url_png}
              alt={selectedPose.english_name}
              className="modal-image"
            />
            <p>
              <strong>Benefits:</strong> {selectedPose.pose_benefits}
            </p>
            <p>
              <strong>Description:</strong> {selectedPose.pose_description}
            </p>
          </div>
        </div>
      )}

      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="close-btn" onClick={() => setShowAddModal(false)}>
              &times;
            </span>
            <h2>{selectedPose ? "Edit Aasan" : "Add New Aasan"}</h2>
            <input
              type="text"
              placeholder="English Name"
              value={newPose.english_name}
              onChange={(e) =>
                setNewPose({ ...newPose, english_name: e.target.value })
              }
              required
            />
            <input
              type="text"
              placeholder="Sanskrit Name"
              value={newPose.sanskrit_name}
              onChange={(e) =>
                setNewPose({ ...newPose, sanskrit_name: e.target.value })
              }
              required
            />
            <input
              type="text"
              placeholder="Adapted Sanskrit Name"
              value={newPose.sanskrit_name_adapted}
              onChange={(e) =>
                setNewPose({
                  ...newPose,
                  sanskrit_name_adapted: e.target.value,
                })
              }
              required
            />
            <input
              type="text"
              placeholder="Translation Name"
              value={newPose.translation_name}
              onChange={(e) =>
                setNewPose({ ...newPose, translation_name: e.target.value })
              }
              required
            />
            <textarea
              placeholder="Pose Description"
              value={newPose.pose_description}
              onChange={(e) =>
                setNewPose({ ...newPose, pose_description: e.target.value })
              }
              required
            />
            <textarea
              placeholder="Pose Benefits"
              value={newPose.pose_benefits}
              onChange={(e) =>
                setNewPose({ ...newPose, pose_benefits: e.target.value })
              }
              required
            />
            <input
              type="url"
              placeholder="Image URL"
              value={newPose.url_png}
              onChange={(e) =>
                setNewPose({ ...newPose, url_png: e.target.value })
              }
              required
            />
            <button className="add-btn" onClick={handleAddPose}>
              {selectedPose ? "Update" : "Add"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Aasan;
