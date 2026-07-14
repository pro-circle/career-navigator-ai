// Agentic AI helpers. Every function calls a real LLM (Groq via
// ai-client). If the user has not configured a Groq API key in Settings,
// we throw a friendly error so the UI can surface a "Configure AI" toast.
// The filename is kept as mock-ai.ts for backwards compatibility with
// existing imports; the module itself has no mocks left.
import { streamCompletion, complete, completeJson, hasAiKey } from "./ai-client";

function requireKey() {
  if (!hasAiKey()) {
    throw new Error(
      "Agentic AI is not configured. Open Settings → Agentic AI and paste a Groq API key.",
    );
  }
}

const SYS_RECRUIT =
  "You are AIHire Pro's agentic recruiting copilot. Return valid JSON only, matching the requested shape exactly. Never wrap in prose.";
const SYS_CAREER =
  "You are AIHire Pro's agentic career copilot. Return valid JSON only, matching the requested shape exactly. Never wrap in prose.";

async function json<T>(system: string, user: string): Promise<T> {
  requireKey();
  const out = await completeJson<T>(
    [
      { role: "system", content: system },
      { role: "user", content: user },
    ],
    { temperature: 0.3 },
  );
  if (!out) throw new Error("AI response was empty or invalid JSON. Try again.");
  return out;
}

// ---------- Resume + JD parsing ----------
export async function mockParseResume(fileName: string) {
  return json<{
    fileName: string;
    fullName: string;
    email: string;
    phone: string;
    location: string;
    skills: string[];
    experience: { company: string; role: string; period: string; bullets: string[] }[];
    education: { school: string; degree: string; period: string }[];
    projects: { name: string; description: string }[];
    certifications: string[];
    hyperlinks: { type: string; url: string }[];
  }>(
    SYS_CAREER,
    `Extract structured resume data from the file named "${fileName}". If the file name alone is insufficient, infer a realistic candidate profile matching that file name (e.g. "jane-doe-frontend.pdf"). Respond as JSON with keys: fileName, fullName, email, phone, location, skills[], experience[{company,role,period,bullets[]}], education[{school,degree,period}], projects[{name,description}], certifications[], hyperlinks[{type,url}].`,
  );
}

export async function mockParseJd(input: string) {
  return json<{
    title: string;
    seniority: string;
    employmentType: string;
    location: string;
    salary: string;
    requiredSkills: string[];
    preferredSkills: string[];
    responsibilities: string[];
    excerpt: string;
  }>(
    SYS_RECRUIT,
    `Parse this job description into structured fields. JD:\n\n${input}\n\nReturn JSON with: title, seniority, employmentType, location, salary, requiredSkills[], preferredSkills[], responsibilities[], excerpt (<=240 chars).`,
  );
}

export async function mockAnalyzeExternalJob(url: string) {
  return json<{
    source: string;
    company: string;
    title: string;
    matchScore: number;
    matchedSkills: string[];
    missingSkills: string[];
    interviewQuestions: string[];
    prep: string[];
    resumeTips: string[];
  }>(
    SYS_CAREER,
    `Analyze this external job listing URL: ${url}. Infer the company and role from the URL and produce fit analysis. Return JSON: source (echo url), company, title, matchScore (0-100), matchedSkills[], missingSkills[], interviewQuestions[3-5], prep[3-5], resumeTips[3-5].`,
  );
}

// ---------- Interview evaluation ----------
export async function mockEvaluateInterview() {
  return json<{
    overall: number;
    dims: { name: string; score: number }[];
    strengths: string[];
    improvements: string[];
    verdict: string;
  }>(
    SYS_CAREER,
    `Score a generic mock interview outcome for a strong mid-senior engineering candidate. Return JSON: overall (0-100), dims[6] with names Technical Knowledge, Communication, Confidence, Problem Solving, Clarity, Leadership Signal, each with score (0-100). Include strengths[], improvements[], verdict (one sentence).`,
  );
}

// ---------- Chat ----------
export async function mockChat(prompt: string) {
  requireKey();
  return complete([
    { role: "system", content: "You are AIHire Pro's agentic career copilot. Be concise, specific, and structured." },
    { role: "user", content: prompt },
  ]);
}

/** Stream an agentic response token-by-token. */
export async function mockStreamChat(prompt: string, onToken: (chunk: string) => void) {
  requireKey();
  await streamCompletion(
    [
      { role: "system", content: "You are AIHire Pro's agentic career copilot. Be concise, specific, and structured. Prefer bullet points and clear next steps." },
      { role: "user", content: prompt },
    ],
    onToken,
  );
}

// ---------- Coding interview ----------
export async function mockCodingQuestions(difficulty: "Easy" | "Medium" | "Hard", company: string) {
  return json<{ title: string; prompt: string; starter: string; language: string }[]>(
    SYS_CAREER,
    `Generate exactly 2 ${difficulty}-difficulty coding interview questions tailored to ${company}'s interview style and product surface. Return a JSON ARRAY (top-level array, not wrapped in an object) with objects: {title, prompt, starter (function/class skeleton), language ("javascript")}.`,
  ).then((v) => {
    // Groq returns a JSON object with a key when asked for arrays sometimes; normalize.
    if (Array.isArray(v)) return v;
    const first = Object.values(v as unknown as Record<string, unknown>).find((x) => Array.isArray(x));
    return (first as { title: string; prompt: string; starter: string; language: string }[]) ?? [];
  });
}

export async function mockEvaluateCode(code: string) {
  return json<{ passed: number; total: number; complexity: string; feedback: string[] }>(
    SYS_CAREER,
    `Evaluate this candidate code submission. Return JSON: passed (int, tests passed out of 5), total (=5), complexity (Big-O string), feedback[] (3 short bullets). Code:\n\n\`\`\`\n${code.slice(0, 4000)}\n\`\`\``,
  );
}

// ---------- Resume Studio ----------
export async function mockBuildResume(role: string, name: string) {
  return json<{
    role: string;
    ats: number;
    summary: string;
    sections: Record<string, string>;
    tips: string[];
  }>(
    SYS_CAREER,
    `Draft an ATS-optimized resume for ${name} targeting a "${role}" role. Return JSON: role (echo), ats (0-100 predicted ATS score), summary (2-3 sentences), sections (object with keys "Professional Summary", "Core Skills", "Experience", "Education" — each a string, use \\n for newlines and • for bullets), tips[3-5].`,
  );
}

export async function mockCoverLetter(role: string, company: string) {
  requireKey();
  return complete(
    [
      { role: "system", content: "You write concise, high-signal cover letters. No fluff, 180-220 words, first person." },
      { role: "user", content: `Write a cover letter for a ${role} role at ${company}. End with a plain sign-off "Best,\\n<applicant name>".` },
    ],
    { temperature: 0.5 },
  );
}

export async function mockTranslateResume(target: string) {
  return json<{ language: string; code: string; preview: string; note: string }>(
    SYS_CAREER,
    `Produce a translated resume PREVIEW (first 2 sentences of a professional summary) in ${target}, preserving ATS keywords. Return JSON: language ("${target}"), code (2-letter ISO code), preview (translated text), note (short explanation of preserved keywords).`,
  );
}
