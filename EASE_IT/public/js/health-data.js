document.addEventListener("DOMContentLoaded", () => {
  const username = localStorage.getItem("username");
  const token = localStorage.getItem("token");
  const form = document.getElementById("healthForm");
  const steps = Array.from(document.querySelectorAll(".condition-step"));
  const progressNumber = document.getElementById("progressNumber");
  const progressBar = document.getElementById("progressBar");
  const progressRing = document.querySelector(".progress-ring");
  const currentStepTitle = document.getElementById("currentStepTitle");
  const selectedCount = document.getElementById("selectedCount");
  const prevBtn = document.getElementById("prevStepBtn");
  const nextBtn = document.getElementById("nextStepBtn");
  const saveBtn = document.getElementById("saveProfileBtn");

  const sections = [
    "ChronicDiseases",
    "InfectiousDiseases",
    "NeurologicalDisorders",
    "Allergies",
    "VeganConcerns",
    "DailyIssues",
    "OnPeriods"
  ];

  let currentStep = 0;

  if (!username || !token) {
    window.location.href = "/html/signin.html";
    return;
  }

  document.getElementById("displayUsername").textContent = username;

  function showToast(message, type = "info") {
    const region = document.getElementById("toastRegion");
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
    }, 3400);
  }

  function getSelectedTotal() {
    return form.querySelectorAll("input[type='checkbox']:checked").length;
  }

  function updateProgress() {
    const progress = ((currentStep + 1) / steps.length) * 100;
    const title = steps[currentStep].dataset.title;
    const totalSelected = getSelectedTotal();

    progressNumber.textContent = String(currentStep + 1);
    progressBar.style.width = `${progress}%`;
    progressRing.style.setProperty("--progress", `${progress}%`);
    currentStepTitle.textContent = title;
    selectedCount.textContent = totalSelected === 0 ? "No selections yet" : `${totalSelected} selected`;

    prevBtn.disabled = currentStep === 0;
    nextBtn.classList.toggle("hidden", currentStep === steps.length - 1);
    saveBtn.classList.toggle("hidden", currentStep !== steps.length - 1);
  }

  function showStep(index) {
    currentStep = Math.max(0, Math.min(index, steps.length - 1));

    steps.forEach((step, stepIndex) => {
      const isActive = stepIndex === currentStep;
      step.classList.toggle("is-active", isActive);
      step.disabled = !isActive;
    });

    updateProgress();

    if (window.gsap && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.fromTo(
        steps[currentStep],
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: 0.34, ease: "power2.out" }
      );
    }
  }

  function buildHealthData() {
    const healthData = {};

    sections.forEach((section) => {
      healthData[section] = {};
      const checkboxes = document.querySelectorAll(`input[name^="${section}_"]`);

      checkboxes.forEach((box) => {
        const condition = box.name.slice(section.length + 1);
        healthData[section][condition] = box.checked;
      });
    });

    return healthData;
  }

  function applyHealthData(conditions) {
    if (!conditions) return;

    sections.forEach((section) => {
      const sectionData = conditions[section] || {};
      Object.keys(sectionData).forEach((condition) => {
        const box = document.querySelector(`input[name="${section}_${condition}"]`);
        if (box) box.checked = sectionData[condition] === true;
      });
    });

    updateProgress();
  }

  async function loadHealthData() {
    try {
      const res = await fetch("/api/healthdata", {
        method: "GET",
        headers: { Authorization: "Bearer " + token }
      });

      if (!res.ok) return;

      const data = await res.json();
      applyHealthData(data.conditions);
    } catch (error) {
      console.error("Error loading health data:", error);
      showToast("Saved health data could not be loaded yet.", "error");
    }
  }

  prevBtn.addEventListener("click", () => showStep(currentStep - 1));
  nextBtn.addEventListener("click", () => showStep(currentStep + 1));

  form.addEventListener("change", updateProgress);

  form.addEventListener("reset", () => {
    window.setTimeout(() => {
      showStep(0);
      updateProgress();
      showToast("Selections cleared. Save to update your profile.", "info");
    }, 0);
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const healthData = buildHealthData();
    saveBtn.disabled = true;
    saveBtn.querySelector("span").textContent = "Saving";

    try {
      const res = await fetch("/api/healthdata", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token
        },
        body: JSON.stringify({ healthData })
      });

      if (res.ok) {
        showToast("Health profile saved.", "success");
        window.setTimeout(() => {
          window.location.href = "/html/home.html";
        }, 650);
      } else {
        const error = await res.json();
        showToast(error.error || "Error saving health profile.", "error");
      }
    } catch (err) {
      console.error("Error:", err);
      showToast("Failed to save health profile.", "error");
    } finally {
      saveBtn.disabled = false;
      saveBtn.querySelector("span").textContent = "Save profile";
    }
  });

  showStep(0);
  loadHealthData();

  if (window.gsap && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    gsap.from(".health-intro > *, .progress-panel, .health-form", {
      opacity: 0,
      y: 24,
      duration: 0.7,
      ease: "power3.out",
      stagger: 0.08
    });
  }
});
