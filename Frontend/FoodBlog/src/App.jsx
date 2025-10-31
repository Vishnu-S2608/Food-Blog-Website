import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar.jsx';
import { Footer } from './components/Footer.jsx';
import './App.css'; 
import { Modal } from './components/Modal.jsx';
import { Inputform } from './components/Inputform.jsx';
import { Home } from './pages/Home.jsx';
import { AddFoodRecipe } from './pages/AddFoodRecipe.jsx';
import { MyRecipe } from './pages/MyRecipe.jsx';
import  RecipeDetail from './pages/RecipeDetail.jsx'
import { Favourites } from './pages/MyFavourites.jsx';




function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [redirectPath, setRedirectPath] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  const openLoginModal = () => setIsModalOpen(true);
  const closeLoginModal = () => setIsModalOpen(false);

  const handleSuccessLogin = () => {
    setIsLoggedIn(true);
    closeLoginModal();
    if (redirectPath) {
      window.location.href = redirectPath;
      setRedirectPath(null);
    }
  };


  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
  };

  const [favourites, setFavourites] = useState(() => {
    // Load from localStorage when app starts
    const stored = localStorage.getItem('favourites');
    return stored ? JSON.parse(stored) : [];
  })


  const toggleFavourite = (recipe) => {
    setFavourites((prev) => {
      const isAlreadyFav = prev.some((r) => r._id === recipe._id);
      const updatedFavourites = isAlreadyFav
        ? prev.filter((r) => r._id !== recipe._id)
        : [...prev, recipe];

      localStorage.setItem('favourites', JSON.stringify(updatedFavourites)); // Save to localStorage
      return updatedFavourites;
    });
  };

  const removeAllFavourites = () => {
    setFavourites([]);
    localStorage.removeItem('favourites'); // ⬅️ Clear from localStorage
  };

  
  return (
    <div className="app-container">
      <Router>
        <Navbar
          isLoggedIn={isLoggedIn}
          openLoginModal={openLoginModal}
          setRedirectPath={setRedirectPath}
          handleLogout={handleLogout}
        />
        <main className="main-content">
          <Routes>
            <Route path="/" element={
              <Home
                isLoggedIn={isLoggedIn}
                openLoginModal={openLoginModal}
                setRedirectPath={setRedirectPath}
                toggleFavourite={toggleFavourite}
                favourites={favourites}
              />
            } />
            <Route path="/addRecipe" element={<AddFoodRecipe />} />
            <Route path="/myRecipes" element={
              <MyRecipe 
                toggleFavourite={toggleFavourite}
                favourites={favourites}
              />} />
            <Route path="/recipe/:id" element={
              <RecipeDetail 
                favourites={favourites} 
                toggleFavourite={toggleFavourite}             
              />
              } />
            <Route path="/Favourites" element={
              <Favourites 
                favourites={favourites} 
                toggleFavourite={toggleFavourite}
                removeAllFavourites={removeAllFavourites}  
              />
              } />
          </Routes>
        </main>
        <Footer />

        {/* Modal for Login */}
        {isModalOpen && (
          <Modal onClose={closeLoginModal}>
            <Inputform
              setIsModalOpen={closeLoginModal}
              onSuccessLogin={handleSuccessLogin}
            />
          </Modal>
        )}
      </Router>
    </div>
  );
}

export default App;

