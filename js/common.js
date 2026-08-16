function initMenu() {
  const menuToggle = document.getElementById("menu-toggle");
  const menu = document.getElementById("menu");
  if (!menuToggle || !menu) return;

  menuToggle.addEventListener("click", () => {
    menu.classList.toggle("open");
  });

  menu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      menu.classList.remove("open");
    });
  });
}

function initFooter() {
  const year = document.getElementById("year");
  const footerName = document.getElementById("footer-name");
  const profileName = window.PORTFOLIO_CONFIG?.profile?.name;

  if (year) {
    year.textContent = new Date().getFullYear();
  }

  if (footerName && profileName) {
    footerName.textContent = profileName;
  }
}

function applyLanguage() {
  if (!window.PortfolioI18n) return;
  window.PortfolioI18n.renderLangSwitcher();
  window.PortfolioI18n.applyStaticI18n();
  if (window.PortfolioTheme) {
    window.PortfolioTheme.renderThemeSwitcher();
  }
  window.dispatchEvent(new CustomEvent("portfolio:contentrefresh"));
}

function initCommon() {
  initMenu();
  initFooter();

  if (window.PortfolioTheme) {
    window.PortfolioTheme.initTheme();
  }

  applyLanguage();

  window.addEventListener("portfolio:langchange", () => {
    applyLanguage();
  });
}

document.addEventListener("DOMContentLoaded", initCommon);
