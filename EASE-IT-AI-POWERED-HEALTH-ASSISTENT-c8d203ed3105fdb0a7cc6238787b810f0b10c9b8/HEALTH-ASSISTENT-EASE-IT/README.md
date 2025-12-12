# 🏥 EASE-IT: AI-Powered Health Assistant

![License](https://img.shields.io/badge/license-ISC-blue.svg)
![Node Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)
![Build Status](https://img.shields.io/badge/build-passing-brightgreen)
![Security](https://img.shields.io/badge/security-patched-success)

> **Your personal AI health companion that reads labels, understands your diet, and jokes like a local.**

---

## 🚀 What is this?

**EASE-IT** is a next-generation health assistant designed to make healthy living accessible, safe, and fun. By combining **Optical Character Recognition (OCR)** with **Generative AI**, EASE-IT can scan food product ingredients and instantly analyze them against your specific health conditions (like allergies or dietary restrictions).

But we didn't stop there. We built **BawarchiBot** 🍛 — a witty, culturally attuned AI chatbot that doesn't just give you medical advice; it talks to you like a friend, warns you about "danger" ingredients with a touch of humor, and suggests tasty alternatives.

---

## ✨ Key Features

*   **📸 Smart Ingredient Scanner:** Upload an image of any food label, and our OCR engine extracts the text to find hidden allergens.
*   **🤖 BawarchiBot:** A funny, engaging AI chatbot powered by Google Gemini that understands Hindi phrases and Indian food culture.
*   **🛡️ Personalized Safety Checks:** instantly flags ingredients unsafe for *your* specific health profile (e.g., Peanut Allergy, Lactose Intolerance).
*   **🔒 Secure & Robust:** Built with security-first architecture, utilizing patched and verified libraries for safe data handling.

---

## 🛠️ Tech Stack

*   **Backend:** Node.js, Express.js
*   **AI & ML:** Google Gemini API, Tesseract.js (OCR)
*   **Database:** MongoDB
*   **Security:** Helmet, CORS, Secure File Uploads (Multer)

---

## 🔐 Security & Architecture

We take security seriously. This repository is maintained with:
*   **Zero High-Severity Vulnerabilities:** All dependencies are rigorously audited and patched.
*   **Safe File Handling:** File uploads are processed with strict size limits and type checks to prevent DoS attacks.
*   **Secure Requests:** API communications are protected against common web vulnerabilities.

---

## 🚀 Getting Started

Follow these steps to get the server running locally.

### Prerequisites
*   Node.js (v18 or higher)
*   MongoDB (Local or Atlas URI)
*   Google Gemini API Key

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/yourusername/EASE-IT.git
    cd EASE-IT/Backend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Configure Environment:**
    Create a `.env` file in the `Backend` directory:
    ```env
    PORT=10000
    DB_URI=your_mongodb_connection_string
    GEMINI_API_KEY=your_gemini_api_key
    ```

4.  **Run the Server:**
    ```bash
    npm start
    ```

    You should see:
    > 🚀 Server is running on http://localhost:10000
    > ✅ Connected to MongoDB!

---

## 🤝 Contributing

Contributions are welcome! Please open an issue or submit a pull request.

---

*Made with ❤️ and 🌶️ by the EASE-IT Team*