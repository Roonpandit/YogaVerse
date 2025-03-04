import React from "react";
import "./UserProfile.css";

const UserProfile = () => {
  return (
        <div className="profile-container">
          <div className="profile-header">
            <div className="profile-image-container">
              <img
                src="https://creatie.ai/ai/api/search-image?query=A professional headshot of a young professional with a warm smile, wearing business attire, against a neutral background. The lighting is soft and flattering, creating a welcoming and approachable appearance&width=128&height=128&orientation=squarish&flag=2c5c0c57-a681-49c8-85a3-0db9a5075e1a"
                alt="Profile picture"
                className="profile-image"
              />
              <button className="edit-profile-pic-btn">
                <i className="fas fa-camera"></i>
              </button>
            </div>
          </div>

          <div className="profile-content">
            <div className="profile-header-info">
              <div className="profile-name-section">
                <h1 className="profile-name">Sarah Johnson</h1>
                <p className="profile-username">@sarahjohnson</p>
              </div>
              <button className="edit-profile-btn">
                <i className="fas fa-pencil"></i>
                Edit Profile
              </button>
            </div>

            <div className="profile-details">
              <div className="detail-row">
                <div className="detail-label">Email</div>
                <div className="detail-value">sarah.johnson@example.com</div>
              </div>
              <div className="detail-row">
                <div className="detail-label">Age</div>
                <div className="detail-value">28</div>
              </div>
              <div className="detail-row">
                <div className="detail-label">Gender</div>
                <div className="detail-value">Female</div>
              </div>
              <div className="detail-row">
                <div className="detail-label">Height</div>
                <div className="detail-value">5'7" (170 cm)</div>
              </div>
              <div className="detail-row last-row">
                <div className="detail-label">Weight</div>
                <div className="detail-value">135 lbs (61 kg)</div>
              </div>
            </div>
          </div>
        </div>
  );
};

export default UserProfile;
