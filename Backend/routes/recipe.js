const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth');
const { getAllRecipes,getRecipe,addRecipe,editRecipe,deleteRecipe,upload } = require('../controller/recipecntrl')

router.get('/', getAllRecipes);//get all recipes
router.get('/:id', getRecipe);//get a recipe
router.post('/',upload.single('file'),verifyToken,addRecipe);//add recipe
router.put('/:id', upload.single('file'), verifyToken, editRecipe);//edit recipe
router.delete('/:id',deleteRecipe);//delete recipe


module.exports = router;