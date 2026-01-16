import "./Navbar.css";
import logo from "../../assets/logo.png";

function Navbar() {
  return (
    <>
      <nav className="nav">
        <div className="nav-logo">
          <img src={logo} alt="Logo" />
        </div>
        <div className="nav-links">
          <a href="#home" className="nav-link">
            Resize
          </a>
          <a href="#about" className="nav-link">
            Crop
          </a>
          <a href="#contact" className="nav-link">
            Compress
          </a>
          <a href="#blog" className="nav-link">
            Convert
          </a>
        </div>

        <div className="auth-links">
          <a href="#login" className="login-btn">
            Login
          </a>
          <a href="#signup" className="signup-btn">
            Signup
          </a>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
