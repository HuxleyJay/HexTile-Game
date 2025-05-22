
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const TILE_RADIUS = 40;
const PLAYER_RADIUS = 20;
const BOT_RADIUS = 20;
const MAP_RADIUS = 4; // hex map size
const SPEED = 2;
const MAX_HEALTH = 100;

let tiles = [];
let player = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    health: MAX_HEALTH,
    target: null
};
let bots = [];

function hexToPixel(q, r) {
    let x = TILE_RADIUS * 3/2 * q;
    let y = TILE_RADIUS * Math.sqrt(3) * (r + q/2);
    return { x: x + canvas.width/2, y: y + canvas.height/2 };
}

function drawHex(x, y) {
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
        const angle = Math.PI / 3 * i;
        const px = x + TILE_RADIUS * Math.cos(angle);
        const py = y + TILE_RADIUS * Math.sin(angle);
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.strokeStyle = "#444";
    ctx.stroke();
}

function createMap() {
    for (let q = -MAP_RADIUS; q <= MAP_RADIUS; q++) {
        for (let r = -MAP_RADIUS; r <= MAP_RADIUS; r++) {
            if (Math.abs(q + r) <= MAP_RADIUS) {
                tiles.push(hexToPixel(q, r));
            }
        }
    }
}

function drawMap() {
    for (let tile of tiles) {
        drawHex(tile.x, tile.y);
    }
}

function drawPlayer() {
    ctx.beginPath();
    ctx.arc(player.x, player.y, PLAYER_RADIUS, 0, 2 * Math.PI);
    ctx.fillStyle = "cyan";
    ctx.fill();

    // Health bar
    ctx.fillStyle = "red";
    ctx.fillRect(player.x - 25, player.y - 30, 50, 5);
    ctx.fillStyle = "lime";
    ctx.fillRect(player.x - 25, player.y - 30, 50 * (player.health / MAX_HEALTH), 5);
}

function drawBots() {
    for (let bot of bots) {
        ctx.beginPath();
        ctx.arc(bot.x, bot.y, BOT_RADIUS, 0, 2 * Math.PI);
        ctx.fillStyle = "orange";
        ctx.fill();

        // Bot health bar
        ctx.fillStyle = "red";
        ctx.fillRect(bot.x - 20, bot.y - 30, 40, 4);
        ctx.fillStyle = "lime";
        ctx.fillRect(bot.x - 20, bot.y - 30, 40 * (bot.health / MAX_HEALTH), 4);
    }
}

function updateBots() {
    for (let bot of bots) {
        let dx = player.x - bot.x;
        let dy = player.y - bot.y;
        let dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > 1) {
            bot.x += (dx / dist) * SPEED * 0.5;
            bot.y += (dy / dist) * SPEED * 0.5;
        }

        // Bot attack
        if (dist < PLAYER_RADIUS + BOT_RADIUS) {
            player.health -= 0.2;
        }
    }
}

canvas.addEventListener("click", function(e) {
    player.target = { x: e.offsetX, y: e.offsetY };
});

function movePlayer() {
    if (player.target) {
        let dx = player.target.x - player.x;
        let dy = player.target.y - player.y;
        let dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > SPEED) {
            player.x += (dx / dist) * SPEED;
            player.y += (dy / dist) * SPEED;
        } else {
            player.target = null;
        }
    }
}

function spawnBots(n) {
    for (let i = 0; i < n; i++) {
        bots.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            health: MAX_HEALTH
        });
    }
}

function updateGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawMap();
    movePlayer();
    drawPlayer();
    updateBots();
    drawBots();

    requestAnimationFrame(updateGame);
}

createMap();
spawnBots(5);
updateGame();
