# EASEIT

EASEIT is an AI-powered ingredient scanner that helps users understand food labels in the context of their personal health profile. Users can save health conditions, scan ingredient labels with OCR, receive AI-assisted safety notes, and continue the conversation in a chatbot.

The project is a production-oriented full-stack web app, not a static template. The backend serves the frontend, manages authentication and health data, performs OCR analysis, and integrates with Google Gemini for ingredient guidance.

## Features

- Ingredient label scanning from uploaded images or camera capture.
- OCR processing with Tesseract.js.
- Personalized ingredient analysis using saved health conditions.
- Health profile flow with condition chips and progress tracking.
- AI chatbot handoff for follow-up questions.
- JWT-based authentication.
- MongoDB-backed user and health profile storage.
- Responsive premium SaaS-style frontend with GSAP animations.

## Tech Stack

- Frontend: HTML, CSS, JavaScript, GSAP
- Backend: Node.js, Express.js
- Database: MongoDB with Mongoose
- Auth: JSON Web Tokens, bcrypt
- OCR: Tesseract.js
- AI: Google Gemini API

## Project Structure

```text
EASE_IT/
  Backend/
    controllers/
    middleware/
    models/
    routes/
    uploads/
    server.js
    package.json
  public/
    chatbot/
    css/
    html/
    images/
    js/
README.md
.gitignore
```

## Getting Started

### Prerequisites

- Node.js 18 or newer
- MongoDB connection string
- Google Gemini API key

Node 18 or 20 is recommended for the smoothest native dependency experience. If you use Node 22 and bcrypt fails to load, run `npm rebuild bcrypt` inside `EASE_IT/Backend`.

### Installation

Clone the repository and install backend dependencies:

```bash
git clone https://github.com/CodewithShiva-286/easeit.git
cd easeit/EASE_IT/Backend
npm install
```

Create `EASE_IT/Backend/.env`:

```env
PORT=10000
DB_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_gemini_api_key
JWT_SECRET=your_jwt_secret
```

Start the backend:

```bash
npm start
```

Open the app:

```text
http://localhost:10000
```

The backend serves the frontend from `EASE_IT/public`.

## Deploying To Vercel

This repository is configured for Vercel deployment from the repository root.

Vercel entry files:

- `vercel.json`: rewrites all requests to the Express serverless handler.
- `api/index.js`: Vercel serverless entrypoint that exports the EASEIT Express app.
- `package.json`: root install metadata and Vercel build script.
- `EASE_IT/Backend/server.js`: exports the Express app for serverless use and still runs locally with `node server.js`.

### Vercel Settings

Use these settings when importing the project:

| Setting | Value |
| --- | --- |
| Framework Preset | Other |
| Root Directory | Repository root |
| Build Command | `npm run vercel-build` |
| Output Directory | Leave empty |
| Install Command | `npm install` |

### Required Environment Variables

Add these in Vercel Project Settings -> Environment Variables:

```env
DB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=1h
GEMINI_API_KEY=your_gemini_api_key
JSON_LIMIT=8mb
```

Do not add `PORT` on Vercel. Vercel assigns the runtime port automatically.

### Deployment Notes

- The frontend uses relative API paths like `/api/auth/login`, so it works locally and on Vercel.
- Express serves the static frontend from `EASE_IT/public`.
- MongoDB connects only for `/api/*` requests, which keeps static pages fast.
- The app uses OCR and AI requests inside serverless functions. Very large images may exceed serverless request limits, so upload clear, compressed label images.

## Environment Variables

| Name | Required | Description |
| --- | --- | --- |
| `PORT` | No | Server port. Defaults to `10000`. |
| `DB_URI` | Yes | MongoDB connection string. |
| `GEMINI_API_KEY` | Yes | Google Gemini API key for AI analysis. |
| `JWT_SECRET` | Yes | Secret used for signing authentication tokens. |

Do not commit `.env` files or API keys. The root `.gitignore` is configured to exclude local secrets, runtime logs, dependency folders, and uploads.

## Development Notes

- Run the server from `EASE_IT/Backend`.
- A running Express server keeps the terminal open by design. Use a second terminal for other commands.
- During local development, the API and static frontend are served from `http://localhost:10000`.
- OCR and AI analysis depend on the backend being connected to MongoDB and having a valid Gemini API key.

## Developer

Maintained by:

- Name: CodewithShiva-286
- GitHub: [CodewithShiva-286](https://github.com/CodewithShiva-286)

## Contributing

Contributions are welcome. To contribute:

1. Fork the repository.
2. Create a feature branch.
3. Make focused changes.
4. Test the app locally.
5. Open a pull request with a clear description.

Please avoid committing secrets, generated uploads, local logs, or dependency folders.

## License

This project is open source under the ISC License.

Copyright (c) 2026 CodewithShiva-286

Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted, provided that the copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
