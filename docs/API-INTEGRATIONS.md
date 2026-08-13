# Integracoes por API (realista e escalavel)

## Principios

- Preferir APIs publicas sem custo
- Evitar backend enquanto nao for necessario
- Sempre ter fallback visual quando a API falhar
- Isolar configuracoes em `config.js`
- O site **nunca** fala direto com LinkedIn ou Instagram

## O que e uma "renderizacao" neste projeto

Renderizar = o JavaScript pega um JSON e monta o HTML sozinho.

Exemplo ja existente: projetos do GitHub. O site pede a lista de repositorios e cria os cards. Voce nao edita HTML a cada repo novo.

O mesmo vale agora para:

- **foto** (GitHub, automatico)
- **titulo / headline** (texto local, ou `data/live.json` se um backend gravar)
- **cargos** (`data/experiences.json`, ou `data/live.json` no futuro)

Voce nao precisa "arrumar na unha" o HTML. Muda a fonte de dados; a pagina redesenha.

## Contrato unico (`data/live.json`)

O frontend so entende este formato (campos opcionais podem vir vazios):

```json
{
  "source": "github",
  "updatedAt": "2026-08-13T12:00:00.000Z",
  "name": "Joao Paulo Martins",
  "headline": "Desenvolvedor Web | APIs | JavaScript",
  "photoUrl": "https://avatars.githubusercontent.com/u/000.png",
  "experiences": [
    {
      "role": "Freelancer Front-end",
      "company": "Autonomo",
      "period": "2024 - Atual",
      "description": "Desenvolvimento de paginas e interfaces.",
      "current": true
    }
  ]
}
```

Ordem de leitura na home:

1. `data/live.json` (snapshot do CI ou de um backend futuro)
2. `data/experiences.json` (cargos locais, bilingues)
3. textos de `js/i18n.js` (fallback)
4. foto `https://github.com/USUARIO.png` se ainda nao houver `photoUrl`

Um backend futuro **so precisa gravar esse JSON**. O HTML da home nao muda.

## GitHub (viavel agora, sem backend)

- Foto: URL publica `https://github.com/{usuario}.png` (sem token)
- Projetos: GitHub REST API publica
- Snapshot no deploy: `node scripts/sync-profile.js` grava `data/live.json` com foto/nome

Por isso a foto ja atualiza sozinha quando voce troca o avatar no GitHub.

## LinkedIn (por que precisa de backend)

A API oficial **nao entrega** foto, headline e historico de cargos para um site estatico pessoal.

O navegador tambem nao consegue "puxar" a pagina do LinkedIn:

- o LinkedIn bloqueia leitura de outro site (CORS)
- tokens de login sao segredo e **nao podem** ir no JavaScript publico
- cargos completos exigem programa de parceiro, nao um app de portifolio comum

### Como funcionaria com backend (quando fizer sentido)

1. Voce clica "Conectar LinkedIn" uma vez
2. O LinkedIn pede login e autorizacao
3. Ele devolve um codigo para **o nosso servidor** (nunca para o navegador)
4. O servidor troca o codigo por um token, guarda o token com seguranca
5. De tempos em tempos o servidor pede foto, nome, titulo (o que a API liberar)
6. Grava o resultado em `data/live.json` (ou num cache equivalente)
7. O portifolio so le esse JSON e renderiza os cards

Mesmo com backend, **historico de cargos costuma nao ser liberado** para app pessoal. Nesse caso os cargos continuam em `data/experiences.json` (um arquivo so, sem HTML).

## Instagram (por que precisa de backend)

Instagram tambem nao tem feed publico livre para frontend.

- Perfil **privado** nao pode aparecer num site publico, mesmo com backend
- Perfil Business/Creator exigiria app da Meta, login OAuth e token no servidor
- O fluxo e o mesmo do LinkedIn: servidor pega a midia, grava no contrato JSON, o site renderiza

Enquanto o Instagram de fotos for privado, a pagina Fotos so aponta o link do perfil. Nao ha como puxar as imagens de forma automatica e licita.

## Spotify (viavel com embed)

- Integracao simples e leve via iframe/embed de playlist
- Sem custo adicional para o site

## Games perfis (PSN / Wild Rift)

- Geralmente sem API publica estavel para frontend puro
- Estrategia recomendada: cards com links e estatisticas manuais

## Seguranca e custo

- Nao expor segredos/tokens no frontend
- Evitar APIs que exigem token sensivel sem backend
- Para escala futura, usar backend serverless com cache (Cloudflare Worker / Vercel) gravando o mesmo `data/live.json`
- Hoje o "backend" barato e o GitHub Actions no deploy: `scripts/sync-profile.js`
