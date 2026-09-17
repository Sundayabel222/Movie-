const API_KEY = "d21f10991a75693df2e960814094b901";
const BASE_URL = "https://api.themoviedb.org/3";

// Row URLs
const trendingUrl = `${BASE_URL}/trending/movie/week?api_key=${API_KEY}`;
const topRatedUrl = `${BASE_URL}/movie/top_rated?api_key=${API_KEY}`;
const upcomingUrl = `${BASE_URL}/movie/upcoming?api_key=${API_KEY}`;

// DOM Elements
const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");
const backButton = document.getElementById("backButton");
const homeView = document.getElementById("homeView");
const detailsView = document.getElementById("detailsView");
const tabs = document.querySelectorAll(".tab");
const tabContents = document.querySelectorAll(".tab-content");

// Initialize application on load
window.addEventListener("DOMContentLoaded", () => {
  fetchMovieRows(trendingUrl, "trending-row");
  fetchMovieRows(topRatedUrl, "top-rated-row");
  fetchMovieRows(upcomingUrl, "upcoming-row");

  // Populate the default home hero section 
  loadHeroDefault(693134);
});

// LOAD DEFAULT HERO PREVIEW
async function loadHeroDefault(movieId) {
  try {
    const res = await fetch(`${BASE_URL}/movie/${movieId}?api_key=${API_KEY}`);
    const movie = await res.json();
    if (movie && !movie.status_code) {
      document.getElementById("heroMovieTitle").textContent = movie.title;
      document.getElementById("heroMovieRating").textContent =
        movie.vote_average.toFixed(1);
      document.getElementById("heroVoteCount").textContent =
        `(${movie.vote_count} votes)`;
      document.getElementById("heroMovieYear").textContent =
        movie.release_date.split("-")[0];
      document.getElementById("heroMovieRuntime").textContent =
        `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m`;
      document.getElementById("heroMovieCert").textContent = movie.adult
        ? "R"
        : "PG-13";
      document.getElementById("heroMovieDescription").textContent =
        movie.overview;

      const backdropPath = `https://image.tmdb.org/t/p/original${movie.backdrop_path}`;
      document.getElementById("heroSection").style.backgroundImage =
        `linear-gradient(to right, rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0.2)), url("${backdropPath}")`;

      const genresContainer = document.getElementById("heroGenresContainer");
      genresContainer.innerHTML = "";
      let genresArr = [];
      movie.genres.forEach((g) => {
        genresArr.push(g.name);
        const btn = document.createElement("button");
        btn.textContent = g.name;
        genresContainer.appendChild(btn);
      });
      document.getElementById("heroMovieGenresText").textContent =
        genresArr.join(", ");

      //Trailer
      const query = encodeURIComponent(`${movie.title} trailer`);
      document.getElementById("heroTrailerButton").onclick = () =>
        window.open(
          `https://www.youtube.com/results?search_query=${query}`,
          "_blank",
        );
    }
  } catch (e) {
    console.error(e);
  }
}

// CARD CLICK HANDLING
async function fetchMovieRows(url, containerId) {
  try {
    const response = await fetch(url);
    const data = await response.json();
    const container = document.getElementById(containerId);
    container.innerHTML = "";

    data.results.forEach((movie) => {
      const posterPath = movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : "https://via.placeholder.com/160x235?text=No+Image";

      const releaseYear = movie.release_date
        ? movie.release_date.split("-")[0]
        : "N/A";
      const rating = movie.vote_average ? movie.vote_average.toFixed(1) : "N/A";

      const card = document.createElement("div");
      card.className = "movie-card";
      card.innerHTML = `
                <div class="poster-container">
                    <button class="favorite-btn">♡</button>
                    <img src="${posterPath}" alt="${movie.title}">
                </div>
                <div class="movie-info-card">
                    <div class="movie-title-card" title="${movie.title}">${movie.title}</div>
                    <div class="movie-meta">
                        <span class="rating-tag">★ ${rating}</span>
                        <span>${releaseYear}</span>
                    </div>
                </div>
            `;

      // Clicking card opens FULL DETAILS VIEW for that specific movie
      card.addEventListener("click", (e) => {
        if (e.target.classList.contains("favorite-btn")) {
          e.stopPropagation();
          e.target.textContent = e.target.textContent === "♡" ? "♥" : "♡";
          return;
        }
        openMovieDetailsView(movie.id);
      });

      container.appendChild(card);
    });
  } catch (error) {
    console.error("Error fetching movie row data:", error);
  }
}

// --- SWITCH TO DETAILED VIEW & LOAD DATA ---
async function openMovieDetailsView(movieId) {
  try {
    const res = await fetch(
      `${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&append_to_response=credits,similar`,
    );
    const movie = await res.json();

    if (!movie || movie.status_code === 34) {
      alert("Movie details not found!");
      return;
    }

    // Hide Home View, Show Details View & Back Button
    homeView.classList.add("hidden");
    detailsView.classList.remove("hidden");
    backButton.classList.remove("hidden");
    window.scrollTo({ top: 0, behavior: "smooth" });

    // Reset to Overview tab by default
    tabs.forEach((t) => t.classList.remove("active"));
    document.querySelector('[data-tab="overview"]').classList.add("active");
    tabContents.forEach((c) => c.classList.add("hidden"));
    document.getElementById("overview").classList.remove("hidden");

    // Populate Trailer & Poster image
    const posterImgPath = movie.poster_path
      ? `https://image.tmdb.org/t/p/w780${movie.poster_path}`
      : "https://image.tmdb.org/t/p/w780/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg";
    document.getElementById("trailerImage").src = posterImgPath;

    // Populate Runtime & Release Date
    const runtimeMinutes = movie.runtime || 0;
    const hours = Math.floor(runtimeMinutes / 60);
    const mins = runtimeMinutes % 60;
    document.getElementById("detailRuntime").textContent = runtimeMinutes
      ? `${hours}h ${mins}m`
      : "N/A";
    document.getElementById("detailReleaseDate").textContent =
      movie.release_date || "N/A";

    // Populate Small Genres
    const smallGenresContainer = document.getElementById(
      "detailGenresContainer",
    );
    smallGenresContainer.innerHTML = "";
    if (movie.genres) {
      movie.genres.forEach((genre) => {
        const span = document.createElement("span");
        span.textContent = genre.name;
        smallGenresContainer.appendChild(span);
      });
    }

    // Populate Cast
    const castContainer = document.getElementById("castContainer");
    const fullCastContainer = document.getElementById("fullCastContainer");
    castContainer.innerHTML = "";
    fullCastContainer.innerHTML = "";

    if (movie.credits && movie.credits.cast) {
      movie.credits.cast.slice(0, 12).forEach((actor, index) => {
        const profileImg = actor.profile_path
          ? `https://image.tmdb.org/t/p/w200${actor.profile_path}`
          : "https://via.placeholder.com/200x300?text=No+Image";

        const castCardHTML = `
                    <div class="cast-card">
                        <img src="${profileImg}" alt="${actor.name}">
                        <h4>${actor.name}</h4>
                        <p>${actor.character || ""}</p>
                    </div>
                `;
        if (index < 6) castContainer.innerHTML += castCardHTML;
        fullCastContainer.innerHTML += castCardHTML;
      });
    }

    // Populate Similar Movies
    const similarSidebar = document.getElementById("similarMovies");
    const fullSimilarContainer = document.getElementById(
      "fullSimilarContainer",
    );
    similarSidebar.innerHTML = "";
    fullSimilarContainer.innerHTML = "";

    if (movie.similar && movie.similar.results) {
      movie.similar.results.slice(0, 6).forEach((simMovie, index) => {
        const simPoster = simMovie.poster_path
          ? `https://image.tmdb.org/t/p/w200${simMovie.poster_path}`
          : "https://via.placeholder.com/200x300?text=No+Image";
        const simYear = simMovie.release_date
          ? simMovie.release_date.split("-")[0]
          : "N/A";
        const simRating = simMovie.vote_average
          ? simMovie.vote_average.toFixed(1)
          : "N/A";

        similarSidebar.innerHTML += `
                    <div class="similar-movie" onclick="openMovieDetailsView(${simMovie.id})">
                        <img src="${simPoster}" alt="${simMovie.title}">
                        <div>
                            <h3>${simMovie.title}</h3>
                            <p>${simRating} (${simYear})</p>
                        </div>
                    </div>
                `;

        if (index < 5) {
          fullSimilarContainer.innerHTML += `
                        <div class="movie-card" onclick="openMovieDetailsView(${simMovie.id})">
                            <div class="poster-container">
                                <img src="${simPoster}" alt="${simMovie.title}">
                            </div>
                            <div class="movie-info-card">
                                <div class="movie-title-card">${simMovie.title}</div>
                                <div class="movie-meta">
                                    <span class="rating-tag">★ ${simRating}</span>
                                    <span>${simYear}</span>
                                </div>
                            </div>
                        </div>
                    `;
        }
      });
    }

    // Configure Trailer & Play buttons
    const trailerQuery = encodeURIComponent(`${movie.title} official trailer`);
    document.getElementById("playButton").onclick = () =>
      window.open(
        `https://www.youtube.com/results?search_query=${trailerQuery}`,
        "_blank",
      );
  } catch (error) {
    console.error("Error loading movie details view:", error);
  }
}

// --- BACK BUTTON LOGIC ---
backButton.addEventListener("click", () => {
  detailsView.classList.add("hidden");
  backButton.classList.add("hidden");
  homeView.classList.remove("hidden");
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// --- SEARCH FUNCTIONALITY ---
searchButton.addEventListener("click", function () {
  const query = searchInput.value.trim();
  if (!query) {
    alert("Please type a movie name");
    return;
  }
  searchAndLoadMovie(query);
});

searchInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    searchButton.click();
  }
});

async function searchAndLoadMovie(movieName) {
  try {
    const url = `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(movieName)}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.results && data.results.length > 0) {
      openMovieDetailsView(data.results[0].id);
    } else {
      alert("Movie not found");
    }
  } catch (error) {
    console.error(error);
    alert("Something went wrong with the search API");
  }
}

// --- TAB SWITCHING LOGIC ---
tabs.forEach(function (tab) {
  tab.addEventListener("click", function () {
    tabs.forEach((button) => button.classList.remove("active"));
    tab.classList.add("active");

    tabContents.forEach((content) => content.classList.add("hidden"));

    const tabName = tab.getAttribute("data-tab");
    document.getElementById(tabName).classList.remove("hidden");
  });
});

// Quick view navigations from overview
document.getElementById("viewCast").addEventListener("click", function () {
  document.querySelector('[data-tab="cast"]').click();
});

document.getElementById("viewSimilar").addEventListener("click", function () {
  document.querySelector('[data-tab="similar"]').click();
});
