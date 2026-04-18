document.addEventListener("DOMContentLoaded", () => {

const search = document.getElementById("search");
const suggestions = document.getElementById("suggestions");
const mapFrame = document.getElementById("mapFrame");
const output = document.getElementById("output");
const favList = document.getElementById("favList");

let history = [];
let auto = false;
let autoTimer = null;

// 🌍 SEARCH (OpenStreetMap)
search.addEventListener("input", async () => {
  const q = search.value.trim();
  if (q.length < 2) return;

  const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${q}`);
  const data = await res.json();

  suggestions.innerHTML = "";
  data.slice(0,5).forEach(p => {
    const d = document.createElement("div");
    d.innerText = p.display_name;
    d.onclick = () => {
      search.value = p.display_name;
      suggestions.innerHTML = "";
      mapFrame.src = `https://maps.google.com/maps?q=${p.lat},${p.lon}&z=13&output=embed`;
    };
    suggestions.appendChild(d);
  });
});

// 📊 ANALYZE
function analyze(){
  const place = search.value || "India";

  // deterministic score (stable)
  let crowd = (place.length * 11) % 100;

  history.push(crowd);
  if(history.length > 12) history.shift();

  const avg = history.reduce((a,b)=>a+b,0)/history.length;

  const risk = avg>75 ? "HIGH 🚨" :
               avg>50 ? "MEDIUM ⚠️" : "LOW ✅";

  output.innerHTML = `
    <h3>${place}</h3>
    <p>Crowd: ${crowd}%</p>
    <p>Trend Avg: ${avg.toFixed(1)}%</p>
    <p>Risk: ${risk}</p>
  `;

  updateChart(crowd);
}

document.getElementById("analyzeBtn").onclick = analyze;

// 🎤 VOICE
document.getElementById("voiceBtn").onclick = () => {
  if(!('webkitSpeechRecognition' in window)){
    alert("Use Chrome for voice");
    return;
  }
  const r = new webkitSpeechRecognition();
  r.onresult = e => search.value = e.results[0][0].transcript;
  r.start();
};

// 📍 GEOLOCATION
document.getElementById("geoBtn").onclick = () => {
  navigator.geolocation.getCurrentPosition(pos => {
    const {latitude, longitude} = pos.coords;
    mapFrame.src = `https://maps.google.com/maps?q=${latitude},${longitude}&z=13&output=embed`;
    search.value = "My Location";
  });
};

// ⭐ FAVORITES
document.getElementById("saveFav").onclick = () => {
  const val = search.value;
  if(!val) return;
  const opt = document.createElement("option");
  opt.text = val;
  favList.add(opt);
};

favList.onchange = () => {
  search.value = favList.value;
};

// 🌗 THEME
document.getElementById("themeToggle").onclick = () => {
  document.body.classList.toggle("dark");
};

// 🔄 RESET
document.getElementById("resetBtn").onclick = () => {
  history = [];
  output.innerHTML = "";
};

// ⏱️ AUTO
document.getElementById("autoBtn").onclick = (e) => {
  auto = !auto;
  e.target.innerText = auto ? "⏱️ Auto: ON" : "⏱️ Auto: OFF";

  if(auto){
    autoTimer = setInterval(analyze,5000);
  } else {
    clearInterval(autoTimer);
  }
};

// 🔴 HEAT VISUAL
const canvas = document.getElementById("mapCanvas");
const ctx = canvas.getContext("2d");

function resize(){
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
}
resize();

let pts = Array.from({length:100},()=>({
  x:Math.random()*canvas.width,
  y:Math.random()*canvas.height,
  dx:Math.random()-0.5,
  dy:Math.random()-0.5
}));

function color(v){
  if(v>75) return "red";
  if(v>50) return "yellow";
  return "green";
}

function animate(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  pts.forEach(p=>{
    p.x+=p.dx; p.y+=p.dy;
    let v=Math.random()*100;
    ctx.beginPath();
    ctx.arc(p.x,p.y,3,0,6.28);
    ctx.fillStyle=color(v);
    ctx.fill();
  });
  requestAnimationFrame(animate);
}
animate();

// 📈 CHART
const chart = new Chart(document.getElementById("chart"),{
  type:"line",
  data:{labels:[],datasets:[{label:"Crowd %",data:[]}]}
});

function updateChart(v){
  chart.data.labels.push("");
  chart.data.datasets[0].data.push(v);
  chart.update();
}

});