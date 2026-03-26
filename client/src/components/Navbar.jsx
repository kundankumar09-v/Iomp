import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaMapMarkerAlt, FaSearch, FaQrcode, FaSignInAlt, FaBars, FaTimes, FaChevronDown } from "react-icons/fa";
import "./Navbar.css";

const CITIES = ["All", "Hyderabad", "Mumbai", "Delhi", "Bangalore", "LB Nagar"];

function Navbar() {
  const [search, setSearch] = useState("");
  const [selectedCity, setSelectedCity] = useState("All");
  const [user, setUser] = useState(null);
  const [userPicture, setUserPicture] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const navigate = useNavigate();
  const location = useLocation();

  // Read user on every route change so navbar always reflects latest login state
  useEffect(() => {
    const syncUser = () => {
      const activeUser = localStorage.getItem("wahap_temp_user");

      // Clear stale placeholder usernames from previous sessions
      if (activeUser === "Google User" || activeUser === "User" || activeUser === null) {
        localStorage.removeItem("wahap_temp_user");
        setUser(null);
        setUserPicture(null);
        return;
      }

      setUser(activeUser || null);
      setUserPicture(localStorage.getItem("wahap_user_picture") || null);
    };

    syncUser();

    // Also listen for storage events (cross-tab) and our custom event
    window.addEventListener("storage", syncUser);
    window.addEventListener("wahap_auth_change", syncUser);

    return () => {
      window.removeEventListener("storage", syncUser);
      window.removeEventListener("wahap_auth_change", syncUser);
    };
  }, [location]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const queryParams = new URLSearchParams();
    if (search.trim()) queryParams.set("query", search.trim());
    if (selectedCity && selectedCity !== "All") queryParams.set("city", selectedCity);
    
    navigate(`/events?${queryParams.toString()}`);
    setIsMenuOpen(false);
  };

  const handleCityChange = (e) => {
    const newCity = e.target.value;
    setSelectedCity(newCity);
    
    // Auto-navigate to events list on city change for better UX
    const searchParams = new URLSearchParams(location.search);
    if (newCity && newCity !== "All") {
      searchParams.set("city", newCity);
    } else {
      searchParams.delete("city");
    }
    
    navigate(`/events?${searchParams.toString()}`);
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleLogout = () => {
    localStorage.removeItem("wahap_temp_user");
    localStorage.removeItem("wahap_user_email");
    localStorage.removeItem("wahap_user_picture");
    setUser(null);
    setUserPicture(null);
    setIsMenuOpen(false);
    setIsDropdownOpen(false);
    window.dispatchEvent(new Event("wahap_auth_change"));
    navigate("/");
  };

  // Get initials for avatar
  const getInitials = (name) => {
    if (!name) return "?";
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  return (
    <nav className="navbar-container">
      <div className="navbar-main">
        <Link to="/" className="navbar-logo" onClick={() => setIsMenuOpen(false)}>
          WAHAP
        </Link>

        {/* Desktop Search */}
        <div className="navbar-search-desktop">
          <div className="search-wrapper">
            <div className="location-box">
              <FaMapMarkerAlt className="loc-icon" />
              <select
                value={selectedCity}
                onChange={handleCityChange}
                className="location-select"
              >
                {CITIES.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>

            <form className="search-bar-inner" onSubmit={handleSearch}>
              <FaSearch className="search-icon" />
              <input
                className="search-input"
                placeholder="Search events..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </form>
          </div>
        </div>

        <div className="navbar-actions-desktop">
          <button className="qr-btn" onClick={() => navigate("/scan-qr")}>
            <FaQrcode className="btn-icon" />
            <span>Scan QR</span>
          </button>

          <div className="vertical-divider" />

          {user ? (
            <div className="user-menu-wrapper" ref={dropdownRef}>
              <button
                className="user-avatar-btn"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                {userPicture ? (
                  <img src={userPicture} alt={user} className="user-avatar-img" />
                ) : (
                  <div className="user-avatar">{getInitials(user)}</div>
                )}
                <span className="user-name-nav">{user.split(" ")[0]}</span>
                <FaChevronDown className={`chevron ${isDropdownOpen ? "open" : ""}`} />
              </button>

              {isDropdownOpen && (
                <div className="user-dropdown">
                  <div className="dropdown-header">
                    {userPicture ? (
                      <img src={userPicture} alt={user} className="dropdown-avatar-img" />
                    ) : (
                      <div className="dropdown-avatar">{getInitials(user)}</div>
                    )}
                    <div className="dropdown-info">
                      <span className="dropdown-name">{user}</span>
                      <span className="dropdown-role">{localStorage.getItem("wahap_user_email") || "Attendee"}</span>
                    </div>
                  </div>
                  <div className="dropdown-divider" />
                  {(localStorage.getItem("wahap_user_email")?.toLowerCase() === "admin@wahap.com" || 
                    localStorage.getItem("wahap_user_email")?.toLowerCase() === "admin@gmail.com") && (
                    <>
                      <Link to="/admin" className="dropdown-item" onClick={() => setIsDropdownOpen(false)}>
                        Manager Console
                      </Link>
                      <div className="dropdown-divider" />
                    </>
                  )}
                  <button onClick={handleLogout} className="dropdown-logout">
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/signin" style={{ textDecoration: 'none' }}>
              <button className="signin-btn">
                <FaSignInAlt className="btn-icon" />
                Sign In
              </button>
            </Link>
          )}
        </div>

        {/* Mobile menu toggle */}
        <button className="navbar-toggle" onClick={toggleMenu}>
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`navbar-mobile-menu ${isMenuOpen ? "open" : ""}`}>
        <div className="mobile-menu-inner">
          <div className="mobile-search-section">
            <div className="mobile-search-wrapper">
              <div className="mobile-location-box">
                <FaMapMarkerAlt className="loc-icon" />
                <select
                  value={selectedCity}
                  onChange={handleCityChange}
                  className="location-select"
                >
                  {CITIES.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>
              <form className="mobile-search-bar" onSubmit={handleSearch}>
                <FaSearch className="search-icon" />
                <input
                  className="search-input"
                  placeholder="Search events..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </form>
            </div>
          </div>

          <div className="mobile-nav-links">
            <button className="mobile-nav-btn qr" onClick={() => { navigate("/scan-qr"); setIsMenuOpen(false); }}>
              <FaQrcode className="btn-icon" /> Scan QR
            </button>

            {user ? (
              <div className="mobile-user-info">
                <div className="mobile-avatar-row">
                  <div className="user-avatar">{getInitials(user)}</div>
                  <div>
                    <div className="mobile-user-name">{user}</div>
                    <div className="mobile-user-role">Attendee</div>
                  </div>
                </div>
                <button onClick={handleLogout} className="mobile-logout-btn">Sign Out</button>
              </div>
            ) : (
              <button className="mobile-nav-btn signin" onClick={() => { navigate("/signin"); setIsMenuOpen(false); }}>
                <FaSignInAlt className="btn-icon" /> Sign In
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
