document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const rememberInput = document.getElementById("remember");
  const toggleButton = document.getElementById("password-toggle-btn");
  const toggleIcon = document.getElementById("password-toggle-icon");
  const submitButton = form.querySelector("button[type='submit']");

  function showAuthMessage(message, type = "error") {
    const authMessage = document.getElementById("authMessage");
    authMessage.textContent = message;
    authMessage.classList.remove("hidden", "success");

    if (type === "success") {
      authMessage.classList.add("success");
    }
  }

  function setLoading(isLoading) {
    submitButton.disabled = isLoading;
    submitButton.querySelector("span").textContent = isLoading ? "Signing in" : "Sign in";
  }

  toggleButton.addEventListener("click", () => {
    const isHidden = passwordInput.type === "password";
    passwordInput.type = isHidden ? "text" : "password";
    toggleButton.setAttribute("aria-pressed", String(isHidden));
    toggleButton.setAttribute("aria-label", isHidden ? "Hide password" : "Show password");
    toggleIcon.classList.toggle("fa-eye", !isHidden);
    toggleIcon.classList.toggle("fa-eye-slash", isHidden);
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: emailInput.value.trim(),
          password: passwordInput.value,
          remember: rememberInput.checked
        })
      });

      if (res.ok) {
        const data = await res.json();
        localStorage.setItem("username", data.username);
        localStorage.setItem("token", data.token);
        showAuthMessage("Signed in. Taking you to the dashboard.", "success");
        window.location.href = "/html/home.html";
        return;
      }

      const error = await res.json();
      showAuthMessage(error.error || "Unable to sign in with those details.");
    } catch (error) {
      console.error("Sign-in failed:", error);
      showAuthMessage("Failed to sign in. Please try again.");
    } finally {
      setLoading(false);
    }
  });
});
