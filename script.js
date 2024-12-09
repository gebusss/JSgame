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
let enemyPositionX = 0;
let enemyPositionY = 0;
let enemyList = [];
let score = 0;

const keyState = {
    d: false,
    a: false,
    w: false, 
    s: false,
};

function rules(){
    console.log("kys");
}

// ENEMIES ------------------------------------------------//
function enemyGenerator(){
    enemy = document.createElement('div');
    score++;
    enemyList.push(enemy); 
    enemy.setAttribute("class", "enemy");
    body.append(enemy);
}

function enemySpawner(){
    let edge = Math.floor(Math.random() * 4 + 1);
    enemyGenerator();
    switch(edge){
        case 1:
            enemyPositionX = Math.floor(Math.random() * (globalThis.innerWidth - enemy.offsetWidth));
            enemyPositionY = 0;
            break;
        case 2:
            enemyPositionX = globalThis.innerWidth - enemy.offsetWidth;
            enemyPositionY = Math.floor(Math.random() * (globalThis.innerHeight - enemy.offsetHeight));
            break;
        case 3:
            enemyPositionX = Math.floor(Math.random() * (globalThis.innerWidth - enemy.offsetWidth));
            enemyPositionY = globalThis.innerHeight - enemy.offsetHeight;
            break;
        case 4:
            enemyPositionX = 0;
            enemyPositionY = Math.floor(Math.random() * (globalThis.innerHeight - enemy.offsetHeight));
            break;
    }

    enemy.style.left = enemyPositionX + "px";
    enemy.style.top = enemyPositionY + "px";
}

//------------ MOVEMENT -------------------------------------------------//

const SPEED = 10;
const SPEED_DIAGONAL = SPEED / Math.sqrt(2);
const clamp = (n, max, min) => Math.max(Math.min(n, max), min);

function enemyShoot(){
    enemySpeedX = Math.round(Math.random() * 10 + 1);
    enemySpeedY = Math.round(Math.random() * 10 + 1);
    let degrees = Math.atan(enemyPositionY/enemyPositionX) * 180 / Math.PI;

    enemyPositionX += enemySpeedX + "px";
    enemyPositionY += enemySpeedY + "px";
     
}


function moveEnemy(){
    enemyList.forEach(enemyShoot);
}

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
    const rect2 = enemy.getBoundingClientRect();
    
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

//---Main game function-------------------------------------------------------//
function updateGame(){
    moveBox();
    moveEnemy();
    
    
    if(enemyList >= 1){ 
        if(checkCollision(enemyList,box)){
            console.log("collision")
        }
    }
    requestAnimationFrame(updateGame);
}

updateGame();
//---- DEBUGGING STUFF ----------------------------------------------------------//
function coordinates(){
    console.log(globalThis.outerWidth + "x" + globalThis.outerHeight);
}
