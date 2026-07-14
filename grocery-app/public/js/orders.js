async function loadOrders() {
  const container = document.getElementById("ordersList");

  if (!isLoggedIn()) {
    container.innerHTML = `<div class="empty-msg">Please <a href="login.html" style="color:#1e7a4a;font-weight:bold;">login</a> to view your orders.</div>`;
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/orders`, {
      headers: { "Authorization": `Bearer ${getToken()}` }
    });
    const orders = await res.json();

    if (!orders.length) {
      container.innerHTML = `<div class="empty-msg">No orders yet. <a href="index.html" style="color:#1e7a4a;font-weight:bold;">Start shopping</a></div>`;
      return;
    }

    container.innerHTML = "";
    orders.forEach((order) => {
      const date = new Date(order.createdAt).toLocaleDateString("en-IN", {
        day: "numeric", month: "short", year: "numeric"
      });
      const itemsText = order.items.map((i) => `${i.name} x${i.quantity}`).join(", ");

      const div = document.createElement("div");
      div.className = "order-card";
      div.innerHTML = `
        <div class="order-head">
          <span>Order #${order._id.slice(-6).toUpperCase()} • ${date}</span>
          <span class="status-badge status-${order.status.replace(/\s/g, "")}">${order.status}</span>
        </div>
        <div style="font-size:14px;margin-bottom:6px;">${itemsText}</div>
        <div style="font-size:13.5px;color:#667066;">Deliver to: ${order.address}</div>
        <div style="font-weight:bold;margin-top:8px;">Total: ₹${order.totalAmount.toFixed(2)}</div>
      `;
      container.appendChild(div);
    });
  } catch (err) {
    console.error(err);
    container.innerHTML = `<p style="color:#c0392b;">Could not load orders. Is the backend running?</p>`;
  }
}

document.addEventListener("DOMContentLoaded", loadOrders);
