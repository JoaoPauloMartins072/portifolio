const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const snake = require("../js/snake-engine.js");
const spotify = require("../js/spotify.js");
const safe = require("../js/safe.js");

describe("snake engine", () => {
  it("avanca a cabeca para a direita", () => {
    const state = snake.createSnakeGame({
      cols: 8,
      rows: 8,
      food: { x: 7, y: 4 }
    });
    const head = state.snake[0];
    snake.step(state);
    assert.equal(state.snake[0].x, head.x + 1);
    assert.equal(state.snake[0].y, head.y);
    assert.equal(state.alive, true);
  });

  it("ignora direcao inversa", () => {
    const state = snake.createSnakeGame({
      cols: 8,
      rows: 8,
      food: { x: 7, y: 4 }
    });
    snake.setDirection(state, -1, 0);
    assert.deepEqual(state.pendingDir, { x: 1, y: 0 });
  });

  it("morre ao bater na parede", () => {
    const state = snake.createSnakeGame({
      cols: 5,
      rows: 5,
      food: { x: 0, y: 0 }
    });
    state.snake = [{ x: 4, y: 2 }];
    state.dir = { x: 1, y: 0 };
    state.pendingDir = { x: 1, y: 0 };
    snake.step(state);
    assert.equal(state.alive, false);
  });

  it("cresce e soma pontos ao comer", () => {
    const state = snake.createSnakeGame({
      cols: 8,
      rows: 8,
      food: { x: 5, y: 4 }
    });
    const length = state.snake.length;
    snake.placeFood(state, { x: 5, y: 4 });
    snake.step(state);
    assert.equal(state.score, 10);
    assert.equal(state.snake.length, length + 1);
    assert.equal(state.alive, true);
  });

  it("morre ao colidir com o proprio corpo", () => {
    const state = snake.createSnakeGame({
      cols: 8,
      rows: 8,
      food: { x: 0, y: 0 }
    });
    state.snake = [
      { x: 3, y: 3 },
      { x: 3, y: 4 },
      { x: 4, y: 4 },
      { x: 4, y: 3 },
      { x: 4, y: 2 }
    ];
    state.dir = { x: 1, y: 0 };
    state.pendingDir = { x: 1, y: 0 };
    snake.step(state);
    assert.equal(state.alive, false);
  });
});

describe("spotify embed", () => {
  it("converte URL de playlist em embed", () => {
    const embed = spotify.toSpotifyEmbed(
      "https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M?si=abc"
    );
    assert.equal(
      embed,
      "https://open.spotify.com/embed/playlist/37i9dQZF1DXcBWIGoYBM5M?utm_source=generator"
    );
  });

  it("converte URI do Spotify", () => {
    const embed = spotify.toSpotifyEmbed("spotify:album:1DFixLWuPkv3KT3TnV35m3");
    assert.equal(
      embed,
      "https://open.spotify.com/embed/album/1DFixLWuPkv3KT3TnV35m3?utm_source=generator"
    );
  });

  it("aceita URL intl e ja embedada", () => {
    const intl = spotify.toSpotifyEmbed(
      "https://open.spotify.com/intl-pt/track/3n3Ppam7vgaVa1iaRUc9Lp"
    );
    assert.equal(
      intl,
      "https://open.spotify.com/embed/track/3n3Ppam7vgaVa1iaRUc9Lp?utm_source=generator"
    );
    const already =
      "https://open.spotify.com/embed/playlist/37i9dQZF1DXcBWIGoYBM5M?utm_source=generator";
    assert.equal(spotify.toSpotifyEmbed(already), already);
  });

  it("rejeita URL invalida", () => {
    assert.equal(spotify.toSpotifyEmbed(""), "");
    assert.equal(spotify.toSpotifyEmbed("https://example.com/playlist/x"), "");
    assert.equal(spotify.toSpotifyEmbed("not a url"), "");
  });
});

describe("safe html e urls", () => {
  it("escapa HTML perigoso", () => {
    assert.equal(
      safe.escapeHtml('<img src=x onerror="alert(1)">'),
      "&lt;img src=x onerror=&quot;alert(1)&quot;&gt;"
    );
  });

  it("aceita so http(s) e github.com", () => {
    assert.equal(safe.isSafeHttpUrl("https://www.linkedin.com/in/test"), true);
    assert.equal(safe.isSafeHttpUrl("javascript:alert(1)"), false);
    assert.equal(safe.isSafeGithubUrl("https://github.com/JoaoPauloMartins072"), true);
    assert.equal(safe.isSafeGithubUrl("https://evil.example/github.com"), false);
  });

  it("valida email simples", () => {
    assert.equal(safe.isSafeEmail("joaopaulo_072@outlook.com"), true);
    assert.equal(safe.isSafeEmail("not-an-email"), false);
  });

  it("aceita so imagens https de hosts conhecidos", () => {
    assert.equal(
      safe.isSafeImageUrl("https://github.com/JoaoPauloMartins072.png"),
      true
    );
    assert.equal(
      safe.isSafeImageUrl("https://avatars.githubusercontent.com/u/1?v=4"),
      true
    );
    assert.equal(safe.isSafeImageUrl("https://evil.example/photo.png"), false);
    assert.equal(safe.isSafeImageUrl("javascript:alert(1)"), false);
    assert.equal(safe.isSafeImageUrl("./data/me.png"), true);
    assert.equal(safe.isSafeImageUrl("./../secret.png"), false);
  });
});

describe("fonte unica de perfil", () => {
  const profile = require("../js/profile-source.js");

  it("monta URL da foto do GitHub sem API", () => {
    assert.equal(
      profile.githubAvatarUrl("JoaoPauloMartins072", 240),
      "https://github.com/JoaoPauloMartins072.png?size=240"
    );
  });

  it("escolhe texto no idioma pedido", () => {
    assert.equal(
      profile.pickLocalized({ "pt-BR": "Atual", "en-IE": "Present" }, "en-IE"),
      "Present"
    );
    assert.equal(profile.pickLocalized("Freelancer", "pt-BR"), "Freelancer");
  });

  it("prioriza live.json e cai para experiences.json e i18n", () => {
    const dict = {
      profile: { roleTag: "Dev local" },
      experience: [{ title: "Fallback i18n", period: "2020" }]
    };
    const file = {
      items: [
        {
          role: { "pt-BR": "Front-end", "en-IE": "Front-end" },
          company: { "pt-BR": "Autonomo", "en-IE": "Freelance" },
          period: { "pt-BR": "2024 - Atual", "en-IE": "2024 - Present" },
          current: true
        }
      ]
    };

    const fromFile = profile.build({
      config: { api: { githubUsername: "JoaoPauloMartins072" }, profile: { name: "Joao" } },
      dict,
      live: null,
      experiences: file,
      lang: "pt-BR"
    });
    assert.equal(fromFile.experiences[0].title, "Front-end");
    assert.equal(fromFile.experiences[0].company, "Autonomo");
    assert.equal(fromFile.photoOrigin, "github");
    assert.match(fromFile.photoUrl, /github\.com\/JoaoPauloMartins072\.png/);

    const fromLive = profile.build({
      config: { profile: { photoSource: "auto", name: "Joao" } },
      dict,
      live: {
        source: "linkedin",
        name: "Joao Paulo",
        headline: "Desenvolvedor Web",
        photoUrl: "https://media.licdn.com/photo.jpg",
        experiences: [
          { role: "Engenheiro", company: "Empresa X", period: "2025" }
        ]
      },
      experiences: file,
      lang: "pt-BR"
    });
    assert.equal(fromLive.headline, "Desenvolvedor Web");
    assert.equal(fromLive.photoOrigin, "linkedin");
    assert.equal(fromLive.experiences[0].title, "Engenheiro");
    assert.equal(fromLive.experiences[0].company, "Empresa X");
  });
});
