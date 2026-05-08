# MedBook — Patient Appointment Booking

A full-stack patient appointment booking system with a multi-step patient flow, physician selection, slot management, and an admin dashboard for managing booking statuses.

## Architecture

```
Browser
  │
  ▼
┌─────────────────────────────────────┐
│  Node.js Proxy  (port 80)           │
│  /api/*  ──▶  Express Backend       │
│  /*      ──▶  Next.js Frontend      │
└─────────────────────────────────────┘
       │                    │
       ▼                    ▼
 ┌───────────┐       ┌────────────┐
 │ Express   │       │  Next.js   │
 │ (port 4000│       │ (port 3000)│
 └─────┬─────┘       └────────────┘
       │
       ▼
 MongoDB Atlas
```

### Services
| Service  | Port | Description |
|----------|------|-------------|
| proxy    | 80   | **nginx** reverse proxy — routes traffic |
| backend  | 4000 | Express.js REST API |
| frontend | 3000 | Next.js App Router UI |

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

### Admin Dashboard (`/admin`)
- Summary cards: total, pending, confirmed, cancelled counts
- Filter by status and/or physician
- One-click **Confirm** / **Cancel** / **Restore** actions
- Inline status updates (no page reload)

### Booking Statuses
| Status | Meaning |
|--------|---------|
| `pending` | Submitted by patient, awaiting review |
| `confirmed` | Approved by physician/admin |
| `cancelled` | Cancelled (can be restored to pending) |

---

## API Reference

### Physicians
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/physicians` | List all active physicians |
| GET | `/api/physicians/:id` | Get a single physician |
| GET | `/api/physicians/:id/slots` | Get available slots (next 14 days) |

### Bookings
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/bookings` | Create a new booking |
| GET | `/api/bookings` | List bookings (supports `?status=`, `?physicianId=`) |
| GET | `/api/bookings/:id` | Get a single booking |
| PATCH | `/api/bookings/:id/status` | Update booking status |
| DELETE | `/api/bookings/:id` | Hard delete a booking |

#### POST `/api/bookings` body
```json
{
  "physicianId": "...",
  "slotDate": "2025-07-14",
  "slotTime": "09:30",
  "patientName": "Jane Smith",
  "patientEmail": "jane@example.com",
  "patientPhone": "+1 555 000 0000",
  "reasonForVisit": "Annual check-up"
}
```

#### PATCH `/api/bookings/:id/status` body
```json
{
  "status": "confirmed",
  "adminNotes": "Confirmed via phone"
}
```

---

## Mock Physicians

| Physician | Specialty | Working Days |
|-----------|-----------|--------------|
| Dr. Sarah Chen | Cardiology | Mon–Fri |
| Dr. James Okafor | General Practice | Mon–Fri |
| Dr. Priya Patel | Neurology | Mon, Wed, Fri |
| Dr. Michael Torres | Orthopaedic Surgery | Tue, Thu |

---

## Data Models

### Physician
```
name, specialty, bio, initials, avatarColor
workDays: [0-6]   (0=Sun, 6=Sat)
workTimes: ["09:00", "09:30", ...]
isActive: boolean
```

### Booking
```
physician (ref), physicianName, physicianSpecialty
slotDate (YYYY-MM-DD), slotTime (HH:MM)
patientName, patientEmail, patientPhone, reasonForVisit
status: pending | confirmed | cancelled
adminNotes
```

Double-booking prevention: compound unique index on `(physician, slotDate, slotTime)`.

---

## Design Decisions & Tradeoffs

- **No auth**: Both patient and admin views are open. In production, the admin route would require physician/staff login (JWT or session + OAuth).
- **Slot generation**: Computed dynamically on each request (physician schedule minus active bookings). Simple and always fresh; doesn't scale to thousands of concurrent users without caching.
- **Auto-seed**: Backend seeds mock physicians on first run. In production, this would be a separate migration step.
- **Denormalised physician info on bookings**: `physicianName` and `physicianSpecialty` are stored on the booking to remain readable if the physician record changes.
- **Double-booking guard**: Both application-level check and MongoDB unique index prevent race conditions.
