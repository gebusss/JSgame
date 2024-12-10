const box = document.getElementById('box');
const shadow = document.getElementById('shadow');
const body = document.getElementById('body');
const startGameButton = document.querySelector('#startButton');
const rulesButton = document.querySelector('#rulesButton');
const shadowButton = document.querySelectorAll('.buttonShadow');
const center = document.querySelector('#center');
let playerPositionX = 0;
let playerPositionY = 0;
let farRight = globalThis.innerWidth - box.offsetWidth;
let farDown = globalThis.innerHeight - box.offsetHeight;
let enemyList = [];
let score = 0;

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
        this.speedX = this.getRandomInt(-10,10);
        this.speedY = this.getRandomInt(-10,10);
        this.element = document.createElement('div');
        this.element.setAttribute("class", "enemy");
        body.append(this.element); // Append the enemy to the body

        // Set the enemy's initial position and render it
        this.updatePosition();
    }
    getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // Update the enemy's position
    updatePosition() {
        this.element.style.left = `${this.x}px`;
        this.element.style.top = `${this.y}px`;
    }

    // Move the enemy
    move() {
        let degrees = Math.atan2(this.y, this.x);
        this.x += this.speedX
        this.y += this.speedY
        this.updatePosition();
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
startGameButton.addEventListener('click', startGame);
rulesButton.addEventListener('click', showRules);

function hideMenu() {
    startGameButton.style.display = "none";
    shadowButton[0].style.display = "none";
    shadowButton[1].style.display = "none";
    rulesButton.style.display = "none";
}

function startGame() {
    playerPositionX = farRight / 2;
    playerPositionY = farDown / 2;
    box.style.display = "block";
    hideMenu();
}

function showRules() {
    let rulesBox = document.createElement('div');
    center.append(rulesBox);
    rulesBox.innerHTML = "Rules: Move with WASD keys.";
    hideMenu();
}

// Checking keystates
document.addEventListener('keydown', (e) => {
    if (e.key === 'd') keyState.d = true;
    if (e.key === 'a') keyState.a = true;
    if (e.key === 'w') keyState.w = true;
    if (e.key === 's') keyState.s = true;
    if (e.key === 'l') coordinates();
    if (e.key === 'o') enemySpawner();
    farRight = globalThis.innerWidth - box.offsetWidth;
    farDown = globalThis.innerHeight - box.offsetHeight;
});

document.addEventListener('keyup', (e) => {
    if (e.key === 'd') keyState.d = false;
    if (e.key === 'a') keyState.a = false;
    if (e.key === 'w') keyState.w = false;
    if (e.key === 's') keyState.s = false;
});

// Main game loop
function updateGame() {
    moveBox();
    enemyList.forEach(enemy => enemy.move()); // Move each enemy

    // Check for collisions
    enemyList.forEach(enemy => {
        if (enemy.checkCollision(box)) {
            console.log("Collision with an enemy!");
        }
    });

    requestAnimationFrame(updateGame); // Keep the game loop going
}

updateGame();

// DEBUGGING STUFF ------------------------------------------------------//
function coordinates() {
    console.log(globalThis.outerWidth + "x" + globalThis.outerHeight);
}
