const uploadBtn = document.querySelector('#upload-btn');
const uploadInput = document.querySelector('#upload-input');
const scanResult = document.querySelector('#scanResult');

uploadBtn.addEventListener('click', () => {
    const useCamera = confirm("Do you want to use the camera? Click OK for camera, Cancel to upload a file.");
    if (useCamera) {
        openCamera(); // triggers camera
    } else {
        uploadInput.click(); // triggers file selection
    }
});

// 📁 Handle image upload from file picker
uploadInput.addEventListener('change', (ev) => {
    const file = ev.target.files[0];
    if (!file) return alert('Please select an image.');
    uploadImageToBackend(file);
});

// 📸 Camera logic
let videoStream = null;

function openCamera() {
    navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
        .then(stream => {
            videoStream = stream;
            const video = document.createElement("video");
            video.srcObject = stream;
            video.play();

            // Create temporary preview for user
            const cameraContainer = document.createElement("div");
            cameraContainer.style.textAlign = "center";
            cameraContainer.innerHTML = "<p>Capturing image in 3 seconds...</p>";
            cameraContainer.appendChild(video);
            scanResult.innerHTML = "";
            scanResult.appendChild(cameraContainer);

            setTimeout(() => captureAndUpload(video), 3000);
        })
        .catch(error => {
            console.error("Camera access denied:", error);
            alert("Could not access the camera. Please allow permissions.");
        });
}

function captureAndUpload(video) {
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0);

    videoStream.getTracks().forEach(track => track.stop()); // stop camera

    canvas.toBlob(blob => {
        if (!blob) return alert("Failed to capture image.");
        const file = new File([blob], "captured-image.png", { type: "image/png" });
        uploadImageToBackend(file);
    }, "image/png");
}

// 🔁 Reusable function to upload image file (from file or camera)
async function uploadImageToBackend(file) {
    scanResult.innerHTML = '<p class="text-gray-500 text-center">Processing... ⏳</p>';

    try {
        const formData = new FormData();
        formData.append('image', file); // send to backend

        const response = await fetch('https://ease-it-ai.onrender.com/api/ocr', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) throw new Error(`Failed to analyze image. Status: ${response.status}`);

        const data = await response.json();
        console.log("📌 OCR Response from backend:", data);

        if (data.text) {
            scanResult.innerHTML = `<div id="analysisResult" style="cursor:pointer;">${data.text.replace(/\n/g, '<br>')}</div>`;
        } else {
            scanResult.innerHTML = `<p class="text-red-500">No meaningful response received.</p>`;
        }
    } catch (err) {
        console.error("❌ Error in OCR Processing:", err);
        scanResult.innerHTML = `<p class="text-red-500">Error: ${err.message}</p>`;
    }
}

