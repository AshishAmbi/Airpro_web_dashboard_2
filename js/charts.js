import { db } from "./firebase.js";
import { ref, onValue, push } from
"https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

const liveRef = ref(db, "helmet_01/live_data");
const historyRef = ref(db, "helmet_01/history/aqi");

let values = [];
let labels = [];

function getColor(aqi) {
  if (aqi < 50) return "#22c55e";
  if (aqi < 100) return "#f59e0b";
  return "#ef4444";
}

/* LINE CHART */
const chart = new Chart(document.getElementById("aqiChart"), {
  type: "line",
  data: {
    labels: labels,
    datasets: [{
      data: values,
      borderWidth: 3,
      tension: 0.4
    }]
  },
  options: {
    plugins:{ legend:{ display:false }},
    scales: {
      x: { display:false },
      y: { beginAtZero:true }
    },
    responsive:true
  }
});

/* GAUGE */
const gauge = new Chart(document.getElementById("aqiGauge"), {
  type: "doughnut",
  data: {
    datasets: [{
      data: [0,300],
      backgroundColor:["#22c55e","#1f2937"],
      cutout:"75%"
    }]
  },
  options:{
    rotation:-90,
    circumference:180,
    plugins:{ legend:{ display:false }}
  }
});

onValue(liveRef, (snap)=>{
  const d = snap.val();
  if(!d) return;

  const time = new Date().toLocaleTimeString();

  if(values.length > 12){
    values.shift();
    labels.shift();
  }

  values.push(d.aqi);
  labels.push(time);

  chart.data.datasets[0].borderColor = getColor(d.aqi);
  chart.update();

  gauge.data.datasets[0].data = [d.aqi, 300-d.aqi];
  gauge.data.datasets[0].backgroundColor[0] = getColor(d.aqi);
  gauge.update();

  push(historyRef, { value:d.aqi, time:Date.now() });
});
