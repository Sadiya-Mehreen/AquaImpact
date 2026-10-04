# 🌊 AquaImpact

**Turn every observation into impact.**

A mobile-first community & gamification platform for freshwater citizen science, built for the **IEEE OneAquaHealth Global Hackathon 2026 — Track 5: Community & Gamification**.

AquaImpact solves the repeat-engagement problem in citizen science with one loop:

**Observe → Verify → Earn → Unlock → Contribute → Return**

The three signature features (built exceptionally deep, per the product spec):

1. **💧 Impact Credits** — reward *verified* contribution, not generic points.
2. **🌎 Community Challenges** — turn individual actions into a shared, visible community goal.
3. **📜 Impact Passport** — a lasting, shareable environmental portfolio.

---

## Tech stack

| Layer | Choice |
|---|---|
| Frontend | React 18 + TypeScript + Vite + Tailwind CSS + Framer Motion + React Router + lucide-react |
| Backend | Node.js + Express |
| Data | JSON-file datastore (`backend/data.json`) — see note below |

### Why a JSON-file store instead of SQLite

The spec's preferred backend was Node/Express/SQLite. `better-sqlite3` requires compiling a native addon against Node's headers, which are fetched from `nodejs.org` at install time — a host this build environment's network allow-list doesn't include, so `npm install` would fail here. Rather than risk that in whatever environment this gets judged in, `backend/db.js` implements the exact same repository-style interface (`load()`, `save()`, `getState()`, `resetDemo()`) over a single JSON file. It's a drop-in seam: if you want real SQLite, swap `db.js`'s internals for `better-sqlite3` calls — none of `server.js`'s route logic needs to change.

---

## Project structure

```
aquaimpact/
├── package.json          # root convenience scripts (install:all, dev, build, reset-demo)
├── backend/
│   ├── server.js          # Express API — all routes
│   ├── db.js               # seed data + JSON-file persistence
│   ├── reset-demo.js       # CLI: reset demo data without starting the server
│   └── data.json           # created on first run (gitignore this in real use)
└── frontend/
    ├── src/
    │   ├── pages/           # Landing, Auth, Dashboard, Missions, Observe,
    │   │                     # Verification, Community, Passport, Rewards
    │   ├── components/      # Button (ripple), WaterWaves, ProgressBar,
    │   │                     # CreditBurst, AppLayout (nav), CertificateModal, ...
    │   ├── context/          # AppContext — current user, toasts, auth
    │   └── lib/api.ts        # typed fetch client for the backend
    └── dist/                # production build output (after `npm run build`)
```

---

## Setup & run

**Requirements:** Node.js 18+ (tested on Node 22) and npm. No database or external services required.

### Option A — one command from the repo root

```bash
cd aquaimpact
npm run install:all   # installs backend + frontend dependencies
npm run dev            # runs both servers together (backend :4000, frontend :5173)
```

Open **http://localhost:5173**.

### Option B — two terminals (manual)

```bash
# Terminal 1
cd aquaimpact/backend
npm install
npm run dev             # → http://localhost:4000

# Terminal 2
cd aquaimpact/frontend
npm install
npm run dev             # → http://localhost:5173 (proxies /api to :4000)
```

### Production build

```bash
cd aquaimpact/frontend
npm run build            # type-checks with tsc, then builds to dist/
npm run preview          # serves the production build on :5174, still proxying /api to :4000
```

The frontend is a static SPA — `dist/` can be deployed to any static host (Vercel, Netlify, S3, etc.) as long as `/api/*` is proxied or rewritten to wherever `backend/server.js` is running. The backend is a single Express process — deploy it anywhere Node runs (Render, Railway, Fly.io, a VM, etc.) and point `frontend/vite.config.ts`'s proxy (dev) or your host's rewrite rule (prod) at it.

---

## Demo mode

The app is seeded with a believable, internally-consistent demo state on first run:

- **Demo account:** `sadiya@aquaimpact.dev` / `demo1234` (or just tap **Continue with Google** on the login screen — it's simulated and signs you straight into this account, clearly labeled as such in a toast).
- **Starting state:** Sadiya Mehreen, 1,250 Impact Credits, 42 verified observations, 8 locations, 4-week streak. Community challenge at **327 / 500** — matching the dashboard mock exactly.
- **After you complete one observation:** the challenge moves to **328 / 500** and the verification screen animates that exact transition — matching the spec's verification/community mocks.

**Suggested judge walkthrough** (mirrors the spec's "final demo story"):

1. Land on the homepage → **Start Contributing** → sign up (or **Continue with Google** to jump straight into the populated demo account).
2. **Dashboard** → see Impact Credits, today's mission, community challenge, passport preview.
3. Tap **Start Mission** (or the Observe tab) → pick a location, select 1+ categories, optionally attach a photo, add a description → **Submit Observation**.
4. Watch the **verification** screen: ripple → "Verifying..." → "Contribution verified" → credits float in with a breakdown → community challenge bar animates forward.
5. Back on the **Dashboard**, credits and mission status are updated live.
6. **Community** tab shows the same updated challenge total, a live activity feed (your action is now at the top), and a tappable stylized map.
7. **Passport** shows the new contribution in the timeline, updated stats, and achievement badges — with a **Generate Certificate** (printable) and **Share Passport** action.
8. **Impact Rewards** (via the Dashboard's "View Impact Rewards" link or the sidebar) — unlock a reward once you have enough credits; the balance updates immediately.

To reset back to the pristine seed state at any time:
- Click **Reset demo data** in the desktop sidebar (or mobile Passport → profile area), **or**
- `POST http://localhost:4000/api/demo/reset`, **or**
- `npm run reset-demo` from the project root (no server needed).

---

## Verification performed

- `tsc -b --noEmit` — clean, no type errors.
- `npm run build` — production build succeeds (`vite build`).
- Full backend API walkthrough via curl: signup, login, demo login, mission completion (including duplicate-completion 409 guard), observation submission (both with and without photo evidence — confirms the +50 / +70 credit breakdown), the 30-second duplicate-submission-per-location guard (429), community challenge increment (327→328), achievement unlocking, reward unlocking (including the "not enough credits" and "locked/partner reward" 400 guards), and the demo reset endpoint.
- A full headless end-to-end run of the actual compiled production bundle (via jsdom, driving real clicks/typing against the real running backend) covering: landing → signup validation → account creation → sign out → simulated Google login into the demo account → dashboard stats → starting a mission → the Observe form → the verification animation sequence → confirmed the dashboard, community, and passport screens all reflect the new credits/progress/timeline entry → unlocking a reward and confirming the balance deducts correctly. All 25 assertions passed against the real production build.

---

## Notable implementation decisions

- **Camera capture** uses a native `<input type="file" accept="image/*" capture="environment">`, which opens the device camera on mobile browsers and a file picker on desktop — no extra permissions/camera library needed.
- **"Use My Location"** uses the browser Geolocation API and snaps to the nearest of the four demo waterbodies (Jakkur, Ulsoor, Hebbal, Bellandur) by great-circle distance; falls back gracefully if permission is denied.
- **Community map** is intentionally stylized (per the spec's "MVP can be a stylized map if a real map API is unnecessary") rather than wired to a paid maps API.
- **"Continue with Google"** is simulated (clearly labeled via a toast) and signs the person into the seeded demo account — there's no real OAuth flow, appropriate for a hackathon prototype.
- **Impact Certificate** renders a real on-screen certificate; "Generate Certificate" opens it and offers **Print / Save as PDF** via the browser's native print dialog rather than bundling a PDF-generation library.
- Every reward and mission enforces its guards server-side (can't double-complete a mission, can't unlock a locked/partner reward, can't overspend credits, can't spam the same location for credits) — the frontend reflects state but isn't the source of truth.
