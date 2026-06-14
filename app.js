// Trova il nuovo contenitore orizzontale
const watchContainer = document.getElementById('watch-container');

// Modifica la vecchia funzione playVideo
function playVideo(id, title) {
    videoPlayer.src = `https://piped.kavin.rocks/embed/${id}`;
    videoTitle.textContent = title;
    
    videoGrid.classList.add('hidden'); // Nasconde la griglia principale
    watchContainer.classList.remove('hidden'); // Mostra il blocco sdoppiato
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Modifica il pulsante chiudi (Back to Home)
closePlayer.addEventListener('click', () => {
    watchContainer.classList.add('hidden');
    videoGrid.classList.remove('hidden'); // Fa tornare i video di prima
    videoPlayer.src = ""; 
});
