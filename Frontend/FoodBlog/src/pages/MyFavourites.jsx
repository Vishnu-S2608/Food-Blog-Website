import React from 'react';
import { Link } from 'react-router-dom';
import { MdOutlineWatchLater } from 'react-icons/md';
import { FaHeart } from 'react-icons/fa';
import recipeLogo from '../assets/Food recipe.png';
import './myFavourites.css';
import { toast, ToastContainer } from 'react-toastify';

export const Favourites = ({ favourites, toggleFavourite, removeAllFavourites }) => {
  const handleRemove = (item) => {
    toggleFavourite(item);
    toast.info(`Removed "${item.title}" from favourites.`);
  };

  const handleClearAll = () => {
    const confirm = window.confirm('Are you sure you want to remove all favourites?');
    if (confirm) {
      removeAllFavourites();
      toast.warn('All favourites removed.');
    }
  };

  return (
    <div className="favourites-container">
      <h1 className="favourites-title">My Favourites</h1>

      {favourites.length > 0 && (
        <div className="clear-button-container">
          <button className="clear-button" onClick={handleClearAll}>
            Remove All Favourites
          </button>
        </div>
      )}

      {favourites.length === 0 ? (
        <p className="empty-text">No favourites yet.</p>
      ) : (
        <div className="card-container">
          {favourites.map((item, index) => (
            <div className="card" key={index}>
              <h1 className="card-title">{item.title}</h1>

              <Link to={`/recipe/${item._id}`}>
                <img
                  src={
                    item.coverImage
                      ? item.coverImage.startsWith('/images/')
                        ? `http://localhost:5000${item.coverImage}`
                        : `http://localhost:5000/images/${item.coverImage}`
                      : recipeLogo
                  }
                  alt={item.name || 'Recipe image'}
                  className="card-image"
                />
              </Link>

              <div className="icons">
                <div className="timer">
                  <MdOutlineWatchLater /> {item.time}
                </div>
                <p className="card-category">{item.dropBox}</p>
                <div
                  className="heart-icon"
                  onClick={() => handleRemove(item)}
                  style={{ cursor: 'pointer', color: 'red' }}
                >
                  <FaHeart />
                </div>
              </div>

              <Link to={`/recipe/${item._id}`}>
                <button className="view-button">View</button>
              </Link>
            </div>
          ))}
        </div>
      )}

      <ToastContainer position="top-right" autoClose={2000} />
    </div>
  );
};
