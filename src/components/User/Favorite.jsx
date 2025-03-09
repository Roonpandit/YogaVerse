import React, { useState, useEffect } from "react";
import { auth, db } from "../firebase/firebase-config";
import { doc, collection, deleteDoc, onSnapshot } from "firebase/firestore";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { onAuthStateChanged } from "firebase/auth";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./Favorite.css";

const Favorite = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [favoritePoses, setFavoritePoses] = useState([]);
  const [filteredFavorites, setFilteredFavorites] = useState([]);
  const [currentPosePage, setCurrentPosePage] = useState(0);
  const [selectedPose, setSelectedPose] = useState(null);

  useEffect(() => {
    let unsubscribe;

    const authUnsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        const favoritesRef = collection(db, "users", user.uid, "favorites");

        unsubscribe = onSnapshot(
          favoritesRef,
          (snapshot) => {
            const poses = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));
            setFavoritePoses(poses);
            setFilteredFavorites(poses);
            setLoading(false);
          },
          (error) => {
            console.error("Error fetching favorites:", error);
            setError("Failed to load favorites");
            setLoading(false);
          }
        );
      } else {
        setFavoritePoses([]);
        setFilteredFavorites([]);
        setLoading(false);
      }
    });

    return () => {
      authUnsub();
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const calculatePosition = (index) => {
    const totalItems = filteredFavorites.length;
    const currentPage = currentPosePage;
    if (totalItems === 0) return 0;
    let position = index - currentPage;

    if (position > totalItems / 2) position -= totalItems;
    else if (position < -totalItems / 2) position += totalItems;

    return position;
  };

  const toggleFavorite = async (pose) => {
    if (!auth.currentUser) {
      alert("Please log in to save favorites.");
      return;
    }

    const poseId = String(pose.id);
    const favoritesRef = doc(
      db,
      `users/${auth.currentUser.uid}/favorites`,
      poseId
    );

    try {
      await deleteDoc(favoritesRef);
    } catch (error) {
      console.error("Error removing favorite:", error);
    }
  };

  const goToNextPose = () => {
    setCurrentPosePage((prev) =>
      prev === filteredFavorites.length - 1 ? 0 : prev + 1
    );
  };

  const goToPrevPose = () => {
    setCurrentPosePage((prev) =>
      prev === 0 ? filteredFavorites.length - 1 : prev - 1
    );
  };

  return (
    <div className="fav">
      <div className="hero">
        <h2>Your Liked Yoga Poses</h2>

        {loading && <div className="loading">Loading yoga poses...</div>}
        {error && <div className="error">{error}</div>}

        {!loading && !error && (
          <>
            {favoritePoses.length > 0 ? (
              <div className="book-slider-container">
                <button
                  className="page-turn-btn prev-btn"
                  onClick={goToPrevPose}
                >
                  <ChevronLeft size={24} />
                </button>

                <div className="book-slider">
                  {favoritePoses.map((pose, index) => {
                    const position = calculatePosition(index);
                    return (
                      <div
                        key={pose.id}
                        className={`book-slide ${
                          position === 0
                            ? "active"
                            : position < 0
                            ? "left"
                            : "right"
                        }`}
                        style={{
                          transform: `translateX(${position * 120}%) rotateY(${
                            position * 40
                          }deg)`,
                          zIndex: position === 0 ? 10 : 10 - Math.abs(position),
                          opacity:
                            Math.abs(position) > 2
                              ? 0
                              : 0.6 + (1 - Math.abs(position) * 1.1),
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
          {favoritePoses.map((_, index) => (
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
    </div>
  );
};

export default Favorite;
