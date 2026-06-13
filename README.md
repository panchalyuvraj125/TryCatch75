# TryCatch75 ⚡🎯

> **A sleek, cyberpunk-themed attendance tracker & smart bunk planner for college students. Never drop below 75% again!**

[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)](https://reactjs.org/)
[![Firebase](https://img.shields.io/badge/Firebase-Free%20Tier-FFCA28?logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-3-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## 🚀 What is TryCatch75?

TryCatch75 is a **free, production-grade** attendance tracker designed specifically for engineering students who must maintain **≥75% attendance** to avoid being detained from exams. 

Built with a stunning **cyberpunk aesthetic**, it runs entirely on Firebase's free tier — zero cost to deploy and use.

### ✨ Key Features (V2)

| Feature | Description |
|---|---|
| 🎯 **Bunk Calculator** | The ultimate **Bunk Planner**: Know exactly how many classes you can skip without falling into the danger zone. |
| 📅 **Interactive Timetable** | Auto-detect today's subjects for one-tap marking. Easily set up your recurring weekly schedule. |
| 📊 **Daily Briefings** | Start your day right with a quick overview of today's schedule and your current attendance standing. |
| 🗺️ **Onboarding Tour** | A guided, interactive tooltip tour for new users to get them set up flawlessly on day one. |
| 🔮 **Logbook & History** | A visual, color-coded interactive calendar tracking Present (🟢), Bunked (🔴), Pending (🟠), and Holidays (⚪). |
| 📤 **Shareable Schedules** | Generate custom links to instantly share your exact timetable and subjects with your classmates. |
| 🌙 **Premium Cyberpunk UI** | Built with custom glass-morphism, subtle micro-animations, and a signature dark theme. |

---

## 🛠️ Tech Stack

- **Frontend:** React 18 + Vite 5
- **Styling:** TailwindCSS 3 + Custom CSS Variables
- **Animations:** Framer Motion 11
- **Guided Tours:** React Joyride
- **Backend:** Firebase Auth + Firestore (free tier)
- **Hosting:** Firebase Hosting (free)
- **Dates:** date-fns 3
- **Notifications:** React Hot Toast

---

## 📦 Local Development Setup

### Prerequisites
- Node.js 18+ (recommended: 20+)
- npm or yarn

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/panchalyuvraj125/TryCatch75.git
cd TryCatch75

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
# Edit .env with your Firebase config values

# 4. Start the dev server
npm run dev
```

The app will open at `http://localhost:5173`.

> **Note:** The app fully supports a **demo mode** using localStorage if you don't supply Firebase credentials.

---

## 📐 Attendance Formulas

All formulas are implemented in `src/utils/attendanceCalc.js` as pure, testable functions:

| Formula | Description |
|---|---|
| `currentPercent(P, T)` | `(P / T) × 100` |
| `safeBunks(P, T, θ)` | `floor(T × (1 - θ/100)) - (T - P)` |
| `classesNeeded(P, T, θ)` | `ceil((θ × T/100 - P) / (1 - θ/100))` |

Where: `P` = present, `T` = total, `θ` = threshold (default 75).

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.

---

**TryCatch75** — *Because 75% is not just a number, it's survival.* 🎓
