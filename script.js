const playerX = 'X';
const playerO = 'O';

let currentPlayer = playerX;
let gameBoard = ['', '', '', '', '', '', '', '', ''];
let gameActive = true;
let isPvPMode = true;

const gameBoardElement = document.getElementById('game-board');
const statusMessageElement = document.getElementById('status-message');
const resetButton = document.getElementById('reset-btn');
const pvpButton = document.getElementById('pvp-btn');
const pvaiButton = document.getElementById('pvai-btn');

// Function to initialize the game
function initializeGame() {
    gameBoardElement.innerHTML = '';
    gameBoard = ['', '', '', '', '', '', '', '', ''];
    gameActive = true;

    for (let i = 0; i < 9; i++) {
        const cell = document.createElement('button');
        cell.addEventListener('click', () => makeMove(i));
        gameBoardElement.appendChild(cell);
    }

    updateBoard();
    updateStatusMessage();
}

// Function to handle player moves
function makeMove(index) {
    if (!gameActive || gameBoard[index] !== '') return;

    gameBoard[index] = currentPlayer;
    updateBoard();
    
    if (checkWinner()) {
        statusMessageElement.textContent = `Player ${currentPlayer} wins!`;
        gameActive = false;
    } else if (checkDraw()) {
        statusMessageElement.textContent = 'It\'s a draw!';
        gameActive = false;
    } else {
        currentPlayer = currentPlayer === playerX ? playerO : playerX;
        updateStatusMessage();

        // If in PvAI mode and it's AI's turn
        if (!isPvPMode && currentPlayer === playerO) {
            makeAiMove();
        }
    }
}

// Function to handle AI move
function makeAiMove() {
    // If in PvAI mode and it's AI's turn
    if (!isPvPMode && currentPlayer === playerO) {
        // TODO: Implement a more advanced AI algorithm (e.g., minimax)
        const emptyCells = gameBoard.reduce((acc, cell, index) => {
            if (cell === '') {
                acc.push(index);
            }
            return acc;
        }, []);

        const randomIndex = Math.floor(Math.random() * emptyCells.length);
        const aiMove = emptyCells[randomIndex];

        setTimeout(() => makeMove(aiMove), 500); // Introduce a delay for a more natural feel
    }
}



// Function to update the game board display
function updateBoard() {
    const cells = gameBoardElement.children;

    for (let i = 0; i < 9; i++) {
        cells[i].textContent = gameBoard[i];
    }
}

// Function to check for a winner
function checkWinner() {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6]              // Diagonals
    ];

    return winPatterns.some(pattern => {
        const [a, b, c] = pattern;
        return gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[b] === gameBoard[c];
    });
}

// Function to check for a draw
function checkDraw() {
    return !gameBoard.includes('') && !checkWinner();
}

// Function to update the status message
function updateStatusMessage() {
    statusMessageElement.textContent = gameActive
        ? `Player ${currentPlayer}'s turn`
        : gameActive === false && checkWinner()
            ? `Player ${currentPlayer} wins!`
            : 'It\'s a draw!';
}

// Event listeners
resetButton.addEventListener('click', initializeGame);
pvpButton.addEventListener('click', () => setGameMode(true));
pvaiButton.addEventListener('click', () => setGameMode(false));

// Function to set game mode (PvP or PvAI)
function setGameMode(isPvP) {
    isPvPMode = isPvP;
    initializeGame();

    if (!isPvP) {
        makeAiMove(); // If starting a PvAI game, make the first move for AI
    }
}

// Initialize the game
initializeGame();
