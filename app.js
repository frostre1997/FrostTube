// Using a public, free Piped API instance
const API_BASE = "https://pipedapi.kavin.rocks";

const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const videoGrid = document.getElementById('video-grid');
const watchContainer = document.getElementById('watch-container');
const videoPlayer = document.getElementById('video-player');
const videoTitle = document.getElementById('video-title');
const closePlayer = document.getElementById('close-player');

// Fetch videos from API based on query
async function searchVideos() {
    const query = searchInput.value.trim();
    if (!query) return;

    // Switch back to grid view if player is open
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

// Render video cards into the grid layout
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

// Inject video source into the iframe player and handle layouts
function playVideo(id, title) {
    videoPlayer.src = `https://piped.kavin.rocks/embed/${id}`;
    videoTitle.textContent = title;
    
    videoGrid.classList.add('hidden'); 
    watchContainer.classList.remove('hidden'); 
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Close player and return to grid
closePlayer.addEventListener('click', () => {
    watchContainer.classList.add('hidden');
    videoGrid.classList.remove('hidden'); 
    videoPlayer.src = ""; 
});

// Event listeners
searchBtn.addEventListener('click', searchVideos);
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') searchVideos();
});
            
