

/* const MyRecipes = async (req, res) => {
  try {
    console.log("🔍 Full req.user object:", req.user);

    const userId = req.user.id;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      console.error('❌ Invalid user ID format:', userId);
      return res.status(400).json({
        success: false,
        data: null,
        message: 'Invaaalid user ID format',
      });
    }

    const recipes = await Recipes.find({ CreatedBy: userId }).sort({ createdAt: -1 });

    console.log("📦 Found recipes:", recipes);

    res.json({
      success: true,
      data: recipes,
    });
  } catch (err) {
    console.error('❌ Error in MyRecipes:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch user recipes' });
  }
}; */

/* onst MyRecipes = async (req, res) => {
  console.log("🟢 Entered MyRecipes controller");
  try {
    console.log("🔍 Full req.user object:", req.user);
    const userId = req.user?.id;
    console.log("🔍 Extracted userId:", userId);
    console.log("🔍 Is valid ObjectId:", mongoose.Types.ObjectId.isValid(userId));

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        data: null,
        message: 'Invalid user ID format',
      });
    }

    const recipes = await Recipes.find({ CreatedBy: userId }).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: recipes,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to fetch user recipes' });
  }
}; */
const mongoose = require('mongoose');
const Recipes = require('../models/recipemdl');

const MyRecipes = async (req, res) => {
  console.log("🟢 Entered MyRecipes controller");
  try {
    if (!req.user) {
      console.error("❌ req.user is undefined!");
      return res.status(400).json({
        success: false,
        data: null,
        message: 'User not found in request (req.user is undefined)',
      });
    }
    console.log("🔍 Full req.user object:", req.user);
    const userId = req.user.id;
    console.log("🔍 Extracted userId:", userId);
    console.log("🔍 Is valid ObjectId:", mongoose.Types.ObjectId.isValid(userId));

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        data: null,
        message: 'Invalid user ID format',
      });
    }

    const recipes = await Recipes.find({ CreatedBy: userId }).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: recipes,
    });
  } catch (err) {
    console.error("❌ Error in MyRecipes:", err);
    res.status(500).json({ success: false, message: 'Failed to fetch user recipes' });
  }
};

module.exports = { MyRecipes };



/* const MyRecipes = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log("Decoded user ID:", userId);

    // Convert to ObjectId
    const objectUserId = mongoose.Types.ObjectId.createFromHexString(userId);

    const recipes = await Recipes.find({ CreatedBy: objectUserId }).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: recipes,
    });
  } catch (err) {
    console.error('Error in MyRecipes:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch user recipes' });
  }
};
 */


