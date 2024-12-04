// Obtener el lienzo y el contexto 2D 
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Variables del menú y de Game Over
const menu = document.getElementById('menu');
const gameContainer = document.getElementById('gameContainer');
const gameOverScreen = document.getElementById('gameOverScreen');
const scoreElement = document.getElementById('score');
const finalScoreElement = document.getElementById('finalScore');
const restartButton = document.getElementById('restart');
const backToMenuButton = document.getElementById('backToMenu');

// Botones del menú principal
const startGameButton = document.getElementById('startGame');

// Variables del juego
canvas.width = 1000;
canvas.height = 800;

let player = {
    x: canvas.width / 2 - 20,
    y: canvas.height / 2 - 20,
    width: 40,
    height: 40,
    color: 'blue',
    speed: 6,
    direction: 'up',         // Dirección de movimiento (WASD)
    shootDirection: 'up',    // Dirección de disparo (Flechas o dirección de movimiento)
    bullets: []
};

let zombies = [];
let zombieSpeed = 1;
let score = 0;
let gameOver = false;
let gameRunning = false;

// Controles del jugador: WASD para mover, Flechas para dirección de disparo
const keys = {
    ArrowLeft: false,
    ArrowRight: false,
    ArrowUp: false,
    ArrowDown: false,
    KeyW: false,
    KeyA: false,
    KeyS: false,
    KeyD: false,
    Space: false
};

// Eventos de teclado para mover (WASD) y disparar en la dirección seleccionada (Flechas)
document.addEventListener('keydown', (e) => {
    if (e.code in keys) keys[e.code] = true;

    // Controlar la dirección de movimiento con WASD y ajustar la dirección de disparo a la misma
    if (e.code === 'KeyW') {
        player.direction = 'up';
        player.shootDirection = 'up';
    }
    if (e.code === 'KeyA') {
        player.direction = 'left';
        player.shootDirection = 'left';
    }
    if (e.code === 'KeyS') {
        player.direction = 'down';
        player.shootDirection = 'down';
    }
    if (e.code === 'KeyD') {
        player.direction = 'right';
        player.shootDirection = 'right';
    }

    // Cambiar la dirección de disparo con las flechas si el jugador está quieto
    if (!keys.KeyW && !keys.KeyA && !keys.KeyS && !keys.KeyD) {
        if (e.key === 'ArrowUp') player.shootDirection = 'up';
        if (e.key === 'ArrowDown') player.shootDirection = 'down';
        if (e.key === 'ArrowLeft') player.shootDirection = 'left';
        if (e.key === 'ArrowRight') player.shootDirection = 'right';
    }

    // Disparar con la tecla Space en la dirección actual de disparo
    if (e.code === 'Space') shootBullet();
});

document.addEventListener('keyup', (e) => {
    if (e.code in keys) keys[e.code] = false;
});

// Función para disparar en la dirección actual de disparo
function shootBullet() {
    let bullet = {
        x: player.x + player.width / 2 - 2.5,
        y: player.y + player.height / 2 - 2.5,
        width: 5,
        height: 5,
        color: 'yellow',
        speed: 8,
        direction: player.shootDirection // Dirección del disparo
    };
    player.bullets.push(bullet);
}

// Generar zombis desde cualquier borde
function createZombie() {
    let side = Math.floor(Math.random() * 4);  // 0 = arriba, 1 = derecha, 2 = abajo, 3 = izquierda
    let zombie = { x: 0, y: 0, width: 40, height: 40, color: 'green', speed: zombieSpeed };

    if (side === 0) {
        zombie.x = Math.random() * canvas.width;
        zombie.y = -zombie.height;
    } else if (side === 1) {
        zombie.x = canvas.width;
        zombie.y = Math.random() * canvas.height;
    } else if (side === 2) {
        zombie.x = Math.random() * canvas.width;
        zombie.y = canvas.height;
    } else if (side === 3) {
        zombie.x = -zombie.width;
        zombie.y = Math.random() * canvas.height;
    }

    zombies.push(zombie);
}

// Actualizar la posición de los zombis y las balas
function updateGameObjects() {
    player.bullets.forEach((bullet, bulletIndex) => {
        if (bullet.direction === 'up') bullet.y -= bullet.speed;
        if (bullet.direction === 'down') bullet.y += bullet.speed;
        if (bullet.direction === 'left') bullet.x -= bullet.speed;
        if (bullet.direction === 'right') bullet.x += bullet.speed;

        if (bullet.y < 0 || bullet.y > canvas.height || bullet.x < 0 || bullet.x > canvas.width) {
            player.bullets.splice(bulletIndex, 1);
        }
    });

    zombies.forEach((zombie, zombieIndex) => {
        let dx = player.x - zombie.x;
        let dy = player.y - zombie.y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        zombie.x += (dx / distance) * zombie.speed;
        zombie.y += (dy / distance) * zombie.speed;

        if (distance < 30) gameOver = true;

        player.bullets.forEach((bullet, bulletIndex) => {
            if (bullet.x < zombie.x + zombie.width &&
                bullet.x + bullet.width > zombie.x &&
                bullet.y < zombie.y + zombie.height &&
                bullet.y + bullet.height > zombie.y) {
                zombies.splice(zombieIndex, 1);
                player.bullets.splice(bulletIndex, 1);
                score += 10;
                scoreElement.textContent = score;
            }
        });
    });
}

// Dibujar el jugador
function drawPlayer() {
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

// Dibujar las balas
function drawBullets() {
    player.bullets.forEach(bullet => {
        ctx.fillStyle = bullet.color;
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    });
}

// Dibujar los zombis
function drawZombies() {
    zombies.forEach(zombie => {
        ctx.fillStyle = zombie.color;
        ctx.fillRect(zombie.x, zombie.y, zombie.width, zombie.height);
    });
}

// Dibujar el juego
function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPlayer();
    drawBullets();
    drawZombies();
}

// Actualizar la lógica del juego
function update() {
    if (gameOver) {
        endGame();
        return;
    }

    updateGameObjects();

    // Movimiento del jugador con WASD
    if (keys.KeyA && player.x > 0) player.x -= player.speed;
    if (keys.KeyD && player.x + player.width < canvas.width) player.x += player.speed;
    if (keys.KeyW && player.y > 0) player.y -= player.speed;
    if (keys.KeyS && player.y + player.height < canvas.height) player.y += player.speed;

    drawGame();
    if (gameRunning) requestAnimationFrame(update);
}

// Iniciar el juego
function startGame() {
    menu.style.display = 'none';
    gameContainer.style.display = 'block';
    gameOverScreen.style.display = 'none';
    gameOver = false;
    gameRunning = true;
    score = 0;
    scoreElement.textContent = score;
    player.x = canvas.width / 2 - 20;  // Reiniciar posición del jugador al centro
    player.y = canvas.height / 2 - 20;
    player.bullets = [];
    zombies = [];
    update();
    setInterval(createZombie, 2000);
}

// Terminar el juego
function endGame() {
    gameRunning = false;
    gameOverScreen.style.display = 'block';
    finalScoreElement.textContent = score;
}

// Vincular el evento de clic al botón de inicio de juego
startGameButton.addEventListener('click', startGame);

// Vincular eventos de los botones de reinicio y volver al menú
restartButton.addEventListener('click', startGame);
backToMenuButton.addEventListener('click', () => {
    gameOverScreen.style.display = 'none';
    gameContainer.style.display = 'none';
    menu.style.display = 'block';
});
