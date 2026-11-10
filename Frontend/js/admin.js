const adminLoginForm = document.getElementById("adminLoginForm");

if (adminLoginForm) {
    adminLoginForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const username = document.getElementById("username").value.trim();
        const password = document.getElementById("password").value;
        const loginStatus = document.getElementById("loginStatus");
        const loginButton = document.getElementById("loginButton");

        loginButton.disabled = true;
        loginStatus.textContent = "Checking login details...";
        loginStatus.style.color = "#333";

        try {
            const response = await fetch(
                "http://localhost:8080/api/auth/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        username: username,
                        password: password
                    })
                }
            );

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || "Invalid username or password.");
            }

            loginStatus.textContent = "Login successful!";
            loginStatus.style.color = "green";

            // The dashboard will be created in the next step.
            window.location.href = "admin-dashboard.html";

        } catch (error) {
            loginStatus.textContent =
                error.message || "Unable to connect to the server.";

            loginStatus.style.color = "red";
        } finally {
            loginButton.disabled = false;
        }
    });
}