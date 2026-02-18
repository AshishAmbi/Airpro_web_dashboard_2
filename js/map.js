import { db } from "./firebase.js";
import { ref, onValue } from
    "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

const liveRef = ref(db, "helmet_01/live_data");

// DOM Elements
const overlay = document.getElementById('map-overlay');
const enableBtn = document.getElementById('enable-location-btn');
const dismissBtn = document.getElementById('dismiss-overlay-btn');

// Initialize Map
// Default to Ichalkaranji, Maharashtra
const map = L.map('map').setView([16.6913, 74.4673], 13);

// LIGHT Tiles (CartoDB Positron) - High Visibility
L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 20
}).addTo(map);

// Normal Marker (Cyan)
const neonIcon = L.divIcon({
    className: 'custom-div-icon',
    html: "<div style='background-color:#22d3ee; width: 14px; height: 14px; border-radius: 50%; box-shadow: 0 0 10px #22d3ee, 0 0 20px #22d3ee; border: 2px solid #fff;'></div>",
    iconSize: [20, 20],
    iconAnchor: [10, 10]
});

// CRASH Marker (Red Pulse)
const crashIcon = L.divIcon({
    className: 'crash-div-icon',
    html: "<div style='background-color:#ef4444; width: 20px; height: 20px; border-radius: 50%; box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.4); border: 3px solid #fff; animation: pulse 1s infinite;'></div> <style>@keyframes pulse { 0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); } 70% { box-shadow: 0 0 0 15px rgba(239, 68, 68, 0); } 100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); } }</style>",
    iconSize: [20, 20],
    iconAnchor: [10, 10]
});

let marker = null;
let usingLiveLocation = false;
let watchId = null;

// EVENT LISTENERS
if (enableBtn) {
    enableBtn.addEventListener('click', startTracking);
}
if (dismissBtn) {
    dismissBtn.addEventListener('click', () => {
        if (overlay) overlay.style.display = 'none';
    });
}

function startTracking() {
    if (!navigator.geolocation) {
        alert("Geolocation is not supported by your browser.");
        return;
    }

    enableBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> LOCATING...';

    // Request Permission via Watch
    watchId = navigator.geolocation.watchPosition(
        (position) => {
            // SUCCESS
            if (overlay) overlay.style.display = 'none'; // Hide overlay

            if (usingLiveLocation) return; // Crash mode priority

            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            updateMap(lat, lng, false);
        },
        (error) => {
            // ERROR
            console.warn(error);
            enableBtn.innerHTML = '<i class="fas fa-exclamation-triangle mr-2"></i> DENIED';
            enableBtn.classList.replace('bg-cyan-500', 'bg-red-500');
            enableBtn.classList.replace('hover:bg-cyan-400', 'hover:bg-red-400');
            alert("Location access denied. Please enable permissions in your browser settings to use this feature.");
        },
        { enableHighAccuracy: true }
    );
}


// Firebase Listener (Always active for crash detection, but map updates depend on context)
onValue(liveRef, (snap) => {
    const d = snap.val();
    if (!d) return;

    // PRIORITY: If Accident Detected -> Force Map View
    if (d.accident_detected) {
        usingLiveLocation = true;
        if (overlay) overlay.style.display = 'none'; // Force hide overlay on crash

        const lat = d.latitude || 16.6913;
        const lng = d.longitude || 74.4673;

        updateMap(lat, lng, true); // Accident Mode
        return;
    }
});

function updateMap(lat, lng, isCrash) {
    const newLatLng = new L.LatLng(lat, lng);
    const icon = isCrash ? crashIcon : neonIcon;

    if (!marker) {
        marker = L.marker(newLatLng, { icon: icon }).addTo(map);
        map.setView(newLatLng, 15);
    } else {
        marker.setLatLng(newLatLng);
        marker.setIcon(icon);
    }

    // If Crash: Pan map & Show Popup
    if (isCrash) {
        map.setView(newLatLng, 16);
        const googleMapsLink = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;

        marker.bindPopup(`
            <div style="text-align:center; color:#111;">
                <h3 style="color:#ef4444; font-weight:bold; margin:0 0 5px 0;">⚠️ ACCIDENT DETECTED</h3>
                <p style="margin:0 0 10px 0; font-size:12px;">Immediate assistance required.</p>
                <a href="${googleMapsLink}" target="_blank" 
                   style="background:#ef4444; color:#fff; padding:6px 12px; text-decoration:none; border-radius:4px; font-weight:bold; font-size:12px; display:inline-block;">
                   NAVIGATE TO LOCATION
                </a>
            </div>
        `).openPopup();
    }
}

export function refreshMap() {
    setTimeout(() => { map.invalidateSize(); }, 200);
}
