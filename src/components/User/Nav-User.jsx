import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { auth, db } from "../Login/firebase/firebase-config";
import { onAuthStateChanged } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import "./Nav-User.css";
import userLogo from "../../assets/user-logo.jpg";
import logo from "../../assets/Logo-Yogaverse.png"; // Default logo

function NavUser() {
  const [userName, setUserName] = useState("Guest");
  const [userData, setUserData] = useState({
    photoURL: userLogo, // Default profile picture
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  useEffect(() => {
    let unsubscribeUser;

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        const userDocRef = doc(db, "users", user.uid);

        unsubscribeUser = onSnapshot(userDocRef, (docSnap) => {
          if (docSnap.exists()) {
            const userData = docSnap.data();
            setUserName(userData.name || "Guest");
            setUserData((prev) => ({
              ...prev,
              photoURL: userData.photoURL || userLogo, // Set profile picture
            }));
          } else {
            console.warn("User document not found!");
          }
        });
      } else {
        setUserName("Guest");
        setUserData({ photoURL: userLogo }); // Reset to default when logged out
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeUser) unsubscribeUser();
    };
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

        {/* Desktop Navigation */}
        <ul className="nav-links desktop-only">
          <div>
            <Link to="/users">Home</Link>
          </div>
          <div>
            <Link to="/classes">Classes</Link>
          </div>
        </ul>

        {/* Desktop Profile */}
        <div className="profile-logo desktop-only">
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

        {/* Mobile Profile Icon (triggers sidebar) */}
        <div className="mobile-profile" onClick={toggleSidebar}>
          <img
            src={userData.photoURL}
            alt="Profile"
            className="profile-image"
          />
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <span className="sidebar-username">{userName}</span>
        </div>
        <div className="sidebar-content">
          <Link to="/users" className="sidebar-link" onClick={toggleSidebar}>
            Home
          </Link>
          <Link to="/classes" className="sidebar-link" onClick={toggleSidebar}>
            Classes
          </Link>
          <Link to="/Profile" className="sidebar-link" onClick={toggleSidebar}>
          My profile
          </Link>
          <Link to="/" className="sidebar-logout" onClick={toggleSidebar}>
            Log Out
          </Link>
        </div>
      </div>

      {/* Overlay */}
      {sidebarOpen && <div className="overlay" onClick={toggleSidebar}></div>}
    </nav>
  );
}

export default NavUser;