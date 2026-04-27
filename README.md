# SmartQA — Interview Pressure Simulator

An AI-powered mock interview training tool that simulates real job interview pressure and provides intelligent performance feedback.

## Features
- 🔐 User Authentication (Login/Signup)
- 🎤 Voice-based answer recording (Speech Recognition)
- ⏱️ Timed questions with countdown pressure
- 🤖 AI-generated questions via Google Gemini
- 💥 Random interruptions to simulate real interviews
- 📊 Detailed performance analytics (Accuracy, Clarity, Confidence, Speed)
- 📈 Dashboard with historical session tracking

## Tech Stack
- **Frontend:** React (Vite), React Router, Lucide Icons
- **Backend:** Node.js, Express, Mongoose (MongoDB)
- **AI:** Google Generative AI (Gemini 1.5 Flash)
- **Database:** MongoDB Atlas

## Setup Instructions

### Prerequisites
- Node.js >= 18
- MongoDB Atlas account (or local MongoDB)
- Google Gemini API key (free at [aistudio.google.com](https://aistudio.google.com))

### Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the `backend` folder:
```
PORT=5000
GEMINI_API_KEY=your_gemini_api_key_here
MONGODB_URI=your_mongodb_connection_string_here
```

Start the backend:
```bash
node server.js
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

## Usage
1. Sign up or log in
2. On the Dashboard, select your target **Role** and **Difficulty**
3. Click **Start Interview**
4. Answer questions using your microphone (or skip with the Next button)
5. View detailed AI feedback and scores at the end
6. Dashboard auto-updates with your session history

## Environment Variables
| Variable | Description |
|---|---|
| `PORT` | Backend server port (default: 5000) |
| `GEMINI_API_KEY` | Google Generative AI key |
| `MONGODB_URI` | MongoDB connection string |

> ⚠️ Never commit your `.env` file — it is already listed in `.gitignore`
