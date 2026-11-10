
const API_URL = "http://localhost:8080/api/news";
const UPLOAD_API = "http://localhost:8080/api/upload/image";
const SERVER_URL = "http://localhost:8080";

const newsForm = document.getElementById("newsForm");
const newsContainer = document.getElementById("newsContainer");
const newsStatus = document.getElementById("newsStatus");

const newsPhoto = document.getElementById("newsPhoto");
const photoPreview = document.getElementById("photoPreview");

// Stores the existing photo while editing
let currentImageUrl = "";

// Convert image path into a complete URL
function getNewsImageUrl(imageUrl) {

    if (!imageUrl) {
        return "";
    }

    return imageUrl.startsWith("http")
        ? imageUrl
        : SERVER_URL + imageUrl;
}


// Preview selected photo
newsPhoto.addEventListener("change", function() {

    const file = newsPhoto.files[0];

    if (file) {

        if (!file.type.startsWith("image/")) {
            newsStatus.textContent = "Please select a valid image.";
            newsPhoto.value = "";
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            newsStatus.textContent = "Image size must be below 5 MB.";
            newsPhoto.value = "";
            return;
        }

        photoPreview.src = URL.createObjectURL(file);
        photoPreview.style.display = "block";

        newsStatus.textContent = "";
    }
});


// Upload photo to Spring Boot
async function uploadNewsPhoto(file) {

    const formData = new FormData();

    formData.append("file", file);

    const response = await fetch(UPLOAD_API, {
        method: "POST",
        body: formData
    });

    if (!response.ok) {
        throw new Error("News photo upload failed");
    }

    const result = await response.json();

    return result.imageUrl;
}


// Load existing news
async function loadNews() {

    try {

        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("Unable to load news");
        }

        const newsList = await response.json();

        newsContainer.replaceChildren();

        if (newsList.length === 0) {
            newsContainer.textContent = "No news articles available.";
            return;
        }

        newsList.forEach(news => {

            const card = document.createElement("div");
            card.className = "admin-card";

            // Display news photo
            if (news.imageUrl) {

                const image = document.createElement("img");

                image.src = getNewsImageUrl(news.imageUrl);
                image.alt = news.title;
                image.style.width = "200px";
                image.style.height = "130px";
                image.style.objectFit = "cover";
                image.style.borderRadius = "8px";

                card.appendChild(image);
            }

            const title = document.createElement("h3");
            title.textContent = news.title;

            const description = document.createElement("p");
            description.textContent = news.description;

            const date = document.createElement("p");
            date.textContent =
                "Published: " + (news.publishedDate || "");

            const editButton = document.createElement("button");
            editButton.textContent = "Edit";
            editButton.onclick = () => editNews(news);

            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Delete";
            deleteButton.onclick = () => deleteNews(news.newsId);

            card.append(
                title,
                description,
                date,
                editButton,
                deleteButton
            );

            newsContainer.appendChild(card);
        });

    } catch (error) {

        console.error(error);

        newsContainer.textContent =
            "Error loading news. Check the browser Console.";
    }
}


// Add or update news
newsForm.addEventListener("submit", async function(event) {

    event.preventDefault();

    const id = document.getElementById("newsId").value;

    const saveButton = document.getElementById("saveButton");

    try {

        saveButton.disabled = true;
        saveButton.textContent = "Saving...";

        let imageUrl = currentImageUrl;

        // Upload new photo if selected
        const selectedFile = newsPhoto.files[0];

        if (selectedFile) {
            imageUrl = await uploadNewsPhoto(selectedFile);
        }

        const news = {

            title: document.getElementById("title").value.trim(),

            description:
                document.getElementById("description").value.trim(),

            imageUrl: imageUrl,

            publishedDate:
                document.getElementById("publishedDate").value
        };

        const response = await fetch(
            id ? `${API_URL}/${id}` : API_URL,
            {
                method: id ? "PUT" : "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(news)
            }
        );

        if (!response.ok) {
            throw new Error("Unable to save news");
        }

        newsStatus.textContent = id
            ? "News updated successfully!"
            : "News added successfully!";

        clearForm();

        await loadNews();

    } catch (error) {

        console.error(error);

        newsStatus.textContent =
            "Error saving news. Check the browser Console.";

    } finally {

        saveButton.disabled = false;

        saveButton.textContent =
            document.getElementById("newsId").value
                ? "Update News"
                : "Add News";
    }
});


// Edit existing news
function editNews(news) {

    document.getElementById("newsId").value = news.newsId;

    document.getElementById("title").value = news.title;

    document.getElementById("description").value =
        news.description;

    document.getElementById("publishedDate").value =
        news.publishedDate || "";

    currentImageUrl = news.imageUrl || "";

    newsPhoto.value = "";

    if (currentImageUrl) {

        photoPreview.src =
            getNewsImageUrl(currentImageUrl);

        photoPreview.style.display = "block";

    } else {

        photoPreview.style.display = "none";
    }

    document.getElementById("formTitle").textContent =
        "Edit News";

    document.getElementById("saveButton").textContent =
        "Update News";

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


// Delete news
async function deleteNews(id) {

    if (!confirm("Are you sure you want to delete this news article?")) {
        return;
    }

    try {

        const response = await fetch(`${API_URL}/${id}`, {
            method: "DELETE"
        });

        if (!response.ok) {
            throw new Error("Unable to delete news");
        }

        newsStatus.textContent =
            "News deleted successfully!";

        await loadNews();

    } catch (error) {

        console.error(error);

        newsStatus.textContent =
            "Error deleting news.";
    }
}


// Clear form
function clearForm() {

    newsForm.reset();

    document.getElementById("newsId").value = "";

    document.getElementById("formTitle").textContent =
        "Add New News";

    document.getElementById("saveButton").textContent =
        "Add News";

    currentImageUrl = "";

    photoPreview.src = "";
    photoPreview.style.display = "none";

}


// Clear button
document.getElementById("clearButton").addEventListener(
    "click",
    clearForm
);


// Load news when page opens
loadNews();
