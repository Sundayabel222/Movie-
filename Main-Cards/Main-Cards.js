const apiKey = 'd21f10991a75693df2e960814094b901';
const trendingUrl = `https://api.themoviedb.org/3/trending/movie/week?api_key=${apiKey}`;
const topRatedUrl = `https://api.themoviedb.org/3/movie/top_rated?api_key=${apiKey}`;
const upcomingUrl = `https://api.themoviedb.org/3/movie/upcoming?api_key=${apiKey}`;

async function fetchMovies(url, containerId) {
    try {
        const response = await fetch(url);
        const data = await response.json();
        const container = document.getElementById(containerId);
        
        container.innerHTML = '';

        data.results.forEach(movie => {
            const posterPath = movie.poster_path 
                ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` 
                : 'https://via.placeholder.com/160x235?text=No+Image';
            
            const releaseYear = movie.release_date ? movie.release_date.split('-')[0] : 'N/A';
            const rating = movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A';

            const card = document.createElement('div');
            card.className = 'movie-card';
            card.innerHTML = `
                <div class="poster-container">
                    <button class="favorite-btn">♡</button>
                    <img src="${posterPath}" alt="${movie.title}">
                </div>
                <div class="movie-info">
                    <div class="movie-title" title="${movie.title}">${movie.title}</div>
                    <div class="movie-meta">
                        <span class="rating">★ ${rating}</span>
                        <span>${releaseYear}</span>
                    </div>
                </div>
            `;
            container.appendChild(card);
        });
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

fetchMovies(trendingUrl, 'trending-row');
fetchMovies(topRatedUrl, 'top-rated-row');
fetchMovies(upcomingUrl, 'upcoming-row');