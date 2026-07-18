// Run with: npm run seed
// This inserts sample categories/products so the site isn't empty.
// Image filenames point to /public/images/products/ — replace those files with your own photos
// (keep the same filenames, or update the "image" field below to match your filenames).

const mongoose = require("mongoose");
require("dotenv").config();
const Product = require("./models/Product");

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/groceryapp";

const sampleProducts = [
  { name: "Fresh Bananas", category: "Fruits", price: 40, discountPrice: 35, unit: "1 kg", image: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&auto=format&fit=crop&q=60", description: "Fresh ripe bananas", stock: 50 },
  { name: "Red Apples", category: "Fruits", price: 180, discountPrice: 160, unit: "1 kg", image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400&auto=format&fit=crop&q=60", description: "Crisp red apples", stock: 40 },
  { name: "Tomatoes", category: "Vegetables", price: 30, discountPrice: 25, unit: "1 kg", image: "https://images.unsplash.com/photo-1567306301408-9b74779a11af?w=400&auto=format&fit=crop&q=60", description: "Farm fresh tomatoes", stock: 60 },
  { name: "Onions", category: "Vegetables", price: 35, unit: "1 kg", image: "https://images.unsplash.com/photo-1620574387735-3624d75b2dbc?w=400&auto=format&fit=crop&q=60", description: "Fresh onions", stock: 60 },
  { name: "Toned Milk", category: "Dairy", price: 28, unit: "500 ml", image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&auto=format&fit=crop&q=60", description: "Fresh toned milk", stock: 100 },
  { name: "Curd", category: "Dairy", price: 25, unit: "400 g", image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&auto=format&fit=crop&q=60", description: "Fresh homemade style curd", stock: 80 },
  { name: "Basmati Rice", category: "Staples", price: 120, discountPrice: 110, unit: "1 kg", image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&auto=format&fit=crop&q=60", description: "Premium basmati rice", stock: 70 },
  { name: "Toor Dal", category: "Staples", price: 140, unit: "1 kg", image: "https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?w=400&auto=format&fit=crop&q=60", description: "Good quality toor dal", stock: 70 },
  { name: "Sunflower Oil", category: "Staples", price: 150, discountPrice: 145, unit: "1 L", image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&auto=format&fit=crop&q=60", description: "Refined sunflower oil", stock: 50 },
  { name: "Salted Chips", category: "Snacks", price: 20, unit: "50 g", image: "https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=400&auto=format&fit=crop&q=60", description: "Crunchy salted chips", stock: 100 },
  { name: "Marie Biscuits", category: "Snacks", price: 30, unit: "200 g", image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&auto=format&fit=crop&q=60", description: "Light and tasty biscuits", stock: 90 },
  { name: "Tea Powder", category: "Beverages", price: 110, unit: "250 g", image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=400&auto=format&fit=crop&q=60", description: "Strong flavourful tea powder", stock: 60 },
  { name: "Instant Coffee", category: "Beverages", price: 160, discountPrice: 150, unit: "100 g", image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400&auto=format&fit=crop&q=60", description: "Rich instant coffee", stock: 50 },
  { name: "Bathing Soap", category: "Personal Care", price: 35, unit: "1 pc", image: "https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?w=400&auto=format&fit=crop&q=60", description: "Gentle bathing soap", stock: 90 },
  { name: "Toothpaste", category: "Personal Care", price: 55, discountPrice: 49, unit: "100 g", image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&auto=format&fit=crop&q=60", description: "Cavity protection toothpaste", stock: 90 },
  { name: "Dishwash Liquid", category: "Household", price: 99, unit: "500 ml", image: "https://images.unsplash.com/photo-1563453392212-326f5e854473?w=400&auto=format&fit=crop&q=60", description: "Grease-cutting dishwash liquid", stock: 60 },
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
