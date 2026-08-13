const SNAKE_HIGH_KEY = "portfolio-snake-highscore";

function snakeT(key, vars) {
  return window.PortfolioI18n?.t(key, vars) || key;
}

function getSnakeElements() {
  return {
    canvas: document.getElementById("snake-canvas"),
    score: document.getElementById("snake-score"),
    high: document.getElementById("snake-high"),
    status: document.getElementById("snake-status"),
    start: document.getElementById("snake-start"),
    pause: document.getElementById("snake-pause")
  };
}

function readHighScore() {
  const value = Number(localStorage.getItem(SNAKE_HIGH_KEY) || 0);
  return Number.isFinite(value) ? value : 0;
}

function writeHighScore(score) {
  const current = readHighScore();
  if (score > current) {
    localStorage.setItem(SNAKE_HIGH_KEY, String(score));
    return score;
  }
  return current;
}

function cssVar(name, fallback) {
  const value = getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
  return value || fallback;
}

const snakeUi = {
  state: null,
  running: false,
  paused: false,
  raf: 0,
  lastTick: 0,
  touchStart: null
};

function resetSnakeState() {
  const engine = window.PortfolioSnakeEngine;
  snakeUi.state = engine.createSnakeGame({ cols: 20, rows: 20, tickMs: 140 });
  snakeUi.running = false;
  snakeUi.paused = false;
  snakeUi.lastTick = 0;
}

function updateSnakeHud() {
  const els = getSnakeElements();
  if (!els.score || !els.high || !snakeUi.state) return;
  els.score.textContent = String(snakeUi.state.score);
  els.high.textContent = String(readHighScore());
}

function setSnakeStatus(key, vars) {
  const els = getSnakeElements();
  if (!els.status) return;
  els.status.textContent = snakeT(key, vars);
}

function drawSnake() {
  const { canvas } = getSnakeElements();
  const state = snakeUi.state;
  if (!canvas || !state) return;

  const ctx = canvas.getContext("2d");
  const dpr = window.devicePixelRatio || 1;
  const cssSize = canvas.clientWidth || 320;
  const pixelSize = Math.round(cssSize * dpr);

  if (canvas.width !== pixelSize || canvas.height !== pixelSize) {
    canvas.width = pixelSize;
    canvas.height = pixelSize;
  }

  const cell = canvas.width / state.cols;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = cssVar("--cell-bg", "#0b1325");
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = cssVar("--border", "#243247");
  ctx.lineWidth = Math.max(1, dpr * 0.6);
  ctx.globalAlpha = 0.45;
  ctx.beginPath();
  for (let i = 1; i < state.cols; i += 1) {
    ctx.moveTo(i * cell, 0);
    ctx.lineTo(i * cell, canvas.height);
    ctx.moveTo(0, i * cell);
    ctx.lineTo(canvas.width, i * cell);
  }
  ctx.stroke();
  ctx.globalAlpha = 1;

  if (state.food) {
    ctx.fillStyle = cssVar("--primary", "#2dd4bf");
    ctx.beginPath();
    ctx.arc(
      (state.food.x + 0.5) * cell,
      (state.food.y + 0.5) * cell,
      cell * 0.32,
      0,
      Math.PI * 2
    );
    ctx.fill();
  }

  state.snake.forEach((part, index) => {
    const pad = cell * 0.12;
    ctx.fillStyle =
      index === 0
        ? cssVar("--primary-strong", "#5eead4")
        : cssVar("--primary", "#2dd4bf");
    ctx.globalAlpha = index === 0 ? 1 : 0.82;
    ctx.beginPath();
    if (typeof ctx.roundRect === "function") {
      ctx.roundRect(
        part.x * cell + pad,
        part.y * cell + pad,
        cell - pad * 2,
        cell - pad * 2,
        cell * 0.22
      );
    } else {
      ctx.rect(
        part.x * cell + pad,
        part.y * cell + pad,
        cell - pad * 2,
        cell - pad * 2
      );
    }
    ctx.fill();
  });
  ctx.globalAlpha = 1;
}

function endSnakeGame() {
  snakeUi.running = false;
  snakeUi.paused = false;
  writeHighScore(snakeUi.state.score);
  updateSnakeHud();
  setSnakeStatus("pages.snakeGameOver", { score: snakeUi.state.score });
  const { start, pause } = getSnakeElements();
  if (start) start.textContent = snakeT("pages.snakeStart");
  if (pause) pause.textContent = snakeT("pages.snakePause");
  drawSnake();
}

function snakeLoop(timestamp) {
  snakeUi.raf = requestAnimationFrame(snakeLoop);
  if (!snakeUi.running || snakeUi.paused || !snakeUi.state?.alive) {
    return;
  }
  if (timestamp - snakeUi.lastTick < snakeUi.state.tickMs) {
    return;
  }
  snakeUi.lastTick = timestamp;
  window.PortfolioSnakeEngine.step(snakeUi.state);
  updateSnakeHud();
  drawSnake();
  if (!snakeUi.state.alive) {
    endSnakeGame();
  }
}

function startSnake() {
  resetSnakeState();
  snakeUi.running = true;
  snakeUi.paused = false;
  snakeUi.lastTick = 0;
  updateSnakeHud();
  setSnakeStatus("pages.snakePlaying");
  const { start, pause } = getSnakeElements();
  if (start) start.textContent = snakeT("pages.snakeRestart");
  if (pause) pause.textContent = snakeT("pages.snakePause");
  drawSnake();
}

function toggleSnakePause() {
  if (!snakeUi.running || !snakeUi.state?.alive) return;
  snakeUi.paused = !snakeUi.paused;
  const { pause } = getSnakeElements();
  if (pause) {
    pause.textContent = snakeT(
      snakeUi.paused ? "pages.snakeResume" : "pages.snakePause"
    );
  }
  setSnakeStatus(snakeUi.paused ? "pages.snakePaused" : "pages.snakePlaying");
}

function applySnakeDirection(dx, dy) {
  if (!snakeUi.state) return;
  window.PortfolioSnakeEngine.setDirection(snakeUi.state, dx, dy);
}

function onSnakeKeydown(event) {
  const keys = {
    ArrowUp: [0, -1],
    ArrowDown: [0, 1],
    ArrowLeft: [-1, 0],
    ArrowRight: [1, 0],
    w: [0, -1],
    a: [-1, 0],
    s: [0, 1],
    d: [1, 0],
    W: [0, -1],
    A: [-1, 0],
    S: [0, 1],
    D: [1, 0]
  };
  const next = keys[event.key];
  if (!next) return;
  if (snakeUi.running && !snakeUi.paused) {
    event.preventDefault();
  }
  applySnakeDirection(next[0], next[1]);
}

function bindSnakeControls() {
  const { canvas } = getSnakeElements();
  document.querySelectorAll(".snake-dir").forEach((button) => {
    button.onclick = () => {
      const map = {
        up: [0, -1],
        down: [0, 1],
        left: [-1, 0],
        right: [1, 0]
      };
      const dir = map[button.dataset.dir];
      if (dir) applySnakeDirection(dir[0], dir[1]);
    };
  });

  if (!canvas) return;

  canvas.addEventListener(
    "touchstart",
    (event) => {
      const touch = event.changedTouches[0];
      snakeUi.touchStart = { x: touch.clientX, y: touch.clientY };
    },
    { passive: true }
  );

  canvas.addEventListener(
    "touchend",
    (event) => {
      if (!snakeUi.touchStart) return;
      const touch = event.changedTouches[0];
      const dx = touch.clientX - snakeUi.touchStart.x;
      const dy = touch.clientY - snakeUi.touchStart.y;
      snakeUi.touchStart = null;
      if (Math.abs(dx) < 24 && Math.abs(dy) < 24) return;
      if (Math.abs(dx) > Math.abs(dy)) {
        applySnakeDirection(dx > 0 ? 1 : -1, 0);
      } else {
        applySnakeDirection(0, dy > 0 ? 1 : -1);
      }
    },
    { passive: true }
  );
}

function initSnake() {
  if (!document.getElementById("snake-canvas") || !window.PortfolioSnakeEngine) {
    return;
  }

  cancelAnimationFrame(snakeUi.raf);
  resetSnakeState();
  updateSnakeHud();
  setSnakeStatus("pages.snakeReady");
  drawSnake();
  bindSnakeControls();

  const { start, pause } = getSnakeElements();
  if (start) start.onclick = startSnake;
  if (pause) pause.onclick = toggleSnakePause;

  window.removeEventListener("keydown", onSnakeKeydown);
  window.addEventListener("keydown", onSnakeKeydown);
  snakeUi.raf = requestAnimationFrame(snakeLoop);
}

document.addEventListener("DOMContentLoaded", initSnake);
window.addEventListener("portfolio:contentrefresh", () => {
  if (!document.getElementById("snake-canvas")) return;
  updateSnakeHud();
  if (!snakeUi.running) {
    setSnakeStatus("pages.snakeReady");
  } else if (!snakeUi.state?.alive) {
    setSnakeStatus("pages.snakeGameOver", { score: snakeUi.state.score });
  } else if (snakeUi.paused) {
    setSnakeStatus("pages.snakePaused");
  } else {
    setSnakeStatus("pages.snakePlaying");
  }
  const { start, pause } = getSnakeElements();
  if (start) {
    start.textContent = snakeT(
      snakeUi.running ? "pages.snakeRestart" : "pages.snakeStart"
    );
  }
  if (pause) {
    pause.textContent = snakeT(
      snakeUi.paused ? "pages.snakeResume" : "pages.snakePause"
    );
  }
});
