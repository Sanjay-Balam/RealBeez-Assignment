# Real Beez - Job Board Project

A full-stack web application for posting and discovering real estate job opportunities. Built with Next.js, ElysiaJS, and MongoDB.

## Tech Stack

### Backend
- **Runtime:** Bun
- **Framework:** ElysiaJS
- **Database:** MongoDB (Mongoose)
- **Language:** TypeScript

### Frontend
- **Framework:** Next.js 16 (App Router)
- **UI:** React 19, Tailwind CSS v4
- **State Management:** Jotai
- **Rich Text Editor:** TipTap
- **Language:** TypeScript

## Project Structure

```
├── backend/
│   └── src/
│       ├── config/db.ts              # MongoDB connection (singleton)
│       ├── models/job.ts             # Job schema
│       ├── controllers/jobController.ts
│       ├── routes/
│       │   ├── jobRoutes.ts          # GET /jobs, DELETE /jobs/:id
│       │   └── createJobRoute.ts     # POST /create/job
│       └── index.ts                  # Server entry point
│
└── frontend/
    └── src/
        ├── app/
        │   ├── page.tsx              # Home (job form + listings)
        │   └── jobs/page.tsx         # Job listings page
        ├── components/
        │   ├── Navbar.tsx
        │   ├── JobForm.tsx
        │   ├── JobList.tsx
        │   ├── JobCard.tsx
        │   └── RichTextEditor.tsx
        └── lib/
            ├── api.ts                # API client
            ├── atoms.ts              # Jotai atoms
            └── types.ts              # TypeScript types
```

## Features

- **Create Job Postings** — Title, location, salary, employment type, role type, experience, education, skills, languages, property types, and a rich text description
- **Rich Text Editor** — Bold, italic, underline, lists, text alignment, links, images, code blocks, undo/redo, and word count
- **Browse Jobs** — View all posted jobs with time-ago timestamps and detailed cards
- **Delete Jobs** — Hover to reveal delete button with optimistic UI updates
- **Preview Mode** — Live preview of job posting before submission
- **Responsive Design** — Mobile-friendly layout

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/jobs` | Get all jobs |
| `POST` | `/create/job` | Create a new job |
| `DELETE` | `/jobs/:id` | Delete a job by ID |

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) (for backend)
- [Node.js](https://nodejs.org/) (for frontend)
- MongoDB Atlas account or local MongoDB instance

### Backend

```bash
cd backend
bun install
```

Create a `.env` file in the `backend/` directory:

```env
MONGODB_URI=your_mongodb_connection_string
DB_NAME=jobboard
PORT=3001
```

Start the development server:

```bash
bun run dev
```

The backend runs at `http://localhost:3001`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend runs at `http://localhost:3000`.

### Other Frontend Scripts

```bash
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Database Schema

**Job**

| Field | Type | Required |
|-------|------|----------|
| `title` | String (max 200) | Yes |
| `location` | String | Yes |
| `fixedSalary` | String | Yes |
| `jobRoleType` | String | No |
| `employmentType` | `"full-time"` \| `"part-time"` | Yes |
| `educationalQualification` | String | No |
| `experienceRequired` | String | Yes |
| `requiredSkills` | String[] | No |
| `languageRequirements` | String[] (min 1) | Yes |
| `propertyTypes` | String[] | No |
| `description` | String | Yes |
