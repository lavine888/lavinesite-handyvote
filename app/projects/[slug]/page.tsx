import Link from "next/link";
import { notFound } from "next/navigation";
import { ReferencePageShell } from "@/components/ReferencePages";
import { PROJECTS } from "@/lib/site-content";

export function generateStaticParams() {
  return PROJECTS.map((project) => ({ slug: project.slug }));
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = PROJECTS.find((candidate) => candidate.slug === slug);
  if (!project) notFound();

  return (
    <ReferencePageShell title={project.name} cwd="~/app/projects">
      <p className="reference-page-kicker">CASE STUDY / {project.id}</p>
      <p className="reference-page-lede">{project.summary}</p>
      <div className="reference-case-grid">
        <section>
          <h2>Problem</h2>
          <p>{project.problem}</p>
        </section>
        <section>
          <h2>Approach</h2>
          <p>{project.approach}</p>
        </section>
        <section>
          <h2>Role</h2>
          <p>{project.role}</p>
        </section>
        <section>
          <h2>Signals</h2>
          <div className="reference-case-tags">{project.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
        </section>
      </div>
      <div className="reference-case-actions">
        <a href={project.href} target="_blank" rel="noreferrer">open project ↗</a>
        <Link href="/projects">all projects</Link>
      </div>
    </ReferencePageShell>
  );
}
