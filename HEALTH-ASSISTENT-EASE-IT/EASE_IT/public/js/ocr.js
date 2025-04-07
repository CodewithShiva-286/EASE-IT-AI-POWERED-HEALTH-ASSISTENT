const uploadBtn = document.querySelector('#upload-btn');
const uploadInput = document.querySelector('#upload-input');
const scanResult = document.querySelector('#scanResult');

uploadBtn.addEventListener('click', () => {
    const useCamera = confirm("Do you want to use the camera? Click OK for camera, Cancel to upload a file.");
    if (useCamera) {
        openCamera();
    } else {
        uploadInput.click();
    }
});

uploadInput.addEventListener('change', (ev) => {
    const file = ev.target.files[0];
    if (!file) {
        alert('Please select an image.');
        return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
        recognizeText(e.target.result);
    };
    reader.readAsDataURL(file);
});

async function recognizeText(imageSrc) {
    scanResult.innerHTML = '<p class="text-gray-500 text-center">Processing... ⏳</p>';
    try {
        const healthConditions = localStorage.getItem('healthConditions') || "No health data available";
        const response = await fetch('http://localhost:3000/api/ocr/analyze', {  
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ imageSrc, healthConditions })
        });

        if (!response.ok) throw new Error(`Failed to analyze image. Status: ${response.status}`);

        const data = await response.json();
        console.log("📌 OCR Response from backend:", data);

        if (data.response) {
            scanResult.innerHTML = `<div id="analysisResult" style="cursor:pointer;">${data.response.replace(/\n/g, '<br>')}</div>`;
        } else {
            scanResult.innerHTML = `<p class="text-red-500">No meaningful response received.</p>`;
        }
    } catch (err) {
        console.error("❌ Error in OCR Processing:", err);
        scanResult.innerHTML = `<p class="text-red-500">Error: ${err.message}</p>`;
    }
}
