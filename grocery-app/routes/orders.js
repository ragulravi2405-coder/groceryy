const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const Cart = require("../models/Cart");
const authMiddleware = require("../middleware/auth");

router.use(authMiddleware);

// PLACE order from current cart
router.post("/place", async (req, res) => {
  try {
    const { address } = req.body;
    if (!address) {
      return res.status(400).json({ message: "Delivery address is required" });
    }

    const cart = await Cart.findOne({ user: req.userId }).populate("items.product");
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Your cart is empty" });
    }

    const orderItems = cart.items.map((item) => ({
      product: item.product._id,
      name: item.product.name,
      price: item.product.discountPrice || item.product.price,
      quantity: item.quantity
    }));

    const totalAmount = orderItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const order = new Order({
      user: req.userId,
      items: orderItems,
      totalAmount,
      address
    });

    await order.save();

    // Clear the cart after order is placed
    cart.items = [];
    await cart.save();

    res.status(201).json({ message: "Order placed successfully", order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error placing order" });
  }
});

// GET all orders for logged-in user
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find({ user: req.userId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error fetching orders" });
  }
});

module.exports = router;
