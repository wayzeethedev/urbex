const $ = s => document.querySelector(s);
const splash = $("#splash");
const toLogin = $("#to-login");
const loginSection = $("#login");
const loginForm = $("#login-form");
const loginError = $("#login-error");
const LS_KEY = "mu_account_id";
const app = document.getElementById("app");

let data = null;

function showSection(el) {
  document.querySelectorAll(".screen").forEach(s => s.classList.add("hidden"));
  el.classList.remove("hidden");
}

async function fetchData() {
  try {
    const res = await fetch("./data.json");
    data = await res.json();
  } catch (e) {
    console.error("Error loading data.json", e);
  }
}

function redirectInApp() {
  window.location.href = "/home.html";
}

function tryAutoLogin() {
  const id = localStorage.getItem(LS_KEY);
  if (!id || !data) return;

  const acc = data.accounts.find(a => a.id === id);
  if (!acc || acc.banned) {
    localStorage.removeItem(LS_KEY);
    showSection(splash);
    return;
  }

  redirectInApp();
}

toLogin.addEventListener("click", () => showSection(loginSection));

loginForm.addEventListener("submit", e => {
  e.preventDefault();
  loginError.classList.add("hidden");

  const code = loginForm.code.value.trim();
  const acc = data.accounts.find(a => a.code === code);

  if (!acc) {
    loginError.textContent = "Invalid invite code";
    loginError.classList.remove("hidden");
    return;
  }

  if (acc.banned) {
    loginError.textContent = "Account banned";
    loginError.classList.remove("hidden");
    return;
  }

  localStorage.setItem(LS_KEY, acc.id);
  redirectInApp();
});

document.addEventListener("DOMContentLoaded", async () => {
  await fetchData();
  tryAutoLogin();
});
