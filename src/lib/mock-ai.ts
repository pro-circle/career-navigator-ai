// Agentic AI helpers. When a Groq API key is present in Settings, real streaming
// completions are used. Otherwise we fall back to structured mock output so the
// UI remains usable without any credentials.
import { streamCompletion, complete } from "./ai-client";


const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function mockParseResume(fileName: string) {
  await sleep(900);
  return {
    fileName,
    fullName: "Alex Morgan",
    email: "alex@example.com",
    phone: "+1 (555) 010-2233",
    location: "Remote · EU",
    skills: ["React", "TypeScript", "Node", "GraphQL", "AWS", "PostgreSQL"],
    experience: [
      { company: "Vector Studio", role: "Senior Frontend Engineer", period: "2023 — Present", bullets: ["Led migration to Next.js 15", "Owned design-system rollout"] },
      { company: "Halo Analytics", role: "Frontend Engineer", period: "2020 — 2023", bullets: ["Built realtime dashboards for 40M events/day"] },
    ],
    education: [{ school: "TU Delft", degree: "BSc Computer Science", period: "2016 — 2020" }],
    projects: [{ name: "OpenChart", description: "OSS charting library — 1.2k stars." }],
    certifications: ["AWS Solutions Architect Associate"],
    hyperlinks: [
      { type: "GitHub", url: "https://github.com/alex" },
      { type: "LinkedIn", url: "https://linkedin.com/in/alex" },
      { type: "Website", url: "https://alexmorgan.dev" },
    ],
  };
}

export async function mockParseJd(input: string) {
  await sleep(700);
  return {
    title: "Senior Frontend Engineer",
    seniority: "Senior",
    employmentType: "Full-time",
    location: "Remote · US",
    salary: "$160k – $210k",
    requiredSkills: ["React", "TypeScript", "System Design", "Web Performance"],
    preferredSkills: ["Web3", "Rust", "GraphQL"],
    responsibilities: [
      "Own frontend architecture and performance",
      "Lead design-system standards across teams",
      "Mentor mid-level engineers",
    ],
    excerpt: input.slice(0, 240) + (input.length > 240 ? "…" : ""),
  };
}

export async function mockAnalyzeExternalJob(url: string) {
  await sleep(1100);
  return {
    source: url,
    company: "Netflix",
    title: "Senior Software Engineer, UI Platform",
    matchScore: 76,
    matchedSkills: ["React", "TypeScript", "GraphQL", "Performance"],
    missingSkills: ["Java", "Cassandra", "Kafka"],
    interviewQuestions: [
      "How would you structure a component library shared across 20 apps?",
      "Design a real-time metrics stream from 100k client apps.",
      "Explain your favorite React 19 feature and why.",
    ],
    prep: [
      "Study Netflix TechBlog UI Platform posts",
      "Rebuild a mini Falcor client",
      "3 mock interviews focused on scale",
    ],
    resumeTips: [
      "Add measurable performance wins with numbers",
      "Highlight cross-team leadership",
    ],
  };
}

export async function mockEvaluateInterview() {
  await sleep(1200);
  return {
    overall: 82,
    dims: [
      { name: "Technical Knowledge", score: 84 },
      { name: "Communication", score: 88 },
      { name: "Confidence", score: 76 },
      { name: "Problem Solving", score: 80 },
      { name: "Clarity", score: 85 },
      { name: "Leadership Signal", score: 74 },
    ],
    strengths: ["Clear structured answers", "Great follow-up questions"],
    improvements: ["Add more concrete metrics", "Slow down on complex explanations"],
    verdict: "Strong hire signal — ready for on-site loop.",
  };
}

export async function mockChat(prompt: string) {
  return complete([
    { role: "system", content: "You are AIHire Pro's agentic career copilot. Be concise, specific, and structured." },
    { role: "user", content: prompt },
  ]);
}

/** Stream an agentic response token-by-token. */
export async function mockStreamChat(prompt: string, onToken: (chunk: string) => void) {
  await streamCompletion(
    [
      { role: "system", content: "You are AIHire Pro's agentic career copilot. Be concise, specific, and structured. Prefer bullet points and clear next steps." },
      { role: "user", content: prompt },
    ],
    onToken,
  );
}


/** Mocked coding-question generator: difficulty + company context. */
export async function mockCodingQuestions(difficulty: "Easy" | "Medium" | "Hard", company: string) {
  await sleep(500);
  const bank: Record<string, { title: string; prompt: string; starter: string; language: string }[]> = {
    Easy: [
      {
        title: "Two Sum",
        prompt:
          "Given an array of integers `nums` and a target, return indices of the two numbers such that they add up to target. Assume exactly one solution.",
        starter: "function twoSum(nums, target) {\n  // your code here\n}\n",
        language: "javascript",
      },
      {
        title: "Valid Parentheses",
        prompt: "Given a string containing '(){}[]', determine if the input string is valid.",
        starter: "function isValid(s) {\n  // your code here\n}\n",
        language: "javascript",
      },
    ],
    Medium: [
      {
        title: "LRU Cache",
        prompt:
          "Design an LRU cache with O(1) `get` and `put`. This is asked frequently at " + company + " for platform roles.",
        starter: "class LRUCache {\n  constructor(capacity) {}\n  get(key) {}\n  put(key, value) {}\n}\n",
        language: "javascript",
      },
      {
        title: "Longest Substring Without Repeating Characters",
        prompt: "Given a string, find the length of the longest substring without repeating characters.",
        starter: "function lengthOfLongestSubstring(s) {\n  // your code here\n}\n",
        language: "javascript",
      },
    ],
    Hard: [
      {
        title: "Serialize and Deserialize a Binary Tree",
        prompt:
          "Design an algorithm to serialize and deserialize a binary tree. " +
          company +
          " often follows up with variants on n-ary trees.",
        starter:
          "function serialize(root) {\n  // your code here\n}\nfunction deserialize(data) {\n  // your code here\n}\n",
        language: "javascript",
      },
      {
        title: "Word Ladder",
        prompt: "Given two words and a dictionary, find the length of the shortest transformation sequence.",
        starter: "function ladderLength(beginWord, endWord, wordList) {\n  // your code here\n}\n",
        language: "javascript",
      },
    ],
  };
  return bank[difficulty];
}

export async function mockEvaluateCode(code: string) {
  await sleep(900);
  const lines = code.split("\n").length;
  return {
    passed: Math.min(4, Math.max(1, Math.floor(lines / 3))),
    total: 5,
    complexity: "O(n)",
    feedback: [
      "Solution runs in expected time complexity.",
      "Consider edge cases: empty input, single element.",
      "Naming is clear — good use of descriptive variables.",
    ],
  };
}

export async function mockBuildResume(role: string, name: string) {
  await sleep(900);
  return {
    role,
    ats: 92,
    summary: `${name} — ${role} with a track record of shipping measurable, high-impact work. ATS-optimized keywords tuned for ${role} postings.`,
    sections: {
      "Professional Summary": `Results-driven ${role} focused on scalable systems and cross-functional leadership.`,
      "Core Skills": ["TypeScript", "React", "System Design", "Performance", "Mentorship"].join(" · "),
      Experience:
        "• Led migration reducing p95 latency by 42%\n• Owned design-system rollout across 12 product teams\n• Shipped realtime dashboards handling 40M events/day",
      Education: "BSc Computer Science — TU Delft (2016 — 2020)",
    },
    tips: [
      "Keywords tuned to " + role + " job descriptions",
      "Uses standard section headings (ATS-safe)",
      "One-page, no tables or columns",
    ],
  };
}

export async function mockCoverLetter(role: string, company: string) {
  await sleep(800);
  return `Dear ${company} Hiring Team,\n\nI'm applying for the ${role} role at ${company}. My work at Vector Studio — where I led a Next.js 15 migration cutting p95 latency by 42% — aligns closely with your platform engineering charter. I've also owned a design-system rollout across 12 product teams, which mirrors ${company}'s cross-functional model.\n\nWhat draws me to ${company} is the depth of your engineering blog and the caliber of open problems in your UI platform. I'd love to discuss how I can contribute.\n\nBest,\nAlex Morgan`;
}

export async function mockTranslateResume(target: string) {
  await sleep(700);
  const flags: Record<string, string> = {
    Spanish: "es",
    French: "fr",
    German: "de",
    Japanese: "ja",
    Portuguese: "pt",
    Hindi: "hi",
  };
  return {
    language: target,
    code: flags[target] ?? "xx",
    preview: `[${target}] Resumen profesional / Résumé / Zusammenfassung — Senior Frontend Engineer con historial de entrega de sistemas escalables y liderazgo interfuncional.`,
    note: "Translation preserves ATS keywords and section headings for the target locale.",
  };
}
