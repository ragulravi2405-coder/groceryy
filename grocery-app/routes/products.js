const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

// GET all products (optionally filter by category or search)
router.get("/", async (req, res) => {
  try {
    const { category, search } = req.query;
    let filter = {};

    if (category) {
      filter.category = category;
    }
    if (search) {
      filter.name = { $regex: search, $options: "i" };
    }

    const products = await Product.find(filter).sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error fetching products" });
  }
});

// GET all unique categories
router.get("/categories/list", async (req, res) => {
  try {
    const categories = await Product.distinct("category");
    res.json(categories);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error fetching categories" });
  }
});

// GET single product
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error fetching product" });
  }
});

module.exports = router;
