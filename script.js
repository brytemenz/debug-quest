document.addEventListener("DOMContentLoaded", function () {
  // Get the canvas element from the HTML file
  const canvas = document.getElementById("game-canvas");
  const ctx = canvas.getContext("2d");

  // Define the background image variables
  const backgroundImage1 = new Image();
  backgroundImage1.src = "asset/imgs/forest.jpg";
  const backgroundImage2 = new Image();
  backgroundImage2.src = "asset/imgs/forest.jpg";

  // Define the character image variables
  const characterImage = new Image();
  characterImage.src = "asset/imgs/run3.svg";

  // Define the obstacle image variable
  const obstacleImage = new Image();
  obstacleImage.src = "asset/imgs/obstacle.svg";

  let currentBackgroundImage = backgroundImage1;

  // Character position and movement variables
  let characterFrameWidth = 100;
  let characterFrameHeight = 500;
  let characterFrameIndex = 0;
  let characterSpeedX = 2;
  let characterIsRunning = true;

  // Calculate the initial X position to center the character horizontally
  let characterX = 0;

  // Character Y position
  let characterY = canvas.height / 2 - characterFrameHeight / 15;
  // Obstacle position and size variables
  let obstacleY = canvas.height / 2 - 50;
  let obstacleWidth = 100;
  let obstacleHeight = 100;
  let obstacleSpeedX = 3;

  // Frame counter variables
  let frameCounter = 0;
  const frameDelay = 10;

  // Syntax error modal variables
  const syntaxErrorModal = document.getElementById("syntax-error-modal");
  const codeInput = document.getElementById("code-input");
  const submitButton = document.getElementById("submit-button");
  const errorMessage = document.getElementById("error-message");
  const questionContainer = document.getElementById("question-container");

  // Function to draw the game background
  function drawBackground() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
    ctx.drawImage(currentBackgroundImage, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(
      currentBackgroundImage,
      canvas.width,
      0,
      canvas.width,
      canvas.height
    );
  }

  // Function to draw the character on the canvas
  function drawCharacter() {
    ctx.drawImage(
      characterImage,
      characterFrameIndex * characterFrameWidth,
      0,
      characterFrameWidth,
      characterFrameHeight,
      characterX,
      characterY,
      characterFrameWidth,
      characterFrameHeight
    );
  }

  // Function to draw the obstacle on the canvas
  function drawObstacle() {
    ctx.drawImage(
      obstacleImage,
      obstacleX,
      obstacleY,
      obstacleWidth,
      obstacleHeight
    );
  }

  // Function to clear the canvas
  function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  // Function to update the game state
  function updateGame() {
    clearCanvas();
    drawBackground();
    drawCharacter();
    drawObstacle();

    // Update character position based on running flag
    if (characterIsRunning) {
      // Update the frame counter
      frameCounter++;

      // Delay the frame update based on the frame counter
      if (frameCounter % frameDelay === 0) {
        characterFrameIndex = (characterFrameIndex + 1) % 12;
      }

      // Update character position
      characterX += characterSpeedX;

      // Check if character is outside the canvas boundaries
      if (characterX > canvas.width) {
        // Switch to the new background image
        currentBackgroundImage = backgroundImage2;

        // Reset character position to the initial X position
        characterX = 0;

        // Adjust the character's Y position for the new background
        characterY = canvas.height / 2 - characterFrameHeight / 15 - 50;
      }
    }

    // Update obstacle position
    obstacleX -= obstacleSpeedX;

    // Check collision between character and obstacle
    if (
      characterX < obstacleX + obstacleWidth &&
      characterX + characterFrameWidth > obstacleX &&
      characterY < obstacleY + obstacleHeight &&
      characterY + characterFrameHeight > obstacleY
    ) {
      // Collision occurred, handle collision logic here (e.g., game over, score update, etc.)
      console.log("Collision!");

      // Stop the character from running
      characterIsRunning = false;

      // Display the syntax error modal
      syntaxErrorModal.style.display = "block";

      // Generate and display a random question
      generateQuestion();
    }

    // Check if the background has panned completely
    if (
      currentBackgroundImage === backgroundImage2 &&
      obstacleX + obstacleWidth <= 0
    ) {
      // Switch back to the original background image
      currentBackgroundImage = backgroundImage1;

      // Reset obstacle position
      obstacleX = canvas.width + 200;
    }

    // Schedule the next game update
    requestAnimationFrame(updateGame);
  }

  // Event listener for keydown event to start running
  document.addEventListener("keydown", function (event) {
    if (event.code === "KeyR" && !characterIsRunning) {
      characterIsRunning = true;
      characterFrameIndex = 0; // Reset the frame index when running starts
    }
  });

  // Event listener for keyup event to stop running
  document.addEventListener("keyup", function (event) {
    if (event.code === "KeyR" && characterIsRunning) {
      characterIsRunning = false;
    }
  });

  // Event listener for start button click to start the game
  const startButton = document.getElementById("start-button");
  startButton.addEventListener("click", function () {
    document.getElementById("welcome-screen").style.display = "none";
    document.getElementById("game-screen").style.display = "block";
    updateGame();
  });

  // Event listener for play again button click to restart the game
  const playAgainButton = document.getElementById("play-again-button");
  playAgainButton.addEventListener("click", function () {
    document.getElementById("end-screen").style.display = "none";
    document.getElementById("game-screen").style.display = "block";
    characterIsRunning = true;
    characterFrameIndex = 0;
    characterX = 0;
    obstacleX = canvas.width + 200;
    updateGame();
  });

  // Event listener for closing the syntax error modal
  const closeButton = document.getElementById("close-button");
  closeButton.addEventListener("click", function () {
    syntaxErrorModal.style.display = "none";
  });

  // Function to generate and display a random question
  function generateQuestion() {
    const questions = [
      "What is the capital of France?",
      "Who painted the Mona Lisa?",
      "What year did World War II end?",
    ];

    // Generate a random index to select a question from the array
    const randomIndex = Math.floor(Math.random() * questions.length);

    // Get the randomly selected question
    const question = questions[randomIndex];

    // Display the question in the modal
    questionContainer.textContent = question;
  }

  // Event listener for submitting the code in the syntax error modal
  submitButton.addEventListener("click", function () {
    const code = codeInput.value;

    if (code.toLowerCase() === "correct") {
      // Code is correct, close the syntax error modal and resume the game
      syntaxErrorModal.style.display = "none";
      characterIsRunning = true;
    } else {
      // Code is incorrect, display an error message
      errorMessage.textContent = "Incorrect code. Please try again.";
    }
  });
});
