# GrocerEasy — Grocery E-commerce App (Node.js + Express + MongoDB)

A RapidBazzar-style grocery delivery website with full Registration/Login authentication,
product catalog, cart, and order placement — all connected to MongoDB.

## Folder Structure
```
grocery-app/
│── server.js              -> Main backend server (Express)
│── seed.js                -> Script to add sample products to MongoDB
│── package.json            -> Dependencies
│── .env                     -> MongoDB URI, JWT secret, PORT config
│── models/
│    ├── User.js             -> User schema
│    ├── Product.js          -> Product schema
│    ├── Cart.js             -> Cart schema
│    └── Order.js            -> Order schema
│── middleware/
│    └── auth.js             -> JWT auth middleware (protects cart/order routes)
│── routes/
│    ├── auth.js             -> Register / Login APIs
│    ├── products.js         -> Product listing / category / search APIs
│    ├── cart.js             -> Add / update / remove cart items (login required)
│    └── orders.js           -> Place order / view order history (login required)
│── public/
│    ├── index.html          -> Homepage (product grid, categories, search)
│    ├── login.html          -> Login page
│    ├── register.html       -> Register page
│    ├── cart.html           -> Cart page
│    ├── orders.html         -> Order history page
│    ├── css/style.css       -> All styling
│    ├── js/
│    │    ├── auth.js         -> Login/Register + header auth logic
│    │    ├── products.js     -> Product listing + add to cart
│    │    ├── cart.js         -> Cart page logic
│    │    └── orders.js       -> Orders page logic
│    └── images/
│         ├── products/       -> PUT YOUR PRODUCT IMAGES HERE
│         └── banners/        -> PUT YOUR BANNER IMAGES HERE
```

## Setup Steps

### 1. Install Node.js (if not already)
https://nodejs.org

### 2. Install MongoDB (local) OR use MongoDB Atlas (free cloud)
- Local: https://www.mongodb.com/try/download/community
- Cloud: https://www.mongodb.com/cloud/atlas (create free cluster, get connection string)

### 3. Open terminal in the project folder
```
cd grocery-app
```

### 4. Install dependencies
```
npm install
```

### 5. Configure `.env`
Default (local MongoDB) already set:
```
MONGO_URI=mongodb://127.0.0.1:27017/groceryapp
JWT_SECRET=grocerySecretKey123
PORT=5000
```
For MongoDB Atlas, replace MONGO_URI with your Atlas connection string:
```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/groceryapp
```

### 6. Add your product images
Put your photos inside `public/images/products/`. Match the filenames used in `seed.js`
(e.g. `banana.jpg`, `apple.jpg`, `tomato.jpg`...) OR open `seed.js` and change the
`image` field for each product to match your own filenames.

If an image is missing, the site automatically falls back to `placeholder.jpg`.

### 7. Seed sample products into MongoDB (run once)
```
npm run seed
```
This clears old products and inserts 16 sample grocery items across categories
(Fruits, Vegetables, Dairy, Staples, Snacks, Beverages, Personal Care, Household).

### 8. Start the server
```
npm start
```
You should see:
```
MongoDB connected successfully
Server running on http://localhost:5000
```

### 9. Open in browser
```
http://localhost:5000
```

## How Authentication Works
1. **Register** (`/register` page) → name, email, phone, password sent to
   `POST /api/auth/register` → password is hashed with bcrypt → user saved in MongoDB.
2. **Login** (`/login` page) → email + password sent to `POST /api/auth/login` →
   password compared with bcrypt → on success, a JWT token is returned.
3. The token is saved in the browser's `localStorage` and sent as
   `Authorization: Bearer <token>` on every Cart/Order request.
4. `middleware/auth.js` verifies this token on protected routes — if invalid or
   missing, the request is rejected with 401.

## Core Flow
```
Browse products (no login needed)
   → Add to Cart (login required — redirects to login if not logged in)
   → View Cart (update quantity / remove items)
   → Enter delivery address → Place Order
   → View order status on My Orders page
```

## Notes
- MongoDB must be running (`mongod` for local install, or your Atlas cluster must be reachable).
- To re-seed products after editing `seed.js`, just run `npm run seed` again.
- If port 5000 is already in use, change `PORT` in `.env`.
- To add new categories, just add products with a new `category` value in `seed.js` and re-seed.
