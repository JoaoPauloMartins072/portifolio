const THEME_KEY = "portfolio-theme";

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

function getCurrentTheme() {
  return document.documentElement.getAttribute("data-theme") || getPreferredTheme();
}

function applyTheme(theme) {
  const next = theme === "dark" ? "dark" : "light";
  document.documentElement.setAttribute("data-theme", next);
  localStorage.setItem(THEME_KEY, next);
  return next;
}

function sunIcon() {
  return `
    <svg class="theme-icon" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="3.6" fill="none" stroke="currentColor" stroke-width="2"/>
      <path d="M12 3v2M12 19v2M4.9 4.9l1.5 1.5M17.6 17.6l1.5 1.5M3 12h2M19 12h2M4.9 19.1l1.5-1.5M17.6 6.4l1.5-1.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    </svg>
  `;
}

function moonIcon() {
  return `
    <svg class="theme-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M15.2 4.1a8.2 8.2 0 1 0 4.7 14.4 6.6 6.6 0 1 1-4.7-14.4z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
    </svg>
  `;
}

function renderThemeSwitcher() {
  const host = document.getElementById("theme-switcher");
  if (!host) return;

  const current = getCurrentTheme();
  const isDark = current === "dark";
  const label = window.PortfolioI18n
    ? window.PortfolioI18n.t(isDark ? "theme.toLight" : "theme.toDark")
    : isDark
      ? "Light mode"
      : "Dark mode";

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
    renderThemeSwitcher();
  });
}

function initTheme() {
  applyTheme(getPreferredTheme());
  renderThemeSwitcher();
}

window.PortfolioTheme = {
  applyTheme,
  getCurrentTheme,
  renderThemeSwitcher,
  initTheme
};

document.documentElement.setAttribute("data-theme", getPreferredTheme());
