import React, { useState, useEffect } from "react";
import { auth, db } from "../Login/firebase/firebase-config";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  getDocs,
  deleteDoc,
} from "firebase/firestore";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { onAuthStateChanged } from "firebase/auth";
import NavUser from "./Nav-User";
import "./Profile.css";

const Profile = () => {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    dob: "",
    height: "",
    weight: "",
    gender: "",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [favoritePoses, setFavoritePoses] = useState([]);
  const [filteredFavorites, setFilteredFavorites] = useState([]);
  const [currentPosePage, setCurrentPosePage] = useState(0);
  const [selectedPose, setSelectedPose] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchFavorites = async (userId) => {
    try {
      const favoritesRef = collection(db, "users", userId, "favorites");
      const querySnapshot = await getDocs(favoritesRef);
      const poses = querySnapshot.docs.map((doc) => doc.data());
      setFavoritePoses(poses);
      setFilteredFavorites(poses); // Initialize filtered favorites with all favorites
    } catch (err) {
      console.error("Error fetching favorites:", err);
      setError("Failed to load favorites");
    }
    
  };
  const calculatePosition = (index) => {
    const totalItems = filteredFavorites.length ;
    const currentPage = currentPosePage ;
    if (totalItems === 0) return 0;
    let position = index - currentPage;

    if (position > totalItems / 2) position -= totalItems;
    else if (position < -totalItems / 2) position += totalItems;

    return position;
  };
  
  const getPoseId = (pose) => {
    return pose.id || pose.sanskrit_name_adapted || "unknown-id";
  };
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(userRef);

        if (docSnap.exists()) {
          setUserData(docSnap.data());
          fetchFavorites(user.uid);
        } else {
          const newUserData = {
            name: user.displayName || "",
            email: user.email || "",
            dob: "",
            height: "",
            weight: "",
            gender: "",
          };

          await setDoc(userRef, newUserData);
          setUserData(newUserData);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Function to calculate age from DOB
  const calculateAge = (dob) => {
    if (!dob) return "Not provided";
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };

  const handleInputChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const userRef = doc(db, "users", auth.currentUser.uid);
      await updateDoc(userRef, userData);
      alert("Profile updated successfully!");
      setEditMode(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile.");
    }
  };

  const toggleFavorite = async (pose) => {
    if (!auth.currentUser) {
      alert("Please log in to save favorites.");
      return;
    }

    const poseId = String(pose.id || pose.sanskrit_name_adapted);
    const favoritesRef = doc(db, `users/${auth.currentUser.uid}/favorites`, poseId);
    
    try {
      // Always remove from favorites in this context since we're viewing favorites
      await deleteDoc(favoritesRef);
      
      // Update local state
      const updatedFavorites = favoritePoses.filter(
        p => String(p.id || p.sanskrit_name_adapted) !== poseId
      );
      setFavoritePoses(updatedFavorites);
      
      // Apply current filter to updated favorites
      filterFavorites(updatedFavorites);
    } catch (error) {
      console.error("Error removing favorite:", error);
    }
  };

  // Filter favorites based on search query
  const filterFavorites = (poses = favoritePoses) => {
    if (!searchQuery.trim()) {
      setFilteredFavorites(poses);
      return;
    }
    
    const filtered = poses.filter(
      (pose) =>
        (pose.sanskrit_name_adapted &&
          pose.sanskrit_name_adapted
            .toLowerCase()
            .includes(searchQuery.toLowerCase())) ||
        (pose.english_name &&
          pose.english_name.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    setFilteredFavorites(filtered);
  };

  // Update filtered favorites when search query changes
  useEffect(() => {
    filterFavorites();
  }, [searchQuery, favoritePoses]);



  if (loading) {
    return <p>Loading profile...</p>;
  }


  const goToNextPose = () => {
    setCurrentPosePage((prev) => {
      // Loop to the first page when on the last page
      if (prev === filteredFavorites.length - 1) {
        return 0;
      }
      return prev + 1;
    });
  };
  
  const goToPrevPose = () => {
    setCurrentPosePage((prev) => {
      // Loop to the last page when on the first page
      if (prev === 0) {
        return filteredFavorites.length - 1;
      }
      return prev - 1;
    });
  };
  
  
  
  return (
    <>
      <NavUser />
      <div className="profile-container">
        <h2 className="profile-title">My Profile</h2>
        <div className="profile-details">
          <div className="profile-row">
            <strong>Name:</strong>
            {editMode ? (
              <input
                type="text"
                name="name"
                value={userData.name}
                onChange={handleInputChange}
              />
            ) : (
              <span>{userData.name || "Not provided"}</span>
            )}
          </div>

          <div className="profile-row">
            <strong>Email:</strong>
            <span>{userData.email || "Not provided"}</span>
          </div>

          <div className="profile-row">
            <strong>Age:</strong>
            <span>{calculateAge(userData.dob)} years</span>
          </div>

          {editMode && (
            <div className="profile-row">
              <strong>Date of Birth:</strong>
              <input
                type="date"
                name="dob"
                value={userData.dob}
                onChange={handleInputChange}
              />
            </div>
          )}

          <div className="profile-row">
            <strong>Gender:</strong>
            {editMode ? (
              <select
                name="gender"
                value={userData.gender}
                onChange={handleInputChange}
              >
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            ) : (
              <span>{userData.gender || "Not provided"}</span>
            )}
          </div>

          <div className="profile-row">
            <strong>Height:</strong>
            {editMode ? (
              <input
                type="number"
                name="height"
                value={userData.height}
                onChange={handleInputChange}
              />
            ) : (
              <span>{userData.height || "Not provided"} cm</span>
            )}
          </div>

          <div className="profile-row">
            <strong>Weight:</strong>
            {editMode ? (
              <input
                type="number"
                name="weight"
                value={userData.weight}
                onChange={handleInputChange}
              />
            ) : (
              <span>{userData.weight || "Not provided"} kg</span>
            )}
          </div>
        </div>

        {editMode ? (
          <button className="save-btn" onClick={handleSave}>
            Save
          </button>
        ) : (
          <button className="edit-btn" onClick={() => setEditMode(true)}>
            Edit Profile
          </button>
        )}
      </div>
      {/* Favorite Yoga Poses Section */}

      <div className="cards">
        <div className="hero">
          <h2>Your Liked Yoga Poses</h2>
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search Aasan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {loading && <div className="loading">Loading yoga aasan...</div>}
          {error && <div className="error">{error}</div>}

          {!loading && !error && (
            <>
              {filteredFavorites.length > 0 ? (
                <div className="book-slider-container">
                  <button
                    className="page-turn-btn prev-btn"
                    onClick={goToPrevPose}
                  >
                    <ChevronLeft size={24} />
                  </button>

                  <div className="book-slider">
                    {filteredFavorites.map((pose, index) => {
                      const position = calculatePosition(index);
                      return (
                        <div
                          key={getPoseId(pose)}
                          className={`book-slide ${
                            position === 0
                              ? "active"
                              : position < 0
                              ? "left"
                              : "right"
                          }`}
                          style={{
                            transform: `translateX(${
                              position * 120
                            }%) rotateY(${position * 40}deg)`,
                            zIndex: position === 0 ? 10 : 10 - Math.abs(position),

                            opacity:
                              Math.abs(position) > 2
                                ? 0
                                : 0.6 +(1 - Math.abs(position) * 1.1),
                          }}
                        >
                          <div className="book-content">
                            <img
                              src={pose.url_png || "/placeholder-pose.png"}
                              alt={pose.english_name || "Yoga pose"}
                              className="yoga-image"
                              onError={(e) => {
                                e.target.src = "/placeholder-pose.png";
                                e.target.onerror = null;
                              }}
                            />
                            <h3 className="yoga-name">
                              {pose.sanskrit_name_adapted || "Unknown Pose"}
                            </h3>
                            <div className="pose-actions">
                              <button
                                onClick={() => setSelectedPose(pose)}
                                className="see-more"
                              >
                                See More
                              </button>
                              <button
                                className="heart-btn favorited"
                                onClick={() => toggleFavorite(pose)}
                                data-tooltip="Remove from favorites"
                              >
                                ❤️
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <button
                    className="page-turn-btn next-btn"
                    onClick={goToNextPose}
                  >
                    <ChevronRight size={24} />
                  </button>
                </div>
              ) : (
                <p>
                  No favorite yoga poses found. Try adding some poses to your
                  favorites!
                </p>
              )}
            </>
          )}

<div className="pagination-indicator">
            {filteredFavorites.map((_, index) => (
              <span
                key={index}
                className={`page-dot ${
                  currentPosePage === index ? "active" : ""
                }`}
                onClick={() => setCurrentPosePage(index)}
              ></span>
            ))}
          </div>
        </div>

        {/* Modal for displaying pose details */}
        {selectedPose && (
          <div className="modal-overlay" onClick={() => setSelectedPose(null)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <span className="close-btn" onClick={() => setSelectedPose(null)}>
                &times;
              </span>
              <h2>
                {selectedPose.sanskrit_name_adapted} (
                {selectedPose.english_name})
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
      </div>
    </>
  );
};

export default Profile;