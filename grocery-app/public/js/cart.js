async function loadCart() {
  if (!isLoggedIn()) {
    document.getElementById("cartItems").innerHTML = `
      <div class="empty-msg">Please <a href="login.html" style="color:#1e7a4a;font-weight:bold;">login</a> to view your cart.</div>
    `;
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/cart`, {
      headers: { "Authorization": `Bearer ${getToken()}` }
    });
    const cart = await res.json();
    renderCart(cart.items || []);
  } catch (err) {
    console.error(err);
    showMessage("Could not load cart. Is the backend running?", "error");
  }
}

function renderCart(items) {
  const container = document.getElementById("cartItems");
  const summary = document.getElementById("cartSummary");

  if (items.length === 0) {
    container.innerHTML = `<div class="empty-msg">Your cart is empty. <a href="index.html" style="color:#1e7a4a;font-weight:bold;">Start shopping</a></div>`;
    summary.style.display = "none";
    return;
  }

  container.innerHTML = "";
  let total = 0;

  items.forEach((item) => {
    const p = item.product;
    if (!p) return;
    const price = p.discountPrice || p.price;
    total += price * item.quantity;

    const div = document.createElement("div");
    div.className = "cart-item";
    div.innerHTML = `
      <img src="images/products/${p.image}" alt="${p.name}" onerror="this.src='images/products/placeholder.jpg'">
      <div class="cart-item-info">
        <h4>${p.name}</h4>
        <div class="unit">${p.unit} • ₹${price}</div>
      </div>
      <div class="qty-controls">
        <button onclick="changeQty('${p._id}', ${item.quantity - 1})">-</button>
        <span>${item.quantity}</span>
        <button onclick="changeQty('${p._id}', ${item.quantity + 1})">+</button>
      </div>
      <button class="remove-btn" onclick="removeItem('${p._id}')">Remove</button>
    `;
    container.appendChild(div);
  });

  document.getElementById("cartTotal").textContent = `₹${total.toFixed(2)}`;
  summary.style.display = "block";
}

async function changeQty(productId, newQty) {
  if (newQty < 1) {
    return removeItem(productId);
  }
  try {
    const res = await fetch(`${API_BASE}/cart/update`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${getToken()}`
      },
      body: JSON.stringify({ productId, quantity: newQty })
    });
    const data = await res.json();
    if (res.ok) {
      renderCart(data.cart.items);
    }
  } catch (err) {
    showMessage("Could not update quantity", "error");
  }
}

async function removeItem(productId) {
  try {
    const res = await fetch(`${API_BASE}/cart/remove/${productId}`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${getToken()}` }
    });
    const data = await res.json();
    if (res.ok) {
      renderCart(data.cart.items);
    }
  } catch (err) {
    showMessage("Could not remove item", "error");
  }
}

async function placeOrder() {
  const address = document.getElementById("address").value.trim();
  if (!address) {
    showMessage("Please enter a delivery address", "error");
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/orders/place`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${getToken()}`
      },
      body: JSON.stringify({ address })
    });
    const data = await res.json();

    if (res.ok) {
      showMessage("Order placed successfully!", "success");
      setTimeout(() => { window.location.href = "orders.html"; }, 1200);
    } else {
      showMessage(data.message || "Could not place order", "error");
    }
  } catch (err) {
    showMessage("Server error placing order", "error");
  }
}

document.addEventListener("DOMContentLoaded", loadCart);
