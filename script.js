
document.querySelector(".bars-menu").addEventListener("click", () => {
  document.querySelector(".nav-items").classList.toggle("active");
});

document.querySelectorAll(".nav-link").forEach((item) => {
  item.addEventListener("click", () => {
    document.querySelector(".nav-items").classList.toggle("active");
  });
});

document.getElementById("submit-review").addEventListener("click", () => {
  const name = document.getElementById("review-name").value.trim();
  const rating = document.getElementById("review-rating").value;
  const review = document.getElementById("review-text").value.trim();
  const reviewList = document.getElementById("review-list");

  if (name && review) {
    const stars = "★".repeat(rating) + "☆".repeat(5 - rating);
    const reviewBox = document.createElement("div");
    reviewBox.style.borderTop = "1px solid #ddd";
    reviewBox.style.padding = "1rem 0";
    reviewBox.innerHTML = `
  <strong>${name}</strong><br>
  <span style="color: gold; font-size: 1.2rem;">${stars}</span>
  <p>${review}</p>
`;
    reviewList.prepend(reviewBox);

    document.getElementById("review-name").value = "";
    document.getElementById("review-rating").value = "5";
    document.getElementById("review-text").value = "";
  } else {
    alert("Please enter your name and review.");
  }
});

const favIcon = document.getElementById("fav-icon");
let isFavorite = false;

const favorite = {
  title: document.getElementById("place-title").textContent,
  price: document.getElementById("price").textContent,
  img: document.getElementById("place-img").src
};

const savedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
if (savedFavorites.some(f => f.title === favorite.title)) {
  favIcon.classList.remove("far");
  favIcon.classList.add("fas");
  favIcon.style.backgroundColor = "black";
  favIcon.style.color = "white";
  isFavorite = true;
}

function filterEvents(category) {
  const cards = document.querySelectorAll(".event-card");
  cards.forEach(card => {
    if (category === "all" || card.dataset.category === category) {
      card.style.display = "block";
    } else {
      card.style.display = "none";
    }
  });
}


(function () {
  const API_HINTS = ['api_login', 'api-login', 'login.php'];
  const msgEl = document.getElementById('loginMsg');

  function looksLikeLogin(url) {
    if (!url) return false;
    const u = String(url).toLowerCase();
    return API_HINTS.some(h => u.includes(h));
  }

  function showMessage(text, type = 'info') {
    let el = msgEl || document.getElementById('loginMsg');
    if (!el) {
      const form = document.getElementById('login-form') || document.querySelector('form');
      el = document.createElement('div');
      el.id = 'loginMsg';
      el.className = 'msg';
      if (form) form.insertBefore(el, form.querySelector('button[type="submit"],input[type="submit"]'));
    }
    el.textContent = text;
    el.style.color = (type === 'error') ? '#c0392b' : (type === 'success' ? '#1e8449' : '#7f8c8d');
  }

  function extractMessage(status, data, fallback) {
    if (data && typeof data === 'object') {
      if (status === 429 && data.lock && typeof data.lock.remaining_seconds === 'number') {
        const mins = Math.max(1, Math.ceil(data.lock.remaining_seconds / 60));
        return `Too many login attempts. Please try again after ${mins} minute(s).`;
      }
      if (data.error) return String(data.error);
      if (data.ok === true && data.user && data.user.name) {
        return { ok: true, text: `Login successful. Welcome, ${data.user.name}! `};
      }
    }
    if (status === 429) return 'Too many login attempts. Please try again later.';
    if (status === 401) return 'Invalid email or password.';
    return fallback || `Login failed (HTTP ${status}).`;
  }

  if (window.fetch) {
    const origFetch = window.fetch;
    window.fetch = async function (input, init) {
      const res = await origFetch(input, init);
      try {
        const url = (typeof input === 'string') ? input : (input && input.url);
        if (looksLikeLogin(url)) {
          let data = null;
          try { data = await res.clone().json(); } catch { data = null; }
          const msg = extractMessage(res.status, data, null);
          if (typeof msg === 'string') showMessage(msg, (!res.ok || (data && data.ok === false)) ? 'error' : 'info');
          else if (msg && msg.ok) showMessage(msg.text, 'success');
        }
      } catch {}
      return res;
    };
  }

  (function () {
    const Orig = window.XMLHttpRequest;
    if (!Orig) return;
    function WrappedXHR() {
      const xhr = new Orig();
      let _url = '';
      const _open = xhr.open;
      xhr.open = function (method, url) { _url = url; return _open.apply(xhr, arguments); };
      xhr.addEventListener('load', function () {
        try {
          if (!looksLikeLogin(_url)) return;
          const status = xhr.status;
          let data = null;
          try { data = JSON.parse(xhr.responseText); } catch {}
          const msg = extractMessage(status, data, null);
          if (typeof msg === 'string') showMessage(msg, (status >= 400 || (data && data.ok === false)) ? 'error' : 'info');
          else if (msg && msg.ok) showMessage(msg.text, 'success');
        } catch {}
      });
      return xhr;
    }
    window.XMLHttpRequest = WrappedXHR;
  })();

  if (window.axios && window.axios.interceptors) {
    window.axios.interceptors.response.use(
      function (response) {
        try {
          const url = response?.config?.url;
          if (looksLikeLogin(url)) {
            const data = response?.data;
            const msg = extractMessage(response.status, data, null);
            if (typeof msg === 'string') showMessage(msg, (data && data.ok === false) ? 'error' : 'info');
            else if (msg && msg.ok) showMessage(msg.text, 'success');
          }
        } catch {}
        return response;
      },
      function (error) {
        try {
          const url = error?.config?.url;
          if (looksLikeLogin(url)) {
            const res = error?.response || {};
            const data = res.data;
            const status = res.status || 0;
            const msg = extractMessage(status, data, error?.message);
            if (typeof msg === 'string') showMessage(msg, 'error');
          }
        } catch {}
        return Promise.reject(error);
      }
    );
  }
})(); 


document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('login-form') || document.getElementById('loginForm') || document.querySelector('form');
  if (!form) return;

  const emailInput = document.getElementById('email') || form.querySelector('input[name="email"]');
  const passInput  = document.getElementById('password') || form.querySelector('input[name="password"]');

  let msgEl = document.getElementById('loginMsg');
  if (!msgEl) { msgEl = document.createElement('div'); msgEl.id = 'loginMsg'; msgEl.className = 'msg'; form.appendChild(msgEl); }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = emailInput ? emailInput.value.trim() : '';
    const password = passInput ? passInput.value : '';

    if (!email || !password) {
      msgEl.textContent = 'Please enter email and password.'; msgEl.style.color = '#c0392b';
      return;
    }

    msgEl.textContent = 'Checking credentials...'; msgEl.style.color = '#7f8c8d';

    try {
      const res = await fetch('/backend-php-mysql-scaffold/api_login.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      let data = null;
      try { data = await res.clone().json(); } catch {}

      if (!res.ok || (data && data.ok === false)) {
        let message = (data && data.error) ? data.error : `Login failed (HTTP ${res.status}).`;
        if (res.status === 429 && data && data.lock && typeof data.lock.remaining_seconds === 'number') {
          const mins = Math.max(1, Math.ceil(data.lock.remaining_seconds / 60));
          message = `Too many login attempts. Please try again after ${mins} minute(s).`;
        }
        msgEl.textContent = message; msgEl.style.color = '#c0392b';
        return;
      }

      if (data && data.ok) {
        msgEl.textContent = ` Login successful. Welcome, ${data.user?.name || 'User'}!`; msgEl.style.color = '#1e8449';
      } else {
        msgEl.textContent = 'Login succeeded, but unexpected response format.'; msgEl.style.color = '#1e8449';
      }

    } catch (err) {
      console.error('Login request error:', err);
      msgEl.textContent = 'Network error. Please try again.'; msgEl.style.color = '#c0392b';
    }
  });
});