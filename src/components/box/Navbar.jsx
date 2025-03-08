import { useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
import logo from "../../assets/Logo-Yogaverse.png";

function Navbar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <nav className="navbars">
      <div className="navbars-container">
        <div className="Navbar">
          <Link className="logo-link">
            <img src={logo} alt="YogaVerse logo" />
            <span>YogaVerse</span>
          </Link>
        </div>

        {/* Desktop navigation buttons */}
        <div className="nav-buttons desktop-nav">
          <Link to="/login" className="nav-button-signup">
            Login
          </Link>
          <Link to="/contact" className="nav-btn">
            Contact Us
          </Link>
        </div>

        {/* Mobile menu hamburger icon */}
        <div className="mobile-menu-icon" onClick={toggleSidebar}>
          <div className={`hamburger ${sidebarOpen ? "active" : ""}`}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>

      {/* Mobile sidebar */}
      <div className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebar-content">
          <Link to="/login" className="sidebar-link" onClick={toggleSidebar}>
            Login
          </Link>
          <Link to="/contact" className="sidebar-link" onClick={toggleSidebar}>
            Contact Us
          </Link>
        </div>
      </div>

      {/* Overlay when sidebar is open */}
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={toggleSidebar}></div>
      )}
    </nav>
  );
}

export default Navbar;
