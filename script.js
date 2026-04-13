/* ============================================================
   SCRIPT.JS — Tic Tac Toe Game Logic
   Pure vanilla JavaScript — no frameworks needed.
   ============================================================ */

// ---- Grab DOM elements ----
const cells      = document.querySelectorAll('.cell');
const statusEl   = document.getElementById('status');
const board      = document.getElementById('board');
const restartBtn = document.getElementById('restartBtn');

// ---- Game state ----
let currentPlayer = 'X';        // X always goes first
let gameBoard     = ['', '', '', '', '', '', '', '', ''];
let gameActive    = true;       // false once someone wins or it's a draw

// ---- All possible winning combinations (indices) ----
const winPatterns = [
  [0, 1, 2],  // top row
  [3, 4, 5],  // middle row
  [6, 7, 8],  // bottom row
  [0, 3, 6],  // left column
  [1, 4, 7],  // middle column
  [2, 5, 8],  // right column
  [0, 4, 8],  // diagonal ↘
  [2, 4, 6],  // diagonal ↙
];

// ---- Helper: build the status message with coloured player name ----
function turnMessage(player) {
  const cls = player === 'X' ? 'x-color' : 'o-color';
  return `Player <span class="${cls}">${player}</span>'s turn`;
}

function winMessage(player) {
  const cls = player === 'X' ? 'x-color' : 'o-color';
  return `Player <span class="${cls}">${player}</span> wins! 🎉`;
}

// ---- Check for a winner ----
// Returns the winning pattern array if found, or null.
function getWinningPattern() {
  for (const pattern of winPatterns) {
    const [a, b, c] = pattern;
    if (
      gameBoard[a] &&                       // cell not empty
      gameBoard[a] === gameBoard[b] &&      // all three match
      gameBoard[a] === gameBoard[c]
    ) {
      return pattern;
    }
  }
  return null;
}

// ---- Check for a draw (all cells filled, no winner) ----
function isDraw() {
  return gameBoard.every(cell => cell !== '');
}

// ---- Handle a cell click ----
function handleCellClick(e) {
  const cell  = e.target;
  const index = parseInt(cell.dataset.index);

  // Ignore clicks on taken cells or if game is over
  if (gameBoard[index] !== '' || !gameActive) return;

  // 1. Update the data model
  gameBoard[index] = currentPlayer;

  // 2. Update the UI — place the mark
  cell.textContent = currentPlayer;
  cell.classList.add('taken', 'placed', currentPlayer.toLowerCase());

  // 3. Check for win
  const winCombo = getWinningPattern();
  if (winCombo) {
    gameActive = false;
    statusEl.innerHTML = winMessage(currentPlayer);
    board.classList.add('game-over');

    // Highlight the three winning cells
    winCombo.forEach(i => {
      cells[i].classList.add('winner');
    });
    return;
  }

  // 4. Check for draw
  if (isDraw()) {
    gameActive = false;
    statusEl.textContent = "It's a draw! 🤝";
    board.classList.add('game-over');
    return;
  }

  // 5. Switch turns
  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  statusEl.innerHTML = turnMessage(currentPlayer);
}

// ---- Restart / reset everything ----
function restartGame() {
  currentPlayer = 'X';
  gameBoard     = ['', '', '', '', '', '', '', '', ''];
  gameActive    = true;

  statusEl.innerHTML = turnMessage('X');
  board.classList.remove('game-over');

  cells.forEach(cell => {
    cell.textContent = '';
    cell.className   = 'cell';   // strips all added classes at once
  });
}

// ---- Attach event listeners ----
cells.forEach(cell => cell.addEventListener('click', handleCellClick));
restartBtn.addEventListener('click', restartGame);
