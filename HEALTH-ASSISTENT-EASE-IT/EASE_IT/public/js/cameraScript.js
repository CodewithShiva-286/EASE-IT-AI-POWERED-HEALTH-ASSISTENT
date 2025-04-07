captureBtn.addEventListener('click', () => {
    const canvas = document.createElement('canvas');
    const video = document.getElementById('cameraStream');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    const imageData = canvas.toDataURL('image/png'); // base64

    // Hide camera and show preview
    videoStream.classList.add('hidden');
    capturedImage.src = imageData;
    imagePreview.classList.remove('hidden');

    // ✅ Fetch OCR analysis (pasted here)
    const healthConditions = document.getElementById('healthConditionsInput').value;

    fetch('/ocr/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageSrc: imageData, healthConditions })
    })
    .then(res => res.json())
    .then(data => {
        document.getElementById('ocrResult').innerText = data.response;
    })
    .catch(err => {
        document.getElementById('ocrResult').innerText = "❌ Error during OCR: " + err.message;
    });
});