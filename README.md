# 🏨 Shift Roster & Break Scheduler Intelligence System

> AI-Assisted Staff Scheduling System for the Food & Beverage Industry

---



## 📌 Project Overview

This project automates weekly staff scheduling for restaurants. Instead of manually writing rosters every week, managers can use this system to:

- Add staff and shifts from a browser dashboard
- Generate the full weekly roster in one click
- Automatically detect understaffing problems
- Receive instant Telegram notifications on their phone

---

## 🚀 Features

| Feature | Description |
|---|---|
| ➕ Add Staff | Add staff members directly from browser |
| 🔄 Toggle Availability | Mark staff as available or unavailable |
| 📅 Add Shifts | Create shifts with role requirements |
| ⚡ Generate Roster | One click auto-assigns staff to shifts |
| 🚨 Risk Detection | Automatically detects understaffing |
| 📱 Telegram Alerts | Manager receives phone notifications |
| 📊 Live Dashboard | Real-time roster and alert view |

---

## 🤖 5-Agent System

| Agent | Code | Role |
|---|---|---|
| Staff Availability Agent | STA-01 | Tracks staff hours and availability |
| Roster Optimization Agent | ROS-02 | Assigns staff to shifts efficiently |
| Labor Compliance Agent | LBR-03 | Enforces max working hour limits |
| Alert & Risk Agent | RSK-04 | Detects understaffing problems |
| Notification Agent | COM-05 | Sends Telegram alerts to manager |

---

## 🛠️ Technology Stack

| Technology | Purpose |
|---|---|
| Node.js | Backend runtime |
| Express.js | REST API server |
| HTML/CSS/JS | Frontend dashboard |
| JSON Files | Lightweight database |
| Telegram Bot API | Mobile notifications |
| dotenv | Environment configuration |

---

## 📁 Project Structure

```
shift-scheduler/
│
├── data/
│   ├── staff.json          ← Staff database
│   ├── shifts.json         ← Shift requirements
│   └── roster.json         ← Generated roster output
│
├── scripts/
│   ├── setup.js            ← Auto setup all JSON files
│   ├── assignShifts.js     ← Roster generation logic
│   ├── detectRisk.js       ← Understaffing detection
│   ├── notify.js           ← Console notifications
│   ├── telegramNotify.js   ← Telegram notifications
│   └── run.js              ← Master runner script
│
├── public/
│   └── index.html          ← Web dashboard UI
│
├── alerts/
│   └── alertLog.json       ← Alert and risk logs
│
├── server.js               ← Express backend server
├── .env                    ← Environment variables
├── .env.example            ← Environment template
├── .gitignore              ← Git ignore rules
├── package.json            ← NPM configuration
├── requirements.txt        ← Project requirements
└── README.md               ← This file
```

---

## ⚙️ Setup & Installation

### Step 1 — Clone the Repository
```bash
git clone https://github.com/YOUR_USERNAME/shift-scheduler.git
cd shift-scheduler
```

### Step 2 — Install Dependencies
```bash
npm install
```

### Step 3 — Setup Environment Variables
```bash
# Copy the example file
cp .env.example .env
```

Open `.env` and fill in your values:
```
MAX_HOURS_PER_WEEK=40
MIN_STAFF_LUNCH=2
MIN_STAFF_DINNER=3
TELEGRAM_BOT_TOKEN=your_telegram_bot_token_here
TELEGRAM_CHAT_ID=your_telegram_chat_id_here
```

### Step 4 — Setup Data Files
```bash
node scripts/setup.js
```

### Step 5 — Start the Server
```bash
node server.js
```

### Step 6 — Open Dashboard
```
http://localhost:3000
```

---

## 📋 All Commands

| Command | What it does |
|---|---|
| `npm install` | Install all packages |
| `node scripts/setup.js` | Create all JSON data files |
| `node scripts/assignShifts.js` | Generate roster only |
| `node scripts/detectRisk.js` | Detect understaffing only |
| `node scripts/notify.js` | Show notifications in terminal |
| `node scripts/telegramNotify.js` | Send Telegram messages |
| `node scripts/run.js` | Run all scripts together |
| `node server.js` | Start web dashboard |

---

## 🤖 Telegram Bot Setup

1. Open Telegram and search `@BotFather`
2. Send `/newbot` and follow instructions
3. Copy the **token** given by BotFather
4. Search your bot and send `hello`
5. Open this URL in browser:
   ```
   https://api.telegram.org/botYOUR_TOKEN/getUpdates
   ```
6. Copy the `id` from `"chat":{"id": YOUR_ID}`
7. Paste token and chat ID in `.env` file

---

## 🔒 Environment Variables

| Variable | Description | Example |
|---|---|---|
| `MAX_HOURS_PER_WEEK` | Max hours staff can work | `40` |
| `MIN_STAFF_LUNCH` | Min staff for lunch shift | `2` |
| `MIN_STAFF_DINNER` | Min staff for dinner shift | `3` |
| `TELEGRAM_BOT_TOKEN` | Your Telegram bot token | `7123...` |
| `TELEGRAM_CHAT_ID` | Your Telegram chat ID | `5086...` |

---

## 📊 Sample Output

### Generated Roster
```json
{
  "roster": [
    {
      "day": "Saturday",
      "session": "Lunch",
      "startTime": "11:00",
      "endTime": "15:00",
      "assigned": {
        "Waiter": ["Prakash", "Riya"],
        "Chef": ["Meena"],
        "Cashier": ["Kiran"]
      }
    }
  ]
}
```

### Alert Output
```json
{
  "alerts": [
    {
      "day": "Saturday",
      "session": "Dinner",
      "role": "Waiter",
      "required": 3,
      "assigned": 2,
      "status": "UNDERSTAFFED",
      "suggestions": [
        "Find part-time Waiter for Dinner",
        "Extend available Waiter shift by extra hours"
      ]
    }
  ]
}
```

---

## 🌐 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/staff` | Get all staff |
| GET | `/api/shifts` | Get all shifts |
| GET | `/api/roster` | Get generated roster |
| GET | `/api/alerts` | Get all alerts |
| POST | `/api/staff/add` | Add new staff |
| DELETE | `/api/staff/:id` | Delete staff |
| PATCH | `/api/staff/:id/toggle` | Toggle availability |
| POST | `/api/shifts/add` | Add new shift |
| DELETE | `/api/shifts/:id` | Delete shift |
| POST | `/api/generate` | Generate roster + send Telegram |

---

## 🔥 How It Works

```
Manager opens localhost:3000
           ↓
Adds staff members and shifts
           ↓
Clicks "Generate Roster" button
           ↓
System reads all staff availability
           ↓
Automatically assigns staff to shifts
           ↓
Detects any understaffing problems
           ↓
Sends Telegram alert to manager phone
           ↓
Dashboard updates instantly
```

---

## 📝 .gitignore

Make sure your `.gitignore` contains:
```
.env
node_modules/
```

This keeps your secret keys safe!

---



---

**Built with ❤️ by Nagraj **
