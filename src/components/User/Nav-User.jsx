import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, db } from "../firebase/firebase-config";
import { onAuthStateChanged } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import "./Nav-User.css";
import userLogo from "../../assets/user-logo.jpg";
import logo from "../../assets/Logo-Yogaverse.png";

function NavAdmin() {
  const [userName, setUserName] = useState("Guest");
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    photoURL: userLogo, // Default profile picture
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);

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

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <nav className="nav-user">
      <div className="navbars-container">
        <div className="Navbar">
          <Link className="logo-link">
            <img src={logo} alt="YogaVerse logo" />
            <span>YogaVerse</span>
          </Link>
        </div>

        {/* Desktop nav links */}
        <ul className="nav-links desktop-only">
          <li>
            <Link to="/users">Home</Link>
          </li>
          <li>
            <Link to="/classes">Classes</Link>
          </li>
        </ul>

        <div className="profile-section">
          <div className="profile-logo" onClick={toggleSidebar}>
            <img
              src={userData.photoURL}
              alt="Profile"
              className="profile-images"
            />
            <span
              onClick={() => navigate("/Profile")}
              className="username desktop-only"
            >
              {userName}
            </span>
          </div>
          <div className="nav-buttons desktop-only">
            <Link to="/" className="nav-button-signup">
              Log Out
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile sidebar */}
      <div className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebar-content">
          <strong className="sidebar-link" onClick={toggleSidebar}>
            {userName}
          </strong>
          <Link to="/users" className="sidebar-link" onClick={toggleSidebar}>
            Users
          </Link>
          <Link to="/classes" className="sidebar-link" onClick={toggleSidebar}>
            Classes
          </Link>
          <Link to="/profile" className="sidebar-link" onClick={toggleSidebar}>
            My Profile
          </Link>
          <Link to="/" className="sidebar-link logout" onClick={toggleSidebar}>
            Log Out
          </Link>
        </div>
      </div>

      {/* Overlay */}
      {sidebarOpen && <div className="overlay" onClick={toggleSidebar}></div>}
    </nav>
  );
}

export default NavAdmin;
