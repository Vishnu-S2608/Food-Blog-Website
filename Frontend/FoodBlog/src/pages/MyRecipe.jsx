import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { MdOutlineWatchLater } from 'react-icons/md';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate, Link } from 'react-router-dom';
import './MyRecipes.css'

export const MyRecipe = ({ toggleFavourite, favourites }) => {
  const [myRecipes, setMyRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMyRecipes();
  }, []);

  const fetchMyRecipes = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/myRecipes', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMyRecipes(response.data.data);
    } catch (error) {
      toast.error('Failed to load your recipes.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this recipe?")) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:5000/recipe/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success('Recipe deleted successfully!');
        setMyRecipes(myRecipes.filter((recipe) => recipe._id !== id));
      } catch (error) {
        toast.error('Failed to delete recipe.');
      }
    }
  };

  const handleEdit = (recipe) => {
    const normalizedCoverImage = recipe.coverImage.startsWith('/images/')
      ? recipe.coverImage
      : `/images/${recipe.coverImage}`;

    navigate('/addRecipe', {
      state: {
        isEdit: true,
        recipe: {
          ...recipe,
          coverImage: normalizedCoverImage
        }
      }
    });
  };

  return (
    <>
      <div className="recipe-items-container">
        {loading ? (
          <p className="loading-text">Loading your recipes...</p>
        ) : myRecipes.length === 0 ? (
          <p className="no-recipes-text">You haven’t added any recipes yet.</p>
        ) : (
          <div className="card-container">
            {myRecipes.map((item) => {
              const isFavourite = favourites.some((fav) => fav._id === item._id);

              return (
                <div key={item._id} className="card">
                  <h1 className="card-title">{item.title}</h1>
                  <p className="card-category">{item.category}</p>
                  <Link to={`/recipe/${item._id}`}>
                    <img
                      src={
                        item.coverImage.startsWith('/images/')
                          ? `http://localhost:5000${item.coverImage}`
                          : `http://localhost:5000/images/${item.coverImage}`
                      }
                      alt={item.title}
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
                      onClick={() => toggleFavourite(item)}
                      style={{ cursor: 'pointer', color: isFavourite ? 'red' : 'gray' }}
                    >
                      {isFavourite ? <FaHeart /> : <FaRegHeart />}
                    </div>
                  </div>

                  <div className="card-actions">
                    <button className="edit-btn" onClick={() => handleEdit(item)}>
                      Edit
                    </button>
                    <button className="delete-btn" onClick={() => handleDelete(item._id)}>
                      Delete
                    </button>
                  </div>

                  <Link to={`/recipe/${item._id}`}>
                    <button className="view-button">View</button>
                  </Link>
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
