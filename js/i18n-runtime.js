const LANG_KEY = "portfolio-lang";

function getSupportedLangs() {
  return window.PORTFOLIO_I18N?.supported || ["pt-BR", "en-IE"];
}

function getCurrentLang() {
  const saved = localStorage.getItem(LANG_KEY);
  const supported = getSupportedLangs();
  if (saved && supported.includes(saved)) {
    return saved;
  }
  return window.PORTFOLIO_I18N?.defaultLang || "pt-BR";
}

function setCurrentLang(lang) {
  const supported = getSupportedLangs();
  const next = supported.includes(lang) ? lang : getCurrentLang();
  localStorage.setItem(LANG_KEY, next);
  return next;
}

function t(path, vars = {}) {
  const lang = getCurrentLang();
  const dict = window.PORTFOLIO_I18N?.dictionaries?.[lang] || {};
  const value = path.split(".").reduce((acc, key) => {
    if (acc && typeof acc === "object" && key in acc) {
      return acc[key];
    }
    return undefined;
  }, dict);

  if (typeof value !== "string") {
    return path;
  }

  return value.replace(/\{(\w+)\}/g, (_, key) =>
    vars[key] !== undefined ? String(vars[key]) : `{${key}}`
  );
}

function getDict() {
  const lang = getCurrentLang();
  return window.PORTFOLIO_I18N?.dictionaries?.[lang] || {};
}

function applyStaticI18n() {
  const dict = getDict();
  document.documentElement.lang = dict.meta?.htmlLang || getCurrentLang();

  if (dict.meta?.title) {
    document.title = dict.meta.title;
  }

  const description = dict.meta?.description;
  if (description) {
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", description);
    const og = document.querySelector('meta[property="og:description"]');
    if (og) og.setAttribute("content", description);
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute("content", dict.meta.title);
  }

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    const translated = t(key);
    if (translated !== key) {
      el.textContent = translated;
    }
  });

  document.querySelectorAll("[data-i18n-aria]").forEach((el) => {
    const key = el.getAttribute("data-i18n-aria");
    const translated = t(key);
    if (translated !== key) {
      el.setAttribute("aria-label", translated);
    }
  });
}

function brazilFlag() {
  return `
    <svg class="flag-icon" viewBox="0 0 28 20" aria-hidden="true">
      <rect width="28" height="20" rx="2" fill="#009c3b"/>
      <path d="M14 3.2 24.2 10 14 16.8 3.8 10z" fill="#ffdf00"/>
      <circle cx="14" cy="10" r="3.4" fill="#002776"/>
      <path d="M11.1 9.2c1.7-.7 3.6-.6 5.2.1" fill="none" stroke="#fff" stroke-width="0.7" stroke-linecap="round"/>
    </svg>
  `;
}

function irelandFlag() {
  return `
    <svg class="flag-icon" viewBox="0 0 28 20" aria-hidden="true">
      <rect width="28" height="20" rx="2" fill="#fff"/>
      <rect width="9.4" height="20" rx="2" fill="#169b62"/>
      <path d="M9.4 0h9.2v20H9.4z" fill="#fff"/>
      <rect x="18.6" width="9.4" height="20" rx="2" fill="#ff883e"/>
    </svg>
  `;
}

function renderLangSwitcher() {
  const host = document.getElementById("lang-switcher");
  if (!host) return;

  const current = getCurrentLang();
  host.innerHTML = `
    <button class="lang-btn ${current === "pt-BR" ? "active" : ""}" type="button" data-lang="pt-BR" aria-label="Portugues Brasil" title="BR">
      ${brazilFlag()}
      <span class="lang-code">BR</span>
    </button>
    <button class="lang-btn ${current === "en-IE" ? "active" : ""}" type="button" data-lang="en-IE" aria-label="English Ireland" title="IE">
      ${irelandFlag()}
      <span class="lang-code">IE</span>
    </button>
  `;

  host.querySelectorAll("[data-lang]").forEach((button) => {
    button.addEventListener("click", () => {
      setCurrentLang(button.getAttribute("data-lang"));
      window.dispatchEvent(new CustomEvent("portfolio:langchange"));
    });
  });
}

window.PortfolioI18n = {
  t,
  getDict,
  getCurrentLang,
  setCurrentLang,
  applyStaticI18n,
  renderLangSwitcher
};
