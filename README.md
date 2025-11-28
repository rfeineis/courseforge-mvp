# CourseForge

**Transform videos into interactive courses** - A local-first SaaS platform for creating engaging educational content from training videos.

## 🏗️ Architecture

CourseForge is built as a **Unified Monolith** with a clear separation between frontend and backend:

### Tech Stack

**Frontend:**
- React 19
- Vite (Build Tool)
- Tailwind CSS v4
- Shadcn UI (Component Library)
- Wouter (Routing)
- TanStack Query (Data Fetching)

**Backend:**
- Node.js 22
- Express 4
- tRPC v11 (End-to-End Type Safety)
- Zod (Validation)

**Database:**
- SQLite (Development) via `better-sqlite3`
- MySQL/TiDB Compatible (Production)
- Drizzle ORM

**AI Services:**
- Google Gemini (Content Generation via Manus API)
- 3-Tier Hybrid Transcription System

**Storage:**
- AWS S3 (via Manus storage helpers)

## 📁 Project Structure

```
courseforge/
├── package.json            # Root dependencies
├── drizzle.config.ts       # Database configuration
├── .env                    # Environment variables
├── server/                 # Backend
│   ├── index.ts            # Express entry point
│   ├── _core/              # System logic (Auth, tRPC)
│   │   ├── context.ts      # tRPC context
│   │   ├── trpc.ts         # tRPC initialization
│   │   └── app.ts          # Main router
│   ├── db/                 # Database
│   │   ├── index.ts        # SQLite connection
│   │   └── schema.ts       # Drizzle schema
│   └── routers/            # API routes
│       └── projects.ts     # Projects CRUD
└── client/                 # Frontend
    ├── vite.config.ts      # Vite configuration
    ├── index.html          # HTML entry
    └── src/
        ├── App.tsx         # Main app component
        ├── main.tsx        # React entry
        ├── index.css       # Tailwind styles
        └── lib/
            └── trpc.ts     # tRPC client
```

## 🚀 Getting Started

### Prerequisites

- Node.js >= 22.0.0
- pnpm (recommended) or npm

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd courseforge
   ```

2. **Install dependencies:**
   ```bash
   pnpm install
   ```

3. **Approve native build scripts:**
   ```bash
   pnpm approve-builds
   ```
   Select `better-sqlite3` and `esbuild`, then approve.

4. **Set up the database:**
   ```bash
   pnpm db:generate  # Generate migrations
   pnpm db:migrate   # Apply migrations
   ```

5. **Configure environment variables:**
   Copy `.env` and update with your API keys:
   ```bash
   cp .env .env.local
   ```

### Development

Start both frontend and backend in development mode:

```bash
pnpm dev
```

This will start:
- **Backend:** http://localhost:3000
- **Frontend:** http://localhost:5173
- **tRPC API:** http://localhost:3000/trpc

### Individual Services

Run services separately:

```bash
pnpm dev:server  # Backend only
pnpm dev:client  # Frontend only
```

### Database Management

```bash
pnpm db:generate  # Generate new migrations
pnpm db:migrate   # Apply migrations
pnpm db:studio    # Open Drizzle Studio (GUI)
```

## 🎯 Features (Planned)

- [ ] Video upload and processing
- [ ] AI-powered transcript generation (3-tier hybrid)
- [ ] Automatic slide generation from transcripts
- [ ] AI image generation for slides
- [ ] Interactive quiz builder
- [ ] SCORM export
- [ ] Course preview and player
- [ ] Learning objectives and metadata management

## 🔒 Environment Variables

Required environment variables (see `.env`):

```env
DATABASE_URL=sqlite:./sqlite.db
PORT=3000
NODE_ENV=development
OPENAI_API_KEY=your_api_key_here
```

## 📦 Build

Build for production:

```bash
pnpm build
```

This will:
1. Build the React frontend (output: `client/dist`)
2. Compile TypeScript backend (output: `dist`)

## 🧪 Database Schema

The database includes the following tables:

- **projects** - Course projects
- **lessons** - Individual slides/lessons
- **transcripts** - Raw transcript data
- **quiz_questions** - Assessment questions
- **course_meta** - Learning objectives and tags

## 🛠️ Development Notes

### Type Safety

CourseForge uses **tRPC v11** for end-to-end type safety. The backend types are automatically inferred in the frontend, eliminating the need for manual API type definitions.

### Local-First Design

This MVP is designed for local development. Cloud scaling features (authentication, multi-tenancy, cloud storage) will be added in future iterations.

## 📄 License

MIT

## 🤝 Contributing

Contributions are welcome! Please open an issue or submit a pull request.

---

**Built with ❤️ using the Unified Monolith architecture**
