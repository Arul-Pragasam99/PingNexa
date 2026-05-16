# RenderPing 📡

> Smart uptime monitoring — keeps your Render (and any free-tier) apps from sleeping.

Built with **Next.js 14 · Tailwind CSS · GSAP · Firebase (Auth + Firestore)**.

---

## 🚀 Quick Start

### 1. Install dependencies

```bash
npm install
```

### 2. Set up Firebase

1. Go to [Firebase Console](https://console.firebase.google.com) → **Create project**
2. Enable **Authentication** → Sign-in method → **Google** → Enable
3. Enable **Firestore Database** → Start in production mode
4. Go to **Project Settings** → **Your Apps** → Add a **Web App**
5. Copy the config values

### 3. Configure environment variables

Rename `.env.local` is already created. Fill in your values:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=...
```

### 4. Set Firestore security rules

In Firebase Console → Firestore → Rules, paste:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Users can only read/write their own profile
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Monitors belong to their owner
    match /monitors/{monitorId} {
      allow read, write: if request.auth != null
        && (resource == null || resource.data.userId == request.auth.uid)
        && (request.resource == null || request.resource.data.userId == request.auth.uid);
    }

    // Ping logs belong to their owner
    match /pingLogs/{logId} {
      allow read, write: if request.auth != null
        && (resource == null || resource.data.userId == request.auth.uid)
        && (request.resource == null || request.resource.data.userId == request.auth.uid);
    }
  }
}
```

### 5. Create Firestore Indexes

The ping history query requires a composite index. Firebase will show you a link
to create it automatically when the query first runs, OR create manually:

- Collection: `pingLogs`
- Fields: `userId` (Ascending), `timestamp` (Descending)

And for monitor history:

- Collection: `pingLogs`
- Fields: `monitorId` (Ascending), `timestamp` (Descending)

### 6. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 📁 Project Structure

```
src/
├── app/
│   ├── api/ping/route.ts      ← Server-side ping proxy (no CORS)
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx               ← Landing (logged out) / Dashboard (logged in)
├── components/
│   ├── auth/
│   │   └── ProfilePanel.tsx   ← User profile + stats
│   ├── dashboard/
│   │   └── DashboardHome.tsx  ← Overview stats + recent activity
│   ├── layout/
│   │   ├── DashboardLayout.tsx
│   │   ├── LandingPage.tsx
│   │   ├── Navbar.tsx
│   │   └── Sidebar.tsx
│   ├── monitor/
│   │   ├── AddMonitorModal.tsx
│   │   ├── EditMonitorForm.tsx
│   │   ├── MonitorCard.tsx
│   │   ├── MonitorDetail.tsx  ← Detail view + ping history
│   │   ├── MonitorList.tsx
│   │   └── PingHistoryTable.tsx
│   └── ui/
│       ├── ConfirmDialog.tsx
│       ├── FullPageLoader.tsx
│       ├── SkeletonCard.tsx
│       ├── StatusBadge.tsx
│       └── ToastContainer.tsx
├── context/
│   ├── AuthContext.tsx         ← Google Sign-In state
│   ├── MonitorsContext.tsx     ← Monitor CRUD state
│   └── ToastContext.tsx        ← Global toast notifications
├── hooks/
│   ├── useGsapReveal.ts       ← GSAP animation helpers
│   └── usePingScheduler.ts    ← Core: drives all timed pings
├── lib/
│   ├── firebase.ts            ← Firebase app init
│   ├── firestore.ts           ← All Firestore read/write ops
│   ├── pinger.ts              ← Calls the /api/ping proxy
│   └── utils.ts               ← Helpers, formatters
└── types/
    └── index.ts               ← TypeScript types
```

---

## ⚙️ How Pinging Works

1. **`usePingScheduler`** hook runs in `DashboardLayout` (always mounted when logged in).
2. For each active (non-paused) monitor, it creates a `setInterval` with the monitor's interval.
3. On each tick → calls `/api/ping?url=...` (Next.js Edge API route, no CORS).
4. Result is saved to Firestore (`pingLogs` collection) and the monitor document is updated.
5. UI updates optimistically via `MonitorsContext.updateLocal`.

---

## 🌐 Deploying

### Vercel (recommended)

```bash
npm i -g vercel
vercel
```

Add all `NEXT_PUBLIC_FIREBASE_*` env vars in the Vercel dashboard.

### Render / Railway / Fly.io

```bash
npm run build
npm start
```

---

## 🔒 Security Notes

- **Never commit `.env.local`** — it's in `.gitignore`
- Firebase API keys for web apps are public by design (protected by Firestore Rules + Auth)
- Always set proper Firestore security rules (see above)
- The `/api/ping` route only fetches HEAD requests to minimize data exposure

---

## 📊 Firestore Data Model

```
users/{uid}
  ├── uid, name, email, photoURL, provider
  ├── createdAt, lastLoginAt
  └── totalPings, totalMonitors

monitors/{monitorId}
  ├── userId, name, url, intervalMinutes
  ├── status, isPaused
  ├── lastCheckedAt, lastLatencyMs
  ├── uptime7d, uptime30d
  ├── totalPings, successPings, failedPings
  ├── alertOnDown, alertEmail, notesOrTag
  └── createdAt, updatedAt

pingLogs/{logId}
  ├── monitorId, userId, url
  ├── result (success|error|timeout)
  ├── statusCode, latencyMs, errorMessage
  └── timestamp
```
