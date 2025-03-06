import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { auth, db } from "../Login/firebase/firebase-config";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import "./Nav-User.css";
import userLogo from "../../assets/user-logo.jpg";
import logo from "../../assets/Logo-Yogaverse.png"; // Default logo

function NavUser() {
  const [userName, setUserName] = useState("Guest");
  const [userData, setUserData] = useState({
    photoURL: userLogo, // Default profile picture
  });

  useEffect(() => {
    const fetchUserData = async (uid) => {
      try {
        const userDocRef = doc(db, "users", uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          setUserName(userData.name || "Guest");
          setUserData((prev) => ({
            ...prev,
            photoURL: userData.photoURL || userLogo, // Set profile picture
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
        fetchUserData(user.uid);
      } else {
        setUserName("Guest");
        setUserData({ photoURL: userLogo }); // Reset to default when logged out
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <nav className="nav-user">
      <div className="navbars-container">
        <div className="Navbar">
          <Link className="logo-link">
            <img src={logo} alt="YogaVerse logo" />
            <span>YogaVerse</span>
          </Link>
        </div>

        <ul className="nav-links">
          <li>
            <Link to="/users">Home</Link>
          </li>
          <li>
            <Link to="/classes">Classes</Link>
          </li>
          {/* <li>
            <Link to="/challenges">Challenges</Link>
          </li> */}
        </ul>

        <div className="profile-logo">
          <Link to="/Profile">
            <img
              src={userData.photoURL}
              alt="Profile"
              className="profile-image"
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

export default NavUser;
