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

function updateDifficulty(diff) {

  // html elements to update
  let rowsEl = document.getElementById('numRows');
  let colsEl = document.getElementById('numCols');
  let minesEl = document.getElementById('numMines');

  // populate new info
  rowsEl.textContent = difficultyDefinitions[diff].rows;
  colsEl.textContent = difficultyDefinitions[diff].cols;
  minesEl.textContent = difficultyDefinitions[diff].mines;
}
