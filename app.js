const canvas = document.getElementById('board');
const ctx = canvas.getContext('2d');
const msg = document.getElementById('message');
const emoji = document.getElementById('emoji');
const resetBtn = document.getElementById('reset');
const patterns = [
    0b111000000, 0b000111000, 0b000000111,  // rows
    0b100100100, 0b010010010, 0b001001001,  // cols
    0b100010001, 0b001010100   // diagonals
];
const status = {
    playerOne: 1,
    playerTwo: -1,
    empty: 0
}
const cellSize = 125;
let board = new Array(9).fill(0);
let gameOver = false;

canvas.width = 3 * cellSize;
canvas.height = 3 * cellSize;
msg.textContent = 'Click on a square to start the game!'
mouse = { 
    x: -1, 
    y: -1 
};
currentPlayer = 1;
canvas.addEventListener('mouseout', () => {
    mouse.x = mouse.y - 1;
});
canvas.addEventListener('mousemove', (e) => {
    mouse.x = (e.pageX - canvas.offsetLeft);
    mouse.y = (e.pageY - canvas.offsetTop);
});
canvas.addEventListener('click', (e) => {
    checkCell(getCellByCoords(mouse.x, mouse.y));
});
// Let's get things rolling.
mainDraw();

/* Main draw function */
function mainDraw () {
    // resetBtn.style.display = "none"; 
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBoard();
    fillBoard();
    /* Draw a board */
    function drawBoard () {
        ctx.strokeStyle = '#212121';
        ctx.lineWidth = 5;
        // First line -
        ctx.beginPath();
        ctx.moveTo(cellSize, 0);
        ctx.lineTo(cellSize, canvas.height);
        ctx.stroke();
        // Second line |
        ctx.beginPath();
        ctx.moveTo(cellSize * 2, 0);
        ctx.lineTo(cellSize * 2, canvas.height);
        ctx.stroke();
        // Third line -
        ctx.beginPath();
        ctx.moveTo(0, cellSize);
        ctx.lineTo(canvas.width, cellSize);
        ctx.stroke();
        // Fourth line -
        ctx.beginPath();
        ctx.moveTo(0, cellSize * 2);
        ctx.lineTo(canvas.width, cellSize * 2);
        ctx.stroke();
    }
    /* Fills the board with either an 'X' or an 'O'. If it's empty, nothing is shown. */
    function fillBoard () {
        for (let i = 0; i < board.length; i += 1) {
            let coords = getCellCoords(i);
            ctx.save();
            ctx.translate(coords.x + cellSize / 2, coords.y + cellSize / 2);
            // So the origin of the canvas is at the center of the current cell, so we can just draw an 'X' or an 'O'
            if (board[i] == status.playerOne) {
                putCross();
            }
            else if (board[i] == status.playerTwo) {
                putZero();
            }
            ctx.restore();
        }
    }
    /* Draw and put a cross if it's valid */
    function putCross () {
        ctx.beginPath();
        ctx.moveTo(-cellSize / 3, -cellSize / 3);
        ctx.lineTo(cellSize / 3, cellSize / 3);
        ctx.moveTo(cellSize / 3, -cellSize / 3);
        ctx.lineTo(-cellSize / 3, cellSize / 3);
        ctx.strokeStyle = '#80b524';
        ctx.stroke();
    }
    /* Draw and put a zero if it's valid */
    function putZero () {
        ctx.beginPath();
        ctx.arc(0, 0, cellSize / 3, 0, Math.PI * 2);
        ctx.strokeStyle = '#449fb7'; 
        ctx.stroke();
    }
    // Tells the browser that you wish to perform an animation and requests 
    // that the browser call a specified function to update an animation before the next repaint
    window.requestAnimationFrame(mainDraw);
}
/* Get the coordinates of a cell */
function getCellCoords (cell) {
    let row = (cell % 3) * cellSize;
    let col = Math.floor(cell / 3) * cellSize;
    return ({ 'x': row, 'y': col });
}
/* Get a celll by the coordinates */
function getCellByCoords (x, y) {
    return ((Math.floor(x / cellSize) % 3) + Math.floor(y / cellSize) * 3);
}
/* Check the pattern of a current player */
function checkPattern (player) {
    let check = 0;
    let bitMask = 0;

    for (let i = 0; i < board.length; i += 1) {
        bitMask <<= 1;
        bitMask += (board[i] == player) ? 1 : 0
        for (let i = 0; i < board.length; i++) {
            if ((bitMask & patterns[i]) == patterns[i])
                check = patterns[i];
        }
    }
    return (check);
}
/* Check if a cell is valid */
function checkCell (cell) {
    msg.textContent = '';
    if (!gameOver && board[cell] == status.empty) {
        board[cell] = currentPlayer;
        let gameStatus = checkPattern(currentPlayer);
        if (gameStatus) {
            gameOver = true;
            emoji.textContent = (currentPlayer == status.playerOne ? '🦖' : '🦕');
            msg.textContent = 'Well, looks like we have a winner 😎';
            resetBtn.style.display = 'block';
        }
        currentPlayer *= -1;
        gameOver ? 0 : displayTurn();
    }
    else if (!gameOver) {
        msg.textContent = 'Invalid move';
    }
}
/* Display current turn of the player */
function displayTurn () {
    msg.textContent = 'Current turn is for '
    msg.textContent += ((currentPlayer == status.playerOne ? 'X' : 'O'))
}