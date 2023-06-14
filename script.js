const splashScreen = document.getElementById("splash-screen");
const startButton = document.getElementById("start-button");
const instructionsButton = document.getElementById("instructions-button");
const instructionsScreen = document.getElementById("instructions-screen");
const gameContainer = document.getElementById("game-container");
const endScreen = document.getElementById("end-screen");
const endMessage = document.getElementById("end-message");
const scoreDisplay = document.getElementById("score-display");
const restartButton = document.getElementById("restart-button");

startButton.addEventListener("click", startGame);
instructionsButton.addEventListener("click", showInstructions);
restartButton.addEventListener("click", restartGame);

function startGame() {
  splashScreen.style.display = "none";
  instructionsScreen.style.display = "none";
  gameContainer.style.display = "block";
  resetGame();
}

function showInstructions() {
  splashScreen.style.display = "none";
  instructionsScreen.style.display = "block";
}

function restartGame() {
  endScreen.style.display = "none";
  gameContainer.style.display = "block";
  resetGame();
}

function gameOver() {
  gameContainer.style.display = "none";
  endScreen.style.display = "block";
  endMessage.textContent = "Game Over";
  scoreDisplay.textContent = "Score: " + score;
}

function congratulations() {
  gameContainer.style.display = "none";
  endScreen.style.display = "block";
  endMessage.textContent = "Congratulations!";
  scoreDisplay.textContent = "Score: " + score;
}
const canvas = document.getElementById("game-canvas");
const context = canvas.getContext("2d");

// Resize the canvas to match the window dimensions
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const player = {
  x: 50,
  y: canvas.height - 50,
  width: 50,
  height: 50,
  speed: 3,
  isJumping: false,
  isFalling: false,
  jumpHeight: 100,
};

const obstacles = [
  { x: 400, y: canvas.height - 50, width: 50, height: 50 },
  { x: 800, y: canvas.height - 50, width: 50, height: 50 },
  { x: 1200, y: canvas.height - 50, width: 50, height: 50 },
  { x: 1600, y: canvas.height - 50, width: 50, height: 50 },
  { x: 2000, y: canvas.height - 50, width: 50, height: 50 },
];

const puzzles = [
  {
    question: "Write a function to reverse a string.",
    solution: "2",
  },
  {
    question: "Write a function to find the maximum element in an array.",
    solution: "2",
  },
  {
    question: "Write a function to check if a number is prime.",
    solution: "2",
  },
  {
    question: "Write a function to remove duplicates from an array.",
    solution: "2",
  },
  {
    question: "Write a function to count the number of vowels in a string.",
    solution: "2",
  },
];

const modal = document.getElementById("puzzle-modal");
const closeButton = document.querySelector(".close");
const runButton = document.getElementById("run-button");
const codePuzzle = document.getElementById("code-puzzle");
const codeEditor = document.getElementById("code-editor");

const outputDiv = document.getElementById("output");
const triesRemaining = document.getElementById("tries-remaining");
const scoreElement = document.getElementById("score");

let isRunning = true;
let chances = 3;
let currentObstacleIndex = 0;
let score = 0;

const playerImg = new Image();
playerImg.src = "/asset/imgs/run/skeleton-run_18.png";

const obstacleImg = new Image();
obstacleImg.src = "/asset/imgs/obst.png";

const forestImg = new Image();
forestImg.src = "/asset/imgs/forest.jpg";

let forestX = 0;

function drawPlayer() {
  context.drawImage(playerImg, player.x, player.y, player.width, player.height);
}

function drawObstacle() {
  const obstacle = obstacles[currentObstacleIndex];
  context.drawImage(
    obstacleImg,
    obstacle.x,
    obstacle.y,
    obstacle.width,
    obstacle.height
  );
}

function clearCanvas() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.drawImage(forestImg, forestX, 0, canvas.width, canvas.height);
  context.drawImage(
    forestImg,
    forestX + canvas.width,
    0,
    canvas.width,
    canvas.height
  );
}

function checkCollision() {
  const obstacle = obstacles[currentObstacleIndex];
  if (
    player.x < obstacle.x + obstacle.width &&
    player.x + player.width > obstacle.x &&
    player.y < obstacle.y + obstacle.height &&
    player.y + player.height > obstacle.y
  ) {
    return true;
  }
  return false;
}

function openModal() {
  modal.style.display = "flex";
  codePuzzle.textContent = puzzles[currentObstacleIndex].question;
  // codeEditor.value = "bright";
  outputDiv.textContent = "";
  triesRemaining.textContent = `Tries Remaining: ${chances}`;

  // Center the modal on the screen
  modal.style.left = "50%";
  modal.style.top = "50%";
  modal.style.transform = "translate(-50%, -50%)";
}

function closeModal() {
  modal.style.display = "none";
  isRunning = true;
}

function validatePuzzle() {
  const answer = codeEditor.value.trim();
  if (answer === puzzles[currentObstacleIndex].solution) {
    closeModal();
    isRunning = true;
    currentObstacleIndex++;
    score += 5; // Increment the score by 5 when a puzzle is solved correctly
    scoreDisplay.textContent = "Score: " + score;

    if (currentObstacleIndex >= obstacles.length) {
      congratulations();
    } else {
      alert(
        "Congratulations! You have solved the puzzle. Proceed to the next obstacle."
      );
      // isRunning = false;
    }
  } else {
    chances--;
    triesRemaining.textContent = `Tries Remaining: ${chances}`;
    if (chances > 0) {
      alert(`Incorrect solution! You have ${chances} chance(s) remaining.`);
    } else {
      gameOver();
    }
  }
}

function resetGame() {
  player.x = 50;
  player.y = canvas.height - 50;
  isRunning = true;
  chances = 3;
  currentObstacleIndex = 0;
  triesRemaining.textContent = `Tries Remaining: ${chances}`;
  score = 0;
  scoreElement.textContent = score;
}

closeButton.addEventListener("click", closeModal);
runButton.addEventListener("click", validatePuzzle);

modal.addEventListener("click", function (event) {
  event.stopPropagation();
});

function update() {
  clearCanvas();

  if (player.isJumping) {
    player.y -= player.speed;
    if (player.y <= player.jumpHeight) {
      player.isJumping = false;
      player.isFalling = true;
    }
  } else if (player.isFalling) {
    player.y += player.speed;
    if (player.y >= canvas.height - player.height) {
      player.isFalling = false;
    }
  }

  if (checkCollision()) {
    openModal();
    isRunning = false;
  }

  if (isRunning) {
    player.x += player.speed;

    // Pan the background
    forestX -= 1;
    if (forestX <= -canvas.width) {
      forestX = 0;
    }
  }

  drawPlayer();
  drawObstacle();

  requestAnimationFrame(update);
}

update();

// Enable typing in the code-editor textarea
codeEditor.disabled = false;
