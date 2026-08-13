const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const snake = require("../js/snake-engine.js");
const spotify = require("../js/spotify.js");

describe("snake engine", () => {
  it("avanca a cabeca para a direita", () => {
    const state = snake.createSnakeGame({
      cols: 8,
      rows: 8,
      food: { x: 7, y: 4 }
    });
    const head = state.snake[0];
    snake.step(state);
    assert.equal(state.snake[0].x, head.x + 1);
    assert.equal(state.snake[0].y, head.y);
    assert.equal(state.alive, true);
  });

  it("ignora direcao inversa", () => {
    const state = snake.createSnakeGame({
      cols: 8,
      rows: 8,
      food: { x: 7, y: 4 }
    });
    snake.setDirection(state, -1, 0);
    assert.deepEqual(state.pendingDir, { x: 1, y: 0 });
  });

  it("morre ao bater na parede", () => {
    const state = snake.createSnakeGame({
      cols: 5,
      rows: 5,
      food: { x: 0, y: 0 }
    });
    state.snake = [{ x: 4, y: 2 }];
    state.dir = { x: 1, y: 0 };
    state.pendingDir = { x: 1, y: 0 };
    snake.step(state);
    assert.equal(state.alive, false);
  });

  it("cresce e soma pontos ao comer", () => {
    const state = snake.createSnakeGame({
      cols: 8,
      rows: 8,
      food: { x: 5, y: 4 }
    });
    const length = state.snake.length;
    snake.placeFood(state, { x: 5, y: 4 });
    snake.step(state);
    assert.equal(state.score, 10);
    assert.equal(state.snake.length, length + 1);
    assert.equal(state.alive, true);
  });

  it("morre ao colidir com o proprio corpo", () => {
    const state = snake.createSnakeGame({
      cols: 8,
      rows: 8,
      food: { x: 0, y: 0 }
    });
    state.snake = [
      { x: 3, y: 3 },
      { x: 3, y: 4 },
      { x: 4, y: 4 },
      { x: 4, y: 3 },
      { x: 4, y: 2 }
    ];
    state.dir = { x: 1, y: 0 };
    state.pendingDir = { x: 1, y: 0 };
    snake.step(state);
    assert.equal(state.alive, false);
  });
});

describe("spotify embed", () => {
  it("converte URL de playlist em embed", () => {
    const embed = spotify.toSpotifyEmbed(
      "https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M?si=abc"
    );
    assert.equal(
      embed,
      "https://open.spotify.com/embed/playlist/37i9dQZF1DXcBWIGoYBM5M?utm_source=generator"
    );
  });

  it("converte URI do Spotify", () => {
    const embed = spotify.toSpotifyEmbed("spotify:album:1DFixLWuPkv3KT3TnV35m3");
    assert.equal(
      embed,
      "https://open.spotify.com/embed/album/1DFixLWuPkv3KT3TnV35m3?utm_source=generator"
    );
  });

  it("aceita URL intl e ja embedada", () => {
    const intl = spotify.toSpotifyEmbed(
      "https://open.spotify.com/intl-pt/track/3n3Ppam7vgaVa1iaRUc9Lp"
    );
    assert.equal(
      intl,
      "https://open.spotify.com/embed/track/3n3Ppam7vgaVa1iaRUc9Lp?utm_source=generator"
    );
    const already =
      "https://open.spotify.com/embed/playlist/37i9dQZF1DXcBWIGoYBM5M?utm_source=generator";
    assert.equal(spotify.toSpotifyEmbed(already), already);
  });

  it("rejeita URL invalida", () => {
    assert.equal(spotify.toSpotifyEmbed(""), "");
    assert.equal(spotify.toSpotifyEmbed("https://example.com/playlist/x"), "");
    assert.equal(spotify.toSpotifyEmbed("not a url"), "");
  });
});
