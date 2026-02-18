import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyDE-pm5B1GkKAU91u_bExMe0h-7FaGznzc",
  authDomain: "airpro-8805e.firebaseapp.com",
  databaseURL: "https://airpro-8805e-default-rtdb.firebaseio.com",
  projectId: "airpro-8805e",
  storageBucket: "airpro-8805e.appspot.com",
  messagingSenderId: "294358062138",
  appId: "1:294358062138:web:31cbc77ca180871215d103"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
