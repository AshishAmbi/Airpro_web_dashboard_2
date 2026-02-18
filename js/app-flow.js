import { refreshMap } from "./map.js";

const views = {
    splash: document.getElementById('splash-view'),
    auth: document.getElementById('auth-view'),
    dashboard: document.getElementById('dashboard-view')
};

const authForm = document.getElementById('auth-form');
const logoutBtn = document.getElementById('logout-btn');

const SPLASH_DURATION = 2500; // 2.5s (Snappy)

function init() {
    const isAuthenticated = sessionStorage.getItem('airpro_session');
    if (isAuthenticated) {
        showDashboard(true);
    } else {
        runSplashSequence();
    }
}

function runSplashSequence() {
    views.splash.classList.remove('hidden');
    views.auth.classList.add('hidden');
    views.dashboard.classList.add('hidden');

    setTimeout(() => {
        views.splash.classList.add('fade-out');
        setTimeout(() => {
            views.splash.classList.add('hidden');
            views.auth.classList.remove('hidden');
        }, 500);
    }, SPLASH_DURATION);
}

function login(e) {
    e.preventDefault();
    const btn = authForm.querySelector('button');
    const originalText = btn.innerText;

    // Tech/Cyber Feel
    btn.innerText = 'AUTHENTICATING...';
    btn.style.opacity = '0.8';

    setTimeout(() => {
        btn.innerText = 'ACCESS GRANTED';
        btn.style.background = '#22c55e'; // Green success

        setTimeout(() => {
            views.auth.classList.add('fade-out');
            sessionStorage.setItem('airpro_session', 'true');

            setTimeout(() => {
                views.auth.classList.add('hidden');
                showDashboard();

                btn.innerText = originalText;
                btn.style.opacity = '1';
                btn.style.background = '';
            }, 500);
        }, 800);
    }, 1200);
}

function showDashboard(skipAnimation = false) {
    views.splash.classList.add('hidden');
    views.auth.classList.add('hidden');
    views.dashboard.classList.remove('hidden');

    if (!skipAnimation) views.dashboard.classList.add('fade-in');

    refreshMap();
}

function logout() {
    sessionStorage.removeItem('airpro_session');
    window.location.reload();
}

document.addEventListener('DOMContentLoaded', init);
authForm.addEventListener('submit', login);
if (logoutBtn) logoutBtn.addEventListener('click', logout);
