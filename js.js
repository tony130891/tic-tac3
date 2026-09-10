function Gameboard() {
  const rows = 4;
  const columns = 4;
  const board = [];

  
  for (let i = 0; i < rows; i++) {
    board[i] = [];
    for (let j = 0; j < columns; j++) {
      board[i].push(Cell());
    }
  }


  const getBoard = () => board;

  
  const dropToken = (column, player) => {

    const availableCells = board
      .filter((row) => row[column].getValue() === 0)
      .map((row) => row[column]);

      const columnsCells = board
      .filter((row) => row[column].getValue() === 0);

    if (availableCells.length === 0) return;
    // Otherwise, I have a valid cell, the last one in the filtered array
    const lowestRow = availableCells.length - 1;
    board[lowestRow][column].addToken(player);
  };



let won = false;
const playerTurnDiv = document.querySelector(".turn");

function winGame (column, player) {
  const columnValues = board.map((row) => row[column].getValue());
  const columnsCells = board
      .filter((row) => row[column].getValue() === 0);

  const celltaken = board.map((row) =>
      row.map((cell) => cell.getValue() !== 0))

   let streak1 = 0;
   let streak2 = 0;

   for (const val of columnValues) {
     if (val === 1) {
       streak1++;
       streak2 = 0;
     } else if (val === 2) {
       streak2++;
       streak1 = 0;
     } else {
       streak1 = 0;
       streak2 = 0;
     }

     if (streak1 === 4) {
      const winnerName = player === 1 ? "Player One" : "Player Two";
      won = true;
      playerTurnDiv.remove()
      const container = document.querySelector('.container1');
      const drawMsg = document.createElement('h1');
      container.appendChild(drawMsg)
      drawMsg.textContent = `${winnerName} has won the game`;
      const divMsg = document.querySelector('.divMsg');
      const gameoverMsg = document.createElement('h1');
      gameoverMsg.textContent = 'GameOver';
      const restartBtn = document.createElement('button');
      restartBtn.classList.add('restartBtn');
      restartBtn.textContent = 'Play Again';

      divMsg.appendChild(gameoverMsg);
      divMsg.appendChild(restartBtn);
      playAgain()      
      //gameOver FUNCTION
     }

     if (streak2 === 4) {
       const winnerName = player === 2 ? "Player Two" : "Player One";
       won = true;
       playerTurnDiv.remove()
      const drawMsg = document.createElement('h1');
      const container = document.querySelector('.container1');
      drawMsg.textContent = `${winnerName} has won the game`;
      container.appendChild(drawMsg);

      const divMsg = document.querySelector('.divMsg');
      const gameoverMsg = document.createElement('h1');
      gameoverMsg.textContent = 'GameOver';
      const restartBtn = document.createElement('button');
      restartBtn.classList.add('restartBtn');
      restartBtn.textContent = 'Play Again';

      divMsg.appendChild(gameoverMsg);
      divMsg.appendChild(restartBtn);
      playAgain()
       //gameOver FUNCTION
     }
  
    }
    let trutyVal = celltaken.every(row => row.every(val => val=== true));
    if (trutyVal) {
      playerTurnDiv.remove()
      const drawMsg = document.createElement('h1');
      const container = document.querySelector('.container1');
      drawMsg.textContent = 'It is a TIE!'
      container.appendChild(drawMsg);

      const divMsg = document.querySelector('.divMsg');
      const gameoverMsg = document.createElement('h1');
      gameoverMsg.textContent = 'GameOver';
      const restartBtn = document.createElement('button');
      restartBtn.classList.add('restartBtn');
      restartBtn.textContent = 'Play Again';

      divMsg.appendChild(gameoverMsg);
      divMsg.appendChild(restartBtn);
      
      playAgain()
    };
};

const getWon = () => {
    return won
}

  const printBoard = () => {
    const boardWithCellValues = board.map((row) =>
      row.map((cell) => cell.getValue())
    );
    console.log(boardWithCellValues);
  };

  return { getBoard, dropToken, printBoard, winGame, getWon };
}


function Cell() {
  let value = 0;

 
  const addToken = (player) => {
    value = player;
  };


  const getValue = () => value;

  return {
    addToken,
    getValue,
  };
}


function GameController(
  playerOneName = "Player One",
  playerTwoName = "Player Two"
) {
  const board = Gameboard();

  const players = [
    {
      name: playerOneName,
      token: 1,
    },
    {
      name: playerTwoName,
      token: 2,
    },
  ];
  
  let activePlayer = players[0];

if(board.getWon() == false) {
  players[0].name = prompt('enter your name please');
    if(players[0].name == null || players[0].name == "") {
      players[0].name = playerOneName;
      activePlayer = players[0];
  } else {
    activePlayer = players[0];
  }
}





  const switchPlayerTurn = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };
  const getActivePlayer = () => activePlayer;

  const printNewRound = () => {
    board.printBoard();
    console.log(`${getActivePlayer().name}'s turn.`);
  };

  const playRound = (column) => {
    
    if(board.getWon() == true) {return}

    // Drop a token for the current player
    console.log(
      `Dropping ${getActivePlayer().name}'s token into column ${column}...`
    );
    board.dropToken(column, getActivePlayer().token);

    if (board.winGame(column, getActivePlayer().token)) {
      return;
    }

    // Switch player turn
    switchPlayerTurn();
    printNewRound();
  };

  // Initial play game message
  printNewRound();

  // For the console version, we will only use playRound, but we will need
  // getActivePlayer for the UI version, so I'm revealing it now
  return {
    playRound,
    getActivePlayer,
    getboard: board.getBoard,
    gameWon: board.winner,

  };
}

function ScreenController() {

  const game = GameController();
  const playerTurnDiv = document.querySelector(".turn");
  const boardDiv = document.querySelector(".board");
  const winner = Gameboard();

  const updateScreen = () => {

  const board = game.getboard();
  const activePlayer = game.getActivePlayer();
  
    boardDiv.textContent = "";
     playerTurnDiv.textContent = `${activePlayer.name}'s turn...`;
    

     board.forEach((row) => {
      row.forEach((cell, index) => {
        const cellButton =  document.createElement("button");
        cellButton.classList.add("cell");
        // Create a data attribute to identify the column
        // This makes it easier to pass into our `playRound` function
        cellButton.dataset.column = index;
        cellButton.textContent = cell.getValue();
        boardDiv.appendChild(cellButton);
      })
     })
  }


  
  function clickHandlerBoard(e){


    const selectedColumn = e.target.dataset.column;
    const selected = e.target.textContent;
    
    if(selected !== '0') return;
    if(!selectedColumn) return;

  
    game.playRound(selectedColumn);
    updateScreen();
  }

  

  boardDiv.addEventListener('click', clickHandlerBoard);

  updateScreen();
}

ScreenController()
//create a welcome page where the players can choose their name


function playAgain() {
    
    const restartBtn = document.querySelector('.restartBtn');
    const divMsg = document.querySelector('.divMsg');
    const controller = Gameboard();
    const board = controller.getBoard(); 
    let bool = controller.getWon();

    restartBtn.addEventListener('click', () => {
      // erase the restartDiv
      divMsg.remove()
      // clean the board on the screen
      console.log(controller)
      //bool = false
    })
}