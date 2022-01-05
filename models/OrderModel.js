const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  
  PaymentMethod: {
    type: String,
    enum: ['Creditcard', 'Cash','Paypal'],
    required: [true, "Please select payment method"],
  },
  Status: {
    type: String,
    enum: ['Pending', 'Approved', 'Delivered'],
    default:"Pending"
  },
  Items: [{
    type: mongoose.Types.ObjectId,
    ref: 'Item',
  }],
  TotalPrice: {
    type: Number,
    require:true
  },
   Email: {
    type: String,
    require: true
  },
  AssignedRider: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
  },
},
  {
    timestamps: true,
  });


const Order = mongoose.model("Order", OrderSchema);
module.exports = Order;
