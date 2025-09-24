# AI Portfolio Generator (Students)  

A web platform that lets students generate and publish professional portfolios using the **Google Gemini API**. Each student uses their own Gemini API key (token) so that usage is independent and private.

---

## 🎯 Features

- Students connect with their own **Gemini API key**  
- Validate the key before using it  
- Input personal information: education, skills, projects, achievements  
- AI (via Gemini) generates narrative content (bio, summaries, project descriptions)  
- Template-based portfolio website output  
- Export / publish / share portfolio  

---

## 📂 Project Structure

```

/ (root)
├── backend/             # Node.js / Express (or your backend)
├── frontend/            # React / Vue / Angular (or any frontend)
├── .gitignore
├── README.md
└── ...

````

---

## 🚀 Setup Instructions

### Prerequisites

- Node.js (v16+ recommended)  
- npm or yarn  
- A valid Google Gemini API key (token) for testing  

### Backend Setup

1. Go into the backend folder:

   ```bash
   cd backend
````

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

3. Create environment configuration file `.env` (or similar) with your settings:

   ```text
   PORT=5000
   GEMINI_API_BASE_URL=https://...        # Gemini endpoint
   # other configs as needed
   ```

4. Start the backend server:

   ```bash
   npm run dev
   # or
   npm start
   ```

### Frontend Setup

1. Go into the frontend folder:

   ```bash
   cd ../frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

3. Configure the frontend to talk to the backend (e.g., set `API_BASE_URL` in `.env` or config file).

4. Start the frontend dev server:

   ```bash
   npm run dev
   # or
   npm start
   ```

---

## 🧩 Dependencies & Suggested Packages

Below is a list of Node.js / frontend packages you might need (this is generic — adapt to your actual code):

### Backend (Node.js / Express)

* `express` — web server
* `cors` — for cross-origin requests
* `dotenv` — for environment variables
* `axios` or `node-fetch` — to make HTTP requests to Gemini API
* `body-parser` — parse JSON payloads (or use built-in in newer Express)
* (Optional) `express-validator` — validate requests
* (Optional) `jsonwebtoken` / `passport` — if you implement authentication
* (Optional) `nodemon` — for development auto-restart

Example `package.json` dependencies:

```json
{
  "dependencies": {
    "express": "^4.18.0",
    "cors": "^2.8.5",
    "dotenv": "^16.0.0",
    "axios": "^1.4.0"
  },
  "devDependencies": {
    "nodemon": "^2.0.0"
  }
}
```

### Frontend (React / Vue / etc.)

* `react` (if using React) / `vue` / `angular`
* `axios` or `fetch` — to call backend APIs
* `tailwindcss` or `styled-components` or CSS framework (optional)
* `react-router-dom` (for routing)
* UI libraries (optional) — e.g. `antd`, `mui`, `bootstrap`
* State management (optional) — e.g. `redux`, `pinia`, `vuex`

Example for React:

```json
{
  "dependencies": {
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "axios": "^1.4.0",
    "react-router-dom": "^6.0.0"
  },
  "devDependencies": {
    "tailwindcss": "^3.0.0"
  }
}
```

---

## ✅ How It Works (Flow)

1. Student visits frontend, logs in or provides their Gemini API token.
2. Frontend sends token to backend to validate (maybe make a test call to Gemini).
3. Student fills in form: education, skills, projects, etc.
4. Backend sends a prompt + student data + token to **Google Gemini API**.
5. Gemini returns generated text (summaries, descriptions).
6. Backend returns the generated portfolio content to frontend.
7. Frontend renders the portfolio (can provide “preview”, “export as HTML”, “publish” etc.).

---

## 🛠️ Notes & Tips

* **Security:** Don’t store student tokens insecurely. Possibly encrypt them or prefer not storing at all; only use them for request forwarding.
* **Rate limits & errors:** Handle errors and rate limits from Gemini gracefully.
* **Prompt design:** For better results, build structured prompts with schema (e.g. “Write a 100-word project description given title, tech stack, challenges, results”).
* **Template design:** Use flexible templates so generated text fits well.
* **Caching / optimization:** Avoid unnecessary repeat calls to Gemini; cache generated outputs if possible.

---

## 📂 Example Commands

```bash
# In backend
cd backend
npm install
npm run dev

# In frontend
cd frontend
npm install
npm run dev
```

---

## 🧠 Future Improvements

* Let student choose between multiple portfolio templates
* Allow customizing generated text (regenerate a section)
* Add image / media embedding
* SEO meta generation
* Analytics (views, shares)

---

## 📝 License & Contribution

Feel free to fork, extend, and contribute. Please add a LICENSE file.


