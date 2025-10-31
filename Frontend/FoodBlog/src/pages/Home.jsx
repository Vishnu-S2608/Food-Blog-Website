import React, { useEffect, useState, useRef } from 'react';
import './Home.css';
import recipeLogo from '../assets/Food recipe.png';
import axios from 'axios';
import { MdOutlineWatchLater } from "react-icons/md";
import { FaRegHeart, FaHeart } from "react-icons/fa6";
import { useNavigate, useLocation } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';


export const Home = ({
  isLoggedIn,
  openLoginModal,
  setRedirectPath,
  toggleFavourite,
  favourites
}) => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const query = queryParams.get('query') || '';

  const firstMatchRef = useRef(null);

  useEffect(() => {
    if (location.state?.showToast) {
      toast.success(location.state.message || 'Success!');
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const res = await axios.get('http://localhost:5000/recipe');
        const recipeList = Array.isArray(res.data.data) ? res.data.data : [];
        setRecipes(recipeList);
      } catch (error) {
        console.error('Error fetching recipes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  // Scroll to first match when query changes
  useEffect(() => {
    if (query && firstMatchRef.current) {
      firstMatchRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [query]);

  // Click anywhere resets to default
  useEffect(() => {
    const handleClickOutside = () => {
      if (query) {
        navigate('/');
      }
    };
    if (query) {
      document.addEventListener('click', handleClickOutside);
    }
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [query, navigate]);

  const handleShareClick = () => {
    if (isLoggedIn) {
      navigate('/addRecipe');
    } else {
      setRedirectPath('/addRecipe');
      openLoginModal();
    }
  };

  const handleRecipeClick = (id) => {
    if (isLoggedIn) {
      navigate(`/recipe/${id}`);
    } else {
      setRedirectPath(`/recipe/${id}`);
      openLoginModal();
    }
  };

   // <-- resets on every render!


  const filteredAndSortedRecipes = recipes.slice().sort((a, b) => {
    const aMatch = a.title.toLowerCase().includes(query.toLowerCase());
    const bMatch = b.title.toLowerCase().includes(query.toLowerCase());
    return (bMatch ? 1 : 0) - (aMatch ? 1 : 0);
  });

  const matchedCount = recipes.filter(recipe =>
    recipe.title.toLowerCase().includes(query.toLowerCase())
  ).length;

  return (
    <>
      <div className="home">
        <div className="home-overlay">
          <div className="home-content">
            <div className="home-left">
              <h1 className="title">Food App</h1>
              <p className="description">
                Discover delicious recipes from around the world. Our Food App brings you easy, healthy, and tasty meals right to your fingertips.
                Explore, cook, and enjoy!
              </p>
              <button onClick={handleShareClick} className="share-button">
                Share Your Recipe
              </button>
            </div>
            <div className="home-right">
              <img src={recipeLogo} alt="Recipe Logo" className="recipe-logo" />
            </div>
          </div>
        </div>
      </div>

      <div className="spacer" />

      <div className="recipe-items-container">
        {loading ? (
          <p className="loading-text">Loading recipes...</p>
        ) : recipes.length === 0 ? (
          <p className="no-recipes-text">No recipes found.</p>
        ) : matchedCount === 0 && query ? (
          <p className="no-recipes-text">No matching recipes found.</p>
        ) : (
          <div className="card-container">
            {filteredAndSortedRecipes.map((item, index) => {
              const isMatch = item.title.toLowerCase().includes(query.toLowerCase());
              const isItemFavourite = favourites.some(fav => fav._id === item._id);

              const refProp =
                isMatch && !firstMatchRef.current ? { ref: firstMatchRef } : {};

              return (
                <div
                  className={`card ${isMatch ? 'highlight' : ''}`}
                  key={index}
                  {...refProp}
                >
                  <h1 className="card-title">{item.title}</h1>

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
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleRecipeClick(item._id)}
                  />

                  <p className="card-category">{item.dropBox}</p>
                  <div className="icons">
                    <div className="timer">
                      <MdOutlineWatchLater /> {item.time}
                    </div>
                    <div
                      className="heart-icon"
                      onClick={() => {
                        if (isLoggedIn) {
                          toggleFavourite(item);
                        } else {
                          setRedirectPath('/');
                          openLoginModal();
                        }
                      }}
                      style={{ cursor: 'pointer', color: isItemFavourite ? 'red' : 'gray' }}
                    >
                      {isItemFavourite ? <FaHeart /> : <FaRegHeart />}
                    </div>
                  </div>
                  

                  <button className="view-button" onClick={() => handleRecipeClick(item._id)}>
                    View
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
};
