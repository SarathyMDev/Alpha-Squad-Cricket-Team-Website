
const GALLERY_API = "http://localhost:8080/api/gallery";
const UPLOAD_API = "http://localhost:8080/api/upload/image";
const SERVER_URL = "http://localhost:8080";

const galleryForm = document.getElementById("galleryForm");
const galleryContainer = document.getElementById("galleryContainer");
const galleryMessage = document.getElementById("galleryMessage");
const imageFileInput = document.getElementById("imageFile");

let editingGalleryId = null;
let currentImageUrl = null;

// Display gallery images
async function loadGallery() {
    try {
        const response = await fetch(GALLERY_API);

        if (!response.ok) {
            throw new Error("Unable to load gallery images.");
        }

        const galleryList = await response.json();

        galleryContainer.innerHTML = "";

        if (galleryList.length === 0) {
            galleryContainer.textContent = "No gallery images available.";
            return;
        }

        galleryList.forEach(item => {
            const card = document.createElement("div");
            card.className = "gallery-card";

            const image = document.createElement("img");

            image.src = item.imageUrl.startsWith("http")
                ? item.imageUrl
                : SERVER_URL + item.imageUrl;

            image.alt = item.title;

            image.onerror = function() {
                this.alt = "Image could not be loaded";
            };

            const title = document.createElement("h3");
            title.textContent = item.title;

            const description = document.createElement("p");
            description.textContent = item.description || "";

            const editButton = document.createElement("button");
            editButton.textContent = "Edit";
            editButton.addEventListener("click", () => editGallery(item));

            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Delete";
            deleteButton.addEventListener("click", () =>
                deleteGallery(item.galleryId)
            );

            card.append(
                image,
                title,
                description,
                editButton,
                deleteButton
            );

            galleryContainer.appendChild(card);
        });

    } catch (error) {
        console.error(error);
        galleryContainer.textContent = error.message;
    }
}

// Upload selected image to Spring Boot
async function uploadImage(file) {

    if (!file) {
        throw new Error("Please select an image.");
    }

    if (!file.type.startsWith("image/")) {
        throw new Error("Please select a valid image file.");
    }

    if (file.size > 5 * 1024 * 1024) {
        throw new Error("Image size must be less than 5 MB.");
    }

    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(UPLOAD_API, {
        method: "POST",
        body: formData
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message || "Image upload failed.");
    }

    return result.imageUrl;
}

// Add or update gallery image

galleryForm.addEventListener("submit", async function(event) {
    event.preventDefault();

    const title = document.getElementById("title").value.trim();
    const description = document.getElementById("description").value.trim();

    const imageFiles = document.getElementById("imageFiles").files;

    try {
        if (!title) {
            throw new Error("Please enter a title.");
        }

        // EDIT EXISTING IMAGE
        if (editingGalleryId) {

            let imageUrl = currentImageUrl;

            // Upload replacement image if selected
            if (imageFiles.length > 0) {
                if (imageFiles.length > 1) {
                    throw new Error("Select only one replacement image while editing.");
                }

                imageUrl = await uploadImage(imageFiles[0]);
            }

            const gallery = {
                title,
                description,
                imageUrl
            };

            const response = await fetch(
                `${GALLERY_API}/${editingGalleryId}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(gallery)
                }
            );

            if (!response.ok) {
                throw new Error("Unable to update gallery image.");
            }

            galleryMessage.textContent = "Gallery image updated successfully!";
        }

        // ADD MULTIPLE IMAGES
        else {

            if (imageFiles.length === 0) {
                throw new Error("Please select at least one image.");
            }

            for (const file of imageFiles) {

                const imageUrl = await uploadImage(file);

                const gallery = {
                    title: title,
                    description: description,
                    imageUrl: imageUrl
                };

                const response = await fetch(GALLERY_API, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(gallery)
                });

                if (!response.ok) {
                    throw new Error("Unable to save " + file.name);
                }
            }

            galleryMessage.textContent =
                imageFiles.length + " images uploaded successfully!";
        }

        resetGalleryForm();
        await loadGallery();

    } catch (error) {
        console.error(error);
        galleryMessage.textContent = error.message;
    }
});


// Edit gallery image
function editGallery(item) {

    editingGalleryId = item.galleryId;
    currentImageUrl = item.imageUrl;

    document.getElementById("galleryId").value = item.galleryId;
    document.getElementById("title").value = item.title;
    document.getElementById("description").value = item.description || "";

    imageFileInput.value = "";

    document.getElementById("formTitle").textContent =
        "Edit Gallery Image";

    document.getElementById("saveButton").textContent = "Update Image";

    window.scrollTo({ top: 0, behavior: "smooth" });
}

// Delete gallery image
async function deleteGallery(id) {

    if (!confirm("Are you sure you want to delete this gallery image?")) {
        return;
    }

    try {

        const response = await fetch(`${GALLERY_API}/${id}`, {
            method: "DELETE"
        });

        if (!response.ok) {
            throw new Error("Unable to delete image.");
        }

        galleryMessage.textContent =
            "Gallery image deleted successfully!";

        if (editingGalleryId === id) {
            resetGalleryForm();
        }

        await loadGallery();

    } catch (error) {
        console.error(error);
        galleryMessage.textContent = error.message;
    }
}

// Clear form
function resetGalleryForm() {

    galleryForm.reset();
    editingGalleryId = null;
    currentImageUrl = null;

    document.getElementById("galleryId").value = "";

    document.getElementById("formTitle").textContent =
        "Add Gallery Image";

    document.getElementById("saveButton").textContent =
        "Add Image";

    document.getElementById("imageFiles").value = "";    
}

// Clear button
document.getElementById("clearButton").addEventListener(
    "click",
    resetGalleryForm
);

// Initial loading
loadGallery();
