console.log("Cricket Team Website Loaded Successfully!");


/* Contact Form */


// Fetch players from the Spring Boot backend
async function loadPlayers() {

    const playersContainer =
        document.getElementById("playersContainer");

    // Run only on the Players page
    if (!playersContainer) {
        return;
    }

    try {

        const response =
            await fetch("http://localhost:8080/api/players");

        if (!response.ok) {
            throw new Error("Unable to fetch players");
        }

        const players = await response.json();

        playersContainer.replaceChildren();

        if (players.length === 0) {
            playersContainer.textContent = "No players found.";
            return;
        }

        // Create a card for every player
        players.forEach(function(player) {

            const card = document.createElement("div");
            card.className = "player-card";

            // Player photo
            const image = document.createElement("img");
            image.className = "player-image";
            image.alt = player.name + " profile photo";

            if (player.imageUrl) {

                image.src = player.imageUrl.startsWith("http")
                    ? player.imageUrl
                    : "http://localhost:8080" + player.imageUrl;

            } else {

                image.src = "images/default-player.png";

            }

            // Player information
            const info = document.createElement("div");
            info.className = "player-info";

            const name = document.createElement("h3");
            name.textContent = player.name;

            const role = document.createElement("p");
            role.className = "player-role";
            role.textContent =
                player.role || "Role not specified";

            const jersey = document.createElement("p");
            jersey.textContent =
                "Jersey Number: " +
                (player.jerseyNumber ?? "Not specified");

            const batting = document.createElement("p");
            batting.textContent =
                "Batting: " +
                (player.battingStyle || "Not specified");

            const bowling = document.createElement("p");
            bowling.textContent =
                "Bowling: " +
                (player.bowlingStyle || "Not specified");

            info.append(
                name,
                role,
                jersey,
                batting,
                bowling
            );

            card.append(image, info);

            playersContainer.appendChild(card);

        });

    } catch (error) {

        console.error("Error loading players:", error);

        playersContainer.textContent =
            "Unable to load players. Please check whether the backend is running.";

    }
}


// Run when the page loads
document.addEventListener("DOMContentLoaded", loadPlayers);

// Fetch matches from Spring Boot backend
async function loadMatches() {

    const matchesContainer =
        document.getElementById("matchesContainer");

    // Run only on the matches page
    if (!matchesContainer) {
        return;
    }

    try {

        const response =
            await fetch("http://localhost:8080/api/matches");

        if (!response.ok) {
            throw new Error("Unable to fetch matches");
        }

        const matches = await response.json();

        // Remove loading message
        matchesContainer.replaceChildren();

        if (matches.length === 0) {
            matchesContainer.textContent = "No matches available.";
            return;
        }

        // Create match cards
        matches.forEach(function(match) {

            const card = document.createElement("div");
            card.className = "match-card";

            const opponent = document.createElement("h3");
            opponent.textContent = "Our Team vs " + match.opponent;

            const date = document.createElement("p");
            date.textContent = "Date: " +
                (match.matchDate || "Not announced");

            const time = document.createElement("p");
            time.textContent = "Time: " +
                (match.matchTime || "Not announced");

            const venue = document.createElement("p");
            venue.textContent = "Venue: " +
                (match.venue || "Not announced");

            const ourScore = document.createElement("p");
            ourScore.textContent = "Our Score: " +
                (match.ourScore || "Not available");

            const opponentScore = document.createElement("p");
            opponentScore.textContent = "Opponent Score: " +
                (match.opponentScore || "Not available");

            const result = document.createElement("p");
            result.textContent = "Result: " +
                (match.result || "Not available");

            const status = document.createElement("p");
            status.textContent = "Status: " +
                (match.status || "Not specified");

            card.append(
                opponent,
                date,
                time,
                venue,
                ourScore,
                opponentScore,
                result,
                status
            );

            matchesContainer.appendChild(card);

        });

    } catch (error) {

        console.error("Error loading matches:", error);

        matchesContainer.textContent =
            "Unable to load matches. Please check your backend.";
    }
}

// Load matches when the page opens
document.addEventListener("DOMContentLoaded", loadMatches);



// Fetch and display player statistics
async function loadStatistics() {

    const statisticsBody =
        document.getElementById("statisticsBody");

    // Run only on the statistics page
    if (!statisticsBody) {
        return;
    }

    try {

        // Fetch statistics and player information
        const [statisticsResponse, playersResponse] =
            await Promise.all([
                fetch("http://localhost:8080/api/statistics"),
                fetch("http://localhost:8080/api/players")
            ]);

        if (!statisticsResponse.ok || !playersResponse.ok) {
            throw new Error("Unable to fetch data");
        }

        const statistics = await statisticsResponse.json();
        const players = await playersResponse.json();

        // Create a player ID-to-name lookup
        const playerNames = new Map(
            players.map(player => [
                player.playerId,
                player.name
            ])
        );

        // Clear loading message
        statisticsBody.replaceChildren();

        if (statistics.length === 0) {
            const row = document.createElement("tr");
            const cell = document.createElement("td");

            cell.colSpan = 8;
            cell.textContent = "No statistics available.";

            row.appendChild(cell);
            statisticsBody.appendChild(row);
            return;
        }

        // Display every player's statistics
        statistics.forEach(function(stat) {

            const row = document.createElement("tr");

            const values = [
                playerNames.get(stat.playerId) || 
                    "Player ID: " + stat.playerId,
                stat.matchesPlayed,
                stat.runs,
                stat.battingAverage,
                stat.highestScore,
                stat.wickets,
                stat.economy,
                stat.bestBowling
            ];

            values.forEach(function(value) {

                const cell = document.createElement("td");

                cell.textContent =
                    value === null || value === undefined
                        ? "-"
                        : value;

                row.appendChild(cell);
            });

            statisticsBody.appendChild(row);

        });

    } catch (error) {

        console.error("Statistics loading error:", error);

        statisticsBody.replaceChildren();

        const row = document.createElement("tr");
        const cell = document.createElement("td");

        cell.colSpan = 8;
        cell.textContent =
            "Unable to load statistics. Check your backend.";

        row.appendChild(cell);
        statisticsBody.appendChild(row);
    }
}

// Load statistics when the page opens
document.addEventListener("DOMContentLoaded", loadStatistics);



// Connect contact form to Spring Boot API
async function submitContactForm(event) {

    event.preventDefault();

    const contactForm = document.getElementById("contactForm");

   
    const formStatus =
        document.getElementById("formStatus");

    const submitButton =
        document.getElementById("submitButton");

    if (!contactForm || !formStatus || !submitButton) {
        return;
    }

    // Collect form information
    const contactData = {
        name: document.getElementById("name").value.trim(),
        email: document.getElementById("email").value.trim(),
        subject: document.getElementById("subject").value.trim(),
        message: document.getElementById("message").value.trim()
    };

    // Check required fields
    if (!contactData.name ||
        !contactData.email ||
        !contactData.message) {

        formStatus.textContent =
            "Please fill in all required fields.";

        return;
    }

    try {

        submitButton.disabled = true;
        submitButton.textContent = "Sending...";

        formStatus.textContent = "";

        // Send information to Spring Boot
        const response = await fetch(
            "http://localhost:8080/api/contact",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(contactData)
            }
        );

        if (!response.ok) {
            throw new Error(
                "Message submission failed. Please check your details."
            );
        }

        const savedMessage = await response.json();

        console.log("Saved contact message:", savedMessage);

        formStatus.textContent =
            "Your message has been submitted successfully!";

        contactForm.reset();

    } catch (error) {

        console.error("Contact form error:", error);

        formStatus.textContent =
            "Unable to send your message. Please try again.";

    } finally {

        submitButton.disabled = false;
        submitButton.textContent = "Send Message";

    }
}

// Register contact form submit event
document.addEventListener("DOMContentLoaded", function() {

    const contactForm =
        document.getElementById("contactForm");

    if (contactForm) {
        contactForm.addEventListener(
            "submit",
            submitContactForm
        );
    }

});



async function loadPublicNews() {

    const newsContainer =
        document.getElementById("newsContainer");

    if (!newsContainer) {
        return;
    }

    try {

        const response =
            await fetch("http://localhost:8080/api/news");

        if (!response.ok) {
            throw new Error("Unable to fetch news");
        }

        const newsList = await response.json();

        newsContainer.replaceChildren();

        if (newsList.length === 0) {
            newsContainer.textContent = "No news available.";
            return;
        }

        newsList.forEach(news => {

            const card = document.createElement("div");
            card.className = "news-card";

            // Display uploaded news photo
            const image = document.createElement("img");

            if (news.imageUrl) {

                image.src = news.imageUrl.startsWith("http")
                    ? news.imageUrl
                    : "http://localhost:8080" + news.imageUrl;

            } else {

                image.src = "images/default-news.jpg";

            }

            image.alt = news.title;
            image.className = "news-image";

            image.onerror = function() {
                this.style.display = "none";
                console.error("Unable to load news image:", this.src);
            };

            const title = document.createElement("h2");
            title.textContent = news.title;

            const description = document.createElement("p");
            description.textContent = news.description;

            const date = document.createElement("p");
            date.textContent =
                "Published: " + (news.publishedDate || "");

            card.append(image, title, description, date);

            newsContainer.appendChild(card);

        });

    } catch (error) {

        console.error("News loading error:", error);

        newsContainer.textContent =
            "Unable to load news. Please try again later.";
    }
}

document.addEventListener("DOMContentLoaded", loadPublicNews);


async function loadPublicGallery() {
    const galleryContainer = document.getElementById("galleryContainer");

    if (!galleryContainer) return;

    try {
        const response = await fetch("http://localhost:8080/api/gallery");

        if (!response.ok) {
            throw new Error("Failed to load gallery");
        }

        const galleryList = await response.json();

        galleryContainer.innerHTML = "";

        if (galleryList.length === 0) {
            galleryContainer.innerHTML = "<p>No gallery images available.</p>";
            return;
        }

        // Group images using their title
        const albums = {};

        galleryList.forEach(image => {
            const albumName = image.title.trim();

            if (!albums[albumName]) {
                albums[albumName] = [];
            }

            albums[albumName].push(image);
        });

        // Create one card for each album
        Object.keys(albums).forEach(albumName => {

            const photos = albums[albumName];

            const imagePath = photos[0].imageUrl.startsWith("http")
                ? photos[0].imageUrl
                : "http://localhost:8080" + photos[0].imageUrl;

            const card = document.createElement("div");
            card.className = "gallery-card album-card";

            const cover = document.createElement("img");
            cover.src = imagePath;
            cover.alt = albumName;

            const title = document.createElement("h3");
            title.textContent = albumName;

            const count = document.createElement("p");
            count.textContent = photos.length + " Photos";

            const button = document.createElement("button");
            button.textContent = "View Album";

            button.addEventListener("click", () => {
                openGalleryAlbum(albumName, photos);
            });

            card.append(cover, title, count, button);
            galleryContainer.appendChild(card);
        });

    } catch (error) {
        console.error("Gallery loading error:", error);
        galleryContainer.innerHTML = "<p>Unable to load gallery.</p>";
    }
}


// Open album and display all its photos
function openGalleryAlbum(albumName, photos) {

    let modal = document.getElementById("galleryAlbumModal");

    if (!modal) {
        modal = document.createElement("div");
        modal.id = "galleryAlbumModal";
        modal.className = "gallery-modal";
        document.body.appendChild(modal);
    }

    modal.innerHTML = "";

    const content = document.createElement("div");
    content.className = "gallery-modal-content";

    const closeButton = document.createElement("button");
    closeButton.className = "gallery-close";
    closeButton.textContent = "×";
    closeButton.addEventListener("click", () => {
        modal.style.display = "none";
    });

    const heading = document.createElement("h2");
    heading.textContent = albumName;

    const photoGrid = document.createElement("div");
    photoGrid.className = "album-photo-grid";

    photos.forEach(photo => {

        const image = document.createElement("img");

        image.src = photo.imageUrl.startsWith("http")
            ? photo.imageUrl
            : "http://localhost:8080" + photo.imageUrl;

        image.alt = photo.title;

        photoGrid.appendChild(image);
    });

    content.append(closeButton, heading, photoGrid);
    modal.appendChild(content);

    modal.style.display = "flex";

    // Close when clicking outside the album
    modal.onclick = function(event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    };
}

loadPublicGallery();


/* =====================================
   HOME PAGE - LOAD LIVE BACKEND DATA
===================================== */

async function loadHomePage() {

    // Run only on the Home page
    const playerCount = document.getElementById("homePlayerCount");

    if (!playerCount) {
        return;
    }

    const matchCount = document.getElementById("homeMatchCount");
    const winCount = document.getElementById("homeWinCount");
    const lossCount = document.getElementById("homeLossCount");

    const upcomingContainer =
        document.getElementById("homeUpcomingMatches");

    const playersContainer =
        document.getElementById("homePlayersContainer");

    const newsContainer =
        document.getElementById("homeNewsContainer");

    try {

        // Fetch data from backend APIs
        const [playersResponse, matchesResponse, newsResponse] =
            await Promise.all([
                fetch("http://localhost:8080/api/players"),
                fetch("http://localhost:8080/api/matches"),
                fetch("http://localhost:8080/api/news")
            ]);

        if (!playersResponse.ok ||
            !matchesResponse.ok ||
            !newsResponse.ok) {
            throw new Error("Unable to load Home page data");
        }

        const players = await playersResponse.json();
        const matches = await matchesResponse.json();
        const newsList = await newsResponse.json();

        // Calculate team statistics
        // Calculate total wins
        const wins = matches.filter(match =>
         /\b(win|won|victory)\b/i.test(match.result || "")
        ).length;

        // Calculate total losses
        const losses = matches.filter(match =>
        /\b(loss|lost|defeat|defeated)\b/i.test(match.result || "")
        ).length;

        if (playerCount) playerCount.textContent = players.length;
        if (matchCount) matchCount.textContent = matches.length;
        if (winCount) winCount.textContent = wins;
        if (lossCount) lossCount.textContent = losses;


        // Display upcoming matches
        if (upcomingContainer) {

            upcomingContainer.replaceChildren();

            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const upcomingMatches = matches
                .filter(match => {
                    if (!match.matchDate) return false;

                    const matchDate = new Date(match.matchDate);

                    return !isNaN(matchDate.getTime()) &&
                        matchDate >= today &&
                        !/completed|finished/i.test(match.status || "");
                })
                .sort((a, b) =>
                    new Date(a.matchDate) - new Date(b.matchDate)
                )
                .slice(0, 3);

            if (upcomingMatches.length === 0) {
                upcomingContainer.textContent =
                    "No upcoming matches available.";
            }

           
upcomingMatches.forEach(match => {

    const card = document.createElement("div");
    card.className = "home-match-card";

    const status = document.createElement("span");
    status.className = "home-match-status";
    status.textContent = "UPCOMING MATCH";

    // Teams section - text only
    const teams = document.createElement("div");
    teams.className = "home-match-teams";

    const ourTeam = document.createElement("h3");
    ourTeam.className = "home-team-name";
    ourTeam.textContent = "ALPHA SQUAD";

    const versus = document.createElement("span");
    versus.className = "home-match-vs";
    versus.textContent = "VS";

    const opponentTeam = document.createElement("h3");
    opponentTeam.className = "home-team-name";
    opponentTeam.textContent = match.opponent || "OPPONENT";

    teams.append(ourTeam, versus, opponentTeam);

    // Match information
    const details = document.createElement("div");
    details.className = "home-match-details";

    const date = document.createElement("p");
    date.textContent = "📅 " + (match.matchDate || "Date TBA");

    const time = document.createElement("p");
    time.textContent = "🕒 " + (match.matchTime || "Time TBA");

    const venue = document.createElement("p");
    venue.textContent = "📍 " + (match.venue || "Venue TBA");

    details.append(date, time, venue);

    card.append(status, teams, details);
    upcomingContainer.appendChild(card);
});

        }


        // Display featured players
        if (playersContainer) {

            playersContainer.replaceChildren();

            const featuredPlayers = players.slice(0, 4);

            if (featuredPlayers.length === 0) {
                playersContainer.textContent = "No players available.";
            }

            featuredPlayers.forEach(player => {

                const card = document.createElement("div");
                card.className = "player-card";

                const image = document.createElement("img");
                image.className = "player-image";
                image.alt = player.name + " profile photo";

                image.src = player.imageUrl
                    ? (player.imageUrl.startsWith("http")
                        ? player.imageUrl
                        : "http://localhost:8080" + player.imageUrl)
                    : "images/default-player.png";

                const name = document.createElement("h3");
                name.textContent = player.name;

                const role = document.createElement("p");
                role.textContent = player.role || "Player";

                card.append(image, name, role);
                playersContainer.appendChild(card);
            });
        }


        // Display latest news
        if (newsContainer) {

            newsContainer.replaceChildren();

            const latestNews = [...newsList]
                .sort((a, b) =>
                    new Date(b.publishedDate || 0) -
                    new Date(a.publishedDate || 0)
                )
                .slice(0, 3);

            if (latestNews.length === 0) {
                newsContainer.textContent = "No latest news available.";
            }

            latestNews.forEach(news => {

                const card = document.createElement("div");
                card.className = "news-card";

                if (news.imageUrl) {

                    const image = document.createElement("img");

                    image.src = news.imageUrl.startsWith("http")
                        ? news.imageUrl
                        : "http://localhost:8080" + news.imageUrl;

                    image.alt = news.title || "Team news";
                    image.className = "news-image";

                    card.appendChild(image);
                }

                const title = document.createElement("h3");
                title.textContent = news.title || "Team News";

                const description = document.createElement("p");
                description.textContent = news.description || "";

                card.append(title, description);
                newsContainer.appendChild(card);
            });
        }

    } catch (error) {

        console.error("Home page loading error:", error);

        if (upcomingContainer) {
            upcomingContainer.textContent =
                "Unable to load upcoming matches.";
        }

        if (playersContainer) {
            playersContainer.textContent =
                "Unable to load featured players.";
        }

        if (newsContainer) {
            newsContainer.textContent =
                "Unable to load latest news.";
        }
    }
}

// Load Home page data when the page opens
document.addEventListener("DOMContentLoaded", loadHomePage);


async function loadHomeBackground() {
    try {
        const response = await fetch("http://localhost:8080/api/home-settings");

        if (!response.ok) {
            throw new Error("Unable to load homepage background");
        }

        const settings = await response.json();

        const hero = document.getElementById("homeHero");

        if (hero && settings.backgroundImageUrl) {
            const imageUrl = settings.backgroundImageUrl.startsWith("http")
                ? settings.backgroundImageUrl
                : "http://localhost:8080" + settings.backgroundImageUrl;

            hero.style.backgroundImage =
                `linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.55)), url("${imageUrl}")`;

            hero.style.backgroundSize = "cover";
            hero.style.backgroundPosition = "center";
            hero.style.backgroundRepeat = "no-repeat";
        }

    } catch (error) {
        console.error("Homepage background error:", error);
    }
}

document.addEventListener("DOMContentLoaded", loadHomeBackground);


// Load editable homepage text from the backend
async function loadHomepageContent() {
    try {
        const response = await fetch("http://localhost:8080/api/homepage-content");

        if (!response.ok) {
            throw new Error("Failed to load homepage content");
        }

        const content = await response.json();

        // Update Welcome Heading
        const heading = document.getElementById("homeWelcomeHeading");

        if (heading && content.welcomeHeading) {
            heading.textContent = content.welcomeHeading;
            heading.style.whiteSpace = "pre-line";
        }

        // Update Welcome Description
        const description = document.getElementById("homeWelcomeDescription");

        if (description && content.welcomeDescription) {
            description.textContent = content.welcomeDescription;
        }

        // Update Team Announcement
        const announcement = document.getElementById("homeTeamAnnouncement");

        if (announcement) {
            if (content.teamAnnouncement && content.teamAnnouncement.trim() !== "") {
                announcement.textContent = content.teamAnnouncement;
                announcement.style.display = "block";
            } else {
                announcement.style.display = "none";
            }
        }

    } catch (error) {
        console.error("Error loading homepage content:", error);
    }
}




// ==========================================
// LOAD HOMEPAGE STATISTICS
// ==========================================
async function loadHomepageStatistics() {
    try {
        // Load match statistics
        const matchResponse = await fetch(
            "http://localhost:8080/api/matches/statistics"
        );

        if (!matchResponse.ok) {
            throw new Error("Unable to load match statistics");
        }

        const matchData = await matchResponse.json();

        document.getElementById("homeMatchCount").textContent =
            matchData.matchesPlayed ?? 0;

        document.getElementById("homeWinCount").textContent =
            matchData.matchesWon ?? 0;

        document.getElementById("homeLossCount").textContent =
            matchData.matchesLost ?? 0;


        // Load total players
        const playerResponse = await fetch(
            "http://localhost:8080/api/homepage-player-statistics"
        );

        if (!playerResponse.ok) {
            throw new Error("Unable to load player statistics");
        }

        const playerData = await playerResponse.json();

        document.getElementById("homePlayerCount").textContent =
            playerData.totalPlayers ?? 0;


        // Load trophies won
        const trophyResponse = await fetch(
            "http://localhost:8080/api/homepage-statistics"
        );

        if (!trophyResponse.ok) {
            throw new Error("Unable to load trophy statistics");
        }

        const trophyData = await trophyResponse.json();

        document.getElementById("homeTrophyCount").textContent =
            trophyData.trophiesWon ?? 0;

    } catch (error) {
        console.error("Homepage statistics error:", error);
    }
}

// Run when the homepage HTML is ready
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
        loadHomepageContent();
        loadHomepageStatistics();
    });
} else {
    loadHomepageContent();
    loadHomepageStatistics();
}