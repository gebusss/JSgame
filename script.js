const box = document.getElementById('box');
const shadow = document.getElementById('shadow');
const body = document.getElementById('body');
const startGameButton = document.querySelector('#startButton');
const rulesButton = document.querySelector('#rulesButton');
const shadowButton = document.querySelectorAll('.buttonShadow');
const center = document.querySelector('#center');
let enemy;
let playerPositionX = 0;
let playerPositionY = 0;
let direction = 1;
let farRight = globalThis.innerWidth - box.offsetWidth;
let farDown = globalThis.innerHeight - box.offsetHeight;
let keySum;
let score = 0;
let lives = 5;

const keyState = {
    d: false,
    a: false,
    w: false, 
    s: false,
};
class Enemy {
    constructor() {
        this.element = document.createElement('div');
        this.element.setAttribute("class", "enemy");
        body.append(this.element);
        
        // Initialize the position and speed of the enemy
        this.positionX = 0;
        this.positionY = 0;
        this.speedX = Math.round(Math.random() * 10 + 1);
        this.speedY = Math.round(Math.random() * 10 + 1);
    }

    // Spawns the enemy at a random edge
    spawn() {
        let edge = Math.floor(Math.random() * 4 + 1);
        
        switch(edge) {
            case 1: // Top
                this.positionX = Math.floor(Math.random() * (globalThis.innerWidth - this.element.offsetWidth));
                this.positionY = 0;
                break;
            case 2: // Right
                this.positionX = globalThis.innerWidth - this.element.offsetWidth;
                this.positionY = Math.floor(Math.random() * (globalThis.innerHeight - this.element.offsetHeight));
                break;
            case 3: // Bottom
                this.positionX = Math.floor(Math.random() * (globalThis.innerWidth - this.element.offsetWidth));
                this.positionY = globalThis.innerHeight - this.element.offsetHeight;
                break;
            case 4: // Left
                this.positionX = 0;
                this.positionY = Math.floor(Math.random() * (globalThis.innerHeight - this.element.offsetHeight));
                break;
        }

        this.updatePosition();
    }

    // Update the position of the enemy
    updatePosition() {
        this.element.style.left = `${this.positionX}px`;
        this.element.style.top = `${this.positionY}px`;
    }

    // Move the enemy based on its speed
    move() {
        this.positionX += this.speedX;
        this.positionY += this.speedY;

        this.updatePosition();
    }

    // Remove the enemy from the DOM
    die() {
        this.element.remove();
    }
}

// Store all enemies in a list
let enemyList = [];

// Function to generate a new enemy and add it to the list
function enemyGenerator() {
    const newEnemy = new Enemy();
    newEnemy.spawn();
    enemyList.push(newEnemy);
    score++;
}

// Function to move all enemies
function moveEnemies() {
    enemyList.forEach(enemy => {
        enemy.move();
    });
}

//------------ MOVEMENT -------------------------------------------------//

const SPEED = 10;
const SPEED_DIAGONAL = SPEED / Math.sqrt(2);
const clamp = (n, max, min) => Math.max(Math.min(n, max), min);

function moveBox() {
    box.innerHTML = Math.floor(playerPositionX) + " " + Math.floor(playerPositionY);
    const diagonal = keyState.a + keyState.d + keyState.s + keyState.w > 1;
    const speed = diagonal ? SPEED_DIAGONAL : SPEED;
    
    if(keyState.a !== keyState.d) playerPositionX += keyState.a ? -speed : speed;
    if(keyState.w !== keyState.s) playerPositionY += keyState.w ? -speed : speed;
    
    playerPositionX = clamp(playerPositionX , farRight, 0);
    playerPositionY = clamp(playerPositionY , farDown, 0);
    box.style.left = `${playerPositionX}px`;
    box.style.top = `${playerPositionY}px`;
   
}
//-------- COLLISION --------------------------------------------------------//
function checkCollision(enemy, player) {
    const rect1 = player.getBoundingClientRect();
    const rect2 = enemy.element.getBoundingClientRect();

    return !(
        rect1.right < rect2.left ||
        rect1.left > rect2.right ||
        rect1.bottom < rect2.top ||
        rect1.top > rect2.bottom
    );
}

//--------------------------------------------------------------------//
startGameButton.addEventListener('click', startGame);
rulesButton.addEventListener('click', showRules);

function hideMenu(){
    startGameButton.style.display = "none";
    shadowButton[0].style.display = "none";
    shadowButton[1].style.display = "none";
    rulesButton.style.display = "none";
}

function startGame (){
    playerPositionX = farRight / 2;
    playerPositionY = farDown / 2;
    box.style.display = "block";
    hideMenu();
}

function showRules(){
    let rulesBox = document.createElement('div');
    center.append(rulesBox);
    rulesBox.innerHTML = "Rules: ";
    hideMenu();
}

//--------------------------------------------------------------------//

// Checking keystates ---------------------------------------------//
document.addEventListener('keydown', (e) => {
    if (e.key === 'd') keyState.d = true;
    if (e.key === 'a') keyState.a = true;
    if (e.key === 'w') keyState.w = true;
    if (e.key === 's') keyState.s = true;
    if (e.key === 'l') coordinates();
    if (e.key === 'o') enemyGenerator();
    farRight = globalThis.innerWidth - box.offsetWidth;
    farDown = globalThis.innerHeight - box.offsetHeight;
});

document.addEventListener('keyup', (e) => {
    if (e.key === 'd') keyState.d = false;
    if (e.key === 'a') keyState.a = false;
    if (e.key === 'w') keyState.w = false;
    if (e.key === 's') keyState.s = false;
});

//--- Main game function-------------------------------------------------------//
function updateGame(){
    moveBox();
    moveEnemy();
    
    
    if (enemyList.length > 0) {
        enemyList.forEach((enemy) => {
            if (checkCollision(enemy, box)) {
                lives--;
                enemy.die(); 
            }
        });
    }
    if (lives <= 0) {
        alert('Game Over');
        lives = 5; // Reset lives
        score = 0; // Reset score
        enemyList.forEach(enemy => enemy.die()); // Clear all enemies
        enemyList = []; // Reset enemy list
    }
    
    requestAnimationFrame(updateGame);
}

updateGame();

//---- DEBUGGING STUFF ----------------------------------------------------------//
function coordinates(){
    console.log(globalThis.outerWidth + "x" + globalThis.outerHeight);
}
