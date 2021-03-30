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
    rows: 16,
    cols: 30,
    mines: 99
  },
}

var ONE_SECOND = 1000;

var gameDifficulty;
var gameBoard;
var mines;
var numRemainingMines = 10;
var timer;
var timerMins;
var timerSecs;
var timerStarted = false;

// helper function to reset board
function resetBoard() {
  determineBoard(gameDifficulty);
}

// function to start the timer
function startTimer() {
  if(timerStarted) return;

  timerStarted = true;
  timer = setInterval(incrementTime, ONE_SECOND);
}

// function to stop the timer
function stopTimer() {
  timerStarted = false;
  clearInterval(timer);
}

// function to increment the time
function incrementTime() {

  let mins = parseInt(timerMins);
  let secs = parseInt(timerSecs);

  if(mins === '59') {
    if(secs === '59') {
      stopTimer();
    } else {
      secs++;
    }
  } else {
    if(secs === '59') {
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

  console.log(timerMins + ":" + timerSecs);
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

  updateFlags(diffDef);
  determineBoard(diff);
}

// update number of flags left
function updateFlags(diffDef) {

  document.getElementById('numFlags').textContent = numRemainingMines;
}

// determine the game board
function determineBoard(diff) {

  let diffDef = difficultyDefinitions[diff];
  let tileType = "";
  let numMinesLeftToDraw = numRemainingMines;
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

  let rows = difficultyDefinitions[gameDifficulty].rows;
  let cols = difficultyDefinitions[gameDifficulty].cols;

  // return -1 if this tile is a mine
  if(gameBoard[i].type === "mine") return -1;

  // if top left corner
  if(i === 0) {
    return [isMine(i + 1), isMine(i + cols), isMine(i + cols + 1)].filter(Boolean).length;
  }

  // if top right corner
  if(i === cols - 1) {
    return [isMine(i - 1), isMine(i + cols), isMine(i + cols - 1)].filter(Boolean).length;
  }

  // if bottom left corner
  if(i === (rows - 1) * cols) {
    return [isMine(i + 1), isMine(i - cols), isMine(i - cols + 1)].filter(Boolean).length;
  }

  // if bottom right corner
  if(i === rows * cols - 1) {
    return [isMine(i - 1), isMine(i - cols), isMine(i - cols - 1)].filter(Boolean).length;
  }

  // if top edge
  if(i < cols) {
    return [isMine(i - 1), isMine(i + 1), isMine(i + cols - 1), isMine(i + cols), isMine(i + cols + 1)].filter(Boolean).length;
  }

  // if left edge
  if (Math.trunc(i / cols) === i / cols) {
    return [isMine(i + 1), isMine(i + cols), isMine(i + cols + 1), isMine(i - cols), isMine(i - cols + 1)].filter(Boolean).length;
  }

  // if right edge
  if (Math.trunc((i + 1) / cols) === (i + 1) / cols) {
    return [isMine(i - 1), isMine(i - cols), isMine(i - cols - 1), isMine(i + cols), isMine(i + cols - 1)].filter(Boolean).length;
  }

  // if bottom edge
  if (i > (rows - 1) * cols) {
    return [isMine(i - 1), isMine(i + 1), isMine(i - cols - 1), isMine(i - cols), isMine(i - cols + 1)].filter(Boolean).length;
  }

  // else, it's a middle square
  return [isMine(i - cols - 1), isMine(i - cols), isMine(i - cols + 1), isMine(i - 1), isMine(i + 1), isMine(i + cols - 1), isMine(i + cols), isMine(i + cols + 1)].filter(Boolean).length;
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

  }

  // add event listener to start timer
  document.getElementsByClassName('game-board')[0].addEventListener('click', startTimer);
}

// function for revealing the tile after clicking on it
function revealTile(e) {

  let tile = e.target.closest('.game-tile');
  let tileId = tile.id;
  let contentSize;

  // if tile is already revealed, return
  if(gameBoard[tileId].revealed) return;

  // determine mine/number size
  switch(gameDifficulty) {
    case 0:
     contentSize = "36px";
     break;
    case 1:
      contentSize = "24px";
      break;
    case 2:
      contentSize = "16px";
      break;
  }

  // if revealed tile is a mine
  if(gameBoard[tileId].type === "mine") {
    let mine = document.createElement('img');
    mine.setAttribute('src', 'assets/mine.png');

    tile.appendChild(mine);
  }

  // else if revealed tile has a number
  else if(gameBoard[tileId].num > 0) {
    let number = document.createElement('img');
    number.setAttribute('src', 'assets/' + gameBoard[tileId].num + '.png')

    tile.appendChild(number);
  }

  // change background color
  if(tile.classList.contains('light-tile')) {
    tile.classList.remove('light-tile');
    tile.classList.add('revealed-light-tile');
  } else {
    tile.classList.remove('dark-tile');
    tile.classList.add('revealed-dark-tile');
  }

  gameBoard[tileId].revealed = true;

}
