# AIHire Pro — UI Shell Build Plan

Scope: fully navigable UI covering every feature area from the spec, with mocked AI outputs with light/dark mode. No login/registration. No Lovable Cloud. A settings drawer lets the user paste a Supabase URL + anon key (stored in localStorage) so a real DB can be wired later.

## Design Foundation (locked)

Direction: **Neon Precision (dark)** — port tokens verbatim.

- Background `#0A0F14`, surface `#151B23`, border `#2D3748`
- Accent `#3B82F6` (recruiter), success `#10B981` (candidate)
- Fonts: Inter (body), JetBrains Mono (metrics/labels), loaded via `<link>` in `__root.tsx`
- Radius: 2xl surfaces, mono uppercase micro-labels, thin dividers, left-border accent for ranked items
- Motion: restrained — subtle hover borders and progress fills only

## Routing (TanStack Start, file-based)

```
src/routes/
  __root.tsx                 head metadata, fonts, providers, settings drawer mount
  index.tsx                  Landing / role picker
  recruiter/
    route.tsx                Recruiter shell (sidebar + Outlet)
    index.tsx                Dashboard (KPIs, active jobs, pipeline)
    jobs.tsx                 Jobs list + "New Job" dialog
    jobs.$jobId.tsx          Job detail w/ ranked candidates
    candidates.tsx           All candidates + filters
    candidates.$id.tsx       Candidate detail (AI summary, portfolio, ranking rationale)
    compare.tsx              Side-by-side candidate comparison
    analytics.tsx            Recruitment analytics (mock charts)
    assistant.tsx            AI Recruiter Assistant chat
  candidate/
    route.tsx                Candidate shell (sidebar + Outlet)
    index.tsx                Dashboard (ATS score, applications, notifications)
    resume.tsx               Upload/parse resume, insights, optimizer
    jobs.tsx                 Browse jobs + AI match
    external.tsx             External job URL analyzer
    interview.tsx            Mock interview launcher + session UI
    roadmap.tsx              Personalized prep roadmap
    portfolio.tsx            Profile, links, projects
    assistant.tsx            AI Career Assistant chat
```

Every route file sets its own `head()` with a unique title/description. `__root.tsx` gets real AIHire Pro title/description (replaces the "Lovable App" default). `src/routes/index.tsx` replaces the blank-page placeholder.

## Global UI

- **Landing** (`/`): centered hero, two role cards (Recruiter blue / Candidate green) → link to `/recruiter` and `/candidate`.
- **Settings drawer** (top-right gear on every page): inputs for Supabase URL + anon key, "Test connection" button (calls a health ping if key present, else stays a stub), save to `localStorage`. Includes a "Groq API key" field slot for later — disabled with "Configured via environment" note.
- **AI chat dock**: floating bottom-right pill on all dashboards, opens a drawer with a mock streaming reply.

## Recruiter Shell

Sidebar nav (icons + labels): Dashboard, Jobs, Candidates, Compare, Analytics, AI Assistant. Top bar shows workspace name + settings. Content in `<Outlet />`.

Key screens:

- **Dashboard**: KPI tiles (Active Jobs, Applications, Shortlisted, Interviews, Offers), pipeline funnel, recent applicants strip.
- **Jobs list**: table of jobs with status pills, deadline, applicant count, actions (edit/archive/duplicate/close). "New Job" opens a dialog with tabs: Paste text / Upload file (PDF/DOCX/TXT/MD accepted, filename shown, parsing simulated with a delay + mock structured output preview).
- **Job detail** (`/recruiter/jobs/$jobId`): header (title, status, share), left column = ranked candidate list (rank number, avatar, name, match %, tags, left-accent border like prototype), right column = AI Candidate Summary + Portfolio Highlights panel. Filter bar above list (skills, experience, ATS score, portfolio score, location, sort).
- **Candidate detail**: tabs — Overview / Resume / Portfolio & Links / AI Ranking / Interviews / Notes. Portfolio tab renders detected links grouped (GitHub, LinkedIn, Behance, Kaggle, Scholar, YouTube, etc.) with validation badges and a Portfolio Quality Score.
- **Compare**: pick 2–4 candidates → matrix of dimensions (Technical, Experience, Portfolio, Communication, Interview) with AI rationale rows.
- **Analytics**: mock recharts (applications over time, sources, skill distribution, geo, time-to-hire).
- **AI Assistant**: chat with quick-action chips (Summarize resumes, Compare top 5, Draft interview questions).

## Candidate Shell

Sidebar nav: Dashboard, Resume, Job Match, External Analyzer, Mock Interview, Roadmap, Portfolio, AI Coach.

Key screens:

- **Dashboard**: ATS radial score card (prototype pattern), applications tracker, notifications, next mock-interview CTA.
- **Resume**: drag-drop upload (PDF/DOCX/TXT/MD), simulated parse → structured view (skills, experience, projects, hyperlinks). Insights panel: strengths, weaknesses, missing keywords, portfolio score. "Optimize with AI" button rewrites weak bullets (mocked).
- **Jobs**: list of mock jobs with per-job match breakdown modal (skill/experience/education/portfolio/ATS).
- **External Analyzer**: paste URL → mock result showing extracted JD, matched skills, gap list, generated interview questions, prep plan.
- **Mock Interview**: setup step (type: HR/Technical/Coding/Behavioral/Managerial/Case, difficulty, role) → live session UI with mock question card, mic button (Web Speech API if available, otherwise textarea), "Next question" advances a scripted set, ends with an evaluation report card.
- **Roadmap**: week-by-week timeline (topics, coding practice, projects, certifications, mock schedule).
- **Portfolio**: profile fields, links manager, projects.
- **AI Coach**: chat with career quick-actions.

## Data & State

- All content driven by a `src/lib/mock-data.ts` module (jobs, candidates, portfolio links, analytics series, interview scripts, roadmap items).
- Zustand-light state via React context + hooks under `src/hooks/` for: settings (Supabase keys), selected candidates for compare, mock interview session.
- Supabase keys persistence: `src/lib/settings-store.ts` (localStorage, `aihire.settings.v1`). A stub `getSupabaseClient()` returns `null` when keys are absent; when present it lazy-creates a client via `@supabase/supabase-js` (installed as a dep) but no queries run yet — surfaces are ready to swap.
- No route loaders hit a backend. Data comes from the mock module synchronously.

## Components (shadcn-based, themed to Neon Precision)

Reused: `Button`, `Card`, `Dialog`, `Sheet` (settings drawer, chat dock), `Tabs`, `Table`, `Badge`, `Progress`, `Input`, `Textarea`, `Select`, `Tooltip`, `Avatar`, `Separator`, `Sonner` toaster.

New components under `src/components/`:

- `AppShell/RecruiterSidebar.tsx`, `CandidateSidebar.tsx`
- `Score/AtsRadial.tsx`, `Score/MatchBar.tsx`
- `Candidate/RankedRow.tsx`, `Candidate/PortfolioPanel.tsx`, `Candidate/AiSummaryCard.tsx`
- `Job/JobCard.tsx`, `Job/NewJobDialog.tsx`
- `Interview/QuestionCard.tsx`, `Interview/EvaluationReport.tsx`
- `Roadmap/WeekTimeline.tsx`
- `Chat/AiChatDock.tsx`
- `Settings/SettingsDrawer.tsx`

Recharts used for analytics (`bun add recharts`).

## Technical Notes

- Add deps: `@supabase/supabase-js`, `recharts`, `react-dropzone` (for upload UX).
- Tokens registered in `src/styles.css` under `@theme` (extend existing OKLCH tokens; add brand-bg / brand-surface / brand-accent / brand-success / brand-border, plus mono font token). Keep existing shadcn semantic tokens; map surfaces to the new brand tokens so existing shadcn components inherit the dark theme.
- Default the app to `.dark` class on `<html>` in the root shell so shadcn dark variants apply.
- Fonts: `<link>` Google Fonts in `__root.tsx` head.
- All AI outputs are pure functions in `src/lib/mock-ai.ts` with a fake `await sleep(600ms)` to feel real; easy to replace with Groq calls later.
- Each route sets `head()` with page-specific title/description; no og:image (leaves host social-preview default).
- Mock interview speech-to-text: feature-detect `window.SpeechRecognition || webkitSpeechRecognition`; fall back to textarea.

## Out of scope (deferred)

- Real Groq/GPT-OSS calls, RAG, live web search — swap `mock-ai.ts` when ready.
- Auth, RLS, real persistence — swap when Supabase keys are entered and schema is defined.
- Email/notification delivery.

## Deliverable

A visually cohesive, fully navigable AIHire Pro shell where every feature area from the spec has a real screen with realistic mock data — production-grade HRTech feel, matching the Neon Precision direction.