const API_BASE = "/api";

function getToken() {
  return localStorage.getItem("token");
}

function getUserName() {
  return localStorage.getItem("userName");
}

function isLoggedIn() {
  return !!getToken();
}

function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("userName");
  window.location.href = "login.html";
}

function showMessage(text, type) {
  const box = document.getElementById("message");
  if (!box) return;
  box.textContent = text;
  box.className = "message show " + type;
  setTimeout(() => { box.className = "message"; }, 3000);
}

// Update header login/logout link on every page
function renderAuthLink() {
  const el = document.getElementById("authLink");
  if (!el) return;
  if (isLoggedIn()) {
    el.innerHTML = `Hi, ${getUserName() || "User"} | <a href="#" onclick="logout(); return false;">Logout</a>`;
  } else {
    el.innerHTML = `<a href="login.html">Login</a>`;
  }
}

document.addEventListener("DOMContentLoaded", renderAuthLink);

// ---------- REGISTER FORM ----------
const registerForm = document.getElementById("registerForm");
if (registerForm) {
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;
    const password = document.getElementById("password").value;

    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, password })
      });
      const data = await res.json();

      if (res.ok) {
        showMessage("Registration successful! Redirecting to login...", "success");
        setTimeout(() => { window.location.href = "login.html"; }, 1200);
      } else {
        showMessage(data.message || "Registration failed", "error");
      }
    } catch (err) {
      showMessage("Server error. Is the backend running?", "error");
    }
  });
}

// ---------- LOGIN FORM ----------
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("userName", data.user.name);
        showMessage("Login successful!", "success");
        setTimeout(() => { window.location.href = "index.html"; }, 800);
      } else {
        showMessage(data.message || "Login failed", "error");
      }
    } catch (err) {
      showMessage("Server error. Is the backend running?", "error");
    }
  });
}
