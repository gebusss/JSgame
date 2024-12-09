const box = document.getElementById('box');
const shadow = document.getElementById('shadow');
const body = document.getElementById('body');
const startGameButton = document.querySelector('#startButton');
let positionX = 0;
let positionY = 0;
let direction = 1;
let farRight = globalThis.innerWidth - box.offsetWidth;
let farDown = globalThis.innerHeight - box.offsetHeight;
let keySum;
let enemyPositionX = 0;
let enemyPositionY = 0;

const keyState = {
    d: false,
    a: false,
    w: false, 
    s: false,
};

function rules(){
    console.log("kys");
}

function enemyGenerator(){
    enemy = document.createElement('div');
    enemy.setAttribute("class", "enemy");
    body.append(enemy);
}

function enemySpawner(){
    let edge = Math.floor(Math.random() * 4 + 1);
    switch(edge){
        case 1:
            enemyPositionX = Math.floor(Math.random() * globalThis.innerWidth);
            enemyPositionY = 0;
            break;
        case 2:
            enemyPositionX = globalThis.innerWidth;
            enemyPositionY = Math.floor(Math.random() * globalThis.innerHeight);
            break;
        case 3:
            enemyPositionX = Math.floor(Math.random() * globalThis.innerWidth);
            enemyPositionY = globalThis.innerHeight;
            break;
        case 4:
            enemyPositionX = 0;
            enemyPositionY = Math.floor(Math.random() * globalThis.innerWidth);
            break;
    }

    enemyGenerator();
    enemy.style.left = enemyPositionX + "px";
    enemy.style.top = enemyPositionY + "px";

}

function startGame (){
    positionX = farRight / 2;
    positionY = farDown / 2;
    box.style.visibility = "visible";
    startGameButton.style.visibility = "hidden";
}

startGameButton.addEventListener('click', startGame);
const SPEED = 10;
const SPEED_DIAGONAL = SPEED / Math.sqrt(2);

const clamp = (n, max, min) => Math.max(Math.min(n, max), min);

function moveBox() {
    box.innerHTML = Math.floor(positionX) + " " + Math.floor(positionY);
    const diagonal = keyState.a + keyState.d + keyState.s + keyState.w > 1;
    const speed = diagonal ? SPEED_DIAGONAL : SPEED;
    
    if(keyState.a !== keyState.d) positionX += keyState.a ? -speed : speed;
    if(keyState.w !== keyState.s) positionY += keyState.w ? -speed : speed;
    
    positionX = clamp(positionX , farRight, 0);
    positionY = clamp(positionY , farDown, 0);
    box.style.left = `${positionX}px`;
    box.style.top = `${positionY}px`;
    
    requestAnimationFrame(moveBox);
}
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

function checkCollision(enemy, box) {
    const rect1 = box.getBoundingClientRect();
    const rect2 = enemy.getBoundingClientRect();

    return !(
        rect1.right < rect2.left || 
        rect1.left > rect2.right || 
        rect1.bottom < rect2.top || 
        rect1.top > rect2.bottom
    );
}

moveBox();

function coordinates(){
    console.log(globalThis.outerWidth + "x" + globalThis.outerHeight);
}




