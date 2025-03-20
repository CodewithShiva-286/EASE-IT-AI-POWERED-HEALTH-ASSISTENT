const fetch = require('node-fetch');
const Tesseract = require('tesseract.js');

exports.analyzeOCR = async ({ imageSrc, healthConditions }) => {
    console.log("📌 Received OCR request");

    try {
        // ✅ Perform OCR using Tesseract.js
        const { data: { text } } = await Tesseract.recognize(imageSrc, 'eng');
        console.log("📌 Extracted Text (Raw):", text);

        // ✅ Clean extracted text (Remove unwanted characters)
        let cleanedText = text.replace(/[^\w\s,():-]/g, ''); // Removes symbols except common separators
        console.log("📌 Cleaned Extracted Text:", cleanedText);

        // ✅ Extract ingredients by getting all text after "INGREDIENTS:"
        let ingredients = "";
        const match = cleanedText.match(/INGREDIENTS:(.*)/i);
        if (match) {
            ingredients = match[1].trim();
        }

        // ✅ Extract additional lines if necessary
        let ingredientsLines = cleanedText.split("\n");
        let startIndex = ingredientsLines.findIndex(line => line.toLowerCase().includes("ingredients"));

        if (startIndex !== -1) {
            ingredients = ingredientsLines.slice(startIndex, startIndex + 7).join(" "); // Get next 7 lines
        }

        // ✅ Ensure we have meaningful ingredient data
        const validWords = ingredients.split(/\s+/).filter(word => word.length > 2); // Ignore short words

        if (!ingredients || validWords.length < 5) {
            console.log("⚠️ Extracted ingredients are too short:", ingredients);
            return "⚠️ OCR detected text, but the ingredients list is incomplete. Please upload a clearer image.";
        }

        console.log("📌 Final Extracted Ingredients:", ingredients);

        // ✅ Build AI analysis prompt using the exact format from uploaded ocr.js
        const analysisPrompt = `Health conditions of the user: ${healthConditions}\n\nIngredients detected: ${ingredients}\n\nBased on the user's health conditions, 
        Please generate a response in the following format (each line should start on a new line):
Line 1: A straightforward answer ("Yes" or "No") with an emoji.
Line 2: If the answer is Yes, provide a funny joke or phrase with emojis.
        If the answer is No, provide a 2-3 line explanation (with emojis) describing why the meal is not safe.
Line 3: List all harmful ingredients in the product with a warning emoji (e.g., ⚠️) before each..`;

        // ✅ Send request to Gemini AI for analysis
        const API_KEY = process.env.GEMINI_API_KEY;
        const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent';

        const response = await fetch(`${API_URL}?key=${API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: analysisPrompt }] }]
            })
        });

        if (!response.ok) throw new Error(`API request failed. Status: ${response.status}`);

        const data = await response.json();
        console.log("📌 Gemini API Response:", data);

        return data.candidates[0].content.parts[0].text;
    } catch (error) {
        console.error("❌ Error in OCR Processing:", error);
        return "Error processing OCR request.";
    }
};