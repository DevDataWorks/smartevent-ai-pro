// ---------------- CLOCK ----------------
function updateClock() {
  const now = new Date();
  document.getElementById("clock").innerText =
    "⏱️ " + now.toLocaleTimeString();
}
setInterval(updateClock, 1000);

// ---------------- AI ANALYSIS ----------------
function analyze() {
  const location = document.getElementById("location").value;

  const crowd = Math.floor(Math.random() * 100);

  let risk = "";
  let color = "";
  let alert = "";
  let eta = "";

  if (crowd > 80) {
    risk = "HIGH RISK 🚨";
    color = "red";
    alert = "Avoid immediately!";
    eta = "15-20 mins delay";
  } else if (crowd > 60) {
    risk = "MEDIUM ⚠️";
    color = "orange";
    alert = "Use alternate path";
    eta = "10 mins delay";
  } else if (crowd > 40) {
    risk = "LOW 🙂";
    color = "yellow";
    alert = "Normal flow";
    eta = "5 mins delay";
  } else {
    risk = "SAFE ✅";
    color = "lightgreen";
    alert = "No delay";
    eta = "Instant access";
  }

  const routes = {
    "Gate A": "Gate B",
    "Gate B": "Gate A",
    "Food Court": "Main Stage",
    "Main Stage": "Gate A"
  };

  const altRoute = routes[location];

  document.getElementById("output").innerHTML = `
    <h3>📊 AI REPORT</h3>
    <p><b>📍 Location:</b> ${location}</p>
    <p><b>👥 Crowd:</b> ${crowd}%</p>
    <p><b style="color:${color}">⚠️ Risk:</b> ${risk}</p>
    <p><b>🔀 Route:</b> ${altRoute}</p>
    <p><b>⏳ ETA:</b> ${eta}</p>
    <p><b>📢 Alert:</b> ${alert}</p>
  `;

  drawPulse();
}

// ---------------- CANVAS CROWD ----------------
const canvas = document.getElementById("mapCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let dots = [];

for (let i = 0; i < 100; i++) {
  dots.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    dx: (Math.random() - 0.5) * 1.5,
    dy: (Math.random() - 0.5) * 1.5
  });
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  dots.forEach(dot => {
    dot.x += dot.dx;
    dot.y += dot.dy;

    if (dot.x < 0 || dot.x > canvas.width) dot.dx *= -1;
    if (dot.y < 0 || dot.y > canvas.height) dot.dy *= -1;

    ctx.beginPath();
    ctx.arc(dot.x, dot.y, 2, 0, Math.PI * 2);
    ctx.fillStyle = "cyan";
    ctx.fill();
  });

  requestAnimationFrame(animate);
}

animate();

// ---------------- PULSE ----------------
function drawPulse() {
  const x = Math.random() * canvas.width;
  const y = Math.random() * canvas.height;

  ctx.beginPath();
  ctx.arc(x, y, 25, 0, Math.PI * 2);
  ctx.strokeStyle = "yellow";
  ctx.lineWidth = 2;
  ctx.stroke();
}