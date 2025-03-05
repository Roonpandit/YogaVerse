import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "./Home.css";
import Navbar from "./Navbar";

function Home() {
  const navigate = useNavigate();
  const [yogaAsanas, setYogaAsanas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentAsanaPage, setCurrentAsanaPage] = useState(0);
  const [currentReviewPage, setCurrentReviewPage] = useState(0);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchYogaAsanas = async () => {
      try {
        const response = await axios.get(
          "https://projects-b8a50-default-rtdb.asia-southeast1.firebasedatabase.app/Yoga/aasan.json"
        );

        if (response.data) {
          // Convert API response into an array
          const asanasArray = Object.entries(response.data).map(
            ([key, value]) => ({
              id: key, // Use key as ID
              ...value,
            })
          );

          // Define names of asanas to display
          const selectedNames = [
            "Dhanurasana",
            "Setu Bandha Sarvangasana",
            "Ustrasana",
            "Balasana",
            "Eka Pada Rajakapotasana",
            "Hanumanasana",
            "Urdhva Dhanurasana"
          ];

          // Filter asanas by name
          const filteredAsanas = asanasArray.filter((asana) =>
            selectedNames.includes(asana.sanskrit_name_adapted)
          );

          // Set the filtered asanas in state
          setYogaAsanas(filteredAsanas);
        }
      } catch (err) {
        setError("Failed to fetch yoga asanas. Please try again later.");
        console.error("Error fetching yoga asanas:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchYogaAsanas();
  }, []);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(
          "https://projects-b8a50-default-rtdb.asia-southeast1.firebasedatabase.app/Yoga/reviews.json"
        );

        if (response.data) {
          const reviewsArray = Object.values(response.data);
          setReviews(reviewsArray);
        }
      } catch (err) {
        setError("Failed to fetch reviews. Please try again later.");
        console.error("Error fetching reviews:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  // Function to calculate the slide position
  const calculatePosition = (index, type) => {
    const totalItems = type === "asana" ? yogaAsanas.length : reviews.length;
    const currentPage = type === "asana" ? currentAsanaPage : currentReviewPage;

    if (totalItems === 0) return 0;

    let position = index - currentPage;
    if (position > totalItems / 2) position -= totalItems;
    else if (position < -totalItems / 2) position += totalItems;

    return position;
  };

  const goToNextAsana = () =>
    setCurrentAsanaPage((prev) => (prev + 1) % yogaAsanas.length);
  const goToPrevAsana = () =>
    setCurrentAsanaPage((prev) =>
      prev === 0 ? yogaAsanas.length - 1 : prev - 1
    );
  const goToNextReview = () =>
    setCurrentReviewPage((prev) => (prev + 1) % reviews.length);
  const goToPrevReview = () =>
    setCurrentReviewPage((prev) =>
      prev === 0 ? reviews.length - 1 : prev - 1
    );

  return (
    <div className="home-container">
      <Navbar />

      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-content">
          <h1>Discover the Power of Yoga</h1>
          <p>
            Transform your mind, body, and soul with our expert-guided yoga
            practices
          </p>
          <button className="hero-button" onClick={() => navigate("/login")}>
            Start Your Journey
          </button>
        </div>
      </div>

      {/* Yoga Asanas Section */}
      <div className="yoga-reviews">
        <div className="yoga-section">
          <h2 className="section-title">Popular Yoga Asanas</h2>

          {loading && <div className="loading">Loading yoga asanas...</div>}
          {error && <div className="error">{error}</div>}

          {!loading && !error && yogaAsanas.length > 0 && (
            <div className="book-slider-container">
              <button
                className="page-turn-btn prev-btn"
                onClick={goToPrevAsana}
              >
                <ChevronLeft size={24} />
              </button>

              <div className="book-slider">
                {yogaAsanas.map((yoga, index) => {
                  const position = calculatePosition(index, "asana");
                  return (
                    <div
                      key={yoga.id}
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
                          src={yoga.url_png}
                          alt={yoga.sanskrit_name_adapted}
                          className="yoga-image"
                        />
                        <div className="yoga-details">
                          <h3 className="yoga-name">
                            {yoga.sanskrit_name_adapted}
                          </h3>
                          <button
                            className="learn-more"
                            onClick={() => navigate("/login")}
                          >
                            Learn More
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <button
                className="page-turn-btn next-btn"
                onClick={goToNextAsana}
              >
                <ChevronRight size={24} />
              </button>
            </div>
          )}

          <div className="pagination-indicator">
            {yogaAsanas.map((_, index) => (
              <span
                key={index}
                className={`page-dot ${
                  currentAsanaPage === index ? "active" : ""
                }`}
                onClick={() => setCurrentAsanaPage(index)}
              ></span>
            ))}
          </div>
        </div>

        {/* Reviews Section */}
        <div className="reviews">
          <h2 className="section-title">User Reviews</h2>

          {loading && <div className="loading">Loading Users Reviews...</div>}
          {error && <div className="error">{error}</div>}

          {!loading && !error && reviews.length > 0 && (
            <div className="book-slider-container">
              <button
                className="page-turn-btn prev-btn"
                onClick={goToPrevReview}
              >
                <ChevronLeft size={24} />
              </button>

              <div className="book-slider">
                {reviews.map((review, index) => {
                  const position = calculatePosition(index, "review");
                  return (
                    <div
                      key={index}
                      className={`book-slide ${
                        position === 0
                          ? "active"
                          : position < 0
                          ? "left"
                          : "right"
                      }`}
                      style={{
                        transform: `translateX(${position * 100}%) rotateY(${
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
                        <p className="review-text">"{review.review}"</p>
                        <p className="review-author">- {review.name}</p>
                        <p className="review-rating">
                          {[...Array(Math.floor(review.rating))].map((_, i) => (
                            <span key={`full-${i}`}>&#9733;</span> // Filled star
                          ))}
                          {review.rating % 1 !== 0 && <span>&#189;</span>}{" "}
                          {/* Half star if rating is decimal */}
                          {[...Array(5 - Math.ceil(review.rating))].map(
                            (_, i) => (
                              <span key={`empty-${i}`}>&#9734;</span> // Empty star
                            )
                          )}
                          ({review.rating} / 5)
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <button
                className="page-turn-btn next-btn"
                onClick={goToNextReview}
              >
                <ChevronRight size={24} />
              </button>
            </div>
          )}
          <div className="pagination-indicator">
            {reviews.map((_, index) => (
              <span
                key={index}
                className={`page-dot ${
                  currentReviewPage === index ? "active" : ""
                }`}
                onClick={() => setCurrentReviewPage(index)}
              ></span>
            ))}
          </div>
        </div>
      </div>

      <footer className="footer">
        <div className="footer-content">
          <p>&copy; 2025 YogaLife. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default Home;
