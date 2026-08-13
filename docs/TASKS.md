# Tasks do projeto

## Sprint A - Conteudo e identidade

- [x] Definir nome, tagline e bio final
- [x] Definir texto final de Sobre mim
- [x] Preencher links reais de contato
- [x] Validar CTA principal (Ver projetos / Falar comigo)

## Sprint B - Projetos por API

- [x] Criar base para GitHub API
- [x] Inserir usuario real do GitHub em `config.js`
- [x] Ajustar regra de ordenacao (updated/stars)
- [x] Definir quantidade ideal de cards no desktop e mobile

## Sprint C - Experiencias atualizaveis

- [ ] Definir fonte oficial das experiencias
- [ ] Implementar ingestao automatica da fonte escolhida
- [x] Criar fallback local para quando API falhar
- [ ] Padronizar formato de datas e cargos

## Sprint D - Galeria e hobbies

- [x] Reestruturar galeria em subcategorias (games/musica/fotos/codigos)
- [x] Navegacao por paginas/rotas reais (`pages/*.html`)
- [x] Adicionar perfis externos (PSN, Wild Rift, Instagram)
- [x] Adicionar jogo da velha (2P e bot)
- [x] Adicionar jogo da cobrinha
- [x] Embed Spotify na pagina Musica

## Sprint QA

- [x] Corrigir bug de `const config` duplicado
- [x] Criar testes smoke automatizados (`npm test`)
- [x] Validacao visual no browser
- [x] Atualizar docs de contexto (`docs/CONTEXT.md`, `docs/RECAP.md`)

## Sprint E - Qualidade final

- [x] Revisao de seguranca (links, sanitizacao, superficie de API)
- [ ] Revisao de performance (Lighthouse)
- [x] Revisao de responsividade final
- [x] Checklist de publicacao

### Checklist de publicacao (navegador)

1. Revisar o PR e fazer merge em `master`
2. GitHub > Settings > Pages > Source: GitHub Actions
3. Abrir `https://joaopaulomartins072.github.io/portifolio/`
4. Enviar o link da playlist Spotify no chat do agente
5. Conferir home, games, musica, tema e idioma no celular
