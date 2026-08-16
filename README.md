# Portifolio Pessoal (Leve e Dinamico)

Projeto de portifolio com foco em:

- baixo custo de hospedagem (site estatico)
- carregamento rapido
- integracoes por API quando viavel
- base escalavel para crescer em etapas
- desenvolvimento pelo Cursor na web, sem baixar o projeto

## Continuar so pelo navegador

Nao precisa de IDE nem download:

1. Abra [cursor.com/agents](https://cursor.com/agents)
2. Selecione o repositorio `JoaoPauloMartins072/portifolio`
3. Escreva o que quer mudar (texto, cor, jogo, playlist, etc.)
4. O agente faz o codigo, os testes e o pull request
5. No GitHub (pelo navegador), revise e clique em merge

Depois do merge, o site pode ir ao ar no GitHub Pages.

## Sistema de Temas RGB 🎨

O portifolio conta com um **sistema de temas neon RGB** inspirado em carros de corrida! 🏎️

### Recursos:
- **6 combinações visuais**: 3 cores (R/G/B) × 2 modos (claro/escuro)
- **Cores neon vibrantes**: Vermelho, Verde e Azul com efeitos de brilho
- **Controles independentes**: 
  - Botão esquerdo: Alterna modo claro/escuro
  - Botão direito: Cicla entre cores R → G → B
- **Efeitos aplicados em**: texto destacado, botões, links, cards, jogos
- **Persistência**: Preferências salvas no localStorage

📖 Veja mais em [`docs/RGB-THEME.md`](docs/RGB-THEME.md)

## Estrutura atual

- `index.html`: home com secoes principais
- `styles.css`: **sistema de temas RGB** e responsividade
- `config.js`: dados pessoais e configuracoes de API
- `script.js`: renderizacao dinamica da home
- `js/common.js`: menu e rodape compartilhados
- `js/theme.js`: **sistema de temas RGB neon**
- `js/pages.js`: preenchimento dinamico das paginas
- `js/tictactoe.js`: jogo da velha (2P / bot)
- `js/snake-engine.js` + `js/snake.js`: cobrinha
- `js/spotify.js`: embed da playlist
- `pages/games.html`: rota Games
- `pages/musica.html`: rota Musica
- `pages/fotos.html`: rota Fotos
- `pages/codigos.html`: rota Codigos
- `docs/ROADMAP.md`: fases do projeto
- `docs/TASKS.md`: backlog por sprint
- `docs/API-INTEGRATIONS.md`: estrategia de APIs e limites reais
- `docs/RGB-THEME.md`: **documentacao do sistema de temas RGB**

## Rodar local (opcional)

No terminal, dentro da pasta:

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

Os testes de logica (`tests/logic.test.js`) rodam sem servidor.

## Deploy barato

Hospedagem recomendada:

- GitHub Pages (workflow em `.github/workflows/pages.yml`)
- Vercel (free)
- Netlify (free)

Para GitHub Pages, uma unica acao no navegador:

1. Abra o repositorio no GitHub
2. Settings > Pages
3. Source: GitHub Actions

URL esperada depois do merge em `master`:

`https://joaopaulomartins072.github.io/portifolio/`

Sem backend, sem banco, sem custo recorrente para o objetivo de cartao de visita.
