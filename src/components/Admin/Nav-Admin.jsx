import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { auth, db } from "../Login/firebase/firebase-config"; 
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore"; 
import "./Nav-Admin.css";
import userLogo from "../../assets/user-logo.jpg";

function NavAdmin() {
  const [userName, setUserName] = useState("Guest");

  useEffect(() => {
    const fetchUserName = async (uid) => {
      try {
        const userDocRef = doc(db, "users", uid); // 🔹 Get user doc by UID
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          setUserName(userData.name); // ✅ Get the correct username
        } else {
          console.warn("User document not found!");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchUserName(user.uid); // 🔹 Use UID instead of email
      } else {
        setUserName("Guest");
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <nav className="nav-admin">
      <div className="navbars-container">
        <Link  className="navbars-logo">YogaVerse</Link>

        <ul className="nav-links">
          <li><Link to="/admin">Home</Link></li>
          <li><Link to="/add-aasan">Aasan</Link></li>
          <li><Link to="/chat">Chat</Link></li>
        </ul>

        <div className="profile-logo">
          <Link to="/admin">
            <img src={userLogo} alt="Profile" className="profile-image" />
            <span className="username">{userName}</span>
          </Link>
          <div className="nav-buttons">
            <Link to="/" className="nav-button-signup">Log Out</Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default NavAdmin;
