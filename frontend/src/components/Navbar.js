/**
 * Navbar Component
 * Navigation bar with links to all pages
 */

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

function Navbar({ isAuthenticated, user, onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">🏥</span>
          Hospital Management
        </Link>

        <ul className="navbar-menu">
          <li className="navbar-item">
            <Link to="/" className="navbar-link">
              Home
            </Link>
          </li>
          <li className="navbar-item">
            <Link to="/services" className="navbar-link">
              Services
            </Link>
          </li>
          <li className="navbar-item">
            <Link to="/doctors" className="navbar-link">
              Our Doctors
            </Link>
          </li>

          {isAuthenticated ? (
            <>
              <li className="navbar-item">
                <Link to="/dashboard" className="navbar-link">
                  Dashboard
                </Link>
              </li>
              <li className="navbar-item">
                <Link to="/appointment" className="navbar-link">
                  Book Appointment
                </Link>
              </li>
              <li className="navbar-item">
                <Link to="/pharmacy" className="navbar-link">
                  Pharmacy
                </Link>
              </li>
              <li className="navbar-item">
                <Link to="/cart" className="navbar-link">
                  Cart
                </Link>
              </li>
              <li className="navbar-item">
                <Link to="/profile" className="navbar-link">
                  Profile ({user?.name})
                </Link>
              </li>
              <li className="navbar-item">
                <button className="navbar-logout" onClick={handleLogout}>
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li className="navbar-item">
                <Link to="/login" className="navbar-link">
                  Login
                </Link>
              </li>
              <li className="navbar-item">
                <Link to="/signup" className="navbar-link navbar-link-signup">
                  Sign Up
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
