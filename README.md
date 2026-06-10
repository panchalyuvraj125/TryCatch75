# TryCatch75 🎓

> **Smart attendance management for Indian engineering students. Never miss 75%.**

[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)](https://reactjs.org/)
[![Firebase](https://img.shields.io/badge/Firebase-Free%20Tier-FFCA28?logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-3-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## 🚀 What is TryCatch75?

TryCatch75 is a **free, production-grade** attendance tracker designed specifically for Indian engineering students who must maintain **≥75% attendance** to avoid being detained from exams.

Built with a **cyberpunk aesthetic**, it runs entirely on Firebase's free tier — zero cost to deploy and use.

### ✨ Key Features

| Feature | Description |
|---|---|
| 📊 **Smart Dashboard** | Subject cards with color-coded status (Safe/Danger/Critical) |
| 🎯 **Bunk Calculator** | Know exactly how many classes you can skip |
| 🔮 **What-If Simulator** | See your projected attendance with sliders |
| 📅 **Timetable Integration** | Auto-detect today's subjects for one-tap marking |
| 📈 **Analytics & Charts** | Weekly, monthly trends + subject distribution |
| 🔥 **Streak Tracking** | Current and longest attendance streaks |
| 🏫 **University Presets** | DBATU, Mumbai, Pune, VTU, GTU, RTU |
| 📱 **PWA Support** | Install on your phone — works offline |
| 📤 **Data Export** | CSV, printable reports, WhatsApp sharing |
| 🎮 **Gamification** | Bunk milestones and emoji rewards |
| 🌙 **Dark/Light Mode** | Cyberpunk dark theme by default |

---

## 🛠️ Tech Stack

- **Frontend:** React 18 + Vite 5
- **Styling:** TailwindCSS 3 + Custom CSS Variables
- **Animations:** Framer Motion 11
- **Charts:** Recharts 2
- **Backend:** Firebase Auth + Firestore (free tier)
- **Hosting:** Firebase Hosting (free)
- **PWA:** vite-plugin-pwa
- **Icons:** Lucide React
- **Dates:** date-fns 3
- **Notifications:** React Hot Toast 2

---

## 📦 Local Development Setup

### Prerequisites
- Node.js 18+ (recommended: 20+)
- npm or yarn
- A Firebase project (free)

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/your-username/trycatch75.git
cd trycatch75

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
# Edit .env with your Firebase config values

# 4. Start the dev server
npm run dev
```

The app will open at `http://localhost:5173`.

> **Note:** The app works in **demo mode** without Firebase config. You'll see a warning in the console, but the UI is fully functional with localStorage.

---

## 🔥 Firebase Setup

### 1. Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Add project" → Name it `trycatch75`
3. Disable Google Analytics (not needed)

### 2. Enable Authentication
1. Go to **Build → Authentication → Sign-in method**
2. Enable **Google** provider
3. Enable **Email/Password** provider (optional)

### 3. Enable Firestore
1. Go to **Build → Firestore Database**
2. Click "Create database"
3. Choose **Production mode**
4. Select nearest region (e.g., `asia-south1` for India)

### 4. Get Config Values
1. Go to **Project Settings → General**
2. Under "Your apps", click the web icon (`</>`)
3. Register the app and copy the `firebaseConfig` object
4. Paste values into your `.env` file:

```env
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=trycatch75.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=trycatch75
VITE_FIREBASE_STORAGE_BUCKET=trycatch75.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef
```

### 5. Deploy Security Rules
```bash
# Install Firebase CLI if not already installed
npm install -g firebase-tools
firebase login
firebase init  # Select Firestore rules
firebase deploy --only firestore:rules
```

---

## 🚀 Deployment

```bash
# Build and deploy to Firebase Hosting
npm run build
firebase deploy --only hosting

# Or in one command:
npm run deploy
```

Your app will be live at `https://trycatch75.web.app`

---

## 📐 Attendance Formulas

All formulas are implemented in `src/utils/attendanceCalc.js` as pure, testable functions:

| Formula | Description |
|---|---|
| `currentPercent(P, T)` | `(P / T) × 100` |
| `safeBunks(P, T, θ)` | `floor(T × (1 - θ/100)) - (T - P)` |
| `classesNeeded(P, T, θ)` | `ceil((θ × T/100 - P) / (1 - θ/100))` |
| `whatIfBunk(P, T, N)` | `P / (T + N) × 100` |
| `whatIfAttend(P, T, N)` | `(P + N) / (T + N) × 100` |
| `weeklyBunkBudget(...)` | Safe bunks per week for remaining semester |

Where: `P` = present, `T` = total, `θ` = threshold (default 75), `N` = additional classes

---

## 📂 Project Structure

```
trycatch75/
├── public/favicon.svg
├── src/
│   ├── main.jsx              # React 18 entry
│   ├── App.jsx                # Router + layout
│   ├── firebase.js            # Firebase init
│   ├── contexts/              # Auth + Theme providers
│   ├── hooks/                 # Attendance, Subjects, Timetable, Calculator
│   ├── pages/                 # Landing, Dashboard, Subjects, Mark, Timetable,
│   │                          # Calculator, Analytics, Settings, NotFound
│   ├── components/
│   │   ├── ui/                # Button, Card, Modal, Badge, ProgressRing
│   │   ├── layout/            # Navbar, Sidebar, ProtectedRoute
│   │   ├── dashboard/         # SubjectCard, OverallStats, AlertBanner
│   │   ├── calculator/        # BunkCalc, WhatIf, RecoveryPlanner
│   │   └── charts/            # WeeklyBar, MonthlyTrend, SubjectPie
│   ├── utils/                 # Math, dates, export, constants
│   └── styles/                # Tailwind + theme tokens
├── firebase.json
├── firestore.rules
└── package.json
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Guidelines
- Follow the existing code style
- Use pure functions in `utils/` for any new calculations
- Keep components focused and reusable
- Test on mobile viewports

---

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.

---

## 🙏 Acknowledgments

- Built for **DBATU** and all Indian engineering students
- Inspired by the universal struggle of maintaining 75% attendance
- Thanks to the Firebase team for the generous free tier

---

**TryCatch75** — *Because 75% is not just a number, it's survival.* 🎓
