document.addEventListener('DOMContentLoaded', () => {
  const board = document.getElementById('board');
  const cells = document.querySelectorAll('.cell');
  const status = document.getElementById('status');
  const resetBtn = document.getElementById('reset');
  const scoreX = document.getElementById('score-x');
  const scoreO = document.getElementById('score-o');
  const playerXElement = document.querySelector('.player.x .name');
  const playerOElement = document.querySelector('.player.o .name');
  const playerX = document.querySelector('.player.x');
  const playerO = document.querySelector('.player.o');
  const playAgainBtn = document.getElementById('play-again');

  // Modal elements
  const nameModal = document.getElementById('nameModal');
  const playerXNameInput = document.getElementById('playerXName');
  const playerONameInput = document.getElementById('playerOName');
  const startGameBtn = document.getElementById('startGameBtn');

  let currentPlayer = 'x';
  let gameState = ['', '', '', '', '', '', '', '', ''];
  let gameActive = true;
  let scores = { x: 0, o: 0 };
  let playerXName = 'Player X';
  let playerOName = 'Player O';

  const winningConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
    [0, 4, 8], [2, 4, 6]             // diagonals
  ];

  // Initialize the game
  function initGame() {
    cells.forEach(cell => {
      cell.textContent = '';
      cell.classList.remove('x', 'o', 'winner');
    });
    gameState = ['', '', '', '', '', '', '', '', ''];
    gameActive = true;
    playAgainBtn.style.display = 'none';
    status.classList.remove('celebrate');
    updatePlayerTurn();
  }

  // Handle cell click
  function handleCellClick(e) {
    const clickedCell = e.target;
    const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));

    if (gameState[clickedCellIndex] !== '' || !gameActive) return;

    updateCell(clickedCell, clickedCellIndex);
    checkResult();
  }

  // Update cell with current player's symbol
  function updateCell(cell, index) {
    gameState[index] = currentPlayer;
    cell.textContent = currentPlayer.toUpperCase();
    cell.classList.add(currentPlayer);
  }

  // Check if there's a winner or draw
  function checkResult() {
    let roundWon = false;

    for (let i = 0; i < winningConditions.length; i++) {
      const [a, b, c] = winningConditions[i];
      if (
        gameState[a] === '' ||
        gameState[b] === '' ||
        gameState[c] === ''
      ) {
        continue;
      }

      if (
        gameState[a] === gameState[b] &&
        gameState[b] === gameState[c]
      ) {
        roundWon = true;
        highlightWinningCells([a, b, c]);
        break;
      }
    }

    if (roundWon) {
      announceWinner(currentPlayer);
      updateScore(currentPlayer);
      gameActive = false;
      playAgainBtn.style.display = 'inline-block';
      return;
    }

    if (!gameState.includes('')) {
      announceDraw();
      gameActive = false;
      playAgainBtn.style.display = 'inline-block';
      return;
    }

    changePlayer();
  }

  // Highlight winning cells
  function highlightWinningCells(cellIndexes) {
    cellIndexes.forEach(index => {
      cells[index].classList.add('winner');
    });
  }

  // Announce winner
  function announceWinner(player) {
    status.textContent = `${getPlayerName(player)} wins!`;
    status.classList.add('celebrate');
  }

  // Announce draw
  function announceDraw() {
    status.textContent = 'Game ended in a draw!';
  }

  // Update score
  function updateScore(player) {
    scores[player]++;
    if (player === 'x') {
      scoreX.textContent = scores.x;
    } else {
      scoreO.textContent = scores.o;
    }
  }

  // Change player turn
  function changePlayer() {
    currentPlayer = currentPlayer === 'x' ? 'o' : 'x';
    updatePlayerTurn();
  }

  // Update player turn UI
  function updatePlayerTurn() {
    status.textContent = `${getPlayerName(currentPlayer)}'s turn`;
    
    if (currentPlayer === 'x') {
      playerX.classList.add('active');
      playerO.classList.remove('active');
    } else {
      playerO.classList.add('active');
      playerX.classList.remove('active');
    }
  }

  // Get player name
  function getPlayerName(player) {
    return player === 'x' ? playerXName : playerOName;
  }

  // Event listeners
  cells.forEach(cell => {
    cell.addEventListener('click', handleCellClick);
  });

  resetBtn.addEventListener('click', initGame);

  playAgainBtn.addEventListener('click', initGame);

  startGameBtn.addEventListener('click', () => {
    playerXName = playerXNameInput.value.trim() !== '' ? playerXNameInput.value : 'Player X';
    playerOName = playerONameInput.value.trim() !== '' ? playerONameInput.value : 'Player O';

    playerXElement.textContent = playerXName;
    playerOElement.textContent = playerOName;

    nameModal.style.display = 'none';
    initGame();
  });

  // Initialize
  nameModal.style.display = 'flex';
});
