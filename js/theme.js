const THEME_KEY = "portfolio-theme";
const COLOR_KEY = "portfolio-color";

function getPreferredTheme() {
  const saved = localStorage.getItem(THEME_KEY);
  if (saved === "light" || saved === "dark") {
    return saved;
  }

  if (
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  ) {
    return "dark";
  }

  return "light";
}

function getPreferredColor() {
  const saved = localStorage.getItem(COLOR_KEY);
  if (saved === "red" || saved === "green" || saved === "blue") {
    return saved;
  }
  return "red";
}

function getCurrentTheme() {
  return document.documentElement.getAttribute("data-theme") || getPreferredTheme();
}

function getCurrentColor() {
  return document.documentElement.getAttribute("data-color") || getPreferredColor();
}

function getNextColor(current) {
  const colors = ["red", "green", "blue"];
  const index = colors.indexOf(current);
  return colors[(index + 1) % colors.length];
}

function applyTheme(theme) {
  const next = theme === "dark" ? "dark" : "light";
  document.documentElement.setAttribute("data-theme", next);
  localStorage.setItem(THEME_KEY, next);
  return next;
}

function applyColor(color) {
  const validColors = ["red", "green", "blue"];
  const next = validColors.includes(color) ? color : "red";
  document.documentElement.setAttribute("data-color", next);
  localStorage.setItem(COLOR_KEY, next);
  return next;
}

function cycleColor() {
  const current = getCurrentColor();
  const next = getNextColor(current);
  applyColor(next);
  return next;
}

function colorIndicator(color) {
  const letter = color.charAt(0).toUpperCase();
  return `
    <svg class="theme-icon" viewBox="0 0 24 24" aria-hidden="true">
      <text x="12" y="16" font-family="Arial, sans-serif" font-size="14" font-weight="bold" text-anchor="middle" fill="currentColor">${letter}</text>
    </svg>
  `;
}

function sunIcon() {
  return `
    <svg class="theme-icon" viewBox="0 0 24 24" aria-hidden="true" style="width: 14px; height: 14px;">
      <circle cx="12" cy="12" r="3.6" fill="none" stroke="currentColor" stroke-width="2"/>
      <path d="M12 3v2M12 19v2M4.9 4.9l1.5 1.5M17.6 17.6l1.5 1.5M3 12h2M19 12h2M4.9 19.1l1.5-1.5M17.6 6.4l1.5-1.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    </svg>
  `;
}

function moonIcon() {
  return `
    <svg class="theme-icon" viewBox="0 0 24 24" aria-hidden="true" style="width: 14px; height: 14px;">
      <path d="M15.2 4.1a8.2 8.2 0 1 0 4.7 14.4 6.6 6.6 0 1 1-4.7-14.4z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
    </svg>
  `;
}

function renderModeSwitcher() {
  const host = document.getElementById("mode-switcher");
  if (!host) return;

  const currentTheme = getCurrentTheme();
  const isDark = currentTheme === "dark";
  const label = isDark ? "Light mode" : "Dark mode";

  host.innerHTML = `
    <button
      class="theme-toggle ${isDark ? "is-dark" : "is-light"}"
      type="button"
      aria-label="${label}"
      title="${label}"
    >
      <span class="theme-toggle-track" aria-hidden="true">
        <span class="theme-toggle-thumb">
          ${isDark ? moonIcon() : sunIcon()}
        </span>
      </span>
    </button>
  `;

  const button = host.querySelector(".theme-toggle");
  if (!button) return;

  button.addEventListener("click", () => {
    applyTheme(isDark ? "light" : "dark");
    renderModeSwitcher();
  });
}

function renderThemeSwitcher() {
  const host = document.getElementById("theme-switcher");
  if (!host) return;

  const currentColor = getCurrentColor();
  const colorName = currentColor.charAt(0).toUpperCase() + currentColor.slice(1);
  const label = `Cycle RGB color (Current: ${colorName})`;

  host.innerHTML = `
    <button
      class="theme-toggle rgb-toggle"
      type="button"
      aria-label="${label}"
      title="${label}"
    >
      <span class="theme-toggle-track" aria-hidden="true">
        <span class="theme-toggle-thumb">
          ${colorIndicator(currentColor)}
        </span>
      </span>
    </button>
  `;

  const button = host.querySelector(".theme-toggle");
  if (!button) return;

  button.addEventListener("click", () => {
    cycleColor();
    renderThemeSwitcher();
  });
}

function initTheme() {
  applyTheme(getPreferredTheme());
  applyColor(getPreferredColor());
  renderModeSwitcher();
  renderThemeSwitcher();
}

window.PortfolioTheme = {
  applyTheme,
  applyColor,
  getCurrentTheme,
  getCurrentColor,
  cycleColor,
  renderModeSwitcher,
  renderThemeSwitcher,
  initTheme
};

document.documentElement.setAttribute("data-theme", getPreferredTheme());
document.documentElement.setAttribute("data-color", getPreferredColor());
