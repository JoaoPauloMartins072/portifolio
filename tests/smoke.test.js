const { describe, it, before } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { pathToFileURL } = require("node:url");

const ROOT = path.resolve(__dirname, "..");
const BASE_URL = process.env.PORTFOLIO_BASE_URL || "http://127.0.0.1:5500";

async function fetchText(urlPath) {
  const response = await fetch(`${BASE_URL}${urlPath}`);
  const text = await response.text();
  return { response, text };
}

describe("smoke - paginas acessiveis", () => {
  const routes = [
    "/",
    "/pages/games.html",
    "/pages/musica.html",
    "/pages/fotos.html",
    "/pages/codigos.html",
    "/styles.css",
    "/config.js",
    "/script.js",
    "/js/common.js",
    "/js/i18n.js",
    "/js/i18n-runtime.js",
    "/js/theme.js",
    "/js/pages.js",
    "/js/tictactoe.js",
    "/js/snake-engine.js",
    "/js/snake.js",
    "/js/spotify.js"
  ];

  for (const route of routes) {
    it(`responde 200 em ${route}`, async () => {
      const { response } = await fetchText(route);
      assert.equal(response.status, 200, `${route} deveria retornar 200`);
    });
  }
});

describe("smoke - home e rotas da galeria", () => {
  it("home contem secoes principais e ponto de montagem da galeria", async () => {
    const { text } = await fetchText("/");
    assert.match(text, /id="inicio"/);
    assert.match(text, /id="galeria"/);
    assert.match(text, /id="gallery-grid"/);
    assert.match(text, /id="project-cards"/);
  });

  it("script da home define rotas da galeria", () => {
    const code = fs.readFileSync(path.join(ROOT, "script.js"), "utf8");
    assert.match(code, /\.\/pages\/games\.html/);
    assert.match(code, /\.\/pages\/musica\.html/);
    assert.match(code, /\.\/pages\/fotos\.html/);
    assert.match(code, /\.\/pages\/codigos\.html/);
  });

  it("pagina games tem tabuleiro, modos e cobrinha", async () => {
    const { text } = await fetchText("/pages/games.html");
    assert.match(text, /id="board"/);
    assert.match(text, /data-mode="pvp"/);
    assert.match(text, /data-mode="bot"/);
    assert.match(text, /id="psn-id"/);
    assert.match(text, /id="wild-rift-id"/);
    assert.match(text, /id="snake-canvas"/);
    assert.match(text, /js\/snake\.js/);
  });

  it("pagina musica aponta para instagram do baterista e spotify", async () => {
    const { text } = await fetchText("/pages/musica.html");
    assert.match(text, /id="link-drummer"/);
    assert.match(text, /id="spotify-embed"/);
    assert.match(text, /js\/spotify\.js/);
  });

  it("pagina codigos aponta para projetos e github", async () => {
    const { text } = await fetchText("/pages/codigos.html");
    assert.match(text, /index\.html#projetos/);
    assert.match(text, /id="link-github"/);
  });
});

describe("config - dados obrigatorios", () => {
  let config;

  before(async () => {
    const configPath = path.join(ROOT, "config.js");
    const code = fs.readFileSync(configPath, "utf8");
    const wrapped = `${code}\nmodule.exports = window.PORTFOLIO_CONFIG;`;
    const tempPath = path.join(ROOT, "tests", "_config.tmp.cjs");
    const prelude = "const window = {};\n";
    fs.writeFileSync(tempPath, prelude + wrapped, "utf8");
    delete require.cache[require.resolve("./_config.tmp.cjs")];
    config = require("./_config.tmp.cjs");
  });

  it("tem nome e usuario github reais", () => {
    assert.equal(config.profile.name, "Joao Paulo Martins");
    assert.equal(config.api.githubUsername, "JoaoPauloMartins072");
  });

  it("tem contato valido", () => {
    assert.match(config.contact.email, /@/);
    assert.match(config.contact.linkedin, /^https:\/\//);
    assert.match(config.contact.github, /^https:\/\/github\.com\//);
  });

  it("tem redes sociais e games ids", () => {
    assert.match(config.social.drummerInstagram, /instagram\.com/);
    assert.match(config.social.developerInstagram, /instagram\.com/);
    assert.equal(config.social.psnId, "Jonh-072");
    assert.equal(config.social.wildRiftId, "irlandes072#5847");
  });

  it("define ordenacao e limite dos projetos do GitHub", () => {
    assert.equal(config.api.githubProjectsSort, "updated");
    assert.equal(config.api.githubProjectsLimit, 6);
    assert.equal(config.api.githubProjectsLimitMobile, 4);
  });
});

describe("arquivos - estrutura esperada", () => {
  const expected = [
    "index.html",
    "styles.css",
    "config.js",
    "script.js",
    "js/common.js",
    "js/i18n.js",
    "js/i18n-runtime.js",
    "js/theme.js",
    "js/pages.js",
    "js/tictactoe.js",
    "js/snake-engine.js",
    "js/snake.js",
    "js/spotify.js",
    "pages/games.html",
    "pages/musica.html",
    "pages/fotos.html",
    "pages/codigos.html",
    "docs/ROADMAP.md",
    "docs/TASKS.md",
    "docs/API-INTEGRATIONS.md"
  ];

  for (const relative of expected) {
    it(`existe ${relative}`, () => {
      const full = path.join(ROOT, relative);
      assert.equal(fs.existsSync(full), true, `${relative} nao encontrado`);
    });
  }
});

describe("i18n - idiomas suportados", () => {
  it("define pt-BR e en-IE", () => {
    const code = fs.readFileSync(path.join(ROOT, "js/i18n.js"), "utf8");
    assert.match(code, /"pt-BR"/);
    assert.match(code, /"en-IE"/);
    assert.match(code, /Hi, I'm/);
    assert.match(code, /Ola, eu sou/);
  });

  it("home tem seletor de idioma e tema", async () => {
    const { text } = await fetchText("/");
    assert.match(text, /id="lang-switcher"/);
    assert.match(text, /id="theme-switcher"/);
    assert.match(text, /js\/i18n\.js/);
    assert.match(text, /js\/theme\.js/);
  });
});

describe("theme - claro e escuro", () => {
  it("css define data-theme light e dark", () => {
    const css = fs.readFileSync(path.join(ROOT, "styles.css"), "utf8");
    assert.match(css, /data-theme="light"/);
    assert.match(css, /data-theme="dark"/);
  });
});

describe("js - nao redeclara const config global", () => {
  const files = ["js/common.js", "js/pages.js", "script.js"];

  for (const relative of files) {
    it(`${relative} nao usa 'const config =' no topo`, () => {
      const code = fs.readFileSync(path.join(ROOT, relative), "utf8");
      assert.equal(
        /(?:^|\n)const config\s*=/.test(code),
        false,
        `${relative} declara const config e pode quebrar outros scripts`
      );
    });
  }
});
