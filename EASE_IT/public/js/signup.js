document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("signupForm");
  const usernameInput = document.getElementById("username");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
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
    submitButton.querySelector("span").textContent = isLoading ? "Creating account" : "Create account";
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
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: usernameInput.value.trim(),
          email: emailInput.value.trim(),
          password: passwordInput.value
        })
      });

      if (res.ok) {
        const data = await res.json();
        localStorage.setItem("username", data.username);
        localStorage.setItem("token", data.token);
        showAuthMessage("Account created. Setting up your health profile.", "success");
        window.location.href = "/html/health-data.html";
        return;
      }

      const error = await res.json();
      showAuthMessage(error.error || "Unable to create your account.");
    } catch (error) {
      console.error("Signup failed:", error);
      showAuthMessage("Failed to sign up. Please try again.");
    } finally {
      setLoading(false);
    }
  });
});
