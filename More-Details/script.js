const API_KEY = "d21f10991a75693df2e960814094b901";
const BASE_URL = "https://api.themoviedb.org/3";

const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");

const trailerButton = document.getElementById("trailerButton");

const playButton = document.getElementById("playButton");

const listButton = document.getElementById("listButton");

const tabs = document.querySelectorAll(".tab");

const tabContents = document.querySelectorAll(".tab-content");


// SEARCH BUTTON
searchButton.addEventListener("click", function () {
    const movieName = searchInput.value.trim();

    if (!movieName) {
        alert("Please type a movie name");
        return;
    }

    searchMovie(movieName);
});

// SEARCH WHEN ENTER IS PRESSED
searchInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        searchButton.click();
    }
});

// SEARCH MOVIE USING API
async function searchMovie(movieName) {
    try {
        const url = `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(movieName)}`;

        const response = await fetch(url);
        const data = await response.json();

        if (data.results && data.results.length > 0) {
            const movie = data.results[0];

            document.getElementById("movieTitle").textContent = movie.title;
            document.getElementById("movieRating").textContent = movie.vote_average
                ? movie.vote_average.toFixed(1)
                : "N/A";
            document.getElementById("movieYear").textContent = movie.release_date
                ? movie.release_date.split("-")[0]
                : "N/A";
        } else {
            alert("Movie not found");
        }
    } catch (error) {
        console.error(error);
        alert("Something went wrong with the API");
    }
}


// WATCH TRAILER BUTTON

trailerButton.addEventListener("click", function () {

    window.open(
        "https://www.youtube.com/results?search_query=Dune+Part+Two+trailer",
        "_blank"
    );

});


// PLAY BUTTON

playButton.addEventListener("click", function () {

    window.open(
        "https://www.youtube.com/results?search_query=Dune+Part+Two+official+trailer",
        "_blank"
    );

});

// MY LIST BUTTON

let addedToList = false;

listButton.addEventListener("click", function () {

    if (addedToList === false) {

        listButton.textContent = "✓ Added to My List";

        addedToList = true;

    } else {

        listButton.textContent = "＋ My List";

        addedToList = false;

    }

});

// TABS

tabs.forEach(function (tab) {

    tab.addEventListener("click", function () {

        // Remove active from every button

        tabs.forEach(function (button) {

            button.classList.remove("active");

        });


        // Add active to clicked button

        tab.classList.add("active");


        // Hide every section

        tabContents.forEach(function (content) {

            content.classList.add("hidden");

        });


        // Get the section we want

        const tabName = tab.getAttribute("data-tab");

        const selectedContent =
            document.getElementById(tabName);


        // Show selected section

        selectedContent.classList.remove("hidden");

    });

});



// SIMILAR MOVIE CLICK

const similarMovies =
    document.querySelectorAll(".similar-movie");


similarMovies.forEach(function (movie) {

    movie.addEventListener("click", function () {

        const movieTitle =
            movie.querySelector("h3").textContent;

        searchInput.value = movieTitle;

        searchMovie(movieTitle);

    });

});



// VIEW CAST

document.getElementById("viewCast")
    .addEventListener("click", function () {

        document.querySelector('[data-tab="cast"]').click();

    });

// VIEW SIMILAR MOVIES

document.getElementById("viewSimilar")
    .addEventListener("click", function () {

        document.querySelector('[data-tab="similar"]').click();

    });