var difficultyDefinitions = {
  0: {
    rows: 9,
    cols: 9,
    mines: 10
  },
  1: {
    rows: 14,
    cols: 16,
    mines: 40
  },
  2: {
    rows: 18,
    cols: 32,
    mines: 99
  },
}

var ONE_SECOND = 1000;
var MUTE_VOLUME = 0;
var POP_VOLUME = 0.3;
var OOPS_VOLUME = 0.5;
var FLAGPLACE_VOLUME = 1;
var FLAGREMOVE_VOLUME = 0.4;
var SADGE_VOLUME = 0.5;
var YEET_VOLUME = 0.3;
var YEEET_VOLUME = 0.5;

var gameDifficulty;
var gameBoard;
var mines;
var numRemainingTiles;
var numRemainingMines = 10;
var timer;
var timerMins;
var timerSecs;
var timerStarted = false;
var gameOver = false;
var isMuted = false;

var pop = new Audio("assets/pop.mp3");
pop.volume = POP_VOLUME;
var oops = new Audio("assets/oops.mp3");
oops.volume = OOPS_VOLUME;
var flagPlace = new Audio("assets/flag-place.mp3");
flagPlace.volume = FLAGPLACE_VOLUME;
var flagRemove = new Audio("assets/flag-remove.mp3");
flagRemove.volume = FLAGREMOVE_VOLUME;
var sadge = new Audio("assets/lose-1.mp3");
sadge.volume = SADGE_VOLUME;
var yeet = new Audio("assets/win-1.mp3");
yeet.volume = YEET_VOLUME;
var yeeet = new Audio("assets/win-2.mp3");
yeeet.volume = YEEET_VOLUME;
yeeet.loop = true;

// helper function to reset board
function resetBoard() {

  // reset variables
  gameOver = false;
  document.getElementsByClassName('game-over-modal-overlay')[0].style.display = 'none';
  numRemainingMines = difficultyDefinitions[gameDifficulty].mines;

  // reset music
  yeet.pause();
  yeeet.pause();
  sadge.pause();

  // reset game UI
  stopTimer();
  determineBoard(gameDifficulty);
  updateFlags();
}

// function to start the timer
function startTimer() {

  // remove redundant event listeners
  if(timerStarted) return;

  // if game is over, don't start the timer again
  if(gameOver) return;

  timerStarted = true;
  timer = setInterval(incrementTime, ONE_SECOND);
}

// function to stop the timer
function stopTimer(isLost) {

  // if game over, terminate the timer
  if(isLost) gameOver = true;

  timerStarted = false;
  clearInterval(timer);
}

// function to increment the time
function incrementTime() {

  let mins = parseInt(timerMins);
  let secs = parseInt(timerSecs);

  if(mins === 59) {
    if(secs === 59) {
      stopTimer();
    } else {
      secs++;
    }
  } else {
    if(secs === 59) {
      mins++;
      secs = 0;
    } else {
      secs++;
    }
  }

  // check if string has one digit, add leading 0 if true
  let minsStr = "" + mins;
  let secsStr = "" + secs;

  if(minsStr.length === 1) minsStr = "0" + minsStr;
  if(secsStr.length === 1) secsStr = "0" + secsStr;

  // update global variables
  timerMins = minsStr;
  timerSecs = secsStr;
  drawTimer();
}

// function to draw the time
function drawTimer() {
  document.getElementById('amtTime').textContent = `${timerMins}:${timerSecs}`;
}

// updates difficulty base on user input
function updateDifficulty(diff) {

  // html elements to update
  let rowsEl = document.getElementById('numRows');
  let colsEl = document.getElementById('numCols');
  let minesEl = document.getElementById('numMines');

  // populate new info
  let diffDef = difficultyDefinitions[diff];
  rowsEl.textContent = diffDef.rows;
  colsEl.textContent = diffDef.cols;
  minesEl.textContent = diffDef.mines;

  // update variables
  numRemainingMines = diffDef.mines;
  gameDifficulty = parseInt(diff);

  resetBoard();
}

// update number of flags left
function updateFlags() {

  document.getElementById('numFlags').textContent = numRemainingMines;
}

// determine the game board
function determineBoard(diff) {

  let diffDef = difficultyDefinitions[diff];
  let tileType = "";
  let numMinesLeftToDraw = numRemainingMines;
  numRemainingTiles = diffDef.rows * diffDef.cols;
  timerMins = "00";
  timerSecs = "00";
  mines = [];
  gameBoard = {};

  drawTimer();

  // determine which tiles are mines
  while(numMinesLeftToDraw > 0) {

    let potentialMine = Math.trunc(Math.random() * diffDef.rows * diffDef.cols);
    if(!mines.includes(potentialMine)) {
      mines.push(potentialMine);
      numMinesLeftToDraw--;
    }
  }

  // populate game board object
  for(let i = 0; i < diffDef.rows * diffDef.cols; i++) {

    let curType = mines.includes(i) ? "mine" : "blank";

    gameBoard[i] = {
      type: curType,
      flagged: false,
      num: -1,
      revealed: false
    }
  }

  // set the actual number for the tile
  for(let i = 0; i < diffDef.rows * diffDef.cols; i++) {

    gameBoard[i].num = numAdjacentMines(i);
  }

  // draw the actual, visual game board
  drawBoard(diffDef.rows, diffDef.cols);

}

// set the correct number for each tile
function numAdjacentMines(i) {

  let rows = parseInt(difficultyDefinitions[gameDifficulty].rows);
  let cols = parseInt(difficultyDefinitions[gameDifficulty].cols);

  // return -1 if this tile is a mine
  if(gameBoard[i].type === "mine") return -1;

  // if top left corner
  if(i === 0) {
    return [isMine(i + 1), isMine(i + cols), isMine(i + cols + 1)].filter(Boolean).length;
  }

  // if top right corner
  else if(i === cols - 1) {
    return [isMine(i - 1), isMine(i + cols), isMine(i + cols - 1)].filter(Boolean).length;
  }

  // if bottom left corner
  else if(i === (rows - 1) * cols) {
    return [isMine(i + 1), isMine(i - cols), isMine(i - cols + 1)].filter(Boolean).length;
  }

  // if bottom right corner
  else if(i === rows * cols - 1) {
    return [isMine(i - 1), isMine(i - cols), isMine(i - cols - 1)].filter(Boolean).length;
  }

  // if top edge
  else if(i < cols) {
    return [isMine(i - 1), isMine(i + 1), isMine(i + cols - 1), isMine(i + cols), isMine(i + cols + 1)].filter(Boolean).length;
  }

  // if left edge
  else if (Math.trunc(i / cols) === i / cols) {
    return [isMine(i + 1), isMine(i + cols), isMine(i + cols + 1), isMine(i - cols), isMine(i - cols + 1)].filter(Boolean).length;
  }

  // if right edge
  else if (Math.trunc((i + 1) / cols) === (i + 1) / cols) {
    return [isMine(i - 1), isMine(i - cols), isMine(i - cols - 1), isMine(i + cols), isMine(i + cols - 1)].filter(Boolean).length;
  }

  // if bottom edge
  else if (i > (rows - 1) * cols) {
    return [isMine(i - 1), isMine(i + 1), isMine(i - cols - 1), isMine(i - cols), isMine(i - cols + 1)].filter(Boolean).length;
  }

  // else, it's a middle square
  else {
    return [isMine(i - cols - 1), isMine(i - cols), isMine(i - cols + 1), isMine(i - 1), isMine(i + 1), isMine(i + cols - 1), isMine(i + cols), isMine(i + cols + 1)].filter(Boolean).length;
  }
}

// helper function to determine if the given tile is a mine
function isMine(tileIndex) {

  return gameBoard[tileIndex].type === "mine";
}

// helper function to determine the tile's color
function getTileColor(i) {

  let cols = difficultyDefinitions[gameDifficulty].cols;

  // if the cols is odd, just return every other
  if(cols % 2 === 1) {
    return i % 2 === 1 ? 'light-tile' : 'dark-tile';
  }

  // if cols is even, some fancy logic is needed :)
  else {
    if(Math.trunc(i / cols) % 2 === 0) {
      return i % 2 === 1 ? 'light-tile' : 'dark-tile';
    }
    else {
      return i % 2 === 1 ? 'dark-tile' : 'light-tile';
    }
  }
}

// function to visually draw the board's HTML elements
function drawBoard(rows, cols) {

  let boardEl = document.getElementsByClassName('game-board')[0];
  let currRowEl;
  let tileSize;

  // clear current board
  while(boardEl.firstChild) {
    boardEl.removeChild(boardEl.lastChild);
  }

  // determine tile size
  switch(gameDifficulty) {
    case 0:
      tileSize = "48px";
      break;
    case 1:
      tileSize = "36px";
      break;
    case 2:
      tileSize = "28px";
      break;
  }

  for(let i = 0; i < rows * cols; i++) {

    // if inserting left edge tile, create new row to insert into
    if(Math.trunc(i / cols) === i / cols) {
      let newRow = document.createElement('div');
      newRow.setAttribute('class', 'game-row');
      currRowEl = newRow;

      boardEl.appendChild(newRow);
    }

    // insert game tile
    let newTile = document.createElement('div');
    newTile.setAttribute('id', i);
    newTile.classList.add(getTileColor(i));
    newTile.classList.add('game-tile');
    newTile.style.height = tileSize;
    newTile.style.width = tileSize;

    currRowEl.appendChild(newTile);

    // add click event listener
    newTile.addEventListener('click', revealTile)
    newTile.addEventListener('contextmenu', toggleFlag);
  }

  // add event listener to start timer
  document.getElementsByClassName('game-board')[0].addEventListener('click', startTimer);

}

// function for toggling a flag on the tile after right clicking on it
function toggleFlag(e) {

  e.preventDefault();

  let tile = e.target.closest('.game-tile');
  let tileId = tile.id;

  // do nothing if tile is already revealed
  if (gameBoard[tileId].revealed) return;

  // remove flag if already there, add flag if not there
  if(gameBoard[tileId].flagged) {

    // remove the flag icon
    tile.classList.remove('flag');

    // play sound if not muted
    if(!isMuted) {
      flagRemove.load();
      flagRemove.play();
    }

    // update variables
    numRemainingMines++;

  } else {

    // add the flag icon
    tile.classList.add('flag');

    // play sound if not muted
    if(!isMuted) {
      flagPlace.load();
      flagPlace.play();
    }

    // update variables
    numRemainingMines--;

  }

  gameBoard[tileId].flagged = !gameBoard[tileId].flagged;
  updateFlags();
}

// function for revealing the tile after left clicking on it
function revealTile(e) {

  let tile;
  let tileId;
  let isSystemPrompt;

  // determine if this is user prompt or system prompt
  if(typeof e === "object") {
    tile = e.target.closest('.game-tile');
    tileId = parseInt(tile.id);
    isSystemPrompt = false;
  } else {
    tile = document.getElementById(e);
    tileId = parseInt(e);
    isSystemPrompt = true;
  }

  // if tile is already revealed, do nothing
  if(gameBoard[tileId].revealed) return;

  // if tile is flagged by user, do nothing
  if(gameBoard[tileId].flagged && !isSystemPrompt) return;

  // change background color
  tile.classList.add('revealed-tile');
  if(tile.classList.contains('light-tile')) {
    tile.classList.remove('light-tile');
    tile.classList.add('revealed-light-tile');
  } else {
    tile.classList.remove('dark-tile');
    tile.classList.add('revealed-dark-tile');
  }

  // play block breaking music if not muted
  if(!isMuted) {
    pop.load();
    pop.play().catch(function() { });
  }

  // remove flag if the tile was flagged
  if(gameBoard[tileId].flagged) {

    // remove the flag icon
    tile.classList.remove('flag');

    // update variables
    numRemainingMines++;
    gameBoard[tileId].flagged = !gameBoard[tileId].flagged;
    updateFlags();
  }

  // update variables
  gameBoard[tileId].revealed = true;
  numRemainingTiles--;

  // if tile is a blank tile, open the other tiles around it too
  if(gameBoard[tileId].num === 0) {

    let rows = parseInt(difficultyDefinitions[gameDifficulty].rows);
    let cols = parseInt(difficultyDefinitions[gameDifficulty].cols);

    // if top left corner
    if(tileId === 0) {
      revealTile(tileId + 1);
      revealTile(tileId + cols);
      revealTile(tileId + cols + 1);
    }

    // if top right corner
    else if(tileId === cols - 1) {
      revealTile(tileId - 1);
      revealTile(tileId + cols);
      revealTile(tileId + cols - 1);
    }

    // if bottom left corner
    else if(tileId === (rows - 1) * cols) {
      revealTile(tileId + 1);
      revealTile(tileId - cols);
      revealTile(tileId - cols + 1);
    }

    // if bottom right corner
    else if(tileId === rows * cols - 1) {
      revealTile(tileId - 1);
      revealTile(tileId - cols);
      revealTile(tileId - cols - 1);
    }

    // if top edge
    else if(tileId < cols) {
      revealTile(tileId - 1);
      revealTile(tileId + 1);
      revealTile(tileId + cols - 1);
      revealTile(tileId + cols);
      revealTile(tileId + cols + 1);
    }

    // if left edge
    else if (Math.trunc(tileId / cols) === tileId / cols) {
      revealTile(tileId + 1);
      revealTile(tileId + cols);
      revealTile(tileId + cols + 1);
      revealTile(tileId - cols);
      revealTile(tileId - cols + 1);
    }

    // if right edge
    else if (Math.trunc((tileId + 1) / cols) === (tileId + 1) / cols) {
      revealTile(tileId - 1);
      revealTile(tileId - cols);
      revealTile(tileId - cols - 1);
      revealTile(tileId + cols);
      revealTile(tileId + cols - 1);
    }

    // if bottom edge
    else if (tileId > (rows - 1) * cols) {
      revealTile(tileId - 1);
      revealTile(tileId + 1);
      revealTile(tileId - cols - 1);
      revealTile(tileId - cols);
      revealTile(tileId - cols + 1);
    }

    // else, it's a middle square
    else {
      revealTile(tileId - cols - 1);
      revealTile(tileId - cols);
      revealTile(tileId - cols + 1);
      revealTile(tileId - 1);
      revealTile(tileId + 1);
      revealTile(tileId + cols - 1);
      revealTile(tileId + cols);
      revealTile(tileId + cols + 1);

    }
  }

  // else if revealed tile has a number
  else if(gameBoard[tileId].num > 0) {
    tile.classList.add(`number-${gameBoard[tileId].num}`)
  }

  // if revealed tile is a mine
  else if(gameBoard[tileId].type === "mine") {
    tile.classList.add('mine');

    // play music if not muted
    if(!isMuted) {
      oops.load();
      oops.play();
    }

    // you lost!
    loseGame();
    return;
  }

  // if all the mines have been found, win the game!
  if(numRemainingTiles === mines.length) winGame();
}

// function for losing the game... bummer!
function loseGame() {

  // end the game
  endGame();

  // reveal all mines
  for(let i = 0; i < mines.length; i++) {
    document.getElementById(mines[i]).classList.add('mine');
  }
  document.getElementsByClassName('game-over-modal')[0].style.display = 'none';
  document.getElementsByClassName('game-over-modal-overlay')[0].style.display = 'flex';

  // play losing music if not muted
  if(!isMuted) {
    setTimeout(function() {
      sadge.load();
      sadge.play();
    }, 200);
  }
}

// function for winning the game. yay!
function winGame() {

  // end the game
  endGame();

  // display winning message
  numRemainingMines = 0;
  updateFlags();
  
  document.getElementById('finalTime').textContent = `${timerMins}:${timerSecs}`;
  document.getElementsByClassName('game-over-modal')[0].style.display = 'flex';
  document.getElementsByClassName('game-over-modal-overlay')[0].style.display = 'flex';

  // play winning music if not muted
  if(!isMuted) {
    yeet.load();
    yeet.play();
  }
}

// helper function for ending the game
function endGame() {

  // stop the timer!
  stopTimer(true);

  let curTile;

  // render the entire board unclickable
  document.getElementsByClassName('game-board')[0].classList.add('no-hover');
}
