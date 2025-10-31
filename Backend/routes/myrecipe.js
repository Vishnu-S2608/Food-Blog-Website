const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth');
const { MyRecipes } = require('../controller/myrecipecntrl')

router.get('/myRecipes',verifyToken,MyRecipes);

module.exports = router;