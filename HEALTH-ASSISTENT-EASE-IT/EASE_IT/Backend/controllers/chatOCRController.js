chatOCRController.js (updated)
const { analyzeOCR } = require('./ocrController');

exports.analyzeChatImage = async (imageFileBuffer, healthConditions) => {
    try {
        // Convert image buffer to base64 data URL
        const imageSrc = `data:image/png;base64,${imageFileBuffer.toString('base64')}`;

        // Use existing OCR analysis logic
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
