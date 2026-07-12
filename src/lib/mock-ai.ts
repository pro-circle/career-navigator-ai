// Mocked AI outputs. Swap with real Groq/GPT-OSS calls later.

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
  await sleep(700);
  const reply =
    "This is a mocked AI response. Wire Groq (GPT-OSS-120B) here later. You asked: “" +
    prompt.slice(0, 160) +
    "”. Here's a helpful pointer: focus on measurable outcomes, cite specific projects, and end with a clear question.";
  return reply;
}
