import { Link } from "react-router-dom";
import "./Navbar.css";
import logo from "../../assets/Logo-Yogaverse.png";

function Navbar() {
  return (
    <nav className="navbars">
      <div className="navbars-container">
        <div className="Navbar">
          <Link className="logo-link">
            <img src={logo} alt="YogaVerse logo" />
            <span>YogaVerse</span>
          </Link>
        </div>
        <div className="nav-buttons">
          <Link to="/login" className="nav-button-signup">
            Login
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
