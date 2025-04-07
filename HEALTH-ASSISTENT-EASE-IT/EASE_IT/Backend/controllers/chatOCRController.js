chatOCRController.js (updated)
const { analyzeOCR } = require('./ocrController');

exports.analyzeChatImage = async (imageFile, healthConditions) => {
    try {
        // Convert image file to data URL
        const imageSrc = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.readAsDataURL(imageFile);
        });

        // Use the existing OCR analysis logic
        const result = await analyzeOCR({ 
            imageSrc, 
            healthConditions 
        });

        return {
            success: true,
            type: 'chat-scan',
            text: result
        };
    } catch (error) {
        return { success: false, error: "Chat scan failed: " + error.message };
   }
};