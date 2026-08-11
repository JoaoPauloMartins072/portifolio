function getConfig() {
  return window.PORTFOLIO_CONFIG || {};
}

function applyProfileContent() {
  const profile = getConfig().profile || {};
  const heroTag = document.getElementById("hero-tag");
  const heroTitle = document.getElementById("hero-title");
  const heroText = document.getElementById("hero-text");
  const aboutText = document.getElementById("about-text");

  if (heroTag && profile.roleTag) {
    heroTag.textContent = profile.roleTag;
  }

  if (heroTitle && profile.name) {
    heroTitle.innerHTML = `Ola, eu sou <span class="highlight">${profile.name}</span>`;
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
  if (!container) return;

  const experiences = Array.isArray(getConfig().experience)
    ? getConfig().experience
    : [];
  container.innerHTML = "";

  experiences.forEach((item) => {
    const article = document.createElement("article");
    article.className = "card";
    article.innerHTML = `
      <h3>${item.title || "Experiencia"}</h3>
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
  if (!grid) return;

  const categories = [
    {
      href: "./pages/games.html",
      icon: "🎮",
      title: "Games",
      subtitle: "PSN, Wild Rift e mini games"
    },
    {
      href: "./pages/musica.html",
      icon: "🎵",
      title: "Musica",
      subtitle: "Baterista e playlist"
    },
    {
      href: "./pages/fotos.html",
      icon: "📷",
      title: "Fotos",
      subtitle: "Instagram privado"
    },
    {
      href: "./pages/codigos.html",
      icon: "💻",
      title: "Codigos",
      subtitle: "GitHub e content dev"
    }
  ];

  grid.innerHTML = categories
    .map(
      (item) => `
        <a class="gallery-item" href="${item.href}">
          <h3>${item.icon} ${item.title}</h3>
          <p class="muted">${item.subtitle}</p>
        </a>
      `
    )
    .join("");
}

async function renderGithubProjects() {
  const cards = document.getElementById("project-cards");
  const meta = document.getElementById("projects-meta");
  const api = getConfig().api || {};
  const username = api.githubUsername;
  const limit = api.githubProjectsLimit || 6;

  if (!cards || !meta) return;

  if (!username || username === "seu-usuario") {
    meta.textContent =
      "Defina seu usuario no arquivo config.js para carregar projetos reais.";
    cards.innerHTML = "";
    return;
  }

  try {
    const response = await fetch(
      `https://api.github.com/users/${username}/repos?sort=updated&per_page=${limit}`
    );

    if (!response.ok) {
      throw new Error(`GitHub API respondeu ${response.status}`);
    }

    const repos = await response.json();
    meta.textContent = `Projetos carregados automaticamente do GitHub (@${username}).`;
    cards.innerHTML = "";

    repos.forEach((repo) => {
      const article = document.createElement("article");
      article.className = "card";
      article.innerHTML = `
        <h3>${repo.name}</h3>
        <p>${repo.description || "Sem descricao no repositorio."}</p>
        <p class="muted">${repo.language || "Linguagem nao informada"}</p>
        <a class="btn ghost" href="${repo.html_url}" target="_blank" rel="noreferrer">Abrir no GitHub</a>
      `;
      cards.appendChild(article);
    });
  } catch (error) {
    meta.textContent =
      "Nao foi possivel carregar projetos agora. Verifique usuario ou limite da API.";
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

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", bootHome);
} else {
  bootHome();
}
