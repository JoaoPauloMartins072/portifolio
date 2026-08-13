function getConfig() {
  return window.PORTFOLIO_CONFIG || {};
}

function getI18n() {
  return window.PortfolioI18n;
}

function applyProfileContent() {
  const i18n = getI18n();
  if (!i18n) return;

  const dict = i18n.getDict();
  const profile = dict.profile || {};
  const name = getConfig().profile?.name || "Joao Paulo Martins";

  const heroTag = document.getElementById("hero-tag");
  const heroTitle = document.getElementById("hero-title");
  const heroText = document.getElementById("hero-text");
  const aboutText = document.getElementById("about-text");

  if (heroTag && profile.roleTag) {
    heroTag.textContent = profile.roleTag;
  }

  if (heroTitle) {
    heroTitle.innerHTML = `${i18n.t("hero.hello")} <span class="highlight">${name}</span>`;
  }

  if (heroText && profile.intro) {
    heroText.textContent = profile.intro;
  }

  if (aboutText && profile.about) {
    aboutText.textContent = profile.about;
  }
}

function renderExperiences() {
  const container = document.getElementById("experience-cards");
  const i18n = getI18n();
  if (!container || !i18n) return;

  const experiences = Array.isArray(i18n.getDict().experience)
    ? i18n.getDict().experience
    : [];
  container.innerHTML = "";

  experiences.forEach((item) => {
    const article = document.createElement("article");
    article.className = "card";
    article.innerHTML = `
      <h3>${item.title || ""}</h3>
      <p class="muted">${item.period || ""}</p>
      <p>${item.description || ""}</p>
    `;
    container.appendChild(article);
  });
}

function renderContact() {
  const list = document.getElementById("contact-list");
  const contact = getConfig().contact || {};
  if (!list) return;

  const items = [];

  if (contact.email) {
    items.push(
      `<li><a href="mailto:${contact.email}">Email: ${contact.email}</a></li>`
    );
  }
  if (contact.linkedin) {
    items.push(
      `<li><a href="${contact.linkedin}" target="_blank" rel="noreferrer">LinkedIn</a></li>`
    );
  }
  if (contact.github) {
    items.push(
      `<li><a href="${contact.github}" target="_blank" rel="noreferrer">GitHub</a></li>`
    );
  }

  list.innerHTML = items.join("");
}

function renderGallery() {
  const grid = document.getElementById("gallery-grid");
  const i18n = getI18n();
  if (!grid || !i18n) return;

  const g = i18n.getDict().gallery || {};
  const categories = [
    {
      href: "./pages/games.html",
      title: g.gamesTitle || "Games",
      subtitle: g.gamesSubtitle || ""
    },
    {
      href: "./pages/musica.html",
      title: g.musicTitle || "Music",
      subtitle: g.musicSubtitle || ""
    },
    {
      href: "./pages/fotos.html",
      title: g.photosTitle || "Photos",
      subtitle: g.photosSubtitle || ""
    },
    {
      href: "./pages/codigos.html",
      title: g.codeTitle || "Code",
      subtitle: g.codeSubtitle || ""
    }
  ];

  grid.innerHTML = categories
    .map(
      (item) => `
        <a class="gallery-item" href="${item.href}">
          <h3>${item.title}</h3>
          <p class="muted">${item.subtitle}</p>
        </a>
      `
    )
    .join("");
}

function getProjectsLimit(api) {
  const desktop = Number(api.githubProjectsLimit) || 6;
  const mobile = Number(api.githubProjectsLimitMobile) || desktop;
  const isMobile =
    typeof window.matchMedia === "function" &&
    window.matchMedia("(max-width: 900px)").matches;
  return isMobile ? mobile : desktop;
}

function sortGithubRepos(repos, sort) {
  const list = Array.isArray(repos) ? repos.slice() : [];
  if (sort === "stars") {
    list.sort(
      (a, b) => (b.stargazers_count || 0) - (a.stargazers_count || 0)
    );
  }
  return list;
}

async function renderGithubProjects() {
  const cards = document.getElementById("project-cards");
  const meta = document.getElementById("projects-meta");
  const i18n = getI18n();
  const api = getConfig().api || {};
  const username = api.githubUsername;
  const sort = api.githubProjectsSort === "stars" ? "stars" : "updated";
  const limit = getProjectsLimit(api);

  if (!cards || !meta || !i18n) return;

  if (!username || username === "seu-usuario") {
    meta.textContent = i18n.t("projects.missingUser");
    cards.innerHTML = "";
    return;
  }

  meta.textContent = i18n.t("projects.loading");

  try {
    const perPage = sort === "stars" ? 100 : limit;
    const response = await fetch(
      `https://api.github.com/users/${username}/repos?sort=updated&per_page=${perPage}`
    );

    if (!response.ok) {
      throw new Error(`GitHub API respondeu ${response.status}`);
    }

    const payload = await response.json();
    const repos = sortGithubRepos(payload, sort).slice(0, limit);
    meta.textContent = i18n.t("projects.loaded", { user: username });
    cards.innerHTML = "";

    repos.forEach((repo) => {
      const article = document.createElement("article");
      article.className = "card";
      article.innerHTML = `
        <h3>${repo.name}</h3>
        <p>${repo.description || i18n.t("projects.noDescription")}</p>
        <p class="muted">${repo.language || i18n.t("projects.noLanguage")}</p>
        <a class="btn ghost" href="${repo.html_url}" target="_blank" rel="noreferrer">${i18n.t("projects.openGithub")}</a>
      `;
      cards.appendChild(article);
    });
  } catch (error) {
    meta.textContent = i18n.t("projects.error");
    cards.innerHTML = "";
    console.error(error);
  }
}

function bootHome() {
  applyProfileContent();
  renderExperiences();
  renderContact();
  renderGallery();
  renderGithubProjects();
}

function startHome() {
  bootHome();
  window.addEventListener("portfolio:contentrefresh", bootHome);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", startHome);
} else {
  startHome();
}
