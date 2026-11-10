
const API_URL = "https://alpha-squad-cricket-team-website.onrender.com/api";

let editingStatId = null;

// Load players into the dropdown
async function loadPlayersDropdown() {
    const playerSelect = document.getElementById("playerId");

    try {
        const response = await fetch(`${API_URL}/players`);

        if (!response.ok) {
            throw new Error("Unable to load players");
        }

        const players = await response.json();

        playerSelect.innerHTML = '<option value="">Select Player</option>';

        players.forEach(player => {
            const option = document.createElement("option");
            option.value = player.playerId;
            option.textContent = player.name;
            playerSelect.appendChild(option);
        });

    } catch (error) {
        console.error(error);
        document.getElementById("statisticsMessage").textContent =
            "Unable to load players.";
    }
}

// Load existing statistics
async function loadStatistics() {
    const container = document.getElementById("statisticsContainer");

    try {
        const [statsResponse, playersResponse] = await Promise.all([
            fetch(`${API_URL}/statistics`),
            fetch(`${API_URL}/players`)
        ]);

        if (!statsResponse.ok || !playersResponse.ok) {
            throw new Error("Unable to load statistics");
        }

        const statistics = await statsResponse.json();
        const players = await playersResponse.json();

        container.innerHTML = "";

        if (statistics.length === 0) {
            container.textContent = "No statistics available.";
            return;
        }

        statistics.forEach(stat => {
            const player = players.find(
                p => Number(p.playerId) === Number(stat.playerId)
            );

            const card = document.createElement("div");
            card.className = "admin-card";

            const heading = document.createElement("h3");
            heading.textContent = player ? player.name : "Unknown Player";

            const details = document.createElement("p");
            details.textContent =
                `Matches: ${stat.matchesPlayed} | Runs: ${stat.runs} | ` +
                `Average: ${stat.battingAverage ?? "-"} | ` +
                `Highest Score: ${stat.highestScore} | ` +
                `Wickets: ${stat.wickets} | Economy: ${stat.economy ?? "-"} | ` +
                `Best Bowling: ${stat.bestBowling ?? "-"}`;

            const editButton = document.createElement("button");
            editButton.textContent = "Edit";
            editButton.addEventListener("click", () => editStatistics(stat));

            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Delete";
            deleteButton.addEventListener("click", () =>
                deleteStatistics(stat.statId)
            );

            card.append(heading, details, editButton, deleteButton);
            container.appendChild(card);
        });

    } catch (error) {
        console.error(error);
        container.textContent = "Unable to load statistics. Check Spring Boot.";
    }
}

// Add or update statistics
document.getElementById("statisticsForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    const statistics = {
        playerId: Number(document.getElementById("playerId").value),
        matchesPlayed: Number(document.getElementById("matchesPlayed").value),
        runs: Number(document.getElementById("runs").value),
        battingAverage: Number(document.getElementById("battingAverage").value || 0),
        highestScore: Number(document.getElementById("highestScore").value),
        wickets: Number(document.getElementById("wickets").value),
        economy: Number(document.getElementById("economy").value || 0),
        bestBowling: document.getElementById("bestBowling").value
    };

    const message = document.getElementById("statisticsMessage");

    try {
        const url = editingStatId
            ? `${API_URL}/statistics/${editingStatId}`
            : `${API_URL}/statistics`;

        const method = editingStatId ? "PUT" : "POST";

        const response = await fetch(url, {
            method: method,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(statistics)
        });

        if (!response.ok) {
            throw new Error("Unable to save statistics");
        }

        message.textContent = editingStatId
            ? "Statistics updated successfully!"
            : "Statistics added successfully!";

        editingStatId = null;
        this.reset();

        await loadStatistics();

    } catch (error) {
        console.error(error);
        message.textContent = "Error saving statistics. Check the browser Console.";
    }
});

// Edit statistics
function editStatistics(stat) {
    editingStatId = stat.statId;

    document.getElementById("playerId").value = stat.playerId;
    document.getElementById("matchesPlayed").value = stat.matchesPlayed;
    document.getElementById("runs").value = stat.runs;
    document.getElementById("battingAverage").value = stat.battingAverage ?? "";
    document.getElementById("highestScore").value = stat.highestScore;
    document.getElementById("wickets").value = stat.wickets;
    document.getElementById("economy").value = stat.economy ?? "";
    document.getElementById("bestBowling").value = stat.bestBowling ?? "";

    document.getElementById("statisticsMessage").textContent =
        "Editing statistics. Make your changes and click Save Statistics.";
}

// Delete statistics
async function deleteStatistics(id) {
    if (!confirm("Are you sure you want to delete these statistics?")) {
        return;
    }

    try {
        const response = await fetch(`${API_URL}/statistics/${id}`, {
            method: "DELETE"
        });

        if (!response.ok) {
            throw new Error("Unable to delete statistics");
        }

        document.getElementById("statisticsMessage").textContent =
            "Statistics deleted successfully!";

        await loadStatistics();

    } catch (error) {
        console.error(error);
        document.getElementById("statisticsMessage").textContent =
            "Error deleting statistics.";
    }
}

// Clear form and cancel editing
document.getElementById("statisticsForm").addEventListener("reset", function() {
    editingStatId = null;
});

// Initial loading
loadPlayersDropdown();
loadStatistics();
