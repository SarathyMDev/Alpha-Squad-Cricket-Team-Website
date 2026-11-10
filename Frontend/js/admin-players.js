
const API_URL = "https://alpha-squad-cricket-team-website.onrender.com/api/players";
const UPLOAD_API = "https://alpha-squad-cricket-team-website.onrender.com/api/upload/image";
const SERVER_URL = "https://alpha-squad-cricket-team-website.onrender.com";

const playerForm = document.getElementById("playerForm");
const playersTableBody = document.getElementById("playersTableBody");
const statusMessage = document.getElementById("statusMessage");

const playerIdInput = document.getElementById("playerId");
const nameInput = document.getElementById("name");
const roleInput = document.getElementById("role");
const jerseyNumberInput = document.getElementById("jerseyNumber");
const battingStyleInput = document.getElementById("battingStyle");
const bowlingStyleInput = document.getElementById("bowlingStyle");

const playerPhotoInput = document.getElementById("playerPhoto");
const photoPreview = document.getElementById("photoPreview");

const saveButton = document.getElementById("saveButton");
const cancelButton = document.getElementById("cancelButton");

let players = [];
let currentImageUrl = null;

// Display messages
function showMessage(message, isError = false) {
    statusMessage.textContent = message;
    statusMessage.style.color = isError ? "red" : "green";
}

// Escape HTML
function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[character]);
}

// Get correct image URL
function getPlayerImageUrl(imageUrl) {
    if (!imageUrl) return "";

    return imageUrl.startsWith("http")
        ? imageUrl
        : SERVER_URL + (
            imageUrl.startsWith("/") ? imageUrl : "/" + imageUrl
        );
}

// Upload player photo
async function uploadPlayerPhoto(file) {

    if (!file.type.startsWith("image/")) {
        throw new Error("Please select a valid image.");
    }

    if (file.size > 5 * 1024 * 1024) {
        throw new Error("Photo size must be less than 5 MB.");
    }

    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(UPLOAD_API, {
        method: "POST",
        body: formData
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message || "Photo upload failed.");
    }

    return result.imageUrl;
}

// Preview selected photo
playerPhotoInput.addEventListener("change", function() {

    const file = this.files[0];

    if (!file) {
        photoPreview.style.display = "none";
        return;
    }

    if (!file.type.startsWith("image/")) {
        showMessage("Please select a valid image.", true);
        this.value = "";
        photoPreview.style.display = "none";
        return;
    }

    if (file.size > 5 * 1024 * 1024) {
        showMessage("Photo size must be less than 5 MB.", true);
        this.value = "";
        photoPreview.style.display = "none";
        return;
    }

    photoPreview.src = URL.createObjectURL(file);
    photoPreview.style.display = "block";
});

// Load players
async function loadPlayers() {

    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("Could not load players.");
        }

        players = await response.json();
        displayPlayers();

    } catch (error) {

        playersTableBody.innerHTML =
            '<tr><td colspan="8">Unable to load players. Check Spring Boot.</td></tr>';

        showMessage(error.message, true);
    }
}

// Display players in table
function displayPlayers() {

    if (players.length === 0) {
        playersTableBody.innerHTML =
            '<tr><td colspan="8">No players found.</td></tr>';
        return;
    }

    playersTableBody.innerHTML = players.map(player => {

        const photoUrl = getPlayerImageUrl(player.imageUrl);

        return `
            <tr>
                <td>${escapeHTML(player.playerId)}</td>

                <td>
                    ${
                        photoUrl
                        ? `<img src="${escapeHTML(photoUrl)}"
                            alt="Player photo"
                            style="width:60px;height:60px;object-fit:cover;border-radius:50%;">`
                        : "No photo"
                    }
                </td>

                <td>${escapeHTML(player.name)}</td>
                <td>${escapeHTML(player.role)}</td>
                <td>${escapeHTML(player.jerseyNumber)}</td>
                <td>${escapeHTML(player.battingStyle)}</td>
                <td>${escapeHTML(player.bowlingStyle)}</td>

                <td>
                    <button class="edit-btn"
                        data-action="edit"
                        data-id="${Number(player.playerId)}">
                        Edit
                    </button>

                    <button class="delete-btn"
                        data-action="delete"
                        data-id="${Number(player.playerId)}">
                        Delete
                    </button>
                </td>
            </tr>
        `;
    }).join("");
}

// Add or update player
playerForm.addEventListener("submit", async function(event) {

    event.preventDefault();

    const id = playerIdInput.value;

    const player = {
        name: nameInput.value.trim(),
        role: roleInput.value,
        jerseyNumber: Number(jerseyNumberInput.value),
        battingStyle: battingStyleInput.value.trim(),
        bowlingStyle: bowlingStyleInput.value.trim(),
        imageUrl: currentImageUrl
    };

    try {

        saveButton.disabled = true;

        // Upload a newly selected photo
        const selectedPhoto = playerPhotoInput.files[0];

        if (selectedPhoto) {
            player.imageUrl = await uploadPlayerPhoto(selectedPhoto);
        }

        if (!id && !player.imageUrl) {
            throw new Error("Please select a player profile photo.");
        }

        const url = id ? `${API_URL}/${id}` : API_URL;
        const method = id ? "PUT" : "POST";

        const response = await fetch(url, {
            method: method,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(player)
        });

        if (!response.ok) {
            throw new Error("Could not save player. Check the API.");
        }

        showMessage(id
            ? "Player updated successfully!"
            : "Player added successfully!"
        );

        resetForm();
        await loadPlayers();

    } catch (error) {
        console.error(error);
        showMessage(error.message, true);

    } finally {
        saveButton.disabled = false;
    }
});

// Edit and Delete buttons
playersTableBody.addEventListener("click", async function(event) {

    const button = event.target.closest("button[data-action]");

    if (!button) return;

    const id = Number(button.dataset.id);
    const action = button.dataset.action;

    const player = players.find(
        item => Number(item.playerId) === id
    );

    if (!player) return;

    // Edit player
    if (action === "edit") {

        playerIdInput.value = player.playerId;
        nameInput.value = player.name ?? "";
        roleInput.value = player.role ?? "";
        jerseyNumberInput.value = player.jerseyNumber ?? "";
        battingStyleInput.value = player.battingStyle ?? "";
        bowlingStyleInput.value = player.bowlingStyle ?? "";

        currentImageUrl = player.imageUrl || null;

        playerPhotoInput.value = "";

        if (currentImageUrl) {
            photoPreview.src = getPlayerImageUrl(currentImageUrl);
            photoPreview.style.display = "block";
        } else {
            photoPreview.style.display = "none";
        }

        document.getElementById("formTitle").textContent = "Edit Player";

        saveButton.textContent = "Update Player";
        cancelButton.hidden = false;

        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    // Delete player
    if (action === "delete") {

        const confirmed = confirm(
            `Are you sure you want to delete ${player.name}?`
        );

        if (!confirmed) return;

        try {

            const response = await fetch(`${API_URL}/${id}`, {
                method: "DELETE"
            });

            if (!response.ok) {
                throw new Error("Could not delete player.");
            }

            showMessage("Player deleted successfully!");

            await loadPlayers();

        } catch (error) {
            showMessage(error.message, true);
        }
    }
});

// Cancel editing
cancelButton.addEventListener("click", resetForm);

// Reset form
function resetForm() {

    playerForm.reset();

    playerIdInput.value = "";
    currentImageUrl = null;

    photoPreview.src = "";
    photoPreview.style.display = "none";

    document.getElementById("formTitle").textContent =
        "Add New Player";

    saveButton.textContent = "Add Player";
    cancelButton.hidden = true;
}

// Initial loading
loadPlayers();
