const openCameraBtn = document.getElementById("open-camera-btn");
const cameraPopup = document.getElementById("camera-popup");
const video = document.getElementById("camera");
const captureBtn = document.getElementById("capture-btn");

let stream;

// Open Camera Preview
openCameraBtn.addEventListener("click", async () => {
  try {
    stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;
    cameraPopup.classList.remove("hidden");
  } catch (err) {
    alert("Camera access denied or unavailable.");
  }
});

// Capture Image
captureBtn.addEventListener("click", () => {
  const canvas = document.createElement("canvas");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  canvas.toBlob((blob) => {
    const formData = new FormData();
    formData.append("image", blob, "captured-image.jpg");

    fetch("/upload", {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("OCR Result:", data);
        window.location.href = "/html/result.html";
      })
      .catch((err) => console.error("Upload error:", err));
  });

  stream.getTracks().forEach((track) => track.stop());
  cameraPopup.classList.add("hidden");
});
