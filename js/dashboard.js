import { db } from "./firebase.js";
import { ref, onValue } from
  "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

const dataRef = ref(db, "helmet_01/live_data");

onValue(dataRef, (snapshot) => {
  const data = snapshot.val();
  if (!data) return;

  if (document.getElementById("aqiValue"))
    document.getElementById("aqiValue").innerText = data.aqi ?? "--";

  // aqiStatus removed in new theme

  if (document.getElementById("battery"))
    document.getElementById("battery").innerText = data.battery + "%";

  if (document.getElementById("fan"))
    document.getElementById("fan").innerText = data.fan_status ?? "--";

  if (document.getElementById("accident"))
    document.getElementById("accident").innerText =
      data.accident_detected ? "Collision Detected" : "ALL SYSTEMS SAFE";

  // Update colors dynamically based on safety
  const accidentEl = document.getElementById("accident");
  if (accidentEl) {
    accidentEl.style.color = data.accident_detected ? "#f87171" : "#34d399";
  }
});
