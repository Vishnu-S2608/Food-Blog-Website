import React, { useState } from 'react';
import './nav.css';
import { Link, useNavigate,useLocation } from 'react-router-dom';
import logo from '../assets/logo.jpg';

export const Navbar = ({ isLoggedIn, openLoginModal, setRedirectPath, handleLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleProtectedRoute = (e, path) => {
    e.preventDefault();
    if (isLoggedIn) {
      navigate(path);
    } else {
      setRedirectPath(path);
      openLoginModal();
    }
  };

  const handleAuthClick = (e) => {
    e.preventDefault();
    if (isLoggedIn) {
      handleLogout();
      navigate('/');
    } else {
      setRedirectPath(null);
      openLoginModal();
      navigate('/');
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim() !== '') {
      navigate(`/?query=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
      setIsMenuOpen(false);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="logo">
          
          <Link to="/">
            <img src={logo} alt="FoodBlog Logo" className="logo-img" />
          </Link>
          
        </div>

        {location.pathname === '/' && (
          <form className="search-form" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search recipes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            <button type="submit" className="search-button">Search</button>
          </form>
        )}

        <ul className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/myRecipes" onClick={(e) => handleProtectedRoute(e, "/myRecipes")}>
              My Recipes
            </Link>
          </li>
          <li>
            <Link to="/Favourites" onClick={(e) => handleProtectedRoute(e, "/Favourites")}>
              Favourites
            </Link>
          </li>
          <li>
            <Link to="#" onClick={handleAuthClick}>
              {isLoggedIn ? 'Logout' : 'Login'}
              <br />
              {user?.email ? `(${user?.email})` : ""}
            </Link>
          </li>
        </ul>

        <div className="hamburger" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <div className={`bar ${isMenuOpen ? 'rotate1' : ''}`}></div>
          <div className={`bar ${isMenuOpen ? 'fade' : ''}`}></div>
          <div className={`bar ${isMenuOpen ? 'rotate2' : ''}`}></div>
        </div>
      </div>
    </nav>
  );
};
