
/* Theme toggle with persistence */
(function themeInit() {
  const body = document.body;
  const toggleBtn = document.getElementById('themeToggle');
  const saved = localStorage.getItem('theme') || 'light';
  body.classList.toggle('theme-dark', saved === 'dark');
  body.classList.toggle('theme-light', saved !== 'dark');

  function setTheme(next) {
    localStorage.setItem('theme', next);
    body.classList.toggle('theme-dark', next === 'dark');
    body.classList.toggle('theme-light', next !== 'dark');
    if (toggleBtn) toggleBtn.textContent = next === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode';
  }
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const current = localStorage.getItem('theme') || 'light';
      setTheme(current === 'dark' ? 'light' : 'dark');
    });
    setTheme(saved);
  }
})();

/* Temperature widget (Open-Meteo API) */
(function tempWidgetInit() {
  const valueEl = document.getElementById('tempValue');
  const unitEl = document.getElementById('tempUnit');
  const statusEl = document.getElementById('tempStatus');
  const spinnerEl = document.getElementById('tempSpinner');
  const refreshBtn = document.getElementById('refreshTemp');
  const toggleUnitBtn = document.getElementById('toggleUnit');

  if (!valueEl || !unitEl || !statusEl) return; // only on pages that have the widget

  let tempC = null;      // store Celsius
  let showF = false;     // unit toggle

  const DEFAULT_COORDS = { lat: 14.4426, lon: 79.9865 }; // Nellore fallback

  function toF(c) { return (c * 9/5) + 32; }
  function display() {
    if (tempC == null) return;
    const shown = showF ? toF(tempC) : tempC;
    valueEl.textContent = Math.round(shown * 10) / 10;
    unitEl.textContent = showF ? '°F' : '°C';
  }

  async function fetchTemp(lat, lon) {
    spinnerEl?.removeAttribute('hidden');
    statusEl.textContent = 'Fetching temperature…';
    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m&timezone=auto`;
      const res = await fetch(url, { cache: 'no-store' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (data?.current?.temperature_2m == null) throw new Error('No temperature in response');
      tempC = data.current.temperature_2m;
      statusEl.textContent = `Updated: ${new Date(data.current.time).toLocaleString()}`;
      display();
    } catch (err) {
      statusEl.textContent = 'Failed to fetch live data. Showing fallback.';
      // Simple fallback: random-ish Celsius around 30°C
      tempC = 28 + Math.random() * 6;
      display();
    } finally {
      spinnerEl?.setAttribute('hidden', '');
    }
  }

  function getLocationAndFetch() {
    if (!navigator.geolocation) {
      fetchTemp(DEFAULT_COORDS.lat, DEFAULT_COORDS.lon);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      pos => fetchTemp(pos.coords.latitude, pos.coords.longitude),
      _err => fetchTemp(DEFAULT_COORDS.lat, DEFAULT_COORDS.lon),
      { enableHighAccuracy: true, timeout: 5000 }
    );
  }

  // Initialize
  getLocationAndFetch();

  // Events
  refreshBtn?.addEventListener('click', getLocationAndFetch);
  toggleUnitBtn?.addEventListener('click', () => { showF = !showF; display(); });
})();

/* Contact form (client-side validation demo) */
(function contactFormInit() {
  const form = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');
  if (!form || !status) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();

    if (!name || !email || !message) {
      status.textContent = 'Please fill out all fields.';
      status.style.color = 'tomato';
      return;
    }
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!emailOk) {
      status.textContent = 'Please enter a valid email address.';
      status.style.color = 'tomato';
      return;
    }

    // Simulate send
    status.textContent = '✅ Message sent (demo). No backend configured.';
    status.style.color = 'green';
    form.reset();
  });
})();
