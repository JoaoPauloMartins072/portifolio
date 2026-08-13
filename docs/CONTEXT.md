# Contexto do Projeto (sempre atualizar)

## Objetivo
Portifolio pessoal leve (cartao de visita) para LinkedIn, com baixo custo de hospedagem, integracoes dinamicas por API quando viavel, e navegacao por paginas reais na galeria.

## Stack atual
- HTML + CSS + JavaScript puro (sem framework)
- Deploy estatico (GitHub Pages / Vercel / Netlify)
- Dados centrais em `config.js`
- Testes smoke + logica (`npm test`)

## Estrutura
- `index.html`: home (intro, sobre, experiencias, projetos GitHub, galeria, contato)
- `pages/games.html`: PSN, Wild Rift, jogo da velha (2P / bot) e cobrinha
- `pages/musica.html`: Instagram baterista + embed Spotify (via `social.spotifyUrl`)
- `pages/fotos.html`: Instagram privado
- `pages/codigos.html`: atalho para projetos + Instagram dev
- `js/common.js`: menu + rodape
- `js/pages.js`: preenchimento dinamico das paginas
- `js/tictactoe.js`: logica do jogo da velha
- `js/snake-engine.js` + `js/snake.js`: cobrinha
- `js/spotify.js`: conversao de URL Spotify para embed
- `js/profile-source.js`: junta foto/titulo/cargos de live.json, experiences.json e i18n
- `data/experiences.json`: fonte unica dos cargos (pt-BR / en-IE)
- `scripts/sync-profile.js`: snapshot da foto/nome do GitHub no deploy
- `script.js`: render da home
- `tests/smoke.test.js` e `tests/logic.test.js`: testes automatizados

## Rotas da galeria
Cards da home navegam para:
- `/pages/games.html`
- `/pages/musica.html`
- `/pages/fotos.html`
- `/pages/codigos.html`

## Bug critico ja corrigido
`const config` estava declarado em mais de um script global (`common.js` + `script.js`).
Isso quebrava a home:
- nome nao renderizava
- galeria vazia
- contato placeholder
- projetos travados em "Carregando..."

Regra: **nao declarar `const config` no escopo global**. Usar `window.PORTFOLIO_CONFIG`.

## i18n
- Bandeiras no header: 🇧🇷 PT-BR e 🇮🇪 EN-IE
- Arquivos: `js/i18n.js` + `js/i18n-runtime.js`
- Idioma salvo em `localStorage` (`portfolio-lang`)
- Funciona na home e nas paginas da galeria

## Como continuar sem IDE (so pelo agente web)
1. Abrir [cursor.com/agents](https://cursor.com/agents) no navegador
2. Escolher o repositorio `JoaoPauloMartins072/portifolio`
3. Escrever o pedido em portugues (ex.: "troca a playlist do Spotify", "muda a cor do tema")
4. O agente edita, testa, faz commit/PR
5. Revisar e mergear no GitHub pelo navegador
6. O site publicado fica em GitHub Pages (depois de ativar Pages uma vez)

Nao e preciso baixar o projeto, instalar Node local nem abrir VS Code/Cursor desktop.

## Estado atual
- Home renderiza nome, foto (GitHub), tagline, sobre, experiencias, contato
- GitHub API carrega repositorios (sort `updated`, 6 no desktop / 4 no mobile)
- Cargos vêm de `data/experiences.json` (prontos para um backend gravar `data/live.json`)
- Cards da galeria abrem paginas reais
- Games: IDs, jogo da velha e cobrinha
- Musica: embed Spotify pronto; falta colar o link da playlist em `config.js`
- Tema claro/escuro e PT-BR / EN-IE
- Testes: smoke + engine da cobrinha + conversao Spotify

## Pendencias
- Colar URL da playlist Spotify em `config.js` (`social.spotifyUrl`)
- Experiencias via fonte unica (`data/experiences.json`); LinkedIn API nao e aberta para app pessoal
- Ativar GitHub Pages uma vez nas settings do repo
- Refino visual / SEO

## Como rodar
```bash
python -m http.server 5500
npm test
```

Abrir: `http://localhost:5500`
