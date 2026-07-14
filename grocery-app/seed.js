// Run with: npm run seed
// This inserts sample categories/products so the site isn't empty.
// Image filenames point to /public/images/products/ — replace those files with your own photos
// (keep the same filenames, or update the "image" field below to match your filenames).

const mongoose = require("mongoose");
require("dotenv").config();
const Product = require("./models/Product");

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/groceryapp";

const sampleProducts = [
  { name: "Fresh Bananas", category: "Fruits", price: 40, discountPrice: 35, unit: "1 kg", image: "banana.jpg", description: "Fresh ripe bananas", stock: 50 },
  { name: "Red Apples", category: "Fruits", price: 180, discountPrice: 160, unit: "1 kg", image: "apple.jpg", description: "Crisp red apples", stock: 40 },
  { name: "Tomatoes", category: "Vegetables", price: 30, discountPrice: 25, unit: "1 kg", image: "tomato.jpg", description: "Farm fresh tomatoes", stock: 60 },
  { name: "Onions", category: "Vegetables", price: 35, unit: "1 kg", image: "onion.jpg", description: "Fresh onions", stock: 60 },
  { name: "Toned Milk", category: "Dairy", price: 28, unit: "500 ml", image: "milk.jpg", description: "Fresh toned milk", stock: 100 },
  { name: "Curd", category: "Dairy", price: 25, unit: "400 g", image: "curd.jpg", description: "Fresh homemade style curd", stock: 80 },
  { name: "Basmati Rice", category: "Staples", price: 120, discountPrice: 110, unit: "1 kg", image: "rice.jpg", description: "Premium basmati rice", stock: 70 },
  { name: "Toor Dal", category: "Staples", price: 140, unit: "1 kg", image: "toordal.jpg", description: "Good quality toor dal", stock: 70 },
  { name: "Sunflower Oil", category: "Staples", price: 150, discountPrice: 145, unit: "1 L", image: "oil.jpg", description: "Refined sunflower oil", stock: 50 },
  { name: "Salted Chips", category: "Snacks", price: 20, unit: "50 g", image: "chips.jpg", description: "Crunchy salted chips", stock: 100 },
  { name: "Marie Biscuits", category: "Snacks", price: 30, unit: "200 g", image: "biscuit.jpg", description: "Light and tasty biscuits", stock: 90 },
  { name: "Tea Powder", category: "Beverages", price: 110, unit: "250 g", image: "tea.jpg", description: "Strong flavourful tea powder", stock: 60 },
  { name: "Instant Coffee", category: "Beverages", price: 160, discountPrice: 150, unit: "100 g", image: "coffee.jpg", description: "Rich instant coffee", stock: 50 },
  { name: "Bathing Soap", category: "Personal Care", price: 35, unit: "1 pc", image: "soap.jpg", description: "Gentle bathing soap", stock: 90 },
  { name: "Toothpaste", category: "Personal Care", price: 55, discountPrice: 49, unit: "100 g", image: "toothpaste.jpg", description: "Cavity protection toothpaste", stock: 90 },
  { name: "Dishwash Liquid", category: "Household", price: 99, unit: "500 ml", image: "dishwash.jpg", description: "Grease-cutting dishwash liquid", stock: 60 },
];

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB for seeding...");

    await Product.deleteMany({});
    console.log("Old products cleared.");

    await Product.insertMany(sampleProducts);
    console.log(`${sampleProducts.length} sample products inserted successfully!`);

    process.exit(0);
  } catch (err) {
    console.error("Seeding error:", err);
    process.exit(1);
  }
}

seed();
