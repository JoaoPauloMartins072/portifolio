let board = Array(9).fill("");
let currentPlayer = "X";
let gameActive = true;
let gameMode = "pvp";

const winningCombos = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];

function getBoardElements() {
  return {
    boardElement: document.getElementById("board"),
    statusElement: document.getElementById("status"),
    resetButton: document.getElementById("reset")
  };
}

function renderBoard() {
  const { boardElement } = getBoardElements();
  if (!boardElement) return;

  boardElement.innerHTML = "";
  board.forEach((value, index) => {
    const cell = document.createElement("button");
    cell.className = "cell";
    cell.type = "button";
    cell.textContent = value;
    cell.addEventListener("click", () => playMove(index));
    boardElement.appendChild(cell);
  });
}

function checkWinner() {
  for (const [a, b, c] of winningCombos) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  return null;
}

function getAvailableMoves() {
  return board
    .map((value, index) => (value ? null : index))
    .filter((index) => index !== null);
}

function botMove() {
  const moves = getAvailableMoves();
  if (!moves.length) return;

  for (const move of moves) {
    board[move] = "O";
    if (checkWinner() === "O") {
      board[move] = "";
      return move;
    }
    board[move] = "";
  }

  for (const move of moves) {
    board[move] = "X";
    if (checkWinner() === "X") {
      board[move] = "";
      return move;
    }
    board[move] = "";
  }

  if (moves.includes(4)) return 4;

  const corners = [0, 2, 6, 8].filter((index) => moves.includes(index));
  if (corners.length) return corners[0];

  return moves[0];
}

function finishTurn() {
  const { statusElement } = getBoardElements();
  const winner = checkWinner();

  if (winner) {
    statusElement.textContent =
      gameMode === "bot" && winner === "O"
        ? "Bot venceu!"
        : `Jogador ${winner} venceu!`;
    gameActive = false;
  } else if (!board.includes("")) {
    statusElement.textContent = "Empate!";
    gameActive = false;
  } else {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    statusElement.textContent =
      gameMode === "bot" && currentPlayer === "O"
        ? "Vez do bot..."
        : `Vez do jogador ${currentPlayer}`;
  }

  renderBoard();
}

function playMove(index) {
  if (!gameActive || board[index]) return;
  if (gameMode === "bot" && currentPlayer === "O") return;

  board[index] = currentPlayer;
  finishTurn();

  if (gameMode === "bot" && gameActive && currentPlayer === "O") {
    setTimeout(() => {
      if (!gameActive) return;
      const move = botMove();
      board[move] = "O";
      finishTurn();
    }, 350);
  }
}

function resetGame() {
  board = Array(9).fill("");
  currentPlayer = "X";
  gameActive = true;
  const { statusElement } = getBoardElements();
  if (statusElement) {
    statusElement.textContent = "Vez do jogador X";
  }
  renderBoard();
}

function initTicTacToe() {
  board = Array(9).fill("");
  currentPlayer = "X";
  gameActive = true;
  gameMode = "pvp";

  renderBoard();

  const { resetButton } = getBoardElements();
  if (resetButton) {
    resetButton.onclick = resetGame;
  }

  document.querySelectorAll("[data-mode]").forEach((button) => {
    button.addEventListener("click", () => {
      gameMode = button.dataset.mode;
      document.querySelectorAll("[data-mode]").forEach((item) => {
        item.classList.toggle("active", item.dataset.mode === gameMode);
      });
      resetGame();
    });
  });
}

document.addEventListener("DOMContentLoaded", initTicTacToe);
