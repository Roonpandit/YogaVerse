import { Link } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  return (
    <nav className="navbars">
      <div className="navbars-container">
        <Link className="navbars-logo">YogaVerse</Link>
        <div className="nav-buttons">
          <Link to="/login" className="nav-button-signup">
            Login
          </Link>
          <Link to="/signup" className="nav-button-signup">
            Sign Up
          </Link>
          <Link to="/contact" className="nav-btn">
            Contact Us
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
