(function (root) {
  "use strict";

  function createSnakeGame(options) {
    const cols = options?.cols || 20;
    const rows = options?.rows || 20;
    const midY = Math.floor(rows / 2);
    const midX = Math.floor(cols / 2);

    return {
      cols,
      rows,
      snake: [
        { x: midX, y: midY },
        { x: midX - 1, y: midY },
        { x: midX - 2, y: midY }
      ],
      dir: { x: 1, y: 0 },
      pendingDir: { x: 1, y: 0 },
      food: options?.food || { x: Math.min(cols - 2, midX + 4), y: midY },
      score: 0,
      alive: true,
      tickMs: options?.tickMs || 140
    };
  }

  function occupies(snake, x, y, ignoreTail) {
    const end = ignoreTail ? snake.length - 1 : snake.length;
    for (let i = 0; i < end; i += 1) {
      if (snake[i].x === x && snake[i].y === y) {
        return true;
      }
    }
    return false;
  }

  function setDirection(state, dx, dy) {
    if (!state.alive) return;
    if (dx === 0 && dy === 0) return;
    if (dx !== 0 && dy !== 0) return;
    if (state.dir.x === -dx && state.dir.y === -dy) return;
    state.pendingDir = { x: dx, y: dy };
  }

  function placeFood(state, cell) {
    if (cell) {
      state.food = { x: cell.x, y: cell.y };
      return state.food;
    }

    const empty = [];
    for (let y = 0; y < state.rows; y += 1) {
      for (let x = 0; x < state.cols; x += 1) {
        if (!occupies(state.snake, x, y, false)) {
          empty.push({ x, y });
        }
      }
    }

    if (!empty.length) {
      state.food = null;
      return null;
    }

    state.food = empty[Math.floor(Math.random() * empty.length)];
    return state.food;
  }

  function step(state) {
    if (!state.alive) return state;

    state.dir = { x: state.pendingDir.x, y: state.pendingDir.y };
    const head = state.snake[0];
    const next = { x: head.x + state.dir.x, y: head.y + state.dir.y };

    if (next.x < 0 || next.y < 0 || next.x >= state.cols || next.y >= state.rows) {
      state.alive = false;
      return state;
    }

    const eating = Boolean(
      state.food && next.x === state.food.x && next.y === state.food.y
    );

    if (occupies(state.snake, next.x, next.y, !eating)) {
      state.alive = false;
      return state;
    }

    state.snake.unshift(next);

    if (eating) {
      state.score += 10;
      state.tickMs = Math.max(70, state.tickMs - 3);
      placeFood(state);
    } else {
      state.snake.pop();
    }

    return state;
  }

  const api = { createSnakeGame, setDirection, placeFood, step, occupies };
  root.PortfolioSnakeEngine = api;

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})(typeof globalThis !== "undefined" ? globalThis : this);
