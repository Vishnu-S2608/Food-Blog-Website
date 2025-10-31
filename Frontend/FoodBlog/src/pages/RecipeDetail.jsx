import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './RecipeDetail.css';
import { toast, ToastContainer } from 'react-toastify';

function RecipeDetail({ favourites, toggleFavourite }) {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isFavourite, setIsFavourite] = useState(false);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await fetch(`http://localhost:5000/recipe/${id}`);
        const data = await response.json();

        if (!response.ok) throw new Error(data.message || 'Something went wrong');

        setRecipe(data.data);

        // Check if already in favourites
        const alreadyFavourite = favourites.some(fav => fav._id === data.data._id);
        setIsFavourite(alreadyFavourite);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id, favourites]);

  const handleToggleFavourite = () => {
    toggleFavourite(recipe);

    if (isFavourite) {
      toast.info('Removed from favourites');
    } else {
      toast.success('Added to favourites');
    }

    setIsFavourite(!isFavourite);
  };

  if (loading) return <p className="loading-text">Loading recipe...</p>;
  if (error) return <p className="error-text">{error}</p>;
  if (!recipe) return <p>No recipe found.</p>;

  return (
    <div className="recipe-detail-container">
      <h1 className="recipe-title">{recipe.title}</h1>

      <img
        src={
          recipe.coverImage
            ? recipe.coverImage.startsWith('/images/')
              ? `http://localhost:5000${recipe.coverImage}`
              : `http://localhost:5000/images/${recipe.coverImage}`
            : 'https://via.placeholder.com/300'
        }
        alt={recipe.title}
        className="recipe-image"
      />

      <div className="recipe-info">
        <p><strong>Time:</strong> {recipe.time}</p>
        <p><strong>Ingredients:</strong> {recipe.ingredients}</p>
        <p><strong>Description:</strong> {recipe.instructions || 'No description available.'}</p>
        <p><strong>Category:</strong> {recipe.dropBox || 'No category specified.'}</p>

        <button
          onClick={handleToggleFavourite}
          className={`favourite-button ${isFavourite ? 'favourite-active' : ''}`}
        >
          {isFavourite ? 'Remove from Favourites' : 'Add to Favourites'}
        </button>
      </div>

      <ToastContainer position="top-right" autoClose={2000} />
    </div>
  );
}

export default RecipeDetail;
