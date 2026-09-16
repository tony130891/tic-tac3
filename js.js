function Gameboard() {
  const rows = 3;
  const columns = 3;
  const board = [];

  
  for (let i = 0; i < rows; i++) {
    board[i] = [];
    for (let j = 0; j < columns; j++) {
      board[i].push(Cell());
    }
  }


  const getBoard = () => board;
  const getRows = () => rows;
  const getColumns = () => columns;
 
  
  const dropToken = (rows, column, player) => {
    //tira el token en el row de la columna de board
    
    board[rows][column].addToken(player);
  };


let won = false;
const playerTurnDiv = document.querySelector(".turn");

function winGame (column, player) {
  const columnValues = board.map((row) => row[column].getValue());
  const columnsCells = board
      .filter((row) => row[column].getValue() === '-');

  const celltaken = board.map((row) =>
      row.map((cell) => cell.getValue() !== '-'))

   let streak1 = 0;
   let streak2 = 0;

   for (const val of columnValues) {
     if (val === 'O') {
       streak1++;
       streak2 = 0;
     } else if (val === 'X') {
       streak2++;
       streak1 = 0;
     } else {
       streak1 = 0;
       streak2 = 0;
     }

     if (streak1 === 3) {
      const winnerName = player === 'O' ? "Player One" : "Player Two";
      won = true;
      playerTurnDiv.remove()
      const container = document.querySelector('.container1');
      const drawMsg = document.createElement('h1');
      drawMsg.classList.add('winnerMsg');
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

     if (streak2 === 3) {
       const winnerName = player === 'X' ? "Player Two" : "Player One";
       won = true;
       playerTurnDiv.remove()
      const container = document.querySelector('.container1');
      const drawMsg = document.createElement('h1');
      drawMsg.classList.add('winnerMsg');
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
  
    }
    let trutyVal = celltaken.every(row => row.every(val => val=== true));
    if (trutyVal && streak1 !== 3 && streak2 !== 3) {
      playerTurnDiv.remove()
      const drawMsg = document.createElement('h1');
      const container = document.querySelector('.container1');
      drawMsg.textContent = 'It is a TIE!';
      drawMsg.classList.add('winnerMsg');
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

  return { getBoard, dropToken, printBoard, winGame, getWon, getRows, getColumns };
}


function Cell() {
  let value = '-';

 
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
      token: 'O',
    },
    {
      name: playerTwoName,
      token: 'X',
    },
  ];
  
  let activePlayer = players[0];


  const switchPlayerTurn = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };
  const getActivePlayer = () => activePlayer;

  const printNewRound = () => {
    board.printBoard();
    console.log(`${getActivePlayer().name}'s turn.`);
  };

  const playRound = (row, column) => {
    
    if(board.getWon() == true) {return}

    // Drop a token for the current player
    console.log(
      `Dropping ${getActivePlayer().name}'s token into column ${column} and ${row}`
    );
    board.dropToken(row,column, getActivePlayer().token);

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

function Menu() {
  const container = document.querySelector('.container1');
  const board = document.querySelector('.boardHidden');

  const form = document.createElement("form");
  const divMenu = document.createElement("div");
  const title = document.createElement("h1");
  const input1 = document.createElement("input");
  const input2 = document.createElement("input");
  const divBtn = document.createElement("button");
  const submitBtn = document.createElement("button");
  const cancelBtn = document.createElement("button");

  divMenu.classList.add("divmenu");
  input1.setAttribute("type", "text");
  input1.setAttribute("placeholder", "Player One");
  input1.classList.add("player1");
  input1.style.display = "flex";
  input2.setAttribute("type", "text");
  input2.setAttribute("placeholder", "Player Two");
  input2.classList.add("player2");
  divBtn.classList.add("divBtn");

  submitBtn.textContent = "Submit";
  cancelBtn.textContent = "Cancel";

  container.appendChild(divMenu);
  divMenu.appendChild(form);
  form.appendChild(title);
  title.appendChild(input1);
  title.appendChild(input2);
  divMenu.appendChild(divBtn);
  divBtn.appendChild(submitBtn);
  divBtn.appendChild(cancelBtn);


  submitBtn.addEventListener("click", () => {
    //e.preventDefault();
    board.classList.remove("boardHidden");
    board.classList.add("board");
    container.appendChild(board);
    divMenu.remove();
    const player1 = input1.value || "Player One";
    const player2 = input2.value || "Player Two";
    // input values variables to become turn's names
    // try to export this value into Screen function
   
    ScreenController(player1, player2);
  });
}

function ScreenController(playerOneName, playerTwoName) {
  const game = GameController(playerOneName, playerTwoName);
  const playerTurnDiv = document.querySelector(".turn");
  const boardDiv = document.querySelector(".board");

  const updateScreen = () => {
    // clear the board
    boardDiv.textContent = "";

    // get the newest version of the board and player turn
    const board = game.getboard();
    const activePlayer = game.getActivePlayer();

    // Display player's turn
    playerTurnDiv.textContent = `${activePlayer.name}'s turn...`;

    // Render board squares
    board.forEach((row) => {
      row.forEach((cell, index) => {
        // Anything clickable should be a button!!
        const cellButton = document.createElement("button");
        cellButton.classList.add("cell");
        cellButton.dataset.column = index;
        cellButton.textContent = cell.getValue();
        if(cellButton.textContent == 'X') {cellButton.style.color = 'orange'};
        if(cellButton.textContent == 'O') {cellButton.style.color = 'blue'};
        boardDiv.appendChild(cellButton);
      });
    });
  };
  
  function clickHandlerBoard(e){


    const selectedColumn = e.target.dataset.column;
    const selected = e.target.textContent;
    
    if(selected !== '-') return;
    if(!selectedColumn) return;

  
    game.playRound(selectedColumn);
    updateScreen();
  }

  

  boardDiv.addEventListener('click', clickHandlerBoard);

  updateScreen();
}

function playAgain() {
    
    const restartBtn = document.querySelector('.restartBtn');
    const divMsg = document.querySelector('.divMsg');
    const container = document.querySelector('.container1');
    const winMsg = document.querySelector('.winnerMsg');
    const boardScreen = document.querySelector('.board');

    const controller = Gameboard();
    const board = controller.getBoard();
    const rows = controller.getRows();
    const columns = controller.getColumns();
    let bool = controller.getWon();

    restartBtn.addEventListener('click', () => {
      
      bool = false
      //boardScreen.remove();
      boardScreen.classList.toggle('boardHidden');
      divMsg.remove()
      winMsg.remove()

      const div2Msg = document.createElement('div');
      div2Msg.classList.add('divMsg');
      container.appendChild(div2Msg);

      const turnMsg = document.createElement('h1');
      turnMsg.classList.add('turn');
      div2Msg.appendChild(turnMsg);
  Menu()
})
}

Menu()