# PingNexa <img width="24" height="24" alt="activity" src="https://github.com/user-attachments/assets/9239e099-c5b4-4d5e-8150-f74ab0462397" />




PingNexa is a modern, free uptime monitoring dashboard built with Next.js, React, Tailwind CSS, and Firebase.

It lets users create monitors for URLs and view uptime status, latency trends, and recent ping history in a web dashboard.

PingNexa solves the problem of keeping track of website or API uptime without relying on complex external services. It gives developers and small teams an easy way to monitor endpoint health, notice downtime, and review performance history in one place.

---

## What PingNexa Does

- Tracks website and API availability over time
- Monitors multiple URLs with configurable intervals
- Displays uptime history and response latency
- Shows monitor status and recent ping results
- Supports authenticated users and per-user monitor data
- Uses a server-side ping proxy to avoid CORS restrictions
- Includes PWA-ready frontend support

---

## Features

- Add, edit, and remove URL monitors
- Pause and resume monitoring
- View historical ping logs and latest status
- Dashboard overview with uptime and latency metrics
- Google sign-in and user-specific dashboard data
- Responsive UI for desktop and mobile

---

## Who It’s For

PingNexa is useful for:

- developers who want a simple uptime dashboard for web services
- small teams monitoring staging or internal endpoints
- hobby projects that need basic status tracking
- anyone who wants instant visibility into monitor health and history

---

## Stack

- Next.js 16
- React 19
- Tailwind CSS
- GSAP
- Firebase Authentication
- Firestore
- next-pwa
- Axios
- date-fns

---

## Project Layout

```
src/
├── app/
│   ├── api/ping/route.ts
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── auth/
│   ├── dashboard/
│   ├── layout/
│   ├── monitor/
│   └── ui/
├── context/
├── hooks/
└── lib/
```

---

## Scripts

```bash
npm run dev
npm run dev:legacy
npm run build
npm run start
npm run lint
```
