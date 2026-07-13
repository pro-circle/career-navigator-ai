# AIHire Pro — Getting Started

Runs 100% in the browser. No cloud backend is required to try the app; connect Supabase + Groq (both keys pasted into Settings) to persist data and get live agentic AI.

## 1. Run locally

```bash
bun install
bun run dev
```

Open the URL Vite prints (usually `http://localhost:8080`). The app boots empty — you'll see empty states everywhere until you create data.

## 2. Add the AI key (agentic responses)

1. Get a **free** Groq API key at <https://console.groq.com>.
2. In the running app, click the **Settings** button (bottom-right in the recruiter/candidate workspace).
3. Paste the key under **Agentic AI → Groq API Key**, click **Save**, then **Test AI**.
4. Status flips to `LIVE`. All chat, resume analysis, interview questions and cover-letter generation now stream real completions.

Without a key the app stays usable in **MOCKED** mode (structured placeholder responses).

## 3. Persist data to Supabase (optional)

Data is kept in `localStorage` by default. To persist across devices:

1. Create a free project at <https://supabase.com>.
2. Open **SQL Editor → New query**, paste the contents of [`supabase/schema.sql`](supabase/schema.sql), and **Run**.
3. Copy your **Project URL** and **anon / publishable key** from **Project Settings → API**.
4. In AIHire Pro, open **Settings**, paste both under **Supabase**, click **Save**, then **Test connection** (expect HTTP 200/404).

From now on every job or candidate you create is upserted to your Supabase tables. The seed policy is fully open for local demos — tighten RLS before shipping publicly.

## 4. Feed real data

Two ways:

**A. Through the UI**
- `Recruiter → Jobs → New Job` — full form for a role (title, description, required skills, deadline…).
- Open a job → **Applicants** tab to review, shortlist, and change stage.
- `Candidate → Profile` — edit your own profile, hyperlinks, and skills.

**B. Seed sample data**
- On an empty **Jobs** page, click **Load demo data** to insert two jobs + one candidate so you can explore all screens.

**C. Bulk import (Supabase)**
- Any row you `INSERT` directly into `public.jobs` / `public.candidates` shows up on the next reload.
- Use **Reload from Supabase** in Settings (or refresh the browser) to sync.

## 5. Deploy

For local-only exploration you're done. To ship:

```bash
bun run build
bun run start   # serves the production build
```

Or deploy the TanStack Start output to any Node/Cloudflare-compatible host.

---

### Where AI is used
- **Recruiter Intelligence** and **Personal Trainee** chat docks (streaming).
- **Resume Studio** — ATS analysis, cover-letter, translator.
- **Mock Interview** — question generation and answer evaluation.
- **Prep Roadmap** — generated after interview completion.

### Environment variables
None required. All keys live in browser `localStorage` under `aihire.settings.v1`. Clear them any time from Settings → Clear.
