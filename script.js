"use strict";

/* ---------- DATA MODEL ---------- */
const crowdBase = {
  "Gate A": 70,
  "Gate B": 40,
  "Food Court": 85,
  "Main Stage": 60
};

/* ---------- CROWD ENGINE ---------- */
function generateCrowd(location) {
  return crowdBase[location] + Math.floor(Math.random() * 20 - 10);
}

/* ---------- AI DECISION ENGINE ---------- */
function analyze() {
  const location = document.getElementById("location").value;
  const crowd = generateCrowd(location);

  let risk, message;

  if (crowd > 80) {
    risk = "HIGH 🚨";
    message = "Avoid area immediately";
  } else if (crowd > 60) {
    risk = "MEDIUM ⚠️";
    message = "Use alternate route";
  } else if (crowd > 40) {
    risk = "LOW 🙂";
    message = "Moderate flow";
  } else {
    risk = "SAFE ✅";
    message = "Smooth movement";
  }

  const routes = {
    "Gate A": "Gate B",
    "Gate B": "Gate A",
    "Food Court": "Gate A",
    "Main Stage": "Gate B"
  };

  const altRoute = routes[location];

  const aiInsight = `Based on crowd level ${crowd}%, AI recommends moving via ${altRoute}.`;

  document.getElementById("output").innerHTML = `
    <h3>AI REPORT</h3>
    <p>Location: ${location}</p>
    <p>Crowd: ${crowd}%</p>
    <p>Risk: ${risk}</p>
    <p>Route: ${altRoute}</p>
    <p>AI Insight: ${aiInsight}</p>
  `;
}

/* ---------- CANVAS SIMULATION ---------- */
const canvas = document.getElementById("mapCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let dots = [];

for (let i = 0; i < 80; i++) {
  dots.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    dx: Math.random() - 0.5,
    dy: Math.random() - 0.5
  });
}

function animate() {
  ctx.clearRect(0,0,canvas.width,canvas.height);

  dots.forEach(d => {
    d.x += d.dx;
    d.y += d.dy;

    if (d.x<0 || d.x>canvas.width) d.dx*=-1;
    if (d.y<0 || d.y>canvas.height) d.dy*=-1;

    ctx.beginPath();
    ctx.arc(d.x,d.y,2,0,Math.PI*2);
    ctx.fillStyle="cyan";
    ctx.fill();
  });

  requestAnimationFrame(animate);
}

animate();