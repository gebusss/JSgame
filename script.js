const box = document.getElementById('box');
const shadow = document.getElementById('shadow');
const body = document.getElementById('body');
const startGameButton = document.querySelector('#startButton');
const rulesButton = document.querySelector('#rulesButton');
const shadowButton = document.querySelectorAll('.buttonShadow');
const center = document.querySelector('#center');
const scoreBox = document.querySelector('#score');
const rulesBox = document.querySelector('#rulesBox');
const backBtn = document.querySelector('#backBtn');
const titleBox = document.querySelector('#title');
let playerPositionX = 0;
let playerPositionY = 0;
let farRight = globalThis.innerWidth - box.offsetWidth;
let farDown = globalThis.innerHeight - box.offsetHeight;
let enemyList = [];
let score = 0;
let lives = 5;
let timer = 3;

const keyState = {
    d: false,
    a: false,
    w: false, 
    s: false,
};

// ENEMY CLASS --------------------------------------------------------//
class Enemy {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.speedX = this.getRandomIntExclude(-10,10,[0]);
        this.speedY = this.getRandomIntExclude(-10,10,[0]);
        this.element = document.createElement('div');
        this.element.setAttribute("class", "enemy");
        body.append(this.element); // Append the enemy to the body

        // Set the enemy's initial position and render it
        this.updatePosition();
    }
    getRandomIntExclude(min, max, exclude) {
        let randomNum;
        do {
          randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
        } while (exclude.includes(randomNum));
        return randomNum;
      }

    // Update the enemy's position
    updatePosition() {
        this.element.style.left = `${this.x}px`;
        this.element.style.top = `${this.y}px`;
    }

    // Move the enemy
    move() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Check horizontal bounds
        if (this.x + this.element.offsetWidth >= globalThis.innerWidth || this.x <= 0) {
            this.speedX = -this.speedX; // Reverse horizontal direction
            this.x = clamp(this.x, globalThis.innerWidth - this.element.offsetWidth, 0); // Clamp position
        }

        // Check vertical bounds
        if (this.y + this.element.offsetHeight >= globalThis.innerHeight || this.y <= 0) {
            this.speedY = -this.speedY; // Reverse vertical direction
            this.y = clamp(this.y, globalThis.innerHeight - this.element.offsetHeight, 0); // Clamp position
        }

        // Update the position of the enemy
        this.updatePosition();
    }

    die(){
        this.element.remove();
    }

    // Check for collision with the player
    checkCollision(player) {
        const rect1 = player.getBoundingClientRect();
        const rect2 = this.element.getBoundingClientRect();

        return !(
            rect1.right < rect2.left || 
            rect1.left > rect2.right || 
            rect1.bottom < rect2.top || 
            rect1.top > rect2.bottom
        );
    }
   
    
}

// ENEMY SPAWNER ----------------------------------------------------//
function enemySpawner() {
    let edge = Math.floor(Math.random() * 4 + 1);
    let newEnemy = new Enemy(); // Create a new enemy instance
    score = enemyList.length + 1;
    switch (edge) {
        case 1:
            newEnemy.x = Math.floor(Math.random() * (globalThis.innerWidth - newEnemy.element.offsetWidth));
            newEnemy.y = 0;
            
            break;
        case 2:
            newEnemy.x = globalThis.innerWidth - newEnemy.element.offsetWidth;
            newEnemy.y = Math.floor(Math.random() * (globalThis.innerHeight - newEnemy.element.offsetHeight));
            break;
        case 3:
            newEnemy.x = Math.floor(Math.random() * (globalThis.innerWidth - newEnemy.element.offsetWidth));
            newEnemy.y = globalThis.innerHeight - newEnemy.element.offsetHeight;
            break;
        case 4:
            newEnemy.x = 0;
            newEnemy.y = Math.floor(Math.random() * (globalThis.innerHeight - newEnemy.element.offsetHeight));
            break;
    }

    newEnemy.updatePosition(); // Update position after setting the edge
    enemyList.push(newEnemy); // Add the new enemy to the list
}

// MOVEMENT ------------------------------------------------------------//
const SPEED = 10;
const SPEED_DIAGONAL = SPEED / Math.sqrt(2);
const clamp = (n, max, min) => Math.max(Math.min(n, max), min);

function moveBox() {
    const diagonal = keyState.a + keyState.d + keyState.s + keyState.w > 1;
    const speed = diagonal ? SPEED_DIAGONAL : SPEED;
    
    if(keyState.a !== keyState.d) playerPositionX += keyState.a ? -speed : speed;
    if(keyState.w !== keyState.s) playerPositionY += keyState.w ? -speed : speed;
    
    playerPositionX = clamp(playerPositionX , farRight, 0);
    playerPositionY = clamp(playerPositionY , farDown, 0);
    box.style.left = `${playerPositionX}px`;
    box.style.top = `${playerPositionY}px`;
}

// COLLISION -----------------------------------------------------------//
function checkCollision(enemy, player) {
    const rect1 = player.getBoundingClientRect();
    const rect2 = enemy.getBoundingClientRect();
    
    return !(
        rect1.right < rect2.left || 
        rect1.left > rect2.right || 
        rect1.bottom < rect2.top || 
        rect1.top > rect2.bottom
    );
}

// GAME FUNCTIONS ----------------------------------------------------//

function hideMenu() {
    startGameButton.style.display = "none";
    shadowButton[0].style.display = "none";
    shadowButton[1].style.display = "none";
    rulesButton.style.display = "none";
    titleBox.style.display = "none";
}
let spawnInterval;

function startGame() {
    playerPositionX = farRight / 2;
    playerPositionY = farDown / 2;
    box.style.display = "block";
    scoreBox.style.display = "block";
    hideMenu();
    spawnInterval = setInterval(enemySpawner, 3000);
}
function showRules() {
    rulesBox.innerHTML = "Rules: Move with WASD keys. <br> Balls spawn every 3 seconds. <br> Everytime a new ball spawns you get a point. <br> You get 5 lives. <br> If you go down to 0 lives you lose.";
    hideMenu();
    backBtn.style.display = "block";
}
function f5() {
    window.location.reload(); //literally instead of doing a normal back button I just reload the site XD
}

// function back(){
//     startGameButton.style.display = "block";
//     shadowButton[0].style.display = "block";
//     shadowButton[1].style.display = "block";
//     backBtn.style.display = "none";
//     rulesButton.style.display = "block";
//     rulesBox.innerHTML = "";
// }
function gameOver() {
    score = 0;
    lives = 5;
    rulesBox.innerHTML = `<h1> Game Over! <br><br> Score: ${score2} </h1>`;
    backBtn.style.display = "block";
    backBtn.addEventListener('click',f5);
    box.style.zIndex = "-1";
    scoreBox.style.display = "none";
}
backBtn.addEventListener('click', f5);
startGameButton.addEventListener('click', startGame);
rulesButton.addEventListener('click', showRules);

// Checking keystates
document.addEventListener('keydown', (e) => {
    if (e.key === 'd') keyState.d = true;
    if (e.key === 'a') keyState.a = true;
    if (e.key === 'w') keyState.w = true;
    if (e.key === 's') keyState.s = true;
    // if (e.key === 'o') enemySpawner(); spawning enemies on O /for debugging
    farRight = globalThis.innerWidth - box.offsetWidth;
    farDown = globalThis.innerHeight - box.offsetHeight;
});

document.addEventListener('keyup', (e) => {
    if (e.key === 'd') keyState.d = false;
    if (e.key === 'a') keyState.a = false;
    if (e.key === 'w') keyState.w = false;
    if (e.key === 's') keyState.s = false;
});
let score2;
let gameLoopId;
// Main game loop
function updateGame() {
    moveBox();
    enemyList.forEach(enemy => enemy.move()); // Move each enemy
    // Check for collisions
    enemyList.forEach(enemy => {
        if (enemy.checkCollision(box)) {
            lives--;
            enemy.die();
        }
    });
    scoreBox.innerHTML = `Score: ${score} <br>  Lives: ${lives}`;
    if(lives === 0){
        cancelAnimationFrame(gameLoopId);
        enemyList.forEach(enemy => enemy.die()); // I dont know what looks better 
        score2 = score;
        gameOver();
        setInterval(enemySpawner, 20);
        return;
    }
    
    gameLoopId = requestAnimationFrame(updateGame); // Keep the game loop going
}
updateGame();
