# Portifolio Pessoal (Leve e Dinamico)

Projeto de portifolio com foco em:

- baixo custo de hospedagem (site estatico)
- carregamento rapido
- integracoes por API quando viavel
- base escalavel para crescer em etapas

## Estrutura atual

- `index.html`: home com secoes principais
- `styles.css`: tema e responsividade
- `config.js`: dados pessoais e configuracoes de API
- `script.js`: renderizacao dinamica da home
- `js/common.js`: menu e rodape compartilhados
- `js/pages.js`: preenchimento dinamico das paginas
- `js/tictactoe.js`: jogo da velha (2P / bot)
- `pages/games.html`: rota Games
- `pages/musica.html`: rota Musica
- `pages/fotos.html`: rota Fotos
- `pages/codigos.html`: rota Codigos
- `docs/ROADMAP.md`: fases do projeto
- `docs/TASKS.md`: backlog por sprint
- `docs/API-INTEGRATIONS.md`: estrategia de APIs e limites reais

## Rodar local

No PowerShell, dentro da pasta:

```bash
python -m http.server 5500
```

Abra:

`http://localhost:5500`

## Testes

Com o servidor local rodando:

```bash
npm test
```

## Deploy barato

Hospedagem recomendada:

- Vercel (free)
- Netlify (free)
- GitHub Pages (free)

Sem backend, sem banco, sem custo recorrente para o objetivo de cartao de visita.
