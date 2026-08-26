document.addEventListener("DOMContentLoaded", () => {

    checkConnection();

    checkAuth();

    showUser();

    const loginForm = document.getElementById("loginForm");

    if (loginForm) {
        loginForm.addEventListener("submit", handleLogin);
    }

    const logoutButtons =
        document.querySelectorAll(".logout-btn");

    logoutButtons.forEach((btn) => {
        btn.addEventListener("click", handleLogout);
    });
});


function checkConnection() {

    const protocol = window.location.protocol;

    const statusElement = document.querySelector(".secure");

    if (!statusElement) {
        return;
    }

    if (protocol === "https:") {

        statusElement.innerHTML =
            "🔒 Kết nối HTTPS an toàn";

        statusElement.style.color = "#4ade80";

    } else {

        statusElement.innerHTML =
            "⚠️ Kết nối HTTP";

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

        // Demo frontend: lưu trạng thái đăng nhập trong session
        sessionStorage.setItem("securecloud_logged_in", "true");
        sessionStorage.setItem("securecloud_user", username);

        message.textContent =
            "✅ Đăng nhập thành công — đang chuyển...";

        message.style.color = "#4ade80";

        setTimeout(() => {
            window.location.href = "dashboard.html";
        }, 800);

    } else {

        message.textContent =
            "❌ Sai tên đăng nhập hoặc mật khẩu";

        message.style.color = "#f87171";
    }
}


function checkAuth() {

    // dashboard.html là khu vực được bảo vệ,
    // chỉ vào được khi đã đăng nhập.
    if (window.location.pathname.endsWith("dashboard.html")) {

        const loggedIn =
            sessionStorage.getItem("securecloud_logged_in");

        if (loggedIn !== "true") {
            window.location.href = "login.html";
        }
    }
}


function showUser() {

    const welcome = document.getElementById("welcomeUser");

    if (!welcome) {
        return;
    }

    welcome.textContent =
        sessionStorage.getItem("securecloud_user") || "người dùng";
}


function handleLogout(event) {

    event.preventDefault();

    sessionStorage.removeItem("securecloud_logged_in");
    sessionStorage.removeItem("securecloud_user");

    window.location.href = "login.html";
}