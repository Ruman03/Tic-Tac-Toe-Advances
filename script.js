let easy = document.getElementById('easy');
let medium = document.getElementById('medium');
let hard = document.getElementById('hard');


let ting = new Audio('ting.mp3');
let gameOver = new Audio('gameover.mp3');
let music = new Audio('music.mp3');
music.loop = true;
music.volume = 0.1;
let isMusicPlay = false;

const winContainer = document.querySelector('.winContainer');

const board = ['','','','','','','','',''];
const human = 'X';
const computer = 'O';

let playerScore = 0;
let computerScore = 0;
const playerScoreDisplay = document.getElementById('playerScore');
const computerScoreDisplay = document.getElementById('computerScore');

const cells = document.querySelectorAll('.cell');
const winner = document.getElementById('winner');
const reset = document.getElementById('reset');

cells.forEach(cell => {
    cell.addEventListener('click', playerMove);
});

reset.addEventListener('click', resetGame);

function playerMove(e){
    document.body.classList.remove('computerTurn');
    document.body.classList.add('playerTurn');
    if(!isMusicPlay){
        music.play();
        isMusicPlay = true;
    }
    ting.play();
    const index = e.target.dataset.index;
    if(!board[index] && !checkWinner(board, human) && !checkWinner(board, computer)) {
        board[index] = human;
        e.target.textContent = human;
        if(checkWinner(board, human)){
            winner.textContent = 'Human Won!';
            playerScore++;
            playerScoreDisplay.textContent = playerScore;
            gameOver.play();
            Won(board, human);
            
        } else if(!board.includes('')){
            winner.textContent = 'It\'s a tie!';
            gameOver.play();
            setTimeout(showWinContainer, 300);
        } else {
            cells.forEach(cell => {
                cell.removeEventListener('click', playerMove);
            })
            setTimeout(computerMove, 900);
        }
    }
}

function computerMove(){
    ting.play();
    document.body.classList.remove('playerTurn');
    document.body.classList.add('computerTurn');
    
    // Introduce randomness: 30% chance for a random move, 70% chance for Minimax
    let e = 0.3;
    let m = 0.2;
    let h = 0.05;
    let mode = h;
    if(easy.checked){
        mode = e;
    } 
    else if(medium.checked){
        mode = m;
    }
    else if(hard.checked){
        mode = h;
    }
    if (Math.random() < mode) {
        // Make a random move
        let availableMoves = [];
        for (let i = 0; i < board.length; i++) {
            if (board[i] == '') {
                availableMoves.push(i);
            }
        }
        let randomMove = availableMoves[Math.floor(Math.random() * availableMoves.length)];
        board[randomMove] = computer;
        cells[randomMove].textContent = computer;
    } else {
        // Use Minimax to make the optimal move
        let bestScore = -Infinity;
        let move;
        for (let i = 0; i < board.length; i++) {
            if (board[i] == '') {
                board[i] = computer;
                let score = minmax(board, 0, false);
                board[i] = '';
                if (score > bestScore) {
                    bestScore = score;
                    move = i;
                }
            }
        }
        board[move] = computer;
        cells[move].textContent = computer;
        
    }

    if(checkWinner(board, computer)){
        winner.textContent = 'Computer Won!';
        computerScore++;
        computerScoreDisplay.textContent = computerScore;
        gameOver.play();
        Won(board, computer);
        
    } else if(!board.includes('')){
        winner.textContent = 'It\'s a tie!';
        gameOver.play();
        setTimeout(showWinContainer, 300);
    }
    cells.forEach(cell => {
        cell.addEventListener('click', playerMove);
    })
}

function minmax(board, depth, isMaximizing){
    if(checkWinner(board, human)) return -10;
    else if(checkWinner(board, computer)) return 10;
    else if(!board.includes('')) return 0;

    if(isMaximizing){
        let bestScore = -Infinity;
        for (let i = 0; i < board.length; i++){
            if(board[i] == ''){
                board[i] = computer;
                let score = minmax(board, depth+1, false);
                board[i] = '';
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < board.length; i++){
            if(board[i] == ''){
                board[i] = human;
                let score = minmax(board, depth+1, true);
                board[i] = '';
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}

function checkWinner(board, player){
    const winnerCombos = [
        [0,1,2], [3,4,5], [6,7,8],
        [0,3,6], [1,4,7], [2,5,8],
        [0,4,8], [2,4,6]
    ];
   
    return winnerCombos.some(combo => {
        return combo.every(i => board[i] === player);
    });
}

function Won(board, player) {
    cells.forEach(cell => {
        cell.removeEventListener('click', playerMove);
        cell.classList.remove('won'); // Clear previous winning class
    });
    
    const winnerCombos = [
        [0,1,2], [3,4,5], [6,7,8],
        [0,3,6], [1,4,7], [2,5,8],
        [0,4,8], [2,4,6]
    ];

    for (let i = 0; i < winnerCombos.length; i++) {
        let [a, b, c] = winnerCombos[i];
        
        // Log each combination that is being checked
        console.log(`Checking combination: ${a}, ${b}, ${c} for player ${player}`);
        
        // If the player has won, highlight the cells
        if (board[a] === player && board[b] === player && board[c] === player) {
            console.log(`Player ${player} won with combo: ${a}, ${b}, ${c}`);
            
            // Log each cell to ensure it's being processed
            console.log(`Highlighting cells: ${a}, ${b}, ${c}`);
            
            cells[a].classList.add('won');
            cells[b].classList.add('won');
            cells[c].classList.add('won');
            
            // Log to confirm each cell is being highlighted
            console.log(`Cell ${a}:`, cells[a]);
            console.log(`Cell ${b}:`, cells[b]);
            console.log(`Cell ${c}:`, cells[c]);
        }
    }
    setTimeout(showWinContainer, 300);
}


function showWinContainer(){
    winContainer.classList.add('visible');
}

function resetGame(){
    board.fill('');
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('won');
        cell.addEventListener('click', playerMove);
    });
    winner.textContent = '';
    winContainer.classList.remove('visible');
    document.body.classList.remove('computerTurn');
    document.body.classList.remove('playerTurn');
}
