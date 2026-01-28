# Pastebin Clone

A lightweight, ephemeral text-sharing application built with Node.js and Redis.

## How to Run Locally
1. **Clone & Install:** `npm install`
2. **Redis:** Ensure a Redis server is running (default `localhost:6379`).
3. **Env:** Create a `.env` file with `REDIS_URL` and `BASE_URL`.
4. **Start:** `npm run dev`

## Persistence Layer
- **Redis:** I used Redis because it natively supports **TTL (Time-To-Live)**, making the time-based expiry requirement extremely efficient to implement. It also allows for atomic increments of view counts.

## Design Decisions
- **Deterministic Time:** Implemented a `getNow` utility to support `TEST_MODE=1`, ensuring automated tests can predict expiration.
- **Security:** HTML content is escaped to prevent XSS (Script Execution) while using `<pre>` tags to maintain text formatting.
- **Availability:** Constraints (TTL and View Counts) are checked on every request to ensure high consistency.