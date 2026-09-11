import Link from "next/link";
import { ReferencePageShell } from "@/components/ReferencePages";

const articles = [
  ["01", "Building with agents in public", "A practical notebook on agent workflows and product proof."],
  ["02", "What makes a quantitative result reproducible", "Point-in-time data, explicit costs, and failure states."],
  ["03", "Designing useful learning worlds", "Notes on turning difficult concepts into interactive experiences."],
] as const;

export default function ArticlesPage() {
  return (
    <ReferencePageShell title="Articles" cwd="~/app/articles">
      <p className="reference-page-lede">Writing on products, agents, quantitative research, and learning systems.</p>
      <div className="reference-list">
        {articles.map(([id, title, summary]) => (
          <Link key={id} href={`/articles/${id}`} className="reference-list-item">
            <b>{id}</b><span>{title}</span><em>{summary} ↗</em>
          </Link>
        ))}
      </div>
    </ReferencePageShell>
  );
}
