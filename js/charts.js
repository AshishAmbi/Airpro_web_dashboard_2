import { db } from "./firebase.js";
import { ref, onValue, push } from
  "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

const liveRef = ref(db, "helmet_01/live_data");
const historyRef = ref(db, "helmet_01/history/aqi");

// DOM Element for Status
const statusEl = document.getElementById('aqi-gauge-status');

let values = [];
let labels = [];

// Helper: Determine Color & Status based on AQI
function getAQIData(aqi) {
  if (aqi <= 50) return { color: '#22c55e', label: 'GOOD' };       // Green
  if (aqi <= 100) return { color: '#eab308', label: 'MODERATE' };  // Yellow
  if (aqi <= 150) return { color: '#f97316', label: 'UNHEALTHY' }; // Orange
  if (aqi <= 200) return { color: '#ef4444', label: 'POOR' };      // Red
  if (aqi <= 300) return { color: '#a855f7', label: 'VERY POOR' }; // Purple
  return { color: '#7f1d1d', label: 'HAZARDOUS' };                 // Dark Red
}

/* LINE CHART - NEON STYLE */
const ctx = document.getElementById("aqiChart").getContext("2d");
const gradient = ctx.createLinearGradient(0, 0, 0, 400);
gradient.addColorStop(0, 'rgba(34, 211, 238, 0.5)'); // Cyan Glow
gradient.addColorStop(1, 'rgba(34, 211, 238, 0)');

const chart = new Chart(ctx, {
  type: "line",
  data: {
    labels: labels,
    datasets: [{
      data: values,
      borderWidth: 2,
      borderColor: "#22d3ee", // Default Cyan (will verify if user wants dynamic line too, keeping cyan for tech feel)
      backgroundColor: gradient,
      fill: true,
      pointRadius: 3,
      pointBackgroundColor: "#fff",
      pointBorderColor: "#22d3ee",
      tension: 0.4
    }]
  },
  options: {
    plugins: { legend: { display: false } },
    scales: {
      x: { display: false },
      y: {
        beginAtZero: true,
        grid: { color: "rgba(255, 255, 255, 0.1)", drawBorder: false },
        ticks: { color: "#94a3b8", font: { family: "'Outfit', sans-serif" } }
      }
    },
    responsive: true,
    maintainAspectRatio: false,
    interaction: { intersect: false, mode: 'index' },
  }
});

/* GAUGE - DYNAMIC RING */
const gauge = new Chart(document.getElementById("aqiGauge"), {
  type: "doughnut",
  data: {
    datasets: [{
      data: [0, 300],
      backgroundColor: ["#22d3ee", "rgba(255,255,255,0.1)"], // Init with Cyan
      borderWidth: 0,
      cutout: "85%",
      borderRadius: 20
    }]
  },
  options: {
    rotation: -90,
    circumference: 180,
    plugins: { tooltip: { enabled: false }, legend: { display: false } },
    animation: { animateScale: true, animateRotate: true }
  }
});

onValue(liveRef, (snap) => {
  const d = snap.val();
  if (!d) return;

  const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  if (values.length > 20) { values.shift(); labels.shift(); }

  values.push(d.aqi);
  labels.push(time);

  // Update Line Chart
  chart.data.labels = labels;
  chart.data.datasets[0].data = values;
  chart.update('none');

  // Update Gauge Logic
  const analysis = getAQIData(d.aqi);

  // 1. Update Ring Color
  gauge.data.datasets[0].backgroundColor = [analysis.color, "rgba(255,255,255,0.1)"];
  gauge.data.datasets[0].data = [d.aqi, 300 - d.aqi]; // Assuming max 300 for gauge scale
  gauge.update();

  // 2. Update Status Text
  if (statusEl) {
    statusEl.innerText = analysis.label;
    statusEl.style.color = analysis.color;
    statusEl.style.textShadow = `0 0 10px ${analysis.color}`; // Neon Glow
  }

  push(historyRef, { value: d.aqi, time: Date.now() });
});
