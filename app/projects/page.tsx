import Link from "next/link";
import { ReferencePageShell } from "@/components/ReferencePages";
import { PROJECTS } from "@/lib/site-content";

export default function ProjectsPage() {
  return (
    <ReferencePageShell title="Projects" cwd="~/app/projects">
      <p className="reference-page-lede">Selected work across AI products, quantitative research, and interactive learning systems.</p>
      <div className="reference-list">
        {PROJECTS.map((project) => (
          <Link key={project.slug} href={`/projects/${project.slug}`} className="reference-list-item">
            <b>{project.id}</b>
            <span>{project.name}</span>
            <em>{project.summary} ↗</em>
          </Link>
        ))}
      </div>
      <p className="reference-page-links"><Link href="/">← home</Link></p>
    </ReferencePageShell>
  );
}
