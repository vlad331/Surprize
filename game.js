const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const gameOverElement = document.getElementById('gameOver');

// Игровые переменные
let score = 0;
let gameSpeed = 5;
let gameRunning = true;
let gravity = 0.6;

// Динозавр
const dino = {
    x: 50,
    y: 150,
    width: 40,
    height: 40,
    velocityY: 0,
    jumping: false,
    color: '#333'
};

// Препятствия
let obstacles = [];
let obstacleTimer = 0;
const obstacleInterval = 100;
let bigBlockCreated = false; // Флаг для большого блока при 500 очках

// Функция рисования динозавра
function drawDino() {
    ctx.fillStyle = dino.color;
    ctx.fillRect(dino.x, dino.y, dino.width, dino.height);
    
    // Глаза
    ctx.fillStyle = 'white';
    ctx.fillRect(dino.x + 25, dino.y + 10, 8, 8);
    ctx.fillStyle = 'black';
    ctx.fillRect(dino.x + 27, dino.y + 12, 4, 4);
}

// Функция прыжка
function jump() {
    if (!dino.jumping && gameRunning) {
        dino.velocityY = -15;
        dino.jumping = true;
    }
}

// Функция создания препятствия
function createObstacle() {
    // Если достигли 500 очков и большой блок еще не создан
    if (score >= 500 && !bigBlockCreated) {
        bigBlockCreated = true;
        // Создаем огромный блок, который закроет почти весь экран
        obstacles.push({
            x: canvas.width,
            y: 0, // Начинается сверху
            width: 100, // Широкий блок
            height: canvas.height - 5, // Почти на всю высоту (оставляем 5px для земли)
            color: '#8B0000' // Темно-красный цвет для устрашения
        });
    } else if (score < 500) {
        // Обычные препятствия до 500 очков
        const height = Math.random() * 30 + 20;
        obstacles.push({
            x: canvas.width,
            y: canvas.height - height - 10,
            width: 20,
            height: height,
            color: '#ff6b6b'
        });
    }
}

// Функция рисования препятствий
function drawObstacles() {
    obstacles.forEach(obstacle => {
        ctx.fillStyle = obstacle.color;
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    });
}

// Функция обновления препятствий
function updateObstacles() {
    obstacles.forEach((obstacle, index) => {
        obstacle.x -= gameSpeed;
        
        // Удаление препятствий за экраном
        if (obstacle.x + obstacle.width < 0) {
            obstacles.splice(index, 1);
            score += 10;
            scoreElement.textContent = score;
            gameSpeed += 0.1;
        }
        
        // Проверка столкновения
        if (
            dino.x < obstacle.x + obstacle.width &&
            dino.x + dino.width > obstacle.x &&
            dino.y < obstacle.y + obstacle.height &&
            dino.y + dino.height > obstacle.y
        ) {
            gameOver();
        }
    });
}

// Функция обновления динозавра
function updateDino() {
    // Гравитация
    dino.velocityY += gravity;
    dino.y += dino.velocityY;
    
    // Ограничение на земле
    const groundY = canvas.height - dino.height - 10;
    if (dino.y >= groundY) {
        dino.y = groundY;
        dino.velocityY = 0;
        dino.jumping = false;
    }
}

// Функция рисования земли
function drawGround() {
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(0, canvas.height - 10, canvas.width, 10);
    
    // Трава
    ctx.fillStyle = '#228B22';
    for (let i = 0; i < canvas.width; i += 20) {
        ctx.fillRect(i, canvas.height - 10, 2, 5);
    }
}

// Функция очистки экрана
function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// Функция игры окончена
function gameOver() {
    gameRunning = false;
    gameOverElement.classList.add('show');
    
    // Редирект на страницу с видео через 2 секунды
    setTimeout(() => {
        // Перенаправление на страницу с локальным видео
        window.location.href = 'video.html';
    }, 2000);
}

// Главный игровой цикл
function gameLoop() {
    if (gameRunning) {
        clearCanvas();
        drawGround();
        drawDino();
        drawObstacles();
        
        updateDino();
        updateObstacles();
        
        // Создание новых препятствий
        obstacleTimer++;
        if (obstacleTimer >= obstacleInterval) {
            createObstacle();
            obstacleTimer = 0;
        }
    }
    
    requestAnimationFrame(gameLoop);
}

// Обработчики событий
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' || e.key === 'ArrowUp') {
        e.preventDefault();
        jump();
    }
});

canvas.addEventListener('click', () => {
    jump();
});

// Запуск игры
gameLoop();

