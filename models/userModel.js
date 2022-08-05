const mongoose = require("mongoose");
const argon2 = require('argon2');
const userSchema = new mongoose.Schema({
  FullName: {
    type: String,
    required: [true, "Please Enter Your Name"],
  },
  Email: {
    type: String,
    required: [true, "Please Enter your email"],
    unique: true,
    lowercase: true,
  },
  Password: {
    type: String,
    required: [true, "Please Enter your password"],
    minLength: 8,
  },
  DOB: {
    type: String,
     required: [true, "Please Enter Your Date Of Birth"],
  },
  UserId: {
    type: Number
  },
  Address: {
    type: String,
    require:true
  },
  PhoneNumber: {
    type: String,
    required: [true, "Please Enter your Phone Number "],
  },
  Role: {
    type: String,
    enum: ['admin', 'driver','customer'],
    required: [true, "Please Select Your Role as Driver or Customer"],
  },
  Order: [{
    type: mongoose.Types.ObjectId,
    ref: 'Order',
  }],
  CardDetails: {
    type: mongoose.Types.ObjectId,
    ref: 'Card',
  },
  WishList: [{
    type: mongoose.Types.ObjectId,
    ref: 'Item',
  }]
},
  {
    timestamps: true,
  });

userSchema.pre('save', async function(next) {
  this.Password = await argon2.hash(this.Password);
  next();
})
userSchema.pre('updateOne', async function (next) {
  this.getUpdate().Password = await argon2.hash(this.getUpdate().Password); 
  next();
})


const User = mongoose.model("User", userSchema);
module.exports = User;
