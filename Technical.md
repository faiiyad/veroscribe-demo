
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
 │(port 4000)│       │ (port 3000)│
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

### Agent
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/agent/generate` | Generate AI-powered symptom analysis and recommendations |

#### POST `/api/agent/generate` body
```json
{
  "symptom": "fever and cough",
  "prompt": "Optional custom prompt for the AI model"
}
```

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