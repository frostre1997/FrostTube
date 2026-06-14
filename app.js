const API_BASE = "https://pipedapi.kavin.rocks";

// DOM Elements
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const videoGrid = document.getElementById('video-grid');
const watchContainer = document.getElementById('watch-container');
const videoPlayer = document.getElementById('video-player');
const videoTitle = document.getElementById('video-title');
const closePlayer = document.getElementById('close-player');

// Login DOM Elements
const loginContainer = document.getElementById('login-container');
const usernameInput = document.getElementById('username-input');
const passwordInput = document.getElementById('password-input');
const loginBtn = document.getElementById('login-btn');
const loginError = document.getElementById('login-error');
const userDisplay = document.getElementById('user-display');
const logoutBtn = document.getElementById('logout-btn');

// --- GESTIONE LOGIN LOCALE ---
const ACC_USER = "frostre1997";
const ACC_PASS = "frost123"; // Puoi cambiare questa password direttamente qui nell'editor

function checkAuth() {
    const session = localStorage.getItem("frostTube_session");
    if (session === ACC_USER) {
        loginContainer.classList.add('hidden');
        userDisplay.textContent = ACC_USER;
        videoGrid.innerHTML = "<p class='message'>Bentornato! Cerca un video per iniziare.</p>";
    } else {
        loginContainer.classList.remove('hidden');
        userDisplay.textContent = "Ospite";
    }
}

loginBtn.addEventListener('click', () => {
    const user = usernameInput.value.trim();
    const pass = passwordInput.value;

    if (user === ACC_USER && pass === ACC_PASS) {
        localStorage.setItem("frostTube_session", ACC_USER);
        loginError.classList.add('hidden');
        usernameInput.value = "";
        passwordInput.value = "";
        checkAuth();
    } else {
        loginError.classList.remove('hidden');
    }
});

logoutBtn.addEventListener('click', () => {
    localStorage.removeItem("frostTube_session");
    videoGrid.innerHTML = "<p class='message'>Accedi per iniziare a esplorare!</p>";
    if (!watchContainer.classList.contains('hidden')) {
        watchContainer.classList.add('hidden');
        videoPlayer.src = "";
    }
    checkAuth();
});

// --- LOGICA VIDEO ---
async function searchVideos() {
    if (!localStorage.getItem("frostTube_session")) return;
    
    const query = searchInput.value.trim();
    if (!query) return;

    watchContainer.classList.add('hidden');
    videoGrid.classList.remove('hidden');
    videoPlayer.src = ""; 

    videoGrid.innerHTML = "<p class='message'>Loading videos...</p>";

    try {
        const response = await fetch(`${API_BASE}/search?q=${encodeURIComponent(query)}&filter=videos`);
        const data = await response.json();
        displayVideos(data.streams);
    } catch (error) {
        console.error(error);
        videoGrid.innerHTML = "<p class='message'>Error loading videos. Please try again.</p>";
    }
}

function displayVideos(videos) {
    videoGrid.innerHTML = ""; 

    if (!videos || videos.length === 0) {
        videoGrid.innerHTML = "<p class='message'>No videos found.</p>";
        return;
    }

    videos.forEach(video => {
        const videoCard = document.createElement('div');
        videoCard.className = 'video-card';
        
        const videoId = video.url.split('=')[1];

        videoCard.innerHTML = `
            <img src="${video.thumbnail}" alt="${video.title}">
            <h3>${video.title}</h3>
            <p>${video.uploaderName} • ${video.uploadedDate}</p>
        `;

        videoCard.addEventListener('click', () => {
            playVideo(videoId, video.title);
        });

        videoGrid.appendChild(videoCard);
    });
}

function playVideo(id, title) {
    videoPlayer.src = `https://piped.kavin.rocks/embed/${id}`;
    videoTitle.textContent = title;
    
    videoGrid.classList.add('hidden'); 
    watchContainer.classList.remove('hidden'); 
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

closePlayer.addEventListener('click', () => {
    watchContainer.classList.add('hidden');
    videoGrid.classList.remove('hidden'); 
    videoPlayer.src = ""; 
});

searchBtn.addEventListener('click', searchVideos);
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') searchVideos();
});

// Avvia il controllo della sessione all'apertura della pagina
checkAuth();
            
