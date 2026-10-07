# Sankalp Setu

A hospital and patient bridge platform: patients register with a hospital, the hospital and doctor teams manage them from their dashboards, queue numbers move live over WebSocket, and patient details go out as SMS alerts.

## Features

- Public patient registration with hospital search and suggestions
- Doctor dashboard with live queue numbers over Socket.IO and the patient list
- Hospital dashboard for managing doctors and patients
- Super admin console to onboard hospitals and doctors
- Session based auth with bcrypt password hashing, sessions stored in MySQL
- SMS notifications to patients through Twilio

## Repository layout

| Path | What it is |
| --- | --- |
| `server.js` | Express entry point with Socket.IO setup |
| `routes/` | Auth, dashboard, patient and SMS routes |
| `admin/`, `public/` | EJS views for the dashboards and public pages |
| `config/`, `styles/`, `assets/` | Database pool, CSS and images |
| `br-sankalp-setu.pptx` | Project presentation (PowerPoint) |
| `SankalpSetu-Show01.pdf` | The same presentation exported as PDF |

## Stack

Node.js, Express, EJS, MySQL through mysql2, Socket.IO, express-session with express-mysql-session, bcryptjs, multer, Twilio.

## Running it

```bash
npm install
cp .env.example .env
npm start
```

The server listens on `http://localhost:3000`.

`.env` needs your MySQL credentials (`DB_HOST`, `DB_USER`, `DB_PASS`, `DB_NAME`) and a `SESSION_SECRET`. The schema uses three tables: `hospitals`, `doctors` and `patients`. Twilio values (`TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_FROM`) are optional, without them the SMS route answers with a "not configured" error instead of crashing.

## Notes

- Only the latest snapshot of the app (May 2026) is published here, the older development snapshots were left out.
- `uploads/` (test patient photos) and `assets/home.png` (121 MB, over the GitHub 100 MB per file limit) are not committed. Copy them in locally if you want the original uploads and hero image.

## License

MIT
