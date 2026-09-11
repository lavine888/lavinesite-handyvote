import Link from "next/link";
import { ReferencePageShell } from "@/components/ReferencePages";

const articles: Record<string, { title: string; body: string[] }> = {
  "1": {
    title: "Building with agents in public",
    body: [
      "A useful agent workflow starts with a real user problem and ends with evidence that another person can inspect.",
      "I keep the loop small: define the job, ship a working slice, measure what happened, then write down the boundary conditions.",
    ],
  },
  "2": {
    title: "What makes a quantitative result reproducible",
    body: [
      "Reproducibility is a product requirement for research. Inputs need a point-in-time boundary, assumptions need names, and costs need to be visible.",
      "The implementation is useful when a reader can rerun the same question and understand both the result and the failure state.",
    ],
  },
  "3": {
    title: "Designing useful learning worlds",
    body: [
      "Interactive worlds make abstract ideas easier to approach when every object has a job and every interaction teaches something.",
      "The best prototype leaves a clear trail from curiosity to understanding.",
    ],
  },
};

export default async function ArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const article = articles[id] ?? articles["1"];
  return (
    <ReferencePageShell title={article.title} cwd="~/app/articles">
      <p className="reference-page-kicker">ARTICLE / {id.padStart(2, "0")}</p>
      {article.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
      <p className="reference-page-links"><Link href="/articles">← all articles</Link></p>
    </ReferencePageShell>
  );
}
