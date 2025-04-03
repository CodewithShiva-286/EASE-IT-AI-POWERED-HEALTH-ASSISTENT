document.addEventListener("DOMContentLoaded", function () {
    const openCameraBtn = document.getElementById("open-camera-btn");
    const cameraPopup = document.getElementById("camera-popup");
    const closePopup = document.getElementById("close-popup");
    const videoElement = document.getElementById("camera-preview");
    const captureBtn = document.getElementById("capture-btn");
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    let stream;

    // Open Camera Popup
    openCameraBtn.addEventListener("click", async () => {
        try {
            stream = await navigator.mediaDevices.getUserMedia({ video: true });
            videoElement.srcObject = stream;
            cameraPopup.style.display = "block";
        } catch (error) {
            console.error("Error accessing camera:", error);
            alert("Camera access denied or not available.");
        }
    });

    // Close Popup
    closePopup.addEventListener("click", () => {
        cameraPopup.style.display = "none";
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
        }
    });

    // Capture Image
    captureBtn.addEventListener("click", () => {
        canvas.width = videoElement.videoWidth;
        canvas.height = videoElement.videoHeight;
        ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

        // Convert image to data URL
        const imageData = canvas.toDataURL("image/png");

        // Send image to OCR processing (existing workflow)
        sendImageToOCR(imageData);

        // Close the popup after capturing
        cameraPopup.style.display = "none";
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
        }
    });

    function sendImageToOCR(imageData) {
        // Assuming you already have a function that handles image uploads
        fetch('/upload-image', {
            method: 'POST',
            body: JSON.stringify({ image: imageData }),
            headers: { 'Content-Type': 'application/json' }
        })
        .then(response => response.json())
        .then(data => console.log("OCR Response:", data))
        .catch(error => console.error("Error sending image:", error));
    }
});
