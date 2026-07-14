const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true
  },
  discountPrice: {
    type: Number
  },
  unit: {
    type: String,
    default: "1 pc"
  },
  image: {
    type: String,
    default: "placeholder.jpg"
  },
  description: {
    type: String,
    default: ""
  },
  stock: {
    type: Number,
    default: 100
  }
}, { timestamps: true });

module.exports = mongoose.model("Product", productSchema);
