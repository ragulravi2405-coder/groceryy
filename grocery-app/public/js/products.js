let allCategories = [];

async function loadCategories() {
  try {
    const res = await fetch(`${API_BASE}/products/categories/list`);
    allCategories = await res.json();

    const list = document.getElementById("categoryList");
    allCategories.forEach((cat) => {
      const li = document.createElement("li");
      li.textContent = cat;
      li.dataset.category = cat;
      li.onclick = () => selectCategory(cat, li);
      list.appendChild(li);
    });
  } catch (err) {
    console.error("Failed to load categories", err);
  }
}

function selectCategory(cat, liEl) {
  document.querySelectorAll("#categoryList li").forEach((li) => li.classList.remove("active"));
  liEl.classList.add("active");
  document.getElementById("sectionTitle").textContent = cat || "All Products";
  loadProducts({ category: cat });
}

async function loadProducts(params = {}) {
  try {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/products?${query}`);
    const products = await res.json();
    renderProducts(products);
  } catch (err) {
    console.error("Failed to load products", err);
    document.getElementById("productGrid").innerHTML = `<p style="color:#c0392b;">Could not load products. Is the backend running and MongoDB connected?</p>`;
  }
}

function renderProducts(products) {
  const grid = document.getElementById("productGrid");
  grid.innerHTML = "";

  if (products.length === 0) {
    grid.innerHTML = `<p style="color:#667066;">No products found.</p>`;
    return;
  }

  products.forEach((p) => {
    const hasDiscount = p.discountPrice && p.discountPrice < p.price;
    const card = document.createElement("div");
    card.className = "product-card";
    card.innerHTML = `
      <img src="images/products/${p.image}" alt="${p.name}" onerror="this.src='images/products/placeholder.jpg'">
      <h4>${p.name}</h4>
      <div class="unit">${p.unit}</div>
      <div class="price">
        ₹${hasDiscount ? p.discountPrice : p.price}
        ${hasDiscount ? `<span class="old">₹${p.price}</span>` : ""}
      </div>
      <button onclick="addToCart('${p._id}')">Add to Cart</button>
    `;
    grid.appendChild(card);
  });
}

function searchProducts() {
  const term = document.getElementById("searchInput").value;
  document.getElementById("sectionTitle").textContent = term ? `Search: "${term}"` : "All Products";
  loadProducts({ search: term });
}

async function addToCart(productId) {
  if (!isLoggedIn()) {
    alert("Please login to add items to your cart.");
    window.location.href = "login.html";
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/cart/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${getToken()}`
      },
      body: JSON.stringify({ productId, quantity: 1 })
    });
    const data = await res.json();

    if (res.ok) {
      updateCartCount();
    } else {
      alert(data.message || "Could not add to cart");
    }
  } catch (err) {
    alert("Server error adding to cart");
  }
}

async function updateCartCount() {
  const el = document.getElementById("cartCount");
  if (!el) return;
  if (!isLoggedIn()) {
    el.textContent = "0";
    return;
  }
  try {
    const res = await fetch(`${API_BASE}/cart`, {
      headers: { "Authorization": `Bearer ${getToken()}` }
    });
    const cart = await res.json();
    const count = (cart.items || []).reduce((sum, i) => sum + i.quantity, 0);
    el.textContent = count;
  } catch (err) {
    el.textContent = "0";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("productGrid")) {
    loadCategories();
    loadProducts();
    updateCartCount();
  }
});
