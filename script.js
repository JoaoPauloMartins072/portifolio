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

let remoteProfile = { live: null, experiences: null, loaded: false };
let remoteProfilePromise = null;

async function fetchJson(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) return null;
    return await response.json();
  } catch (_error) {
    return null;
  }
}

async function ensureRemoteProfile() {
  if (remoteProfile.loaded) return remoteProfile;
  if (!remoteProfilePromise) {
    remoteProfilePromise = Promise.all([
      fetchJson("./data/live.json"),
      fetchJson("./data/experiences.json")
    ]).then(([live, experiences]) => {
      remoteProfile = { live, experiences, loaded: true };
      return remoteProfile;
    });
  }
  return remoteProfilePromise;
}

function buildViewProfile() {
  const i18n = getI18n();
  const builder = window.PortfolioProfile;
  if (!i18n || !builder) return null;
  return builder.build({
    config: getConfig(),
    dict: i18n.getDict(),
    live: remoteProfile.live,
    experiences: remoteProfile.experiences,
    lang: i18n.getCurrentLang()
  });
}

function applyProfileContent(view) {
  const i18n = getI18n();
  if (!i18n) return;

  const dict = i18n.getDict();
  const profile = dict.profile || {};
  const name = view?.name || getConfig().profile?.name || "Joao Paulo Martins";
  const headline = view?.headline || profile.roleTag || "";

  const heroTag = document.getElementById("hero-tag");
  const heroTitle = document.getElementById("hero-title");
  const heroText = document.getElementById("hero-text");
  const aboutText = document.getElementById("about-text");

  if (heroTag && headline) {
    heroTag.textContent = headline;
  }

  if (heroTitle) {
    heroTitle.innerHTML = `${i18n.t("hero.hello")} <span class="highlight">${escapeHtml(name)}</span>`;
  }

  if (heroText && profile.intro) {
    heroText.textContent = profile.intro;
  }

  if (aboutText && profile.about) {
    aboutText.textContent = profile.about;
  }
}

function renderHeroPhoto(view) {
  const wrap = document.getElementById("hero-photo-wrap");
  const img = document.getElementById("hero-photo");
  const i18n = getI18n();
  if (!wrap || !img) return;

  const photoUrl = window.PortfolioSafe?.isSafeImageUrl(view?.photoUrl)
    ? view.photoUrl
    : "";

  if (!photoUrl) {
    wrap.hidden = true;
    img.removeAttribute("src");
    img.alt = "";
    return;
  }

  const name = view?.name || getConfig().profile?.name || "";
  img.alt = i18n ? i18n.t("hero.photoAlt", { name }) : name;
  img.src = photoUrl;
  wrap.hidden = false;
  img.onerror = () => {
    wrap.hidden = true;
    img.removeAttribute("src");
  };
}

function experienceMetaLine(item) {
  const parts = [item.company, item.period].filter(Boolean);
  return parts.join(" · ");
}

function renderExperiences(view) {
  const container = document.getElementById("experience-cards");
  const i18n = getI18n();
  if (!container || !i18n) return;

  const experiences = Array.isArray(view?.experiences) ? view.experiences : [];
  container.innerHTML = "";

  experiences.forEach((item) => {
    const article = document.createElement("article");
    article.className = item.current ? "card card-current" : "card";
    const meta = experienceMetaLine(item);
    article.innerHTML = `
      <h3>${escapeHtml(item.title || "")}</h3>
      ${meta ? `<p class="muted">${escapeHtml(meta)}</p>` : ""}
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
        <a class="gallery-item" href="${escapeHtml(item.href)}">
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
        <p class="muted">${escapeHtml(repo.language || i18n.t("projects.noLanguage"))}</p>
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

async function bootHome() {
  await ensureRemoteProfile();
  const view = buildViewProfile();
  applyProfileContent(view);
  renderHeroPhoto(view);
  renderExperiences(view);
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
