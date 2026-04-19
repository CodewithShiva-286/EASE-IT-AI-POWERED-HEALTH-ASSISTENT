const fetch = require('node-fetch');
const Tesseract = require('tesseract.js');

exports.analyzeOCR = async ({ imageSrc, healthConditions }) => {
    console.log("📌 Received OCR request");

    try {
        if (!imageSrc) throw new Error("Missing imageSrc in request.");

        // ✅ Perform OCR using Tesseract.js
        console.log("🔄 Processing OCR...");
        const { data: { text } } = await Tesseract.recognize(imageSrc, 'eng', {
            tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789,() -:',
        });

        console.log("📌 Extracted Text (Raw):", text);

        // ✅ Clean extracted text
        let cleanedText = text.replace(/[^a-zA-Z0-9\s,():-]/g, ''); // Strict cleaning
        console.log("📌 Cleaned Extracted Text:", cleanedText);

        // ✅ Extract ingredients (Improved regex)
        let ingredients = "";
        const match = cleanedText.match(/ingredients?[:\s-](.*)/i); // More flexible regex

        if (match) ingredients = match[1].trim();

        // ✅ Extract additional lines to ensure full ingredient list
        let lines = cleanedText.split("\n");
        let startIndex = lines.findIndex(line => line.toLowerCase().includes("ingredients"));

        if (startIndex !== -1) {
            ingredients = lines.slice(startIndex, startIndex + 15).join(" "); // Extract more lines
        }

        // ✅ Ensure meaningful ingredient data
        const validWords = ingredients.split(/\s+/).filter(word => word.length > 2);
        if (!ingredients || validWords.length < 5) {
            console.log("⚠️ Extracted ingredients are too short:", ingredients);
            return "⚠️ OCR detected text, but the ingredients list is incomplete. Please upload a clearer image.";
        }

        console.log("📌 Final Extracted Ingredients:", ingredients);

        // ✅ Build AI analysis prompt
        const analysisPrompt = `Health conditions of the user: ${healthConditions}\n\nIngredients detected: ${ingredients}\n\nBased on the user's health conditions, 
        User Health Conditions: ${healthConditions || "None"}
Detected Ingredients: ${ingredients}

Generate response in EXACTLY 4 lines:
 Hindi phrase + emoji (safe/unsafe)\n
 Explanation if unsafe in 2-3 lines/Food joke if safe\n
 "Caution:" + All harmful ingredients (user-specific + general)

**Examples:**

Unsafe:
"Arrey! Ye toh danger hai! 💀
Contains peanuts  (allergy alert!) 
Caution: ⚠️Peanut, ⚠️Palm Oil, ⚠️Added Sugar "

Safe:
"Wah! Bilkul safe hai! 👍
Khao aur mast raho! 😄
Caution: ⚠️Preservatives (E211), ⚠️Added Sugar"
`;
        // ✅ Send request to Gemini AI for analysis
        const API_KEY = process.env.GEMINI_API_KEY;
        if (!API_KEY) throw new Error("GEMINI_API_KEY is missing from environment variables.");

        const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';
        console.log("📡 Sending request to Gemini AI...");

        const response = await globalThis.fetch(`${API_URL}?key=${API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: [{ text: analysisPrompt }] }] })
        });

        if (!response.ok) throw new Error(`API request failed. Status: ${response.status}`);
        const data = await response.json();
        console.log("📌 Gemini API Response:", data);

        return data?.candidates?.[0]?.content?.parts?.[0]?.text || "⚠️ No response from AI. Please try again.";
    } catch (error) {
        console.error("❌ Error in OCR Processing:", error);
        return `Error processing OCR request: ${error.message}`;
    }
};
