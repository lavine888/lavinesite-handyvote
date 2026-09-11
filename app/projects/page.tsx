import Link from "next/link";
import { ReferencePageShell } from "@/components/ReferencePages";

const projects = [
  ["01", "Wozai · 我在", "Relationship-centered AI for preserving authentic life records.", "https://www.wozai.space/"],
  ["02", "Agent JAM", "A shared workflow for agent execution, context, and review.", "https://github.com/lavine888/AgentJAM-showcase"],
  ["03", "PandaAI Quant", "A factor research workflow with reproducible validation.", "https://github.com/lavine888"],
  ["04", "LiveLink", "AI structured identity and higher-value professional connections.", "https://livelink-delta.vercel.app/"],
  ["05", "Bull & Bear Exchange Island", "A game-based finance learning experience.", "https://github.com/lavine888/bull-bear-exchange-island"],
] as const;

export default function ProjectsPage() {
  return (
    <ReferencePageShell title="Projects">
      <p className="reference-page-lede">Things built in public across AI products, quantitative research, and interactive systems.</p>
      <div className="reference-list">
        {projects.map(([id, name, summary, href]) => (
          <a key={id} href={href} target="_blank" rel="noreferrer" className="reference-list-item">
            <b>{id}</b><span>{name}</span><em>{summary} ↗</em>
          </a>
        ))}
      </div>
      <p className="reference-page-links"><Link href="/">← home</Link></p>
    </ReferencePageShell>
  );
}
