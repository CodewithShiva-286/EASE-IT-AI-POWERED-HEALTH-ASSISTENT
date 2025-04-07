// ===============================
// DOM Elements
// ===============================
const openCameraBtn = document.getElementById("open-camera-btn");
const cameraPopup = document.getElementById("camera-popup");
const closePopupBtn = document.getElementById("close-popup");
const captureBtn = document.getElementById("capture-btn");
const video = document.getElementById("camera-stream");
const resultBox = document.getElementById("result-box");
const healthDataDiv = document.getElementById("health-data");
const saveBtn = document.getElementById("save-btn");
const imageUpload = document.getElementById("imageUpload");

let currentStream = null;

// ===============================
// Show Camera Popup
// ===============================
openCameraBtn.addEventListener("click", async () => {
  try {
    cameraPopup.classList.remove("hidden");

    currentStream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = currentStream;
    video.play();
  } catch (err) {
    alert("Camera access denied or not available.");
    console.error(err);
  }
});

// ===============================
// Close Camera Popup
// ===============================
closePopupBtn.addEventListener("click", () => {
  cameraPopup.classList.add("hidden");

  if (currentStream) {
    currentStream.getTracks().forEach((track) => track.stop());
  }
  video.srcObject = null;
});

// ===============================
// Capture Image from Camera
// ===============================
captureBtn.addEventListener("click", () => {
  const canvas = document.createElement("canvas");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  canvas.toBlob((blob) => {
    if (blob) {
      const file = new File([blob], "captured.jpg", { type: "image/jpeg" });
      sendImageToServer(file);
      cameraPopup.classList.add("hidden");

      // Stop stream
      if (currentStream) {
        currentStream.getTracks().forEach((track) => track.stop());
      }
    }
  }, "image/jpeg");
});

// ===============================
// Upload Image Directly
// ===============================
imageUpload.addEventListener("change", () => {
  const file = imageUpload.files[0];
  if (file) {
    sendImageToServer(file);
  }
});

// ===============================
// Send Image to Backend Server
// ===============================
function sendImageToServer(file) {
  const formData = new FormData();
  formData.append("image", file);

  resultBox.textContent = "Scanning... Please wait.";
  healthDataDiv.innerHTML = "";

  fetch("/extract-text", {
    method: "POST",
    body: formData,
  })
    .then((res) => res.json())
    .then((data) => {
      resultBox.textContent = data.text || "No text found.";

      if (data.healthData) {
        healthDataDiv.innerHTML = `
          <p><strong>Product:</strong> ${data.healthData.product || "N/A"}</p>
          <p><strong>Calories:</strong> ${data.healthData.calories || "N/A"}</p>
          <p><strong>Sugar:</strong> ${data.healthData.sugar || "N/A"}</p>
        `;
      }
    })
    .catch((err) => {
      resultBox.textContent = "Failed to scan image.";
      console.error(err);
    });
}

// ===============================
// Save & Go to Chatbot
// ===============================
saveBtn.addEventListener("click", () => {
  const scannedText = resultBox.textContent;
  if (scannedText.trim() !== "") {
    localStorage.setItem("scannedText", scannedText);
    window.location.href = "/html/chatbot.html";
  } else {
    alert("No scanned text to save.");
  }
});
