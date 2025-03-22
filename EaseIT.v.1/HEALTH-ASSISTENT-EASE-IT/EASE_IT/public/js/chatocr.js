// chatocr.js (updated)
export async function handleChatImage(imageFile) {
    const formData = new FormData();
    formData.append('image', imageFile);
    formData.append('healthConditions', localStorage.getItem('healthConditions') || "No health data");

    try {
        const response = await fetch('/api/ocr/chat/scan/text', {
            method: 'POST',
            body: formData
        });
        
        if (!response.ok) throw new Error('Scan failed');
        return await response.json();
        
    } catch (error) {
        console.error("Chat OCR Error:", error);
        return { success: false, error: error.message };
    }
}