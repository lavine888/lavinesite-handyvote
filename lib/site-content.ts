export type ProjectCase = {
  id: string;
  slug: string;
  name: string;
  summary: string;
  problem: string;
  approach: string;
  role: string;
  tags: readonly string[];
  href: string;
};

export const PROJECTS: readonly ProjectCase[] = [
  {
    id: "01",
    slug: "wozai",
    name: "Wozai · 我在",
    summary: "A relationship-centered AI product for preserving authentic life records.",
    problem: "Important memories become fragmented across apps, chats, and private notes.",
    approach: "Shape a consent-first recording experience around relationships, context, and the people who will receive a memory.",
    role: "Product direction · interaction design · system framing",
    tags: ["AI", "MEMORY", "PRODUCT"],
    href: "https://www.wozai.space/",
  },
  {
    id: "02",
    slug: "agent-jam",
    name: "Agent JAM",
    summary: "A shared workflow for agent execution, context, and team review.",
    problem: "Agent work loses momentum when execution, project context, and review live in separate places.",
    approach: "Keep the live workflow visible so people can inspect what an agent did, add context, and decide what should happen next.",
    role: "Agent systems · workflow design · product proof",
    tags: ["AGENTS", "WORKFLOW", "OPEN SOURCE"],
    href: "https://github.com/lavine888/AgentJAM-showcase",
  },
  {
    id: "03",
    slug: "bull-bear-exchange-island",
    name: "Bull & Bear Exchange Island",
    summary: "A game-based finance learning experience built around market intuition.",
    problem: "Financial ideas stay abstract when learners can only read definitions and charts.",
    approach: "Turn candlesticks, sentiment, and strategy choices into an explorable world with immediate feedback.",
    role: "Learning interaction · game loop · finance education",
    tags: ["EDUCATION", "GAME", "FINANCE"],
    href: "https://github.com/lavine888/bull-bear-exchange-island",
  },
  {
    id: "04",
    slug: "pandaai-quant",
    name: "PandaAI Quant",
    summary: "A factor-research workflow for cleaner, reproducible quantitative experiments.",
    problem: "Research results are difficult to trust when data boundaries, costs, and assumptions stay implicit.",
    approach: "Make data preparation, signal evaluation, and validation steps explicit and repeatable.",
    role: "Quant research · Python workflows · validation",
    tags: ["QUANT", "PYTHON", "RESEARCH"],
    href: "https://github.com/lavine888",
  },
  {
    id: "05",
    slug: "livelink",
    name: "LiveLink",
    summary: "An AI networking prototype for clearer professional identity and discovery.",
    problem: "Professional profiles often describe a person without helping the right people find each other.",
    approach: "Structure identity around intent and create a shorter path from context to a useful connection.",
    role: "Product concept · information architecture · prototype",
    tags: ["AI", "IDENTITY", "NETWORK"],
    href: "https://livelink-delta.vercel.app/",
  },
];

export const FEATURED_PROJECTS = PROJECTS.slice(0, 3);
