const express = require("express");
const router = express.Router();
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const authMiddleware = require("../middleware/auth");

// All cart routes require login
router.use(authMiddleware);

// GET current user's cart
router.get("/", async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.userId }).populate("items.product");
    if (!cart) {
      cart = { items: [] };
    }
    res.json(cart);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error fetching cart" });
  }
});

// ADD item to cart (or increase quantity if already present)
router.post("/add", async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const qty = quantity && quantity > 0 ? quantity : 1;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    let cart = await Cart.findOne({ user: req.userId });
    if (!cart) {
      cart = new Cart({ user: req.userId, items: [] });
    }

    const existingItem = cart.items.find(
      (item) => item.product.toString() === productId
    );

    if (existingItem) {
      existingItem.quantity += qty;
    } else {
      cart.items.push({ product: productId, quantity: qty });
    }

    await cart.save();
    await cart.populate("items.product");

    res.json({ message: "Item added to cart", cart });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error adding to cart" });
  }
});

// UPDATE quantity of an item
router.put("/update", async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({ message: "Quantity must be at least 1" });
    }

    const cart = await Cart.findOne({ user: req.userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const item = cart.items.find((i) => i.product.toString() === productId);
    if (!item) {
      return res.status(404).json({ message: "Item not in cart" });
    }

    item.quantity = quantity;
    await cart.save();
    await cart.populate("items.product");

    res.json({ message: "Cart updated", cart });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error updating cart" });
  }
});

// REMOVE item from cart
router.delete("/remove/:productId", async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== req.params.productId
    );

    await cart.save();
    await cart.populate("items.product");

    res.json({ message: "Item removed from cart", cart });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error removing item" });
  }
});

module.exports = router;
