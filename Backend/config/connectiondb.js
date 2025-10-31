const mongoose = require('mongoose');
require('dotenv').config();

async function connectDb(){
    mongoose.connect('mongodb://127.0.0.1:27017/Food-Recipes')
    .then(() =>{
        console.log('Database Connected')
    }).catch((err)=>{
        console.log(err)
    })
};

module.exports = connectDb;



/* const mongoose = require('mongoose');
const dotenv = require('dotenv').config();

const connectDb = async()=>{
    await mongoose.connect(process.env.CONNECTION_STRING).then(()=>{
        console.log('Database Connected'),{
            useNewUrlParser:true,
            useUnifiedTopology:true,
            useCreateIndex:true
        }
    }).catch((err)=>{
        console.log(err)
    })
}

module.exports =connectDb; */