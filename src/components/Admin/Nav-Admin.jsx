import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { auth, db } from "../Login/firebase/firebase-config";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import "./Nav-Admin.css";
import userLogo from "../../assets/user-logo.jpg";
import logo from "../../assets/Logo-Yogaverse.png";

function NavAdmin() {
  const [userName, setUserName] = useState("Guest");
  const [userData, setUserData] = useState({
    photoURL: userLogo, // Default profile picture
  });

  useEffect(() => {
    const fetchUserName = async (uid) => {
      try {
        const userDocRef = doc(db, "users", uid);
        const userDocSnap = await getDoc(userDocRef);
  
        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          console.log("Fetched user data:", userData); // 🔹 Debugging log
          setUserName(userData.name);
          setUserData((prev) => ({
            ...prev,
            photoURL: userData.photoURL || userLogo,
          }));
        } else {
          console.warn("User document not found!");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
  
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchUserName(user.uid);
      } else {
        setUserName("Guest");
        setUserData({ photoURL: userLogo });
      }
    });
  
    return () => unsubscribe();
  }, []);

  return (
    <nav className="nav-admin">
      <div className="navbars-container">
      <div className="Navbar">
          <Link className="logo-link">
            <img src={logo} alt="YogaVerse logo" />
            <span>YogaVerse</span>
          </Link>
        </div>
        <ul className="nav-links">
          <li>
            <Link to="/admin">Home</Link>
          </li>
          <li>
            <Link to="/chat">Chat</Link>
          </li>
        </ul>

        <div className="profile-logo">
          <Link to="/admin">
            <img
              src={userData.photoURL}
              alt="Profile"
              className="profile-images"
            />
            <span className="username">{userName}</span>
          </Link>
          <div className="nav-buttons">
            <Link to="/" className="nav-button-signup">
              Log Out
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default NavAdmin;
