export type Job = {
  id: string;
  title: string;
  department: string;
  location: string;
  employmentType: string;
  status: "Active" | "Draft" | "Closed" | "Archived";
  applicants: number;
  shortlisted: number;
  postedAt: string;
  deadline: string;
  salary?: string;
  requiredSkills: string[];
  preferredSkills: string[];
  experience: string;
  description: string;
};

export type PortfolioLink = {
  type:
    | "GitHub"
    | "LinkedIn"
    | "Website"
    | "Portfolio"
    | "Behance"
    | "Dribbble"
    | "Kaggle"
    | "Scholar"
    | "Medium"
    | "Dev.to"
    | "Figma"
    | "YouTube"
    | "PlayStore"
    | "AppStore"
    | "Paper"
    | "Other";
  label: string;
  url: string;
  status: "verified" | "unreachable" | "pending";
};

export type Candidate = {
  id: string;
  name: string;
  headline: string;
  location: string;
  yearsExperience: number;
  currentCompany: string;
  education: string;
  skills: string[];
  matchScore: number;
  atsScore: number;
  portfolioScore: number;
  interviewScore: number;
  communicationScore: number;
  status: "New" | "Screening" | "Interview" | "Offer" | "Rejected";
  appliedJobId: string;
  appliedAt: string;
  aiSummary: string;
  strengths: string[];
  weaknesses: string[];
  portfolio: PortfolioLink[];
  projects: { name: string; description: string; tech: string[] }[];
  tags: string[];
};

export const jobs: Job[] = [
  {
    id: "j-4029",
    title: "Senior Frontend Engineer",
    department: "Engineering",
    location: "Remote · US",
    employmentType: "Full-time",
    status: "Active",
    applicants: 142,
    shortlisted: 12,
    postedAt: "2026-06-14",
    deadline: "2026-07-31",
    salary: "$160k – $210k",
    requiredSkills: ["React", "TypeScript", "System Design", "Web Performance"],
    preferredSkills: ["Web3", "Rust", "GraphQL"],
    experience: "5–8 years",
    description:
      "Lead frontend architecture for our real-time trading dashboards. Own performance budgets, design systems, and cross-team standards.",
  },
  {
    id: "j-4030",
    title: "Machine Learning Engineer",
    department: "AI / ML",
    location: "San Francisco, CA",
    employmentType: "Full-time",
    status: "Active",
    applicants: 86,
    shortlisted: 7,
    postedAt: "2026-06-22",
    deadline: "2026-08-10",
    salary: "$180k – $240k",
    requiredSkills: ["Python", "PyTorch", "MLOps", "LLM Fine-tuning"],
    preferredSkills: ["Ray", "Kubernetes", "Vector DBs"],
    experience: "4–7 years",
    description:
      "Ship LLM-powered features into production. Own fine-tuning pipelines, evals, and inference infrastructure.",
  },
  {
    id: "j-4031",
    title: "Product Designer",
    department: "Design",
    location: "London · Hybrid",
    employmentType: "Full-time",
    status: "Active",
    applicants: 54,
    shortlisted: 5,
    postedAt: "2026-06-28",
    deadline: "2026-08-05",
    requiredSkills: ["Figma", "Design Systems", "Prototyping"],
    preferredSkills: ["Motion", "Framer", "Research"],
    experience: "3–6 years",
    description: "Design end-to-end experiences for our recruiter and candidate products.",
  },
  {
    id: "j-4032",
    title: "DevOps Engineer",
    department: "Platform",
    location: "Remote",
    employmentType: "Contract",
    status: "Draft",
    applicants: 0,
    shortlisted: 0,
    postedAt: "2026-07-05",
    deadline: "2026-08-20",
    requiredSkills: ["Kubernetes", "Terraform", "AWS"],
    preferredSkills: ["Pulumi", "Datadog"],
    experience: "4+ years",
    description: "Own our multi-region deploys and observability stack.",
  },
  {
    id: "j-4028",
    title: "Data Scientist",
    department: "AI / ML",
    location: "New York, NY",
    employmentType: "Full-time",
    status: "Closed",
    applicants: 210,
    shortlisted: 18,
    postedAt: "2026-05-01",
    deadline: "2026-06-15",
    requiredSkills: ["SQL", "Python", "Statistics"],
    preferredSkills: ["Causal Inference", "Experimentation"],
    experience: "3–5 years",
    description: "Drive experimentation and analytics for our growth org.",
  },
];

export const candidates: Candidate[] = [
  {
    id: "c-001",
    name: "Elena Rodriguez",
    headline: "Staff Frontend Engineer",
    location: "Barcelona, ES",
    yearsExperience: 8,
    currentCompany: "Nebula Labs",
    education: "MSc Computer Science, UPC Barcelona",
    skills: ["React", "TypeScript", "Web3", "System Design", "Rust", "GraphQL"],
    matchScore: 98,
    atsScore: 94,
    portfolioScore: 92,
    interviewScore: 88,
    communicationScore: 91,
    status: "Interview",
    appliedJobId: "j-4029",
    appliedAt: "2026-06-20",
    aiSummary:
      "Elena shows exceptional expertise in distributed systems and real-time state management. Her portfolio includes a custom rendering engine that outperformed industry benchmarks by 12%.",
    strengths: [
      "Deep React internals + performance optimization",
      "Ships accessible design systems at scale",
      "Strong open-source footprint",
    ],
    weaknesses: ["Limited backend Rust experience", "No public leadership talks"],
    portfolio: [
      { type: "GitHub", label: "github.com/erodriguez", url: "https://github.com", status: "verified" },
      { type: "LinkedIn", label: "linkedin.com/in/erodriguez", url: "https://linkedin.com", status: "verified" },
      { type: "Website", label: "elena.dev", url: "https://elena.dev", status: "verified" },
      { type: "Medium", label: "medium.com/@elenar", url: "https://medium.com", status: "verified" },
      { type: "YouTube", label: "Conf talk: Rendering at 120fps", url: "https://youtube.com", status: "verified" },
    ],
    projects: [
      {
        name: "Engine-X Rendering Architecture",
        description: "Custom WebGL rendering pipeline used by 3 production apps; 12% faster than benchmark.",
        tech: ["WebGL", "TypeScript", "Rust/WASM"],
      },
      {
        name: "Lumina UI Framework",
        description: "Open-source design-system framework with 2.1k stars.",
        tech: ["React", "CSS-in-JS", "Storybook"],
      },
    ],
    tags: ["React", "Web3"],
  },
  {
    id: "c-002",
    name: "Marcus Chen",
    headline: "Senior Full-stack Engineer",
    location: "Toronto, CA",
    yearsExperience: 6,
    currentCompany: "Vector Studio",
    education: "BSc Software Engineering, Waterloo",
    skills: ["Vue", "Node", "TypeScript", "PostgreSQL", "AWS"],
    matchScore: 92,
    atsScore: 88,
    portfolioScore: 84,
    interviewScore: 86,
    communicationScore: 90,
    status: "Screening",
    appliedJobId: "j-4029",
    appliedAt: "2026-06-22",
    aiSummary:
      "Marcus brings strong full-stack fundamentals with production ownership of high-traffic Vue applications and mature CI/CD practices.",
    strengths: ["End-to-end ownership", "Clean architecture writing", "Mentorship history"],
    weaknesses: ["Less React ecosystem depth vs. top candidates"],
    portfolio: [
      { type: "GitHub", label: "github.com/mchen", url: "https://github.com", status: "verified" },
      { type: "LinkedIn", label: "linkedin.com/in/mchen", url: "https://linkedin.com", status: "verified" },
      { type: "Dev.to", label: "dev.to/mchen", url: "https://dev.to", status: "verified" },
    ],
    projects: [
      { name: "Halo Analytics", description: "Realtime analytics dashboard, 40M events/day.", tech: ["Vue", "Node", "ClickHouse"] },
    ],
    tags: ["Vue", "Node"],
  },
  {
    id: "c-003",
    name: "Priya Nair",
    headline: "Frontend Engineer",
    location: "Bengaluru, IN",
    yearsExperience: 5,
    currentCompany: "Kite Systems",
    education: "BTech CSE, IIT Madras",
    skills: ["React", "TypeScript", "Next.js", "TailwindCSS"],
    matchScore: 89,
    atsScore: 86,
    portfolioScore: 80,
    interviewScore: 82,
    communicationScore: 88,
    status: "New",
    appliedJobId: "j-4029",
    appliedAt: "2026-07-01",
    aiSummary:
      "Priya has strong React + Next.js delivery experience, with measurable performance wins on consumer-scale apps.",
    strengths: ["React 19 fluency", "Great Core Web Vitals record"],
    weaknesses: ["Limited system-design portfolio"],
    portfolio: [
      { type: "GitHub", label: "github.com/pnair", url: "https://github.com", status: "verified" },
      { type: "Website", label: "priyanair.io", url: "https://priyanair.io", status: "verified" },
      { type: "Figma", label: "Design case studies", url: "https://figma.com", status: "pending" },
    ],
    projects: [{ name: "Kite Trader Web", description: "Rebuilt trading web app; 34% faster TTI.", tech: ["Next.js", "React"] }],
    tags: ["React", "Next.js"],
  },
  {
    id: "c-004",
    name: "Daniel Okafor",
    headline: "ML Engineer",
    location: "Berlin, DE",
    yearsExperience: 5,
    currentCompany: "Aether AI",
    education: "MSc ML, TU Munich",
    skills: ["Python", "PyTorch", "MLOps", "Ray", "LLMs"],
    matchScore: 95,
    atsScore: 92,
    portfolioScore: 90,
    interviewScore: 87,
    communicationScore: 84,
    status: "Interview",
    appliedJobId: "j-4030",
    appliedAt: "2026-06-25",
    aiSummary: "Daniel has shipped fine-tuning pipelines for 30B-parameter models with strong eval discipline.",
    strengths: ["Production LLM fine-tuning", "Distributed training", "Great research writing"],
    weaknesses: ["Limited product-side collaboration examples"],
    portfolio: [
      { type: "GitHub", label: "github.com/dokafor", url: "https://github.com", status: "verified" },
      { type: "Scholar", label: "Google Scholar profile", url: "https://scholar.google.com", status: "verified" },
      { type: "Paper", label: "Adaptive LoRA distillation (2026)", url: "https://arxiv.org", status: "verified" },
    ],
    projects: [{ name: "OpenLoRA", description: "Distributed LoRA training on Ray; 3.2k stars.", tech: ["PyTorch", "Ray"] }],
    tags: ["PyTorch", "LLM"],
  },
  {
    id: "c-005",
    name: "Sarah Jenkins",
    headline: "Product Designer",
    location: "London, UK",
    yearsExperience: 6,
    currentCompany: "DesignSystems Inc",
    education: "BA Interaction Design, RCA",
    skills: ["Figma", "Design Systems", "Motion", "Research"],
    matchScore: 94,
    atsScore: 90,
    portfolioScore: 96,
    interviewScore: 89,
    communicationScore: 93,
    status: "Screening",
    appliedJobId: "j-4031",
    appliedAt: "2026-07-02",
    aiSummary: "Sarah owns end-to-end design ops with a stellar systems-thinking portfolio.",
    strengths: ["Design systems at scale", "Cross-functional facilitation"],
    weaknesses: ["Limited native-mobile shipping"],
    portfolio: [
      { type: "Behance", label: "behance.net/sjenkins", url: "https://behance.net", status: "verified" },
      { type: "Dribbble", label: "dribbble.com/sjenkins", url: "https://dribbble.com", status: "verified" },
      { type: "Figma", label: "Figma community", url: "https://figma.com", status: "verified" },
      { type: "Website", label: "sarahj.design", url: "https://sarahj.design", status: "verified" },
    ],
    projects: [{ name: "Nord Design System", description: "Adopted by 40+ product teams.", tech: ["Figma", "Tokens"] }],
    tags: ["Figma", "Systems"],
  },
  {
    id: "c-006",
    name: "Jordan Alvarez",
    headline: "Frontend Engineer",
    location: "Austin, TX",
    yearsExperience: 4,
    currentCompany: "Lumen Labs",
    education: "BS CS, UT Austin",
    skills: ["React", "TypeScript", "TailwindCSS"],
    matchScore: 81,
    atsScore: 78,
    portfolioScore: 72,
    interviewScore: 75,
    communicationScore: 80,
    status: "New",
    appliedJobId: "j-4029",
    appliedAt: "2026-07-04",
    aiSummary: "Solid mid-level engineer; strong on execution but limited architecture experience.",
    strengths: ["Fast execution", "Good testing habits"],
    weaknesses: ["Limited depth in system design", "No public portfolio"],
    portfolio: [
      { type: "GitHub", label: "github.com/jalvarez", url: "https://github.com", status: "verified" },
      { type: "LinkedIn", label: "linkedin.com/in/jalvarez", url: "https://linkedin.com", status: "verified" },
    ],
    projects: [{ name: "Lumen Console", description: "Internal admin dashboard.", tech: ["React"] }],
    tags: ["React"],
  },
];

export function candidatesForJob(jobId: string) {
  return candidates
    .filter((c) => c.appliedJobId === jobId)
    .sort((a, b) => b.matchScore - a.matchScore);
}

export function getJob(jobId: string) {
  return jobs.find((j) => j.id === jobId);
}

export function getCandidate(id: string) {
  return candidates.find((c) => c.id === id);
}

// Recruiter analytics series
export const analytics = {
  applicationsByWeek: [
    { week: "W1", applications: 42, shortlisted: 6 },
    { week: "W2", applications: 58, shortlisted: 9 },
    { week: "W3", applications: 71, shortlisted: 11 },
    { week: "W4", applications: 66, shortlisted: 12 },
    { week: "W5", applications: 84, shortlisted: 15 },
    { week: "W6", applications: 92, shortlisted: 17 },
  ],
  sources: [
    { name: "LinkedIn", value: 42 },
    { name: "Referrals", value: 21 },
    { name: "Career Site", value: 18 },
    { name: "Indeed", value: 12 },
    { name: "Other", value: 7 },
  ],
  skillDistribution: [
    { skill: "React", count: 68 },
    { skill: "TypeScript", count: 61 },
    { skill: "Python", count: 44 },
    { skill: "AWS", count: 39 },
    { skill: "Node", count: 33 },
    { skill: "PyTorch", count: 22 },
  ],
  funnel: [
    { stage: "Applied", value: 492 },
    { stage: "Screened", value: 148 },
    { stage: "Interview", value: 62 },
    { stage: "Offer", value: 18 },
    { stage: "Hired", value: 11 },
  ],
  timeToHireDays: 24,
};

// Candidate-side
export const candidateProfile = {
  name: "Alex Morgan",
  headline: "Senior Frontend Engineer",
  location: "Remote · EU",
  yearsExperience: 6,
  atsScore: 84,
  portfolioScore: 78,
  skills: ["React", "TypeScript", "Node", "GraphQL", "AWS"],
  missingSkills: ["System Design", "Rust"],
  hyperlinks: [
    { type: "GitHub", label: "github.com/alex", url: "https://github.com", status: "verified" as const },
    { type: "LinkedIn", label: "linkedin.com/in/alex", url: "https://linkedin.com", status: "verified" as const },
    { type: "Website", label: "alexmorgan.dev", url: "https://alexmorgan.dev", status: "verified" as const },
    { type: "Dev.to", label: "dev.to/alex", url: "https://dev.to", status: "verified" as const },
  ] as PortfolioLink[],
  applications: [
    { jobId: "j-4029", status: "Interview", appliedAt: "2026-06-20", match: 84 },
    { jobId: "j-4030", status: "Screening", appliedAt: "2026-06-28", match: 62 },
    { jobId: "j-4031", status: "New", appliedAt: "2026-07-05", match: 41 },
  ],
  notifications: [
    { id: "n1", text: "Interview scheduled for Senior Frontend Engineer on Jul 15", ts: "2h ago", kind: "interview" },
    { id: "n2", text: "New role matched: ML Platform Engineer (79% match)", ts: "6h ago", kind: "match" },
    { id: "n3", text: "AI Coach: 3 new practice questions ready", ts: "1d ago", kind: "coach" },
  ],
};

export const interviewScripts: Record<string, string[]> = {
  Technical: [
    "Walk me through how you'd design a real-time collaborative text editor.",
    "How do you approach performance budgets on a large React app?",
    "Explain the trade-offs between SSR, SSG, and client-side rendering.",
    "How would you debug a memory leak in a long-running SPA?",
    "Describe your approach to state management in complex forms.",
  ],
  HR: [
    "Tell me about yourself in 90 seconds.",
    "Why are you leaving your current role?",
    "What kind of team environment brings out your best work?",
    "Where do you see yourself in three years?",
  ],
  Coding: [
    "Given a stream of events, design an LRU cache with O(1) operations.",
    "Implement a debounce function with cancel support.",
    "Write a function that flattens deeply nested arrays.",
  ],
  Behavioral: [
    "Tell me about a time you disagreed with a technical decision.",
    "Describe a project that failed. What did you learn?",
    "How do you handle competing priorities from multiple stakeholders?",
  ],
  Managerial: [
    "How do you run a technical interview?",
    "How do you give feedback to an underperforming engineer?",
    "How do you prioritize technical debt against feature work?",
  ],
  "Case Study": [
    "Our activation rate dropped 12% last week. Walk me through your investigation.",
    "Design an experiment to increase interview completion rate on our platform.",
  ],
};

export const roadmap = [
  {
    week: "Week 1",
    focus: "System Design Foundations",
    items: [
      { kind: "Study", label: "Designing Data-Intensive Applications — Ch. 1–3" },
      { kind: "Practice", label: "2 mock interviews (system design, intermediate)" },
      { kind: "Project", label: "Sketch architecture for a URL shortener at 10M/day" },
    ],
  },
  {
    week: "Week 2",
    focus: "React Performance & Rendering",
    items: [
      { kind: "Study", label: "Concurrent React deep-dive" },
      { kind: "Practice", label: "Profile 3 open-source apps; write findings" },
      { kind: "Project", label: "Ship a virtualized list with 100k rows" },
    ],
  },
  {
    week: "Week 3",
    focus: "Behavioral + Communication",
    items: [
      { kind: "Study", label: "STAR method, 6 stories from your history" },
      { kind: "Practice", label: "3 behavioral mock interviews" },
      { kind: "Reading", label: "'The Manager's Path' Ch. 4–6" },
    ],
  },
  {
    week: "Week 4",
    focus: "Company-specific Prep",
    items: [
      { kind: "Study", label: "Engineering blog — last 6 months" },
      { kind: "Practice", label: "Company-focused mock with senior peer" },
      { kind: "Prep", label: "Prepare 5 tailored questions for the panel" },
    ],
  },
];
