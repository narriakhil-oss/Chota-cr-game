const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});
const deathSound = new Audio("cow-death.wav");
let highScore = localStorage.getItem("highScore") || 0;
const scoreText = document.getElementById("score");

const birdImg = new Image();
birdImg.src = "dada.jpg";

let bird, pipes, score, gameOver;

function resetGame() {
  bird = {
    x: canvas.width / 6,
    y: canvas.height / 3,
    size: 60,
    gravity: 0.5,
    lift: -9,
    velocity: 0
  };

  pipes = [];
  score = 0;
  gameOver = false;
  scoreText.innerText = "Score: 0 | High: " + highScore;
}

resetGame();

function createPipe() {
  if (gameOver) return;

  let gap = 230;
  let topHeight = Math.random() * 250 + 50;

  pipes.push({
    x: canvas.width,
    top: topHeight,
    bottom: topHeight + gap,
    width: 60,
    passed: false   // 👈 add this
  });
}
function drawBird() {
  ctx.save();
  ctx.beginPath();
  ctx.arc(bird.x + bird.size/2, bird.y + bird.size/2, bird.size/2, 0, Math.PI * 2);
  ctx.closePath();
  ctx.clip();
  ctx.drawImage(birdImg, bird.x, bird.y, bird.size, bird.size);
  ctx.restore();
}

function drawPipes() {
  ctx.fillStyle = "green";
  pipes.forEach(pipe => {
    ctx.fillRect(pipe.x, 0, pipe.width, pipe.top);
    ctx.fillRect(pipe.x, pipe.bottom, pipe.width, canvas.height);
  });
}
function drawFireTrail() {
  for (let i = 0; i < 6; i++) {
    ctx.beginPath();
    ctx.fillStyle = `rgba(255, ${100 + Math.random() * 155}, 0, 0.7)`;
    ctx.arc(
      bird.x - 15 - Math.random() * 15,
      bird.y + bird.size / 2,
      5 + Math.random() * 6,
      0,
      Math.PI * 2
    );
    ctx.fill();
  }
}
function updatePipes() {
  pipes.forEach(pipe => {
    pipe.x -= 2;

    // Collision detection
    if (
      bird.x < pipe.x + pipe.width &&
      bird.x + bird.size > pipe.x &&
      (bird.y < pipe.top || bird.y + bird.size > pipe.bottom)
    ) {
      if (!gameOver) {
        gameOver = true;
        deathSound.currentTime = 0;
        deathSound.play();
      }
    }

    // ✅ Proper scoring logic
    if (!pipe.passed && pipe.x + pipe.width < bird.x) {
      pipe.passed = true;
      score++;

      if (score > highScore) {
        highScore = score;
        localStorage.setItem("highScore", highScore);
      }

      scoreText.innerText = "Score: " + score + " | High: " + highScore;
    }
  });

  pipes = pipes.filter(pipe => pipe.x + pipe.width > 0);
}function updateBird() {
  if (gameOver) return;

  bird.velocity += bird.gravity;
  bird.y += bird.velocity;

  if (bird.y + bird.size > canvas.height || bird.y < 0) {
  if (!gameOver) {
    gameOver = true;
    deathSound.currentTime = 0;
    deathSound.play();
  }
}
}
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  updateBird();
  updatePipes();

  drawPipes();
  drawFireTrail();
  drawBird();

  if (gameOver) {
    ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "white";
    ctx.font = "bold 30px Arial";
    ctx.textAlign = "center";
    ctx.fillText("Chotu is Dead 💀", canvas.width / 2, canvas.height / 2);
  }

  requestAnimationFrame(gameLoop);
}

setInterval(createPipe, 3000);

function handleTouch(e) {
  if (gameOver) {
    resetGame();
  } else {
    bird.velocity = bird.lift;
  }
}

document.addEventListener("keydown", e => {
  if (e.code === "Space") handleTouch();
});

canvas.addEventListener("click", handleTouch);
canvas.addEventListener("touchstart", handleTouch);

birdImg.onload = function() {
  gameLoop();
};