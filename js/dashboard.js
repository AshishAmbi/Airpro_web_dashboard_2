import { db } from "./firebase.js";
import { ref, onValue } from 
"https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

const dataRef = ref(db, "helmet_01/live_data");

onValue(dataRef, (snapshot) => {
  const data = snapshot.val();
  if (!data) return;

  document.getElementById("aqiValue").innerText = data.aqi ?? "--";
  document.getElementById("aqiStatus").innerText = data.air_status ?? "--";
  document.getElementById("battery").innerText = data.battery + "%";
  document.getElementById("fan").innerText = data.fan_status ?? "--";
  document.getElementById("accident").innerText =
    data.accident_detected ? "Accident Detected" : "Safe";
});
