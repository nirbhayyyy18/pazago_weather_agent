# 🌦️ Weather Agent Chat Interface — Pazago Assignment

This project is my submission for the **Frontend Developer Assignment** given by **Pazago**.  
It implements a responsive chat interface connected to the provided **WeatherAgent Streaming API**.

---

## 🚀 Live Demo
🔗 [Click here to view the live app](https://pazago-weather-agent-m71k9si7s-nirbhay-tiwaris-projects.vercel.app/)

---

## 📌 Features Implemented
- ✅ **Chat Interface**: User and Agent messages shown in a clean, responsive chat UI.
- ✅ **Streaming Responses**: Messages stream in real-time from the given API endpoint.
- ✅ **Weather Tool Integration**: Tool results are parsed and displayed in a user-friendly bubble (temperature, humidity, wind, etc.).
- ✅ **Error Handling**: API/network errors are shown in red bubbles.
- ✅ **Conversation History**: Maintains user–agent conversation on screen.
- ✅ **Keyboard Shortcuts**:  
  - `Enter` → send message  
  - `Shift + Enter` → new line  
- ✅ **Clear Chat Button** to reset conversation.
- ✅ **Responsive Design**: Works smoothly on both desktop and mobile.

---

## ⚙️ Tech Stack
- **Next.js 14** (React framework)  
- **TypeScript**  
- **Tailwind CSS** for styling  

---

## 🔑 API Details (Provided by Pazago)

This project uses the **Pazago WeatherAgent Streaming API** exactly as instructed.

Endpoint: https://millions-screeching-vultur.mastra.cloud/api/agents/weatherAgent/stream
Header: x-mastra-dev-playground: true
Content-Type: application/json
threadId: My Roll Number (52)
runId: weatherAgent

yaml
Copy code

- `threadId` is set to my **Roll Number** as required.  
- No private keys are hardcoded in the repo.  
- Environment variables are stored safely in `.env.local` (and configured on Vercel for deployment).  

---

## 🛠️ Running Locally

1. Clone the repository:
   ```bash
   git clone https://github.com/nirbhayyyy18/pazago_weather_agent.git
   cd pazago_weather_agent
Install dependencies:

bash
Copy code
npm install
Create a .env.local file in the root folder:

ini
Copy code
NEXT_PUBLIC_WEATHER_AGENT_ENDPOINT=https://millions-screeching-vultur.mastra.cloud/api/agents/weatherAgent/stream
NEXT_PUBLIC_PLAYGROUND_HEADER=true
NEXT_PUBLIC_THREAD_ID=52   # My Roll Number
Run locally:

bash
Copy code
npm run dev
Open http://localhost:3000 in your browser.

📬 Submission Details
Name: Nirbhay Dileep Tiwari

Roll Number: 52

GitHub Repo: GitHub Link

Live Deployment: Vercel Link

✅ Notes
Built strictly using the instructions and provided API.

No extra libraries or services were used beyond what was required.

Tool call raw JSON events are filtered and only useful weather info is displayed.

yaml
Copy code
