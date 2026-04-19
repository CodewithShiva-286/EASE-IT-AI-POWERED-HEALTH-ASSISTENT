const { analyzeOCR } = require('./ocrController');

exports.analyzeChatImage = async (imageFile, healthConditions) => {
    try {
        if (!imageFile || !imageFile.buffer) {
            throw new Error('Invalid image file');
        }
        
        // Convert buffer to base64 data URL
        const base64 = imageFile.buffer.toString('base64');
        const mimeType = imageFile.mimetype || 'image/jpeg';
        const imageSrc = `data:${mimeType};base64,${base64}`;

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