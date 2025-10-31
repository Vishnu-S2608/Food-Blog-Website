const Recipes = require('../models/recipemdl');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

// Ensure the directory exists
const imageDir = path.join(__dirname, '../public/images');
if (!fs.existsSync(imageDir)) {
  fs.mkdirSync(imageDir, { recursive: true });
}

// Multer storage config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, imageDir); // ✅ Use absolute path
  },
  filename: function (req, file, cb) {
    const filename = Date.now() + '-' + file.originalname;
    cb(null, filename);
  }
});

const upload = multer({ storage });




/* //Get All Recipes
const getAllRecipes = async(req,res)=>{
    const recipes = await Recipes.find();
    return res.json(recipes);
} */
// Get All Recipes
const getAllRecipes = async (req, res) => {
    try {
        const recipes = await Recipes.find();

        if (!recipes || recipes.length === 0) {
            return res.status(404).json({
                success: false,
                data: [],
                message: 'No recipes found',
            });
        }

        return res.status(200).json({
            success: true,
            data: [...recipes],
            message: 'Recipes fetched successfully',
        });
    } catch (error) {
        console.error('Error fetching recipes:', error.message);
        return res.status(500).json({
            success: false,
            data: [],
            message: 'An error occurred while fetching recipes',
            error: error.message,
        });
    }
};





/* Get Recipe by ID
const getRecipe = async(req,res)=>{
    const recipe = await Recipes.findById(req.params.id);
    res.json(recipe);
} */
// Get Recipe by ID
const getRecipe = async (req, res) => {
    try {
        const recipeId = req.params.id;

        // Validate ID format (optional but recommended)
        if (!recipeId.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({
                success: false,
                data: null,
                message: 'Invalid recipe ID format',
            });
        }

        const recipe = await Recipes.findById(recipeId);

        if (!recipe) {
            return res.status(404).json({
                success: false,
                data: null,
                message: 'Recipe not found',
            });
        }

        return res.status(200).json({
            success: true,
            data: recipe,
            message: 'Recipe fetched successfully',
        });
    } catch (error) {
        console.error('Error fetching recipe:', error.message);
        return res.status(500).json({
            success: false,
            data: null,
            message: 'An error occurred while fetching the recipe',
            error: error.message,
        });
    }
};




/* //Add Recipe
const addRecipe = async(req,res)=>{
    const {title,ingredients,instructions,time}=req.body

    if(!title || !ingredients || !instructions )
    {
        res.json({message:"Required fields cant be Empty"})
    }
    const newRecipe = await Recipes.create({
        title,ingredients,instructions,time
    })
    return res.json(newRecipe)
} */
// Add New Recipe
const addRecipe = async (req, res) => {
    console.log(req.user)
    console.log(req.user.id)
    console.log(req.file)
    try {
        const { title, ingredients, instructions, time, dropBox } = req.body;

        // Basic field validation
        if (!title || !ingredients || !instructions || !time) {
            return res.status(400).json({
                success: false,
                message: 'All fields (title, ingredients, instructions, time) are required',
            });
        }

        if (!req.file) {
            return res.status(400).json({ success: false, message: 'Image file is required' });
        }


        const newRecipe = new Recipes({
            title,
            ingredients:JSON.parse(ingredients),
            instructions,
            time,
            coverImage: req.file.filename,
            CreatedBy: req.user.id, // link recipe to user
            dropBox: dropBox || '' // Optional field
        });

        const savedRecipe = await newRecipe.save();

        return res.status(201).json({
            success: true,
            data: savedRecipe,
            message: 'Recipe added successfully',
        });
    } catch (error) {
        console.error('Error adding recipe:', error);
        return res.status(500).json({
            success: false,
            message: 'An error occurred while adding the recipe',
            error: error.message,
        });
    }
};





// Edit Recipe

const editRecipe = async (req, res) => {
  try {
    const recipeId = req.params.id;

    // Optional: Validate ID format
    if (!recipeId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid recipe ID format',
      });
    }

    const ingredients = req.body.ingredients
      ? JSON.parse(req.body.ingredients)
      : [];

    const updateData = {
      title: req.body.title,
      time: req.body.time,
      instructions: req.body.instructions,
      ingredients,
      dropBox: req.body.dropBox || null
    };

    if (req.file) {
      updateData.coverImage = `/images/${req.file.filename}`; // or just `req.file.filename` if that's how you store it
    }

    const updatedRecipe = await Recipes.findByIdAndUpdate(recipeId, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedRecipe) {
      return res.status(404).json({ success: false, message: 'Recipe not found' });
    }

    return res.status(200).json({
      success: true,
      data: updatedRecipe,
      message: 'Recipe updated successfully',
    });
  } catch (error) {
    console.error('Error updating recipe:', error.message);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while updating the recipe',
      error: error.message,
    });
  }
};



// Delete Recipe by ID
const deleteRecipe = async (req, res) => {
    try {
        const recipeId = req.params.id;

        // Validate ID format
        if (!recipeId.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid recipe ID format',
            });
        }

        const deletedRecipe = await Recipes.findByIdAndDelete(recipeId);
        
        if (deletedRecipe.coverImage) {
            const filePath = path.join(imageDir, deletedRecipe.coverImage);
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
           }
           
        if (!deletedRecipe) {
            return res.status(404).json({
                success: false,
                message: 'Recipe not found',
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Recipe deleted successfully',
            data: deletedRecipe,
        });
    } catch (error) {
        console.error('Error deleting recipe:', error.message);
        return res.status(500).json({
            success: false,
            message: 'An error occurred while deleting the recipe',
            error: error.message,
        });
    }
};


module.exports={getAllRecipes , getRecipe,addRecipe,editRecipe,deleteRecipe,upload}