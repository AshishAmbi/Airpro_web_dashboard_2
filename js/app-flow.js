// DOM Elements
const views = {
    splash: document.getElementById('splash-view'),
    auth: document.getElementById('auth-view'),
    dashboard: document.getElementById('dashboard-view')
};

const authForm = document.getElementById('auth-form');
const logoutBtn = document.getElementById('logout-btn');

// Configuration
const SPLASH_DURATION = 3500; // 3.5s total (allows for animation)

function init() {
    // Check session
    const isAuthenticated = sessionStorage.getItem('airpro_session');

    if (isAuthenticated) {
        showDashboard(true); // true = skip animation
    } else {
        runSplashSequence();
    }
}

function runSplashSequence() {
    // Ensure splash is visible
    views.splash.classList.remove('hidden');
    views.auth.classList.add('hidden');
    views.dashboard.classList.add('hidden');

    setTimeout(() => {
        // Fade out splash
        views.splash.classList.add('fade-out');
        
        // Wait for fade out to finish, then show auth
        setTimeout(() => {
            views.splash.classList.add('hidden');
            views.auth.classList.remove('hidden');
        }, 500); // match css animation duration

    }, SPLASH_DURATION);
}

function login(e) {
    e.preventDefault();
    
    const btn = authForm.querySelector('button');
    const originalText = btn.innerText;
    
    // Simulate API call
    btn.innerText = 'Verifying...';
    btn.style.opacity = '0.7';
    
    setTimeout(() => {
        // Success
        sessionStorage.setItem('airpro_session', 'true');
        
        // Transition
        views.auth.classList.add('fade-out');
        
        setTimeout(() => {
            views.auth.classList.add('hidden');
            showDashboard();
            
            // Reset button
            btn.innerText = originalText;
            btn.style.opacity = '1';
        }, 500);
        
    }, 1500);
}

function showDashboard(skipAnimation = false) {
    views.splash.classList.add('hidden'); // Ensure splash is gone
    views.auth.classList.add('hidden');   // Ensure auth is gone
    
    views.dashboard.classList.remove('hidden');
    
    if (!skipAnimation) {
        views.dashboard.classList.add('fade-in');
    }
}

function logout() {
    sessionStorage.removeItem('airpro_session');
    window.location.reload();
}

// Event Listeners
document.addEventListener('DOMContentLoaded', init);
authForm.addEventListener('submit', login);
if (logoutBtn) logoutBtn.addEventListener('click', logout);
