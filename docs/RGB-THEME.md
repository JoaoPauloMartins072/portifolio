# Sistema de Temas RGB Neon

## 🎨 Visão Geral

O portfólio agora conta com um sistema de temas inspirado em carros de corrida com luzes neon RGB. O sistema oferece 6 combinações visuais diferentes através de dois controles independentes.

## 🎮 Controles

### Mode Switcher (Esquerda)
- **Ícone**: Sol ☀️ / Lua 🌙
- **Função**: Alterna entre modo claro e escuro
- **Modo Claro**: Fundo branco (#ffffff), texto preto
- **Modo Escuro**: Fundo preto (#000000), texto branco

### RGB Color Switcher (Direita)
- **Ícone**: Letra R, G ou B
- **Função**: Cicla entre as cores neon
- **Sequência**: R (Vermelho) → G (Verde) → B (Azul) → R
- **Cores**:
  - 🔴 **Red**: #ff0000 (vermelho vibrante)
  - 🟢 **Green**: #00ff00 (verde neon)
  - 🔵 **Blue**: #0000ff (azul elétrico)

## ✨ Efeitos Neon

Os efeitos de brilho neon são aplicados automaticamente em:

- Texto destacado (nome principal, tag de função)
- Botões primários
- Links e itens de navegação (no hover)
- Bordas de cards e elementos interativos
- Controles ativos de jogos
- Track do theme switcher

### Exemplos de Efeito:
```css
/* Texto com brilho duplo */
text-shadow: 0 0 10px var(--neon-glow), 0 0 20px var(--neon-glow);

/* Botão com sombra neon */
box-shadow: 0 0 15px var(--neon-glow), 0 0 30px var(--neon-glow);
```

## 🔧 Implementação Técnica

### Estrutura de Temas

O sistema utiliza atributos HTML combinados:

```html
<html data-theme="dark" data-color="red">
```

### Variáveis CSS

Cada combinação define suas próprias variáveis:

```css
html[data-theme="dark"][data-color="red"] {
  --bg: #000000;
  --text: #ffffff;
  --primary: #ff0000;
  --neon-glow: #ff0000;
  /* ... */
}
```

### Persistência

As preferências são salvas no localStorage:
- `portfolio-theme`: "light" ou "dark"
- `portfolio-color`: "red", "green" ou "blue"

## 📱 Uso no Celular

O sistema funciona perfeitamente em dispositivos móveis:
- Controles touch-friendly
- Layout responsivo mantido
- Efeitos neon otimizados para telas pequenas
- Performance fluida

## 🎯 Combinações Disponíveis

1. **Dark + Red** - Preto com vermelho neon intenso
2. **Dark + Green** - Preto com verde neon vibrante
3. **Dark + Blue** - Preto com azul elétrico
4. **Light + Red** - Branco com vermelho neon suave
5. **Light + Green** - Branco com verde neon pastel
6. **Light + Blue** - Branco com azul neon claro

## 🚀 Como Usar

1. **Escolher o modo**: Clique no botão sol/lua para alternar entre claro e escuro
2. **Escolher a cor**: Clique no botão RGB (R/G/B) para ciclar entre as cores
3. **Pronto!** Suas preferências são salvas automaticamente

## 🎨 Inspiração

O tema foi inspirado na estética de carros de corrida personalizados, onde:
- **Carroceria**: Preta (dark) ou Branca (light)
- **Luzes neon**: RGB vibrantes nos detalhes
- **Adesivos**: Elementos destacados com brilho neon

---

Desenvolvido com ❤️ para criar uma experiência visual única e personalizável!
