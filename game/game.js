// --- OPPONENT CONFIGURATION (Generated via boxer-archetype-generator skill) ---
const OPPONENT_CONFIG = {
  name: "Iron Slugger",
  health: 100,
  punchPower: 12,
  telegraphDurationMs: 600,
  attackCooldownMs: 1400,
  blockProbability: 0.2,
  roundDurationSec: 30,
  visuals: {
    gloveColor: "#ef4444",
    shortsColor: "#1e293b"
  }
};

// Canvas & HUD Elements
const canvas = document.getElementById("ringCanvas");
const ctx = canvas.getContext("2d");
const playerHpBar = document.getElementById("player-hp");
const opponentHpBar = document.getElementById("opponent-hp");
const timerEl = document.getElementById("round-timer");
const opponentNameEl = document.getElementById("opponent-name");
const modalScreen = document.getElementById("modal-screen");
const modalTitle = document.getElementById("modal-title");
const modalDesc = document.getElementById("modal-desc");
const startBtn = document.getElementById("start-btn");

const zonePunch = document.getElementById("zone-punch");
const zoneGuard = document.getElementById("zone-guard");

opponentNameEl.textContent = OPPONENT_CONFIG.name.toUpperCase();

// Game State
let playerHP = 100;
let opponentHP = OPPONENT_CONFIG.health;
let timeLeft = OPPONENT_CONFIG.roundDurationSec;
let isPlaying = false;
let gameTimerInterval = null;
let lastOpponentActionTime = 0;

// Fighter Animation States
let playerState = "idle"; // idle | punch | guard
let opponentState = "idle"; // idle | telegraph | punch | guard
let hitSparks = [];

// --- INPUT LISTENERS (Pointer Events for Touch + Mouse) ---
zonePunch.addEventListener("pointerdown", (e) => {
  e.preventDefault();
  if (!isPlaying || playerState === "guard") return;
  triggerPlayerPunch();
});

zoneGuard.addEventListener("pointerdown", (e) => {
  e.preventDefault();
  if (!isPlaying) return;
  playerState = "guard";
  zoneGuard.classList.add("active");
});

const releaseGuard = (e) => {
  if (playerState === "guard") {
    playerState = "idle";
    zoneGuard.classList.remove("active");
  }
};
zoneGuard.addEventListener("pointerup", releaseGuard);
zoneGuard.addEventListener("pointerleave", releaseGuard);
zoneGuard.addEventListener("pointercancel", releaseGuard);

function triggerPlayerPunch() {
  playerState = "punch";
  setTimeout(() => {
    if (playerState === "punch") playerState = "idle";
  }, 180);

  // Hit determination
  const isOpponentGuarding = Math.random() < OPPONENT_CONFIG.blockProbability;
  if (isOpponentGuarding) {
    opponentState = "guard";
    createSpark(240, 200, "#facc15"); // yellow guard spark
    setTimeout(() => { if (opponentState === "guard") opponentState = "idle"; }, 250);
  } else {
    opponentHP = Math.max(0, opponentHP - 10);
    opponentHpBar.style.width = `${(opponentHP / OPPONENT_CONFIG.health) * 100}%`;
    createSpark(250, 190, "#ef4444"); // red hit spark

    if (opponentHP <= 0) {
      endGame("KNOCKOUT! 🏆", "You defeated " + OPPONENT_CONFIG.name + "!");
    }
  }
}

function triggerOpponentPunch() {
  opponentState = "punch";
  setTimeout(() => {
    if (opponentState === "punch") opponentState = "idle";
  }, 220);

  if (playerState === "guard") {
    createSpark(160, 200, "#facc15");
    playerHP = Math.max(0, playerHP - 2); // chip damage
  } else {
    createSpark(150, 190, "#38bdf8");
    playerHP = Math.max(0, playerHP - OPPONENT_CONFIG.punchPower);
  }

  playerHpBar.style.width = `${Math.max(0, playerHP)}%`;

  if (playerHP <= 0) {
    endGame("KNOCKED OUT! 💥", OPPONENT_CONFIG.name + " knocked you down!");
  }
}

function updateOpponentAI(timestamp) {
  if (!isPlaying) return;

  if (opponentState === "idle" && timestamp - lastOpponentActionTime > OPPONENT_CONFIG.attackCooldownMs) {
    lastOpponentActionTime = timestamp;
    opponentState = "telegraph"; // visual cue before strike

    setTimeout(() => {
      if (isPlaying && opponentState === "telegraph") {
        triggerOpponentPunch();
      }
    }, OPPONENT_CONFIG.telegraphDurationMs);
  }
}

function createSpark(x, y, color) {
  hitSparks.push({ x, y, color, life: 10 });
}

// --- CANVAS RENDERING (Procedural Stickmen) ---
function drawFighter(x, y, color, state, isFacingRight) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 4;
  ctx.lineCap = "round";

  // Head
  ctx.beginPath();
  ctx.arc(x, y - 60, 16, 0, Math.PI * 2);
  ctx.stroke();

  // Torso
  ctx.beginPath();
  ctx.moveTo(x, y - 44);
  ctx.lineTo(x, y);
  ctx.stroke();

  // Legs
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x - 14, y + 45);
  ctx.moveTo(x, y);
  ctx.lineTo(x + 14, y + 45);
  ctx.stroke();

  // Arms & Boxing Gloves
  const dir = isFacingRight ? 1 : -1;

  if (state === "punch") {
    // Punch extended
    ctx.beginPath();
    ctx.moveTo(x, y - 30);
    ctx.lineTo(x + 40 * dir, y - 30);
    ctx.stroke();

    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x + 46 * dir, y - 30, 8, 0, Math.PI * 2);
    ctx.fill();
  } else if (state === "guard") {
    // High Guard
    ctx.beginPath();
    ctx.moveTo(x, y - 30);
    ctx.lineTo(x + 12 * dir, y - 55);
    ctx.stroke();

    ctx.fillStyle = "#facc15";
    ctx.beginPath();
    ctx.arc(x + 12 * dir, y - 55, 8, 0, Math.PI * 2);
    ctx.fill();
  } else if (state === "telegraph") {
    // Reeled back ready to strike
    ctx.beginPath();
    ctx.moveTo(x, y - 30);
    ctx.lineTo(x - 16 * dir, y - 40);
    ctx.stroke();

    ctx.fillStyle = "#f97316"; // warning orange
    ctx.beginPath();
    ctx.arc(x - 18 * dir, y - 40, 8, 0, Math.PI * 2);
    ctx.fill();
  } else {
    // Idle stance
    ctx.beginPath();
    ctx.moveTo(x, y - 30);
    ctx.lineTo(x + 16 * dir, y - 34);
    ctx.stroke();

    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x + 18 * dir, y - 34, 7, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

function renderRing() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Ring Canvas Ropes
  ctx.strokeStyle = "#334155";
  ctx.lineWidth = 2;
  for (let i = 0; i < 3; i++) {
    ctx.beginPath();
    ctx.moveTo(20, 180 + i * 40);
    ctx.lineTo(380, 180 + i * 40);
    ctx.stroke();
  }

  // Draw Fighters
  drawFighter(130, 260, "#38bdf8", playerState, true);
  drawFighter(270, 260, OPPONENT_CONFIG.visuals.gloveColor, opponentState, false);

  // Sparks/Hits
  for (let i = hitSparks.length - 1; i >= 0; i--) {
    const s = hitSparks[i];
    ctx.fillStyle = s.color;
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.life * 1.5, 0, Math.PI * 2);
    ctx.fill();
    s.life--;
    if (s.life <= 0) hitSparks.splice(i, 1);
  }
}

function gameLoop(timestamp) {
  updateOpponentAI(timestamp);
  renderRing();
  if (isPlaying) requestAnimationFrame(gameLoop);
}

// --- GAME LIFECYCLE ---
function startGame() {
  playerHP = 100;
  opponentHP = OPPONENT_CONFIG.health;
  timeLeft = OPPONENT_CONFIG.roundDurationSec;
  playerState = "idle";
  opponentState = "idle";
  hitSparks = [];

  playerHpBar.style.width = "100%";
  opponentHpBar.style.width = "100%";
  timerEl.textContent = timeLeft;

  modalScreen.classList.add("hidden");
  isPlaying = true;
  lastOpponentActionTime = performance.now();

  clearInterval(gameTimerInterval);
  gameTimerInterval = setInterval(() => {
    timeLeft--;
    timerEl.textContent = timeLeft;
    if (timeLeft <= 0) {
      if (playerHP > opponentHP) {
        endGame("DECISION WIN! 🥇", "Time expired! You landed more clean hits.");
      } else {
        endGame("DECISION LOSS! ⏱️", "Time expired! " + OPPONENT_CONFIG.name + " controlled the round.");
      }
    }
  }, 1000);

  requestAnimationFrame(gameLoop);
}

function endGame(title, message) {
  isPlaying = false;
  clearInterval(gameTimerInterval);
  modalTitle.textContent = title;
  modalDesc.innerHTML = `${message}<br/><br/><strong>Tap Restart to Fight Again.</strong>`;
  startBtn.textContent = "RESTART";
  modalScreen.classList.remove("hidden");
}

startBtn.addEventListener("click", startGame);
renderRing();
