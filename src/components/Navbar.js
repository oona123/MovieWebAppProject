import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, NavLink } from "react-router-dom";
import "./Navbar.css";
import { useUser } from "../context/useUser";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

export default function CustomNavbar() {
  const { user, logOut } = useUser(); // Accessing user data and the setter function
  const [searchParam, setSearchParam] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State to toggle menu
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // State for dropdown
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get("query");
    if (query) {
      setSearchParam(query);
      navigate(location.pathname, { replace: true }); // Tyhjennetään edellinen haku enpointista
    }
    // Close dropdown and menu when user changes page
    setIsDropdownOpen(false);
    setIsMenuOpen(false);
  }, [location]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchParam.trim()) {
      // Navigate to Search.js with the query
      navigate(`/search?query=${encodeURIComponent(searchParam)}`);
    }
  };

  const handleLogout = () => {
    logOut(); // Call the logOut function from the context
    navigate("/"); // Redirect to the homepage after logout
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen); // Toggle menu visibility
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen); // Toggle dropdown visibility
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <a className="navbar-brand" href="/">
          Movie App
        </a>
        {/* Menu for smaller screens */}
        <div className="navbar-mobile" onClick={toggleMenu}>
          <span className="menu-icon">&#9776;</span>
        </div>
        <div className={`navbar-desktop ${isMenuOpen ? "active" : ""}`}>
          <ul className={`navbar-links ${isMenuOpen ? "active" : ""}`}>
            <li className="nav-item">
              <NavLink
                className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
                to="/showtimes"
              >
                Showtimes
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
                to="/groups"
              >
                Groups
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
                to="/search"
              >
                Search
              </NavLink>
            </li>
            {/* Search bar */}
            <form className="search-form" onSubmit={handleSearchSubmit}>
              <input
                className="search-input"
                type="text"
                placeholder="Search..."
                value={searchParam}
                onChange={(e) => setSearchParam(e.target.value)}
              />
              <button type="submit" className="search-icon-button">
                <FontAwesomeIcon icon={faSearch} className="search-icon" />
              </button>
            </form>
            {/* User menu dropdown */}
            <li className="nav-item dropdown">
              {!user.token ? (
                <button className="navbar-button" onClick={() => navigate("/login")}>
                  Login
                </button>
              ) : (
                <div className="dropdown-container">
                  <button
                    className="navbar-button dropdown-toggle"
                    onClick={toggleDropdown}
                  >
                    {user.username}
                  </button>
                  {isDropdownOpen && (
                    <ul className="dropdown-menu">
                      <li onClick={() => navigate("/profile")}>Profile</li>
                      <li onClick={handleLogout}>Logout</li>
                    </ul>
                  )}
                </div>
              )}
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
