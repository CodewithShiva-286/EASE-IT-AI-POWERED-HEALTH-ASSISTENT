document.addEventListener("DOMContentLoaded", () => {
  const username = localStorage.getItem("username");
  const token = localStorage.getItem("token");
  const displayUsername = document.getElementById("displayUsername");
  const logoutBtn = document.getElementById("logoutBtn");
  const editHealthBtn = document.getElementById("editHealthBtn");
  const scanResult = document.getElementById("scanResult");
  const chatbotBtn = document.getElementById("chatbotBtn");

  if (!username || !token) {
    window.location.href = "/html/signin.html";
    return;
  }

  displayUsername.textContent = username;

  window.showToast = function showToast(message, type = "info") {
    const region = document.getElementById("toastRegion");
    if (!region) return;

    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    toast.textContent = message;
    region.appendChild(toast);

    if (window.gsap && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.fromTo(toast, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.28, ease: "power2.out" });
    }

    window.setTimeout(() => {
      if (window.gsap && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.to(toast, {
          opacity: 0,
          y: 10,
          duration: 0.2,
          ease: "power2.in",
          onComplete: () => toast.remove()
        });
      } else {
        toast.remove();
      }
    }, 3600);
  };

  window.setScanStage = function setScanStage(stage) {
    document.querySelectorAll(".flow-step").forEach((step) => {
      step.classList.toggle("is-active", step.dataset.stage === stage);
    });

    const status = document.getElementById("resultStatus");
    if (!status) return;

    const labels = {
      scan: "Ready",
      processing: "Analyzing",
      result: "Result ready",
      action: "Ask assistant"
    };
    status.textContent = labels[stage] || "Ready";
  };

  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("username");
    localStorage.removeItem("token");
    localStorage.removeItem("healthConditions");
    window.location.href = "/html/signin.html";
  });

  editHealthBtn.addEventListener("click", () => {
    window.location.href = "/html/health-data.html";
  });

  function goToChatbot() {
    const emptyState = scanResult.querySelector(".empty-state");
    const scanText = scanResult.innerText.trim();

    if (!emptyState && scanText) {
      localStorage.setItem("lastScanResult", scanText);
    }

    window.location.href = "../chatbot/chatbot.html";
  }

  scanResult.addEventListener("click", goToChatbot);
  scanResult.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      goToChatbot();
    }
  });
  chatbotBtn.addEventListener("click", goToChatbot);

  async function fetchHealthData() {
    try {
      const res = await fetch("/api/healthdata", {
        method: "GET",
        headers: { Authorization: "Bearer " + token }
      });

      if (!res.ok) {
        window.showToast("Could not load health profile yet.", "error");
        return;
      }

      const data = await res.json();
      localStorage.setItem("healthConditions", JSON.stringify(data.conditions));
      displayHealthData(data.conditions);
    } catch (error) {
      console.error("Error fetching health data:", error);
      window.showToast("Health profile is offline. Scans still work with saved data.", "error");
    }
  }

  function formatLabel(value) {
    return value
      .replace(/_/g, " ")
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      .trim();
  }

  function displayHealthData(conditions) {
    const summary = document.getElementById("healthDataSummary");
    const selected = [];

    if (conditions && Object.keys(conditions).length > 0) {
      Object.keys(conditions).forEach((section) => {
        Object.keys(conditions[section]).forEach((condition) => {
          if (conditions[section][condition] === true) {
            selected.push(formatLabel(condition));
          }
        });
      });
    }

    summary.innerHTML = "";

    if (selected.length === 0) {
      const empty = document.createElement("p");
      empty.className = "health-empty";
      empty.textContent = "No health conditions selected yet. Add your profile to personalize scan results.";
      summary.appendChild(empty);
      localStorage.setItem("healthConditions", JSON.stringify([]));
      return;
    }

    const tagWrap = document.createElement("div");
    tagWrap.className = "health-tags";
    selected.forEach((condition) => {
      const tag = document.createElement("span");
      tag.className = "health-tag";
      tag.textContent = condition;
      tagWrap.appendChild(tag);
    });

    summary.appendChild(tagWrap);
    localStorage.setItem("healthConditions", JSON.stringify(selected));
  }

  fetchHealthData();

  if (window.gsap && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    gsap.from(".dashboard-hero > *", {
      opacity: 0,
      y: 22,
      duration: 0.7,
      ease: "power3.out",
      stagger: 0.08
    });
    gsap.from(".workspace-panel", {
      opacity: 0,
      y: 28,
      duration: 0.72,
      ease: "power3.out",
      stagger: 0.08,
      delay: 0.08
    });
  }
});
