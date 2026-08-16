function getConfig() {
  return window.PORTFOLIO_CONFIG || {};
}

function escapeHtml(value) {
  return window.PortfolioSafe?.escapeHtml(value) ?? "";
}

function safeHttpUrl(url) {
  return window.PortfolioSafe?.isSafeHttpUrl(url) ? url : "";
}

function safeGithubUrl(url) {
  return window.PortfolioSafe?.isSafeGithubUrl(url) ? url : "";
}

function safeEmail(email) {
  return window.PortfolioSafe?.isSafeEmail(email) ? email : "";
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
    heroTitle.innerHTML = `${escapeHtml(i18n.t("hero.hello"))} <span class="highlight">${escapeHtml(name)}</span>`;
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
      <p class="card-kicker">${escapeHtml(item.period || "")}</p>
      <h3>${escapeHtml(item.title || "")}</h3>
      <p>${escapeHtml(item.description || "")}</p>
    `;
    container.appendChild(article);
  });
}

function renderContact() {
  const list = document.getElementById("contact-list");
  const contact = getConfig().contact || {};
  if (!list) return;

  const items = [];

  const email = safeEmail(contact.email);
  const linkedin = safeHttpUrl(contact.linkedin);
  const github = safeGithubUrl(contact.github);

  if (email) {
    items.push(
      `<li><a href="mailto:${escapeHtml(email)}">Email: ${escapeHtml(email)}</a></li>`
    );
  }
  if (linkedin) {
    items.push(
      `<li><a href="${escapeHtml(linkedin)}" target="_blank" rel="noopener noreferrer">LinkedIn</a></li>`
    );
  }
  if (github) {
    items.push(
      `<li><a href="${escapeHtml(github)}" target="_blank" rel="noopener noreferrer">GitHub</a></li>`
    );
  }

  list.innerHTML = items.join("");
}

function galleryMark(kind) {
  const icons = {
    games:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="8" width="18" height="11" rx="3"/><path d="M8 13h3M9.5 11.5v3M16 12.5h.01M18 14.5h.01" stroke-linecap="round"/></svg>',
    music:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M9 18V6l12-2v12"/><circle cx="7" cy="18" r="2.5"/><circle cx="19" cy="16" r="2.5"/></svg>',
    photos:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="6" width="18" height="13" rx="2"/><path d="M3 15l4.5-4.5 3.5 3.5 2.5-2.5L21 17"/><circle cx="9" cy="10" r="1.2"/></svg>',
    code: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M8 8 4 12l4 4M16 8l4 4-4 4M13 5l-2 14"/></svg>'
  };
  return `<span class="gallery-mark" aria-hidden="true">${icons[kind] || ""}</span>`;
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
      subtitle: g.gamesSubtitle || "",
      mark: "games"
    },
    {
      href: "./pages/musica.html",
      title: g.musicTitle || "Music",
      subtitle: g.musicSubtitle || "",
      mark: "music"
    },
    {
      href: "./pages/fotos.html",
      title: g.photosTitle || "Photos",
      subtitle: g.photosSubtitle || "",
      mark: "photos"
    },
    {
      href: "./pages/codigos.html",
      title: g.codeTitle || "Code",
      subtitle: g.codeSubtitle || "",
      mark: "code"
    }
  ];

  grid.innerHTML = categories
    .map(
      (item) => `
        <a class="gallery-item" href="${escapeHtml(item.href)}">
          ${galleryMark(item.mark)}
          <h3>${escapeHtml(item.title)}</h3>
          <p class="muted">${escapeHtml(item.subtitle)}</p>
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
      const repoUrl = safeGithubUrl(repo.html_url);
      const openLabel = escapeHtml(i18n.t("projects.openGithub"));
      article.innerHTML = `
        <h3>${escapeHtml(repo.name)}</h3>
        <p>${escapeHtml(repo.description || i18n.t("projects.noDescription"))}</p>
        <p class="card-badge">${escapeHtml(repo.language || i18n.t("projects.noLanguage"))}</p>
        ${
          repoUrl
            ? `<a class="btn ghost" href="${escapeHtml(repoUrl)}" target="_blank" rel="noopener noreferrer">${openLabel}</a>`
            : ""
        }
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
