// ============================================
// CANVAS BASE
// ============================================
const canvas = document.getElementById("galaxyCanvas");
const ctx = canvas.getContext("2d");

let width, height, centerX, centerY;
let globalTime = 0;
let paused = false;
const GALAXY_SPEED = 30;

let mouseX = 0;
let mouseY = 0;

window.addEventListener("mousemove", (e) => {
  mouseX = (e.clientX - width / 2) * 0.02;
  mouseY = (e.clientY - height / 2) * 0.02;
});

// ============================================
// RESIZE
// ============================================
function resizeCanvas() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
  centerX = width / 2;
  centerY = height / 2;
}

resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// ============================================
// BOTONES
// ============================================
const btnFullscreen = document.getElementById("btnFullscreen");
const btnPause = document.getElementById("btnPause");
const pauseIcon = document.getElementById("pauseIcon");

btnFullscreen?.addEventListener("click", () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
});

btnPause?.addEventListener("click", () => {
  paused = !paused;
  if (pauseIcon) pauseIcon.textContent = paused ? "▶" : "⏸";
});

// ============================================
// ESTRELLAS (más suaves y azules)
// ============================================
const stars = [];

for (let i = 0; i < 1000; i++) {
  stars.push({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    size: Math.random() * 1.6 + 0.2,
    brightness: Math.random(),
    speed: Math.random() * 0.015 + 0.003,
  });
}

// ============================================
// GALAXIA AZUL NEBULOSA MEJORADA
// ============================================
const galaxyParticles = [];
const numGalaxy = 5000;

for (let i = 0; i < numGalaxy; i++) {
  const arms = 4;
  const arm = Math.floor(Math.random() * arms);

  const distance = Math.random() * 500 + 20;

  const baseAngle = (arm / arms) * Math.PI * 2;
  const spin = distance * 0.018;
  const noise = (Math.random() - 0.5) * 0.8;

  galaxyParticles.push({
    angle: baseAngle + spin + noise,
    distance,
    speed: 0.005 + Math.random() * 0.008,
    size: Math.random() * 2.5 + 0.3,
    depth: Math.random(),
  });
}

// ============================================
// CORAZÓN
// ============================================
const heartParticles = [];
const heartOffsetY = -120;

for (let i = 0; i < 1300; i++) {
  const t = Math.random() * Math.PI * 2;
  const scale = 110;

  const x = 16 * Math.pow(Math.sin(t), 3);
  const y = -(
    13 * Math.cos(t) -
    5 * Math.cos(2 * t) -
    2 * Math.cos(3 * t) -
    Math.cos(4 * t)
  );

  heartParticles.push({
    baseX: centerX + (x * scale) / 16,
    baseY: centerY + heartOffsetY + (y * scale) / 16,
    size: Math.random() * 2 + 0.4,
    offset: Math.random() * Math.PI * 2,
    color: { r: 255, g: 60, b: 140 },
  });
}

// ============================================
// TEXTO ORBITAL
// ============================================
const textParticles = [];

for (let i = 0; i < 160; i++) {
  textParticles.push({
    angle: Math.random() * Math.PI * 2,
    distance: 280 + Math.random() * 80,
    speed: 0.002 + Math.random() * 0.002,
    size: 1.5,
  });
}

// ============================================
// 📸 FOTOS + FRASES DE AMOR (MEJORADAS)
// ============================================
const photoData = [
  {
    url: "img/597096263_804581585887256_1169204710274092587_n.jpg",
    message: "💙 Eres mi universo infinito",
  },
  {
    url: "img/668464184_896638653348215_5212956770256297370_n.jpg",
    message: "✨ Contigo todo tiene sentido",
  },
  {
    url: "img/WhatsApp Image 2026-06-12 at 02.03.46.jpeg",
    message: "🌟 Eres mi estrella favorita",
  },
  {
    url: "img/WhatsApp Image 2026-06-12 at 02.04.08 (1).jpeg",
    message: "❤️ Te amo más de lo que imaginas",
  },

  {
    url: "img/WhatsApp Image 2026-06-12 at 02.05.54.jpeg",
    message: "🌙 Eres mi paz en el caos",
  },
  {
    url: "img/WhatsApp Image 2026-06-12 at 02.04.08.jpeg",
    message: "💫 Eres mi destino bonito",
  },
  {
    url: "img/WhatsApp Image 2026-06-12 at 02.03.46 (2).jpeg",
    message: "🔥 Mi corazón es tuyo",
  },
  {
    url: "img/WhatsApp Image 2026-06-12 at 02.03.46 (1).jpeg",
    message: "🌌 Siempre quiero estar contigo",
  },
  {
    url: "img/WhatsApp Image 2026-06-12 at 02.04.08.jpeg",
    message: "💖 Tú eres mi todo",
  },
];

const photos = [];

photoData.forEach((p, i) => {
  const img = new Image();
  img.src = p.url;

  photos.push({
    img,
    data: p,
    angle: (i / photoData.length) * Math.PI * 2,
    distance: 270,
    speed: 0.01,
    size: 40,
    x: 0,
    y: 0,
  });
});

// ============================================
// MODAL
// ============================================
const modalOverlay = document.getElementById("modalOverlay");
const modalImage = document.getElementById("modalImage");
const modalMessage = document.getElementById("modalMessage");
const modalClose = document.getElementById("modalClose");

function openModal(photo) {
  modalImage.src = photo.data.url;
  modalMessage.textContent = photo.data.message;
  modalOverlay.classList.add("active");
}

function closeModal() {
  modalOverlay.classList.remove("active");
}

modalClose?.addEventListener("click", closeModal);

modalOverlay?.addEventListener("click", (e) => {
  if (e.target === modalOverlay) closeModal();
});

// ============================================
// CLICK FOTOS
// ============================================
canvas.addEventListener("click", (e) => {
  const rect = canvas.getBoundingClientRect();

  const mx = e.clientX - rect.left;
  const my = e.clientY - rect.top;

  for (const p of photos) {
    const dx = mx - p.x;
    const dy = my - p.y;

    if (Math.sqrt(dx * dx + dy * dy) < p.size + 15) {
      openModal(p);
      break;
    }
  }
});

// ============================================
// DRAW LOOP (GALAXIA AZUL PRO)
// ============================================
function draw() {
  const bg = ctx.createRadialGradient(
    centerX,
    centerY,
    0,
    centerX,
    centerY,
    width,
  );

  bg.addColorStop(0, "#08111f");
  bg.addColorStop(0.4, "#050b16");
  bg.addColorStop(1, "#000000");

  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, width, height);

  // estrellas
  for (const s of stars) {
    s.brightness += s.speed;
    if (s.brightness > 1 || s.brightness < 0.2) s.speed *= -1;

    ctx.beginPath();
    ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(180,220,255,${s.brightness})`;
    ctx.fill();
  }

  // galaxia azul neón
  for (const p of galaxyParticles) {
    if (!paused) p.angle += p.speed * GALAXY_SPEED;

    const x = centerX + Math.cos(p.angle) * p.distance;
    const y = centerY + Math.sin(p.angle) * p.distance * 0.45;

    const depth = 0.3 + p.depth;

    const r = 60;
    const g = 140 + p.depth * 100;
    const b = 255;

    const alpha = 0.65 * depth;

    ctx.shadowBlur = 18;
    ctx.shadowColor = `rgba(100,180,255,${alpha})`;

    ctx.beginPath();
    ctx.arc(x, y, p.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`;
    ctx.fill();

    ctx.shadowBlur = 0;
  }
// ============================================
// CORAZÓN RELLENO
// ============================================

ctx.save();

const heartScale = 12 * pulse;

ctx.translate(centerX, centerY - 120);

ctx.beginPath();

for (let t = 0; t <= Math.PI * 2; t += 0.02) {
  const x = 16 * Math.pow(Math.sin(t), 3);
  const y = -(
    13 * Math.cos(t)
    - 5 * Math.cos(2 * t)
    - 2 * Math.cos(3 * t)
    - Math.cos(4 * t)
  );

  if (t === 0) {
    ctx.moveTo(x * heartScale, y * heartScale);
  } else {
    ctx.lineTo(x * heartScale, y * heartScale);
  }
}

ctx.closePath();

// degradado rosa brillante
const heartGradient = ctx.createRadialGradient(
  0, -20, 10,
  0, 0, 200
);

heartGradient.addColorStop(0, "#ff9acb");
heartGradient.addColorStop(0.4, "#ff4f9a");
heartGradient.addColorStop(1, "#d4005f");

ctx.fillStyle = heartGradient;

ctx.shadowBlur = 40;
ctx.shadowColor = "#ff4f9a";

ctx.fill();

ctx.restore();
  // corazón
  const pulse = Math.sin(globalTime * 0.03) * 0.2 + 1;

  for (const p of heartParticles) {
    const x = p.baseX + Math.sin(globalTime * 0.003 + p.offset) * 10;
    const y = p.baseY + Math.cos(globalTime * 0.003 + p.offset) * 10;

    ctx.beginPath();
    ctx.arc(x, y, p.size * pulse, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${p.color.r},${p.color.g},${p.color.b},0.9)`;
    ctx.fill();
  }

  // texto orbital
  for (const t of textParticles) {
    if (!paused) t.angle += t.speed * GALAXY_SPEED;

    const x = centerX + Math.cos(t.angle) * t.distance;
    const y = centerY + Math.sin(t.angle) * t.distance * 0.35;

    ctx.beginPath();
    ctx.arc(x, y, t.size, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255,105,180,0.9)";
    ctx.fill();
  }

  // fotos
  for (const p of photos) {
    if (!paused) p.angle += p.speed * GALAXY_SPEED;

    p.x = centerX + Math.cos(p.angle) * p.distance;
    p.y = centerY + Math.sin(p.angle) * p.distance * 0.35;

    ctx.save();
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.clip();

    if (p.img.complete) {
      ctx.drawImage(p.img, p.x - p.size, p.y - p.size, p.size * 2, p.size * 2);
    }

    ctx.restore();
  }

  globalTime++;
  requestAnimationFrame(draw);

  // ============================================
  // AUDIO
  // ============================================
  
}

draw();
