# TryCatch75

> **A sleek, cyberpunk-themed attendance tracker & smart bunk planner for college students. Never drop below 75% again!**

[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)](https://reactjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?logo=supabase&logoColor=white)](https://supabase.com/)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-3-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## What is TryCatch75?

TryCatch75 is a **free, production-grade** attendance tracker designed specifically for engineering students who must maintain **≥75% attendance** to avoid being detained from exams.

Built with a stunning **cyberpunk aesthetic**, it features real-time cloud sync, secure authentication, and cross-device support.

### Key Features

| Feature | Description |
|---|---|
| **Bunk Calculator** | Know exactly how many classes you can skip without falling into the danger zone. |
| **Interactive Timetable** | Auto-detect today's subjects for one-tap marking. Easily set up your recurring weekly schedule. |
| **Daily Briefings** | Start your day right with a quick overview of today's schedule and your current attendance standing. |
| **Onboarding Tour** | A guided, interactive tooltip tour for new users. |
| **Logbook & History** | A visual, color-coded interactive calendar tracking Present, Bunked, Pending, and Holidays. |
| **Shareable Schedules** | Generate custom links to instantly share your timetable with classmates. |
| **Cloud Sync** | Your data syncs securely across all your devices. |
| **Premium Cyberpunk UI** | Built with custom glass-morphism, subtle micro-animations, and a signature dark theme. |

---

## Tech Stack

- **Frontend:** React 18 + Vite 5
- **Styling:** TailwindCSS 3 + Custom CSS Variables
- **Animations:** Framer Motion 11
- **Guided Tours:** React Joyride
- **Backend:** Supabase (PostgreSQL + Auth + Realtime)
- **Dates:** date-fns 3
- **Notifications:** React Hot Toast
- **PWA:** Vite PWA Plugin

---

## Local Development Setup

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

# 3. Start the dev server
npm run dev
```

The app will open at `http://localhost:5173`.

---

## Attendance Formulas

All formulas are implemented in `src/utils/attendanceCalc.js` as pure, testable functions:

| Formula | Description |
|---|---|
| `currentPercent(P, T)` | `(P / T) x 100` |
| `safeBunks(P, T, theta)` | `floor(T x (1 - theta/100)) - (T - P)` |
| `classesNeeded(P, T, theta)` | `ceil((theta x T/100 - P) / (1 - theta/100))` |

Where: `P` = present, `T` = total, `theta` = threshold (default 75).

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## License

MIT License - see [LICENSE](LICENSE) for details.

---

**TryCatch75** - *Because 75% is not just a number, it's survival.*
