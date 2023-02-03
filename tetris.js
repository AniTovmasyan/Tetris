// random tiv [min,max]
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);

  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// tetromino hajordakanutyun
function generateSequence() {
  const sequence = ["I", "J", "L", "O", "S", "T", "Z"];

  while (sequence.length) {
    const rand = getRandomInt(0, sequence.length - 1);
    const name = sequence.splice(rand, 1)[0];
    tetrominoSequence.push(name);
  }
}

// myus tetromino hajordakanutyun
function getNextTetromino() {
  if (tetrominoSequence.length === 0) {
    generateSequence();
  }

  const name = tetrominoSequence.pop();
  const matrix = tetrominos[name];

  // I, O sksum en mejtexic, mnacacy left-middle
  const col = playfield[0].length / 2 - Math.ceil(matrix[0].length / 2);

  // I sksum e tox 21 (-1), mnacacy row 22 (-2)
  const row = name === "I" ? -1 : -2;

  return {
    name: name, // (I, J, ...)
    matrix: matrix,
    row: row,
    col: col,
  };
}

// 90ast. matrixy pttel
var rotate = function (matrix) {
  // Copy the original matrix
  var origMatrix = matrix.slice();
  for (var i = 0; i < matrix.length; i++) {
    // Map each row entry to its rotated value
    var row = matrix[i].map(function (x, j) {
      var k = matrix.length - 1 - j;
      return origMatrix[k][i];
    });
    matrix[i] = row;
  }
  return matrix;
};
// function rotate(matrix) {
//   const N = matrix.length - 1;
//   const result = matrix.map((row, i) =>
//     row.map((val, j) => matrix[N - j][i])
//   );

//   return result;
// }

// stugel nor matrix/row/col valid en te voch
function isValidMove(matrix, cellRow, cellCol) {
  for (let row = 0; row < matrix.length; row++) {
    for (let col = 0; col < matrix[row].length; col++) {
      if (
        matrix[row][col] &&
        // sahmanneric durs
        (cellCol + col < 0 ||
          cellCol + col >= playfield[0].length ||
          cellRow + row >= playfield.length ||
          // baxvum e me kayl ktori
          playfield[cellRow + row][cellCol + col])
      ) {
        return false;
      }
    }
  }

  return true;
}

// ktornery texadrel dashtum
function placeTetromino() {
  for (let row = 0; row < tetromino.matrix.length; row++) {
    for (let col = 0; col < tetromino.matrix[row].length; col++) {
      if (tetromino.matrix[row][col]) {
        // game over ete ktory dashti sahmanic durs a
        if (tetromino.row + row < 0) {
          return showGameOver();
        }

        playfield[tetromino.row + row][tetromino.col + col] = tetromino.name;
      }
    }
  }

  // stugel toxery bac en te voch nerqevic verev
  for (let row = playfield.length - 1; row >= 0; ) {
    if (playfield[row].every((cell) => !!cell)) {
      // damen toxy dnel myusi vra
      for (let r = row; r >= 0; r--) {
        for (let c = 0; c < playfield[r].length; c++) {
          playfield[r][c] = playfield[r - 1][c];
        }
      }
    } else {
      row--;
    }
  }

  tetromino = getNextTetromino();
}

// show the game over screen
function showGameOver() {
  cancelAnimationFrame(rAF);
  gameOver = true;

  context.fillStyle = "red";
  context.font = "50px monospace";
  context.textAlign = "center";
  context.fillText("GAME OVER!", canvas.width / 2, canvas.height / 2);
}

const canvas = document.getElementById("game");
const context = canvas.getContext("2d");
const grid = 32;
const tetrominoSequence = [];

const playfield = [];

// populate the empty state
for (let row = -2; row < 20; row++) {
  playfield[row] = [];

  for (let col = 0; col < 16; col++) {
    playfield[row][col] = 0;
  }
}

const tetrominos = {
  I: [
    [0, 0, 0, 0],
    [1, 1, 1, 1],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ],
  J: [
    [1, 0, 0],
    [1, 1, 1],
    [0, 0, 0],
  ],
  L: [
    [0, 0, 1],
    [1, 1, 1],
    [0, 0, 0],
  ],
  O: [
    [1, 1],
    [1, 1],
  ],
  S: [
    [0, 1, 1],
    [1, 1, 0],
    [0, 0, 0],
  ],
  Z: [
    [1, 1, 0],
    [0, 1, 1],
    [0, 0, 0],
  ],
  T: [
    [0, 1, 0],
    [1, 1, 1],
    [0, 0, 0],
  ],
};

const colors = {
  I: "Tomato",
  O: "Violet",
  T: "MediumSeaGreen",
  S: "DodgerBlue",
  Z: "Orange",
  J: "SlateBlue",
  L: "oSlateBlue",
};

let count = 0;
let tetromino = getNextTetromino();
let rAF = null;
let gameOver = false;

// game loop
function loop() {
  rAF = requestAnimationFrame(loop);
  context.clearRect(0, 0, canvas.width, canvas.height);

  for (let row = 0; row < 20; row++) {
    for (let col = 0; col < 16; col++) {
      if (playfield[row][col]) {
        const name = playfield[row][col];
        context.fillStyle = colors[name];

        // canci hamar
        context.fillRect(col * grid, row * grid, grid - 1, grid - 1);
      }
    }
  }

  if (tetromino) {
    if (++count > 35) {
      tetromino.row++;
      count = 0;

      // ete ktory baxvum e inch vor mi ktori mi tox bardzrana
      if (!isValidMove(tetromino.matrix, tetromino.row, tetromino.col)) {
        tetromino.row--;
        placeTetromino();
      }
    }
    context.fillStyle = colors[tetromino.name];

    for (let row = 0; row < tetromino.matrix.length; row++) {
      for (let col = 0; col < tetromino.matrix[row].length; col++) {
        if (tetromino.matrix[row][col]) {
          // canci hamar
          context.fillRect(
            (tetromino.col + col) * grid,
            (tetromino.row + row) * grid,
            grid - 1,
            grid - 1
          );
        }
      }
    }
  }
}

document.addEventListener("keydown", function (event) {
  if (gameOver) return;

  // dzax, aj keys (which)
  if (event.which === 37 || event.which === 39) {
    const col = event.which === 37 ? tetromino.col - 1 : tetromino.col + 1;

    if (isValidMove(tetromino.matrix, tetromino.row, col)) {
      tetromino.col = col;
    }
  }

  // verev
  if (event.which === 38) {
    const matrix = rotate(tetromino.matrix);
    if (isValidMove(matrix, tetromino.row, tetromino.col)) {
      tetromino.matrix = matrix;
    }
  }

  // nerqev
  if (event.which === 40) {
    const row = tetromino.row + 1;

    if (!isValidMove(tetromino.matrix, row, tetromino.col)) {
      tetromino.row = row - 1;

      placeTetromino();
      return;
    }

    tetromino.row = row;
  }
});

// start the game
rAF = requestAnimationFrame(loop);
