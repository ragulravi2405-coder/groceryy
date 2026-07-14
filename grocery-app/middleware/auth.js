const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "grocerySecretKey123";

function authMiddleware(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // "Bearer TOKEN"

  if (!token) {
    return res.status(401).json({ message: "No token provided. Please login." });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token. Please login again." });
  }
}

module.exports = authMiddleware;
