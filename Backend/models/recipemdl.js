const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    ingredients:{
        type:Array,
        required:true
    },
    instructions:{
        type:String,
        required:true
    },
    time:{
        type:String
        
    },
    coverImage:{
        type:String
    },
    CreatedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
    },
    dropBox: {
        type: String, // Or `type: Array` if you expect multiple values.
        required: false, // Optional field
    },
},{timestamps:true});

module.exports=mongoose.model('Recipes',recipeSchema);