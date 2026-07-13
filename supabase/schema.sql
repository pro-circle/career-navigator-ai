-- AIHire Pro — Supabase schema
-- Run this in the Supabase SQL Editor (Project → SQL Editor → New query).
-- The app connects with your project URL + anon key from Settings in the UI.

-- Enable UUID helper (usually already enabled).
create extension if not exists "pgcrypto";

-- =========================================
-- JOBS
-- =========================================
create table if not exists public.jobs (
  id                text primary key,
  title             text not null,
  department        text,
  location          text,
  employment_type   text,
  status            text default 'Draft',
  applicants        integer default 0,
  shortlisted       integer default 0,
  posted_at         date,
  deadline          date,
  salary            text,
  required_skills   text[] default '{}',
  preferred_skills  text[] default '{}',
  experience        text,
  description       text,
  created_at        timestamptz default now()
);

grant select, insert, update, delete on public.jobs to anon, authenticated;
grant all on public.jobs to service_role;

alter table public.jobs enable row level security;

-- Demo policy: allow anyone to read/write. Tighten in production.
drop policy if exists "jobs open access" on public.jobs;
create policy "jobs open access" on public.jobs
  for all to anon, authenticated using (true) with check (true);

-- =========================================
-- CANDIDATES
-- =========================================
create table if not exists public.candidates (
  id                    text primary key,
  name                  text not null,
  headline              text,
  location              text,
  years_experience      integer default 0,
  current_company       text,
  education             text,
  skills                text[] default '{}',
  match_score           integer default 0,
  ats_score             integer default 0,
  portfolio_score       integer default 0,
  interview_score       integer default 0,
  communication_score   integer default 0,
  status                text default 'New',
  applied_job_id        text references public.jobs(id) on delete set null,
  applied_at            date,
  ai_summary            text,
  strengths             text[] default '{}',
  weaknesses            text[] default '{}',
  portfolio             jsonb default '[]'::jsonb,
  projects              jsonb default '[]'::jsonb,
  tags                  text[] default '{}',
  created_at            timestamptz default now()
);

grant select, insert, update, delete on public.candidates to anon, authenticated;
grant all on public.candidates to service_role;

alter table public.candidates enable row level security;
drop policy if exists "candidates open access" on public.candidates;
create policy "candidates open access" on public.candidates
  for all to anon, authenticated using (true) with check (true);

create index if not exists candidates_job_idx on public.candidates(applied_job_id);
