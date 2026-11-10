
const API_URL = "https://alpha-squad-cricket-team-website.onrender.com/api/matches";

const matchForm = document.getElementById("matchForm");
const matchesContainer = document.getElementById("matchesContainer");
const message = document.getElementById("message");

async function loadAdminMatches() {
    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("Unable to load matches");
        }

        const matches = await response.json();

        matchesContainer.innerHTML = "";

        if (matches.length === 0) {
            matchesContainer.textContent = "No matches available.";
            return;
        }

        matches.forEach(match => {
            const card = document.createElement("div");
            card.className = "match-admin-card";

            const details = document.createElement("p");
            details.textContent =
                `Opponent: ${match.opponent} | Date: ${match.matchDate} | ` +
                `Venue: ${match.venue} | Score: ${match.ourScore || "-"} vs ` +
                `${match.opponentScore || "-"} | Result: ${match.result || "-"} | ` +
                `Status: ${match.status || "-"}`;

            const editButton = document.createElement("button");
            editButton.textContent = "Edit";
            editButton.onclick = () => editMatch(match);

            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Delete";
            deleteButton.onclick = () => deleteMatch(match.matchId);

            card.append(details, editButton, deleteButton);
            matchesContainer.appendChild(card);
        });

    } catch (error) {
        matchesContainer.textContent = error.message;
    }
}

matchForm.addEventListener("submit", async function(event) {
    event.preventDefault();

    const id = document.getElementById("matchId").value;

    const match = {
        opponent: document.getElementById("opponent").value,
        matchDate: document.getElementById("matchDate").value,
        matchTime: document.getElementById("matchTime").value || null,
        venue: document.getElementById("venue").value,
        ourScore: document.getElementById("ourScore").value,
        opponentScore: document.getElementById("opponentScore").value,
        result: document.getElementById("result").value,
        status: document.getElementById("status").value
    };

    try {
        const response = await fetch(
            id ? `${API_URL}/${id}` : API_URL,
            {
                method: id ? "PUT" : "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(match)
            }
        );

        if (!response.ok) {
            throw new Error("Unable to save match. Check the backend.");
        }

        message.textContent = id
            ? "Match updated successfully!"
            : "Match added successfully!";

        resetMatchForm();
        loadAdminMatches();

    } catch (error) {
        message.textContent = error.message;
    }
});

function editMatch(match) {
    document.getElementById("matchId").value = match.matchId;
    document.getElementById("opponent").value = match.opponent;
    document.getElementById("matchDate").value = match.matchDate || "";
    document.getElementById("matchTime").value = match.matchTime || "";
    document.getElementById("venue").value = match.venue || "";
    document.getElementById("ourScore").value = match.ourScore || "";
    document.getElementById("opponentScore").value = match.opponentScore || "";
    document.getElementById("result").value = match.result || "";
    document.getElementById("status").value = match.status || "Upcoming";

    document.getElementById("formTitle").textContent = "Edit Match";
    document.getElementById("saveButton").textContent = "Update Match";

    window.scrollTo({ top: 0, behavior: "smooth" });
}

async function deleteMatch(id) {
    if (!confirm("Are you sure you want to delete this match?")) {
        return;
    }

    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "DELETE"
        });

        if (!response.ok) {
            throw new Error("Unable to delete match.");
        }

        message.textContent = "Match deleted successfully!";
        loadAdminMatches();

    } catch (error) {
        message.textContent = error.message;
    }
}

function resetMatchForm() {
    matchForm.reset();
    document.getElementById("matchId").value = "";
    document.getElementById("formTitle").textContent = "Add New Match";
    document.getElementById("saveButton").textContent = "Add Match";
}

loadAdminMatches();
