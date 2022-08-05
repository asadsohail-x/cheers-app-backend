const mongoose = require("mongoose");

const ItemSchema = new mongoose.Schema({
    Name: {
        type: String,
        required: [true, "Please Enter Your Name"],
        unique: true
    },
    Image: {
        type: String
    },
    Price: {
        type: Number,
        required: [true, "Please Price of Item"],
    },
    Description: {
        type: String
    },
    Category: {
        type: String,
        default:''
    },
    Top:{
        type:Boolean,
        default:false
    },
    Status: {
        type: String,
        enum: ["Available","OutOfStock"],
        default: "Available"
    }
    
},
    {
        timestamps: true,
    });


const Item = mongoose.model("Item", ItemSchema);
module.exports = Item;
