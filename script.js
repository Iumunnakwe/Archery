const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const bow = {
  x: 1,
  y: canvas.height * 0.5,
  width: 10,
  height: 150,
  dy: 2
};

const arrow = {
  x: bow.x,
  y: bow.y,
  width: 80,
  height: 5,
  dx: 5,
  color: 'green',
  fired: false
};

const target = {
  x: canvas.width - 100,
  y: canvas.height / 2 - 25,
  width: 50,
  height: 50,
  color: 'orange',
  dy: 0
};

let bowAngle = Math.PI / 2;
let arrowState = 'ready';
let lives = 4;
let hits = 0;
let misses = 0;

function drawBow() {
  const bowTipX = bow.x - Math.cos(bowAngle) * bow.height / 2;
  const bowTipY = bow.y + Math.sin(bowAngle) * bow.height / 2;
  const bowBottomX = bow.x - Math.cos(bowAngle + Math.PI) * bow.height / 2;
  const bowBottomY = bow.y + Math.sin(bowAngle + Math.PI) * bow.height / 2;

  ctx.beginPath();
  ctx.moveTo(bowTipX, bowTipY);
  ctx.quadraticCurveTo(
    bow.x - Math.cos(bowAngle + Math.PI / 2) * 50,
    bow.y + Math.sin(bowAngle + Math.PI / 2) * 50,
    bowBottomX,
    bowBottomY
  );
  ctx.strokeStyle = 'green';
  ctx.lineWidth = 10;
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(bowTipX, bowTipY);
  ctx.lineTo(bowBottomX, bowBottomY);
  ctx.strokeStyle = 'white';
  ctx.lineWidth = 2;
  ctx.stroke();
}

function drawArrow() {
  const arrowTipX = bow.x + Math.cos(bowAngle) * bow.height * 0.2;
  const arrowTipY = bow.y - Math.sin(bowAngle) * bow.height * 0.02;

  ctx.fillStyle = arrow.color;
  if (!arrow.fired) {
    ctx.fillRect(arrowTipX, arrowTipY - arrow.height / 2, arrow.width, arrow.height);
    ctx.fillStyle = 'white';
    ctx.font = '24px Arial';
    ctx.fillText('>', arrowTipX + arrow.width, arrowTipY + 8);
  } else {
    ctx.fillRect(arrow.x, arrow.y - arrow.height / 2, arrow.width, arrow.height);
    ctx.fillStyle = 'white';
    ctx.font = '24px Arial';
    ctx.fillText('>', arrow.x + arrow.width, arrow.y + 8);
    if (arrow.x + arrow.width >= target.x && arrow.y >= target.y && arrow.y <= target.y + target.height) {
      ctx.fillStyle = 'red';
      ctx.font = '30px Arial';
      ctx.fillText('Hit!', canvas.width / 2, canvas.height / 2);
      hits++;
      document.getElementById('hits').innerText = hits;
    }
  }
}

function drawTarget() {
  ctx.fillStyle = target.color;
  ctx.beginPath();
  ctx.arc(target.x, target.y + target.height / 2, target.width / 2, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = 'white';
  ctx.beginPath();
  ctx.arc(target.x, target.y + target.height / 2, target.width / 4, 0, Math.PI * 2);
  ctx.fill();
}

function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  bow.y += bow.dy;
  if (bow.y - bow.height / 2 < 0 || bow.y + bow.height / 2 > canvas.height) {
    bow.dy *= -1;
  }
  
  target.y += target.dy;
  if (target.y < 0 || target.y + target.height > canvas.height) {
    target.dy *= -1;
  }

  drawBow();
  if (arrowState === 'ready') {
    drawArrow();
    arrow.y = bow.y;
  } else if (arrowState === 'fired') {
    arrow.x += arrow.dx;
    drawArrow();
    if (arrow.x + arrow.width >= target.x && arrow.y >= target.y && arrow.y <= target.y + target.height) {
      arrowState = 'hit';
      setTimeout(() => {
        arrowState = 'ready';
        arrow.x = bow.x;
      }, 10);
    }
    if (arrow.x > canvas.width) {
      arrowState = 'ready';
      arrow.x = bow.x;
      misses++;
      lives--;
      document.getElementById('misses').innerText = misses;
      document.getElementById('lives').innerText = lives;
      if (lives <= 0) {
        endGame();
        return;
      }
    }
  } else if (arrowState === 'hit') {
    arrow.x = target.x - arrow.width;
    drawArrow();
  }
  drawTarget();
  requestAnimationFrame(update);
}

function endGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    let imageSrc = '';
    if (hits >= 20) {
        imageSrc = 'diamond.png'; // Replace with your gold medal image path
      } 
   else if (hits >= 8) {
      imageSrc = 'gold.png'; // Replace with your gold medal image path
    } else if (hits >= 5) {
      imageSrc = 'silver.png'; // Replace with your silver medal image path
    } else if (hits >= 3) {
      imageSrc = 'bronze.png'; // Replace with your bronze medal image path
    } else {
      imageSrc = 'game_over.jpeg'; // Replace with your game over image path
    }
  
    // Load image
    const img = new Image();
    img.onload = function() {
      ctx.drawImage(img, canvas.width / 2 - img.width / 2, canvas.height / 2 - img.height / 2);
    };
    img.src = imageSrc;
  }
  

canvas.addEventListener('click', () => {
  if (arrowState === 'ready') {
    arrowState = 'fired';
    arrow.fired = true;
  }
});

// Define these variables globally or in a scope accessible to both initGame and restartGame
let initialLevel = 'easy'; // Store the initial level chosen

function restartGame() {
  // Reset the game state
  initGame(initialLevel);

  // Show the homepage and hide the game container
  document.querySelector('.homepage').style.display = 'block';
  document.querySelector('.container').style.display = 'none';
}

// Function to start the game
function startGame(level) {
  initialLevel = level; // Store the level chosen for restart purposes
  document.querySelector('.homepage').style.display = 'none';
  document.querySelector('.container').style.display = 'block';
  // Initialize the game
  initGame(level);
}


function initGame(level) {
  lives = 4;
  hits = 0;
  misses = 0;
  document.getElementById('lives').innerText = lives;
  document.getElementById('hits').innerText = hits;
  document.getElementById('misses').innerText = misses;
  
  switch(level) {
    case 'easy':
      arrow.dx = 5;
      bow.dy = 1;
      target.dy = 0;
      break;
    case 'medium':
      arrow.dx = 7;
      bow.dy = 3;
      target.dy = 2;
      break;
    case 'hard':
      arrow.dx = 10;
      bow.dy = 4;
      target.dy = 10;
      break;
    case 'insanity':
      arrow.dx = 100;
      bow.dy = 60;
      target.dy = 100;
      break;
    default:
      arrow.dx = 5;
      bow.dy = 2;
      target.dy = 5;
  }
  arrowState = 'ready';
  arrow.fired = false;
  arrow.x = bow.x;
  update();
}
