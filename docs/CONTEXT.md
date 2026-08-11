# Contexto do Projeto (sempre atualizar)

## Objetivo
Portifolio pessoal leve (cartao de visita) para LinkedIn, com baixo custo de hospedagem, integracoes dinamicas por API quando viavel, e navegacao por paginas reais na galeria.

## Stack atual
- HTML + CSS + JavaScript puro (sem framework)
- Deploy estatico (Vercel/Netlify/GitHub Pages)
- Dados centrais em `config.js`
- Testes smoke com Node (`npm test`)

## Estrutura
- `index.html`: home (intro, sobre, experiencias, projetos GitHub, galeria, contato)
- `pages/games.html`: PSN, Wild Rift, jogo da velha (2P / bot)
- `pages/musica.html`: Instagram baterista + placeholder Spotify
- `pages/fotos.html`: Instagram privado
- `pages/codigos.html`: atalho para projetos + Instagram dev
- `js/common.js`: menu + rodape
- `js/pages.js`: preenchimento dinamico das paginas
- `js/tictactoe.js`: logica do jogo da velha
- `script.js`: render da home
- `tests/smoke.test.js`: testes automatizados

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

## Estado atual (validado em tela)
- Home renderiza nome, tagline, sobre, experiencias, contato
- GitHub API carrega repositorios
- Cards da galeria abrem paginas reais
- Games renderiza IDs e jogo da velha jogavel
- Testes: `36/36` passando (`npm test`)

## Pendencias
- Jogo da cobrinha em Games
- Embed Spotify em Musica
- Experiencias via fonte automatica (LinkedIn API nao e aberta)
- Refino visual / SEO / deploy

## Como rodar
```bash
python -m http.server 5500
npm test
```

Abrir: `http://localhost:5500`
