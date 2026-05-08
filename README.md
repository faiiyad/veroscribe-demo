# VeroScribe — Patient Booking flow feature

A full-stack patient appointment booking system with a multi-step patient flow, physician selection, slot management, and an admin dashboard for managing booking statuses.

---

## Quick Start (Docker)

### 1. Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running
- A [MongoDB Atlas](https://www.mongodb.com/atlas) cluster (free tier works fine)

### 2. Configure environment

```bash
cp .env.example .env
```

Edit `.env` and set your MongoDB Atlas connection string:
```
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/patient-booking?retryWrites=true&w=majority
```

> **Tip:** In Atlas, go to your cluster → Connect → Drivers → copy the connection string.  
> Make sure your current IP is in the **Network Access** allowlist, or allow `0.0.0.0/0` for development.

### 3. Build and run

```bash
docker compose --env-file .env up --build
```

### 4. Open the app

| View | URL |
|------|-----|
| Patient booking flow | http://localhost/book |
| Admin dashboard | http://localhost/admin |
| Backend health check | http://localhost/api/health |

---

## Local Development (without Docker)

Run each service in a separate terminal.

### Backend
```bash
cd backend
npm install
MONGODB_URI=<your-uri> npm run dev
# Runs on http://localhost:4000
```

### Frontend
```bash
cd frontend
npm install
npm run dev
# Runs on http://localhost:3000
# Next.js rewrites /api/* → http://localhost:4000/api/*
```

> The proxy is only needed in Docker. In local dev, Next.js rewrites handle API routing.

### Seed data (manual)
```bash
cd backend
MONGODB_URI=<your-uri> npm run seed
```

The backend **auto-seeds** on first startup if no physicians exist in the database.

---

## Features

### Patient Flow (`/book`)
1. **Choose Physician** — browse cards for 4 mock physicians across specialties
2. **Select Date & Time** — scrollable 14-day date strip with available time slots; booked slots are filtered out
3. **Patient Details** — name, email (required), phone (optional), reason for visit
4. **Confirmation** — booking summary with pending status and reference ID
5. **Patient Dashboard** - review all your confirmed, pending and cancelled bookings in one place
6. **Polling** - Patient dashboard auto updates to reflect changes in booking status

### Admin Dashboard (`/admin`)
- Summary cards: total, pending, confirmed, cancelled counts
- Filter by status and/or physician
- One-click **Confirm** / **Cancel** / **Restore** / **Delete** actions



## Design Decisions & Tradeoffs

- **No auth**: Both patient and admin views are open. In production, the admin route would require physician/staff login (JWT or session + OAuth2).
- **Auto-seed**: Backend seeds mock physicians on first run. In production, this would be done seperately during migration of data.
- **Double-booking guard**: Both application-level check and MongoDB unique index prevent race conditions.


## Future improvements

- **Auth**: implement auth using sessions (passportjs + OAuth2), allowing personal accounts and preventing unwanted access
- **Chatbot / Chat system**: A chatbot that would guide the patient into selecting the most appropriate doctor. In serious cases, a trained employee could take over if needed.
- **Auto updates via websockets / SSE**: to ensure that status changes / bookings are updated instantaneously without need of polling. 