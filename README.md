# Alpha Platform Take-Home Project

A full-stack research platform demo using Node.js, React, PostgreSQL, Redis, BullMQ, Prisma, and Socket.io.

## Project Overview
- **Backend:** Node.js + Express + Prisma + BullMQ + Socket.io
- **Frontend:** React (Vite) + Tailwind CSS
- **Database:** PostgreSQL
- **Queue:** Redis + BullMQ
- **Realtime:** WebSocket (Socket.io)

## Quick Start

1. **Clone the repo:**
   ```bash
   git clone <repo-url>
   cd Alpha\ Assignment
   ```
2. **Copy env file:**
   ```bash
   cp .env.example .env
   # Edit as needed
   ```
3. **Start everything with Docker Compose:**
   ```bash
   docker-compose up --build
   ```
4. **Seed the database (in another terminal):**
   ```bash
   docker-compose exec backend npm run seed
   ```
5. **Access the app:**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000

## API Reference

- `GET /people` — List all people
- `POST /enrich/:person_id` — Enqueue research job for a person
- `GET /context-snippets/:companyId` — Get latest research snippet for a company

## Running a Research Job

- **Via UI:**
  1. Open the frontend in your browser.
  2. Click "Run Research" for a person.
  3. Watch live progress and see results when complete.

- **Via API:**
  1. `POST /enrich/:person_id` to start a job.
  2. Listen for WebSocket events (`progress`, `complete`) on `/ws`.
  3. `GET /context-snippets/:companyId` to fetch the result.

## WebSocket Explanation
- The backend exposes a Socket.io server at `/ws`.
- During research jobs, events are emitted:
  - `progress`: `{ personId, companyId, iteration, message }`
  - `complete`: `{ personId, companyId }`
- The frontend listens for these events to show live updates.

## Postman Collection
See `AlphaPlatform.postman_collection.json` for ready-to-use API requests.

## Future Improvements
- Authentication & authorization
- Real search integration (e.g., SerpAPI)
- Rate limiting & abuse prevention
- Horizontal scaling for workers and API
- UI/UX polish, error handling, and tests

---
## Demo Video

Watch this short walkthrough video:
👉 [Loom Video Link Here](https://www.loom.com/share/your-video-id)

---
## Entity Relationship Diagram (ERD)

![ERD](docs/erd.png)


---
## Running Tests

```bash
cd backend
npm test

**Made with ❤️ for the Alpha take-home challenge.**
