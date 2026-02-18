import { db } from "./firebase.js";
import { ref, onValue, push } from
  "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

const liveRef = ref(db, "helmet_01/live_data");
const historyRef = ref(db, "helmet_01/history/aqi");

let values = [];
let labels = [];

function getColor(aqi) {
  if (aqi > 200) return "#f472b6"; // Pink/Red
  return "#22d3ee"; // Cyan
}

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
      borderColor: "#22d3ee", // Cyan
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

const gauge = new Chart(document.getElementById("aqiGauge"), {
  type: "doughnut",
  data: {
    datasets: [{
      data: [0, 300],
      backgroundColor: ["#22d3ee", "rgba(255,255,255,0.1)"],
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

  chart.data.labels = labels;
  chart.data.datasets[0].data = values;
  chart.update('none');

  gauge.data.datasets[0].data = [d.aqi, 300 - d.aqi];
  gauge.update();

  push(historyRef, { value: d.aqi, time: Date.now() });
});
