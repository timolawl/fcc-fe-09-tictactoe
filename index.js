// FCC: Build a Tic Tac Toe Game
// User Story: I can play a game of Tic Tac Toe with the computer.
// User Story: My game will reset as soon as it's over so I can play again.
// User Story: I can choose whether I want to play as X or O.

// Design Inspiration from https://dribbble.com/shots/1374282-Tic-Tac-Toe-App-Gameboard

// Wrap everything in an IIFE
!function() {


function menu() {
  // 1. Global reset
  var weapon = null;
  var difficulty = null;
  
  document.getElementById('weapon--x').classList.remove('highlight');
  document.getElementById('weapon--o').classList.remove('highlight');
   
  document.getElementById('difficulty--easy').classList.remove('highlight');
  document.getElementById('difficulty--medium').classList.remove('highlight');
  document.getElementById('difficulty--impossible').classList.remove('highlight');
  
  document.getElementById('ttt__title').classList.remove('is-hidden');
  document.getElementById('menu').classList.remove('is-hidden');
  document.getElementById('ttt__board').classList.add('is-hidden');

  var squares = ['s1', 's2', 's3', 's4', 's5', 's6', 's7', 's8', 's9'];
  
  squares.forEach(function(currentSquare) {
    var currentElement = document.getElementById(currentSquare);
    
    if(currentElement.firstChild) {
      currentElement.removeChild(currentElement.firstChild);
    }    
  });
  
  // 2. Set up click events for the menu options.
  // Using EventListener requires an additional step in removing the EventListener (replace node).
  document.getElementById('menu').onclick = function(e) {
    if(e.target) {
      if(e.target.id == 'weapon--x') {
        weapon = 'x';
        document.getElementById('weapon--o').classList.remove('highlight');
        document.getElementById('weapon--x').classList.add('highlight');
      }
      else if(e.target.id == 'weapon--o') {
        weapon = 'o';
        document.getElementById('weapon--x').classList.remove('highlight');
        document.getElementById('weapon--o').classList.add('highlight');
      }
      else if(e.target.id == 'difficulty--easy') {
        difficulty = 'easy';
        document.getElementById('difficulty--easy').classList.add('highlight');
        document.getElementById('difficulty--medium').classList.remove('highlight');
        document.getElementById('difficulty--impossible').classList.remove('highlight');
      }
      else if (e.target.id == 'difficulty--medium') {
        difficulty = 'medium';
        document.getElementById('difficulty--easy').classList.remove('highlight');
        document.getElementById('difficulty--medium').classList.add('highlight');
        document.getElementById('difficulty--impossible').classList.remove('highlight');
      }
      
      else if (e.target.id == 'difficulty--impossible') {
        difficulty = 'impossible';
        document.getElementById('difficulty--easy').classList.remove('highlight');
        document.getElementById('difficulty--medium').classList.remove('highlight');
        document.getElementById('difficulty--impossible').classList.add('highlight');
      }
      
    }
    // 3. When a weapon and a difficulty has been selected, proceed to the game.
    if(weapon && difficulty) {
      document.getElementById('ttt__title').classList.toggle('is-hidden');
      document.getElementById('menu').classList.toggle('is-hidden');
      document.getElementById('ttt__board').classList.toggle('is-hidden');
      
      // 4. Who goes first is randomized here.
      var first = Math.random();
      if(first < 0.5) {
        game('player', weapon, difficulty);
      }
      else {
        game('AI', weapon, difficulty);
       
      }
    }
  };
}


function game(whoGoesFirst, selectedWeapon, AIdifficulty) {
  // 5. Initial setup of the board.
  var initialTurn = 1;
  var AIweapon = selectedWeapon === 'x' ? 'o' : 'x';

  var board = ['E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E'];

  // 6. Get action from first player.
  if(whoGoesFirst === 'player') {
    playerAction(selectedWeapon, board, initialTurn, AIdifficulty);    
  }
  else AIAction(AIweapon, board, initialTurn, AIdifficulty);
}


function playerAction(weapon, currentBoard, currentTurn, difficulty) {
  var opponentWeapon = weapon === 'x' ? 'o' : 'x';

  var squares = ['s1', 's2', 's3', 's4', 's5', 's6', 's7', 's8', 's9'];
  
  // 7. Set up clickable Tic-Tac-Toe board for player
  squares.forEach(function(currentSquare) {
    var currentSquareElement = document.getElementById(currentSquare);
    // Again, event handlers stick around, so they stack if not removed each step
    // If you just want one event only, use onclick.
    // 8. Add the X or O (weapon) on the clicked location, if not already occupied.
    currentSquareElement.onclick = function() {
      if(!currentSquareElement.hasChildNodes()) {
        var xmlns = 'http://www.w3.org/2000/svg';
        var xlink = 'http://www.w3.org/1999/xlink';
        var svgElem = document.createElementNS(xmlns, 'svg');
        svgElem.setAttributeNS(xmlns, 'viewBox', '0 0 76 76');
        svgElem.setAttribute('height', '76px');
        svgElem.setAttribute('width', '76px');
        var use = document.createElementNS(xmlns, 'use');
        weapon === 'x' ? use.setAttributeNS(xlink, 'href', '#X') : use.setAttributeNS(xlink, 'href', '#O');
        svgElem.appendChild(use);
        currentSquareElement.appendChild(svgElem);

        // 9. Update the model array after click
        currentBoard[currentSquare.substring(1) - 1] = weapon;

        // 10. Check outcome of the board, and if it hasn't ended, pass the turn.
        if(checkOutcome(currentBoard)) {
          // 11. If outcome is over, show endgame message.
          document.getElementById('outcome').classList.remove('is-hidden');
          document.getElementById('outcome--win').classList.remove('is-hidden');
          // 12. If restart is clicked, the menu is displayed.
          document.getElementById('outcome--restartW').onclick = function() {
            document.getElementById('outcome').classList.add('is-hidden');
            document.getElementById('outcome--win').classList.add('is-hidden');
            menu();
          };
        }
        // 13. If current turn is lower than the max, pass the turn
        else if(currentTurn < 9) {
          return AIAction(opponentWeapon, currentBoard, ++currentTurn, difficulty); // to AI
        }
        // 14. If turn is maxed, then show result as draw and prompt for game restart.
        else { 
          document.getElementById('outcome').classList.remove('is-hidden');
          document.getElementById('outcome--draw').classList.remove('is-hidden');
          document.getElementById('outcome--restartD').onclick = function() {
            document.getElementById('outcome').classList.add('is-hidden');
            document.getElementById('outcome--draw').classList.add('is-hidden');
            menu();
          };
        }
      }
    };
  });
}


function AIAction(weapon, currentBoard, currentTurn, difficulty) {
  var opponentWeapon = weapon === 'x' ? 'o' : 'x';

  // 15. Check remaining states for AI options and make an array of remaining options.
  var openTiles = [];
  currentBoard.forEach(function(tile, tileIndex) {
    if(tile === 'E') {
      openTiles.push(tileIndex);
    }
  })
  var AIchoice;
  
  // 16. AI choice depends on the difficulty, as shown here.
  switch(difficulty) {
    case 'easy': AIchoice = openTiles[Math.floor(Math.random() * openTiles.length)]; break; // Easy AI chooses at random.
    case 'medium': AIchoice = AImedium(weapon, currentBoard); break; // Medium AI will secure own win conditions if imminently available, otherwise will block imminent win conditions of the opponent player.
    case 'impossible': AIchoice = AIimpossible(weapon, currentBoard, currentTurn); break; // Impossible AI never loses.
  }
  
  // 17. AI makes selection here.
  currentBoard[AIchoice] = weapon;
  
  // 18. Display the AI selection on the board.
  var currentSquare = document.getElementById('s' + (AIchoice + 1));

  var xmlns = 'http://www.w3.org/2000/svg';
  var xlink = 'http://www.w3.org/1999/xlink';
  var svgElem = document.createElementNS(xmlns, 'svg');
  svgElem.setAttributeNS(xmlns, 'viewBox', '0 0 76 76');
  svgElem.setAttribute('height', '76px');
  svgElem.setAttribute('width', '76px');
  var use = document.createElementNS(xmlns, 'use');
  weapon === 'x' ? use.setAttributeNS(xlink, 'href', '#X') : use.setAttributeNS(xlink, 'href', '#O');
  svgElem.appendChild(use);
  currentSquare.appendChild(svgElem);

  // 19. Check outcome
  if(checkOutcome(currentBoard)) {
    document.getElementById('outcome').classList.remove('is-hidden');
    document.getElementById('outcome--loss').classList.remove('is-hidden');
    document.getElementById('outcome--restartL').onclick = function() {
      document.getElementById('outcome').classList.add('is-hidden');
      document.getElementById('outcome--loss').classList.add('is-hidden');
      menu();
    };
  }
  // 20. If outcome is still indeterminate and the turn is lower than max, pass the turn.
  else if(currentTurn < 9) { 
    return playerAction(opponentWeapon, currentBoard, ++currentTurn, difficulty); 
  }
  else { 
    document.getElementById('outcome').classList.remove('is-hidden');
    document.getElementById('outcome--draw').classList.remove('is-hidden');
    document.getElementById('outcome--restartD').onclick = function() {
      document.getElementById('outcome').classList.add('is-hidden');
      document.getElementById('outcome--draw').classList.add('is-hidden');
      menu();
    };
  }
}


function checkOutcome(board) {
  var winningSets = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];

  var winConditionMet = false;
  
  // 21. Check if the current player has won.
  winningSets.forEach(function(set) {
    if(board[set[0]] === board[set[1]] && board[set[1]] === board[set[2]]) {
      if(board[set[0]] === 'x' || board[set[0]] === 'o') {
        winConditionMet = true;   // winnar!
      }
    }
  });
  return winConditionMet;
}


function AImedium(weap, board) {
  var opponentWeapon = weap === 'x' ? 'o' : 'x';
  // Use winnings sets and see if 2 of opponents fill two of them, if so, check the 3rd and if it's empty place piece there
  var winningSets = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
  // 22. AI medium algorithm:
  // - If there exists a location where AI can win immediately, choose this spot.
  // - Otherwise if there exists a row where 2 of opponents pieces are in a line, then choice is to stop the connection.
  // - If none of these conditions are met, pick at random.
  
   var openTiles = [];
  board.forEach(function(tile, tileIndex) {
    if(tile === 'E') {
      openTiles.push(tileIndex);
    }
  })
  
  var move = '';
  
  var moves = winningSets.map(function(set) {
    // check for own immediate win condition first
    if(board[set[0]] === board[set[1]]) {
      if(board[set[2]] === 'E') {
        if(board[set[0]] === weap) {
          return set[2];
        }
      }
    }
    else if(board[set[0]] === board[set[2]]) {
      if(board[set[1]] === 'E') {
        if(board[set[0]] === weap) {
          return set[1];
        }
      }
    }
    else if(board[set[1]] === board[set[2]]) {
      if(board[set[0]] === 'E') {
        if(board[set[1]] === weap) {
          return set[0];
        }
      }
    }
    
    if(board[set[0]] === board[set[1]]) {
      if(board[set[2]] === 'E') {
        if(board[set[0]] === opponentWeapon) {
          return set[2];
        }
      }
    }
    else if(board[set[0]] === board[set[2]]) {
      if(board[set[1]] === 'E') {
        if(board[set[0]] === opponentWeapon) {
          return set[1];
        }
      }
    }
    else if(board[set[1]] === board[set[2]]) {
      if(board[set[0]] === 'E') {
        if(board[set[1]] === opponentWeapon) {
          return set[0];
        }
      }
    }
  });
  
  for(var index = 0; index < 9; index++) {
    if(typeof moves[index] === 'number') {
      move = moves[index];
    }
  }  
  if(move === '') {
    move = openTiles[Math.floor(Math.random() * openTiles.length)];
  }
  return move;
}



function AIimpossible(weap, board, turn) {
  // 23. AI impossible (Minimax) algorithm

  var openTiles = [];
  board.forEach(function(tile, tileIndex) {
    if(tile === 'E') {
      openTiles.push(tileIndex);
    }
  });
  
  var templateBoard = [];
  var potentialBoards = [];
  
  //transfer contents
  
  potentialBoards = openTiles.map(function(openTile) {

    //remap the board to a templateBoard for each openTile
    templateBoard = board.map(function(value) {
      return value;
    });
        
    //assign the current open tile an entry
    templateBoard[openTile] = weap;
    
    //get the minimax value of the move.
    var minimaxVal = minimax(weap, templateBoard, turn + 1, 'min');

    return {board: templateBoard,
            tile: openTile,
            value: minimaxVal}
  });
  
  potentialBoards.sort(smallestFirst);

  return potentialBoards[0].tile;
}

function smallestFirst(a, b) {
  if (a.value < b.value) return -1;
  else if (a.value > b.value) return 1;
  else return 0;
}

function minimax(weapon, board, turn, minOrMax) {
  // check if this outcome is a terminal case, and if so return value of board
  if(checkOutcome(board)) {
    if(minOrMax === 'max') { // came from a min so return a min.
      return 10 - turn;
    }
    else { // came from a max so return a max
      return -10 + turn;
    }
  }
  else if(board.indexOf('E') === -1) {
      return 0; 
  }

  else {  
      var newMinOrMax = minOrMax === 'max' ? 'min' : 'max';
      var newWeapon = weapon === 'x' ? 'o' : 'x';
    
      var score;

      if(newMinOrMax === 'max') score = -1000;
      else score = 1000;

      var openTiles = [];
      board.forEach(function(tile, tileIndex) {
        if(tile === 'E') {
          openTiles.push(tileIndex);
        }
      });

      var templateBoard = [];
      var potentialBoards = [];

      potentialBoards = openTiles.map(function(openTile) {
        //remap the board to a templateBoard for each openTile
        templateBoard = board.map(function(value) {
          return value;
        });
        //assign the current open tile an entry
        templateBoard[openTile] = newWeapon;  
        return templateBoard;
      });

      potentialBoards.forEach(function(nextBoard) {
        var nextScore = minimax(newWeapon, nextBoard, turn + 1, newMinOrMax);

        if(newMinOrMax === 'max') {
          if(nextScore > score) {
            score = nextScore;
          }
        }
        else if(nextScore < score) {
          score = nextScore;
        }
     });     
    return score;
  }
}

// 24. Initiate game through menu.

menu();
  
}();
