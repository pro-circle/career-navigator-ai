# AIHire Pro — Getting Started

The app is a TanStack Start SSR site. AI calls are proxied through the server, so users never see or configure API keys — you (the operator) put the Groq key in `.env`.

## 1. Configure environment

Copy the example file and fill in the key(s):

```bash
cp .env.example .env
```

`.env` values:

| Var | Required | Where it runs | Notes |
| --- | --- | --- | --- |
| `GROQ_API_KEY` | **Yes** for AI features | Server only | Free key at <https://console.groq.com>. Never shipped to the browser. |
| `VITE_SUPABASE_URL` | Optional | Browser | Anon-only project URL. |
| `VITE_SUPABASE_ANON_KEY` | Optional | Browser | Safe to expose (RLS-scoped). |

## 2. Run locally

```bash
bun install
bun run dev
```

Open the URL Vite prints (usually `http://localhost:8080`). Every AI-powered surface (chat docks, Resume Studio, Mock Interview, external job analyzer, Prep Roadmap) hits `/api/ai/*` on the server, which uses `GROQ_API_KEY`. If the key is missing the endpoints return **503** and the UI shows a "Server AI not configured" toast — configure `.env` and restart `bun run dev`.

## 3. Persist data (optional)

Data is kept in `localStorage` by default. To sync across devices:

1. Create a free project at <https://supabase.com>.
2. Open **SQL Editor → New query**, paste [`supabase/schema.sql`](supabase/schema.sql), and **Run**.
3. Copy your **Project URL** and **anon key** from **Project Settings → API** into `.env` (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`).
4. Restart `bun run dev`. Every job/candidate is upserted to Supabase; refresh to reload.

Tighten the seed RLS in `supabase/schema.sql` before shipping publicly.

## 4. Feed data

- `Recruiter → Jobs → New Job` — full form (title, description, required skills, deadline…).
- Open a job → **Applicants** tab to review, shortlist, change stage.
- `Candidate → Profile` — edit profile, hyperlinks, skills.
- Empty **Jobs** page → **Load demo data** to seed two jobs and one candidate.

## 5. Settings

The in-app **Settings** panel now manages the signed-in user's profile only: full name, email, job title, role, timezone, notifications, compact mode. No API keys are exposed to end-users.

## 6. Deploy

```bash
bun run build
bun run start
```

Deploy the TanStack Start output (Cloudflare Worker target by default) to any supported host. Set `GROQ_API_KEY` and optional `VITE_SUPABASE_*` in the host's env config — do not commit `.env`.

---

### Where AI is used
- **Recruiter Intelligence** and **Personal Trainee** chat docks (streaming).
- **Resume Studio** — ATS analysis, cover-letter, translator.
- **Mock Interview** — question generation and answer evaluation.
- **External Job Analyzer** — role-fit + prep plan.
- **Prep Roadmap** — generated after interview completion.
