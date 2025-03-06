import React, { useState, useEffect } from "react";
import { auth, db } from "../Login/firebase/firebase-config";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import "@fortawesome/fontawesome-free/css/all.min.css";

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
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);

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
            photoURL: user.photoURL || "",
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



  const handleImageUpload = async (event) => {
    const file = event.target.files[0];

    if (!file) {
      alert("Please select an image!");
      return;
    }

    if (file.size > 1024 * 1024) {
      // 1MB = 1024 * 1024 bytes
      alert("Image cannot be greater than 1MB.");
      return;
    }

    try {
      const resizedBase64 = await resizeImage(file, 500, 500); // Resize to 500x500px

      if (!userData.uid) {
        throw new Error("User ID is missing!");
      }

      const userRef = doc(db, "users", userData.uid);
      await updateDoc(userRef, { photoURL: resizedBase64 });

      setUserData((prev) => ({ ...prev, photoURL: resizedBase64 }));

      alert("Image uploaded successfully!");
    } catch (error) {
      console.error("Firestore update error:", error);
      alert("Failed to update Firestore: " + error.message);
    }
  };

  // Function to resize image
  const resizeImage = (file, maxWidth, maxHeight) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          let width = img.width;
          let height = img.height;

          if (width > maxWidth || height > maxHeight) {
            if (width > height) {
              height *= maxWidth / width;
              width = maxWidth;
            } else {
              width *= maxHeight / height;
              height = maxHeight;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);

          resolve(canvas.toDataURL("image/jpeg", 1.0)); // Convert to Base64 (JPEG with 70% quality)
        };
        img.src = event.target.result;
      };
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };

  return (
    <>
      <NavUser />
      <div className="profile-container">
        <div className="profile-details">
          <div className="profile-row">
            <div className="profile-picture">
              <img
                src={userData.photoURL || "default-profile.png"}
                alt="Profile"
                className="profile-img"
              />
              <label htmlFor="imageUpload" className="upload-icon">
                <i className="fas fa-camera"></i>
              </label>
              <input
                type="file"
                id="imageUpload"
                accept="image/*"
                onChange={handleImageUpload}
              />
            </div>

            <div className="users-name">
              <strong>{userData.name}</strong>
            </div>
          </div>
          {editMode && (
            <div className="profile-row">
              <strong>Name</strong>
              <input
                type="text"
                name="name"
                value={userData.name}
                onChange={handleInputChange}
              />
            </div>
          )}
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
    </>
  );
};

export default Profile;
