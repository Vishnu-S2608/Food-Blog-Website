const express = require('express');
const app = express();
const connectDb = require('./config/connectiondb');
const cors = require('cors');


const dotenv = require('dotenv').config();
require('dotenv').config();
const PORT = process.env.PORT || 8000;
connectDb();
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors());
app.use(express.static('public'));//to serve static files

const recipeRoutes = require('./routes/recipe');
const userRoutes = require('./routes/user');


const myrecipe=require('./routes/myrecipe');

app.use('/recipe',recipeRoutes);
app.use('/',userRoutes);
app.use('/',myrecipe);






app.listen(PORT,(err) => {
    console.log(`Server is running on port ${PORT}`);
    
})