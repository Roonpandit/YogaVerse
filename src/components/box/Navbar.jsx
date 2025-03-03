import { Link } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  return (
    <nav className="navbars">
      <div className="navbars-container">
        <Link to="/" className="navbars-logo">
          YogaVerse
        </Link>
        <div className="nav-buttons">
          <Link to="/login" className="nav-btn">Login</Link>
          <Link to="/signup" className="nav-button-signup">Sign Up</Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;