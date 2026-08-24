document.addEventListener("DOMContentLoaded", () => {

    checkConnection();

    const loginForm = document.getElementById("loginForm");

    if (loginForm) {
        loginForm.addEventListener("submit", handleLogin);
    }
});


function checkConnection() {

    const protocol = window.location.protocol;

    const statusElement = document.querySelector(".secure");

    if (!statusElement) {
        return;
    }

    if (protocol === "https:") {

        statusElement.innerHTML =
            "🔒 Secure HTTPS Connection";

        statusElement.style.color = "#4ade80";

    } else {

        statusElement.innerHTML =
            "⚠️ HTTP Connection";

        statusElement.style.color = "#facc15";
    }
}


function handleLogin(event) {

    event.preventDefault();

    const username =
        document.getElementById("username").value;

    const password =
        document.getElementById("password").value;

    const message =
        document.getElementById("loginMessage");

    if (username === "admin" && password === "admin123") {

        message.textContent =
            "✅ Login successful";

        message.style.color = "#4ade80";

    } else {

        message.textContent =
            "❌ Invalid username or password";

        message.style.color = "#f87171";
    }
}