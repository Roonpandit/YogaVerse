import { useState, useEffect } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../firebase/firebase-config.js";
import { useNavigate } from "react-router-dom";
import "./CompleteProfile.css";

const CompleteProfile = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState(""); // Role state
  const [dob, setDob] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [gender, setGender] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const data = userSnap.data();
          setName(data.name || "");
          setEmail(data.email || "");
          setRole(data.role || ""); // Fetch user role
          setDob(data.dob || "");
          setHeight(data.height || "");
          setWeight(data.weight || "");
          setGender(data.gender || "");
        }
      }
    };

    fetchUserData();
  }, []);

  const handleUpdateProfile = async () => {
    if (!dob || !height || !weight || !gender || !role) {
      alert("All fields are required.");
      return;
    }

    const user = auth.currentUser;
    if (!user) return;

    const updatedData = {
      uid: user.uid,
      name,
      email,
      role, // Include role in profile update
      dob,
      height,
      weight,
      gender,
      isProfileComplete: true,
    };

    try {
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, updatedData);

      alert("Profile updated successfully!");

      // Redirect user based on role
      if (role === "admin") {
        navigate("/admin");
      } else {
        navigate("/users");
      }
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="complete-profile-container">
      <h2>Complete Your Profile</h2>

      <label>Name</label>
      <input type="text" value={name} disabled />

      <label>Email</label>
      <input type="email" value={email} disabled />

      <label>Role</label>
      {role ? (
        <input type="text" value={role} disabled /> // Role is set, cannot change
      ) : (
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="">Select Role</option>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
      )}

      <label>Date of Birth</label>
      <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} />

      <label>Height (cm)</label>
      <input
        type="number"
        value={height}
        onChange={(e) => {
          const value = Math.min(e.target.value, 200); // Set max limit to 200
          setHeight(value);
        }}
        max={200} // Optional, for additional HTML validation
      />
      <label>Weight (kg)</label>
      <input
        type="number"
        value={weight}
        onChange={(e) => {
          const value = Math.min(e.target.value, 150); // Set max limit to 150 kg
          setWeight(value);
        }}
        max={250} // Optional for additional validation
      />

      <label>Gender</label>
      <select value={gender} onChange={(e) => setGender(e.target.value)}>
        <option value="">Select Gender</option>
        <option value="Male">Male</option>
        <option value="Female">Female</option>
        <option value="Other">Other</option>
      </select>

      <button onClick={handleUpdateProfile}>Update Profile</button>
    </div>
  );
};

export default CompleteProfile;
