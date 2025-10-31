
import axios from 'axios';
import React, { useEffect, useState, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './AddFoodRecipe.css';

export const AddFoodRecipe = () => {
  const [recipeData, setRecipeData] = useState({ dropBox: '' });
  const [isEditMode, setIsEditMode] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const categories = [
    "Indian",
    "Chinese",
    "Continental",
    "Beverages",
    "Starter",
    "Dessert",
    "Snacks"
  ];

  useEffect(() => {
    const editState = location?.state;
    if (editState?.isEdit && editState?.recipe) {
      const recipe = editState.recipe;
      setRecipeData({
        _id: recipe._id,
        title: recipe.title || '',
        time: recipe.time || '',
        instructions: recipe.instructions || '',
        ingredients: Array.isArray(recipe.ingredients)
          ? recipe.ingredients.join(', ')
          : recipe.ingredients || '',
        coverImage: recipe.coverImage || '',
        file: null,
        category: recipe.category || '',
        dropBox: recipe.category || ''
      });
      setIsEditMode(true);
    } else if (editState?.isEdit) {
      toast.error("Invalid navigation: No recipe data.");
      navigate('/');
    }
  }, [location.state]);

  const onHandleChange = (e) => {
    const { name, value, files } = e.target;
    const val = name === 'file' ? files[0] : value;
    setRecipeData((prev) => ({ ...prev, [name]: val }));
  };

  const onSelectCategory = (category) => {
    setRecipeData((prev) => ({ ...prev, dropBox: category }));
    setDropdownOpen(false);
  };

  const previewUrl = useMemo(() => {
    if (recipeData.file) {
      return URL.createObjectURL(recipeData.file);
    }
    return null;
  }, [recipeData.file]);

  const onHandleSubmit = async (e) => {
    e.preventDefault();
    const { title, time, ingredients, instructions, file, _id, dropBox } = recipeData;
    const cleanedIngredients = ingredients
      .split(',')
      .map(item => item.trim())
      .filter(item => item.length > 0);

    if (!title) return toast.error('Title is required');
    if (!time) return toast.error('Time is required');
    if (cleanedIngredients.length === 0) return toast.error('Ingredients are required');
    if (!instructions) return toast.error('Instructions are required');
    if (!file && !isEditMode) return toast.error('Recipe image is required');
    if (!dropBox) return toast.error('Category is required');

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("time", time);
      formData.append("instructions", instructions);
      formData.append("ingredients", JSON.stringify(cleanedIngredients));
      formData.append("dropBox", dropBox);
      if (isEditMode && recipeData.coverImage) {
        formData.append("coverImage", recipeData.coverImage);
      }
      if (file instanceof File) {
        formData.append("file", file);
      }
      const config = {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data'
        }
      };
      if (isEditMode) {
        await axios.put(`http://localhost:5000/recipe/${_id}`, formData, config);
        toast.success("Recipe updated successfully!");
        setTimeout(() => navigate('/myRecipes'), 1500);
      } else {
        await axios.post('http://localhost:5000/recipe', formData, config);
        navigate('/', { state: { showToast: true, message: 'Recipe submitted successfully!' } });
      }
    } catch (err) {
      console.error('Submission error:', err);
      toast.error('Something went wrong.');
    }
  };

  return (
    <>
      <div className="form-container">
        <form className="recipe-form" onSubmit={onHandleSubmit}>
          <div className="form-group">
            <label>Title</label>
            <input type="text" name="title" value={recipeData.title || ''} placeholder="Recipe Name" onChange={onHandleChange} />
          </div>

          <div className="form-group">
            <label>Time</label>
            <input type="text" name="time" value={recipeData.time || ''} placeholder="Time (e.g., 30 mins)" onChange={onHandleChange} />
          </div>

          <div className="form-group">
            <label>Ingredients</label>
            <textarea name="ingredients" rows="5" value={recipeData.ingredients || ''} placeholder="List ingredients..." onChange={onHandleChange}></textarea>
          </div>

          <div className="form-group">
            <label>Instruction</label>
            <textarea name="instructions" rows="5" value={recipeData.instructions || ''} placeholder="Instructions..." onChange={onHandleChange}></textarea>
          </div>

          {/* Custom Dropdown */}
          <div className="form-group">
            <label>Category</label>
            <div className={`custom-dropdown ${dropdownOpen ? 'open' : ''}`} onClick={() => setDropdownOpen(!dropdownOpen)}>
              <div className="dropdown-selected">
                {recipeData.dropBox || '-- Select Category --'}
                <span className="arrow"></span>
              </div>
              {dropdownOpen && (
                <ul className="dropdown-list">
                  {categories.map((cat, index) => (
                    <li key={index} onClick={() => onSelectCategory(cat)}>{cat}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Custom File Upload */}
          <div className="form-group">
            <label>Recipe Image</label>
            <div className="custom-file-upload" onClick={() => document.getElementById('fileInput').click()}>
              {previewUrl || recipeData.coverImage ? (
                <img src={previewUrl || `http://localhost:5000${recipeData.coverImage}`} alt="Recipe" />
              ) : (
                <span>Click here to Upload</span>
              )}
            </div>
            <input
              type="file"
              id="fileInput"
              name="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={onHandleChange}
            />
          </div>

          <button type="submit" className="submit-btn">
            {isEditMode ? 'Update Recipe' : 'Submit Recipe'}
          </button>
        </form>
        <ToastContainer position="top-right" autoClose={1500} />
      </div>
    </>
  );
};

