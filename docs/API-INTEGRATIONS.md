# Integracoes por API (realista e escalavel)

## Principios

- Preferir APIs publicas sem custo
- Evitar backend enquanto nao for necessario
- Sempre ter fallback visual quando a API falhar
- Isolar configuracoes em `config.js`

## GitHub (viavel agora)

- Fonte: GitHub REST API publica
- Uso: listar repositorios atualizados
- Status: implementado no frontend

## LinkedIn (limitacao importante)

A API oficial do LinkedIn para perfil/experiencia nao e aberta livremente para qualquer app pessoal.

Alternativas praticas:

1. Fonte local versionada (`config.js` / JSON) para experiencias
2. Exportar experiencias de uma fonte propria (quando houver backend)
3. Link direto para perfil LinkedIn no contato

## Instagram (limitacao importante)

Instagram basico nao oferece feed publico livre para qualquer frontend sem autenticacao.

Alternativas praticas:

1. Link direto para perfis
2. Embeds pontuais de posts
3. Backend futuro para tokens e cache (se realmente necessario)

## Spotify (viavel com embed)

- Integracao simples e leve via iframe/embed de playlist
- Sem custo adicional para o site

## Games perfis (PSN / Wild Rift)

- Geralmente sem API publica estavel para frontend puro
- Estrategia recomendada: cards com links e estatisticas manuais

## Seguranca e custo

- Nao expor segredos/tokens no frontend
- Evitar APIs que exigem token sensivel sem backend
- Para escala futura, usar backend serverless com cache
