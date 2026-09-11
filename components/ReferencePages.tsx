"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, type ReactNode } from "react";
import { FEATURED_PROJECTS } from "@/lib/site-content";
import TerminalCommandBar from "./TerminalCommandBar";

type ReferencePageShellProps = {
  title: string;
  children: ReactNode;
  cwd?: string;
};

export function ReferencePageShell({ title, children, cwd = "~/app" }: ReferencePageShellProps) {
  return (
    <main className="reference-page-shell">
      <header className="reference-page-heading">
        <p className="reference-eyebrow">{cwd} $ cat index.md</p>
        <div className="reference-page-title-row">
          <h1>{title}</h1>
          <Link className="reference-page-home" href="/">home ↗</Link>
        </div>
      </header>
      <div className="reference-page-content">{children}</div>
      <nav className="reference-page-links" aria-label="Site navigation">
        <Link href="/">home</Link>
        <Link href="/articles">articles</Link>
        <Link href="/projects">projects</Link>
        <Link href="/about">about</Link>
      </nav>
      <TerminalCommandBar cwd={cwd} />
    </main>
  );
}

const ACTIVITY = Array.from({ length: 371 }, (_, index) => (index * 7 + 2) % 5);

function HomePanelHeading({ label, detail }: { label: string; detail?: ReactNode }) {
  return (
    <div className="reference-home-panel-heading">
      <h2>{label}</h2>
      {detail}
    </div>
  );
}

export function HomeScreen() {
  const router = useRouter();
  const lastTouch = useRef(0);

  const enterArticles = (event: React.MouseEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;
    if (!target.closest("a,button,input,textarea,select")) router.push("/articles");
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "touch") return;
    const target = event.target as HTMLElement;
    if (target.closest("a,button,input,textarea,select")) return;
    const now = Date.now();
    if (now - lastTouch.current < 320) router.push("/articles");
    lastTouch.current = now;
  };

  return (
    <main className="reference-page-shell reference-home-screen">
      <div className="reference-home-content" onDoubleClick={enterArticles} onPointerUp={handlePointerUp}>
        <div className="reference-home-intro" tabIndex={0} onKeyDown={(event) => { if (event.key === "Enter") router.push("/articles"); }}>
          <p className="reference-eyebrow">~/intro.md · double click to enter articles</p>
          <div className="reference-home-identity">
            <div className="reference-home-mark">
              <img className="reference-logo" src="/lavine-logo.png" alt="LavineX mark" />
              <span>AI × QUANT</span>
            </div>
            <div className="reference-home-copy">
              <div className="reference-home-title-row">
                <h1>Lavine Xie</h1>
                <span>AI Product Builder</span>
              </div>
              <p className="reference-name">$ Math → Computer Science → AI products.</p>
              <div className="reference-home-signal-row" aria-label="Current focus">
                <span><b>FOCUS</b> AI products</span>
                <span><b>TRACK</b> Quant systems</span>
                <span><b>BASE</b> Hong Kong</span>
              </div>
            </div>
          </div>
        </div>

        <div className="reference-home-sections">
          <section className="reference-home-panel">
            <HomePanelHeading label="Social" />
            <div className="reference-home-panel-body">
              <a href="https://github.com/lavine888" target="_blank" rel="noreferrer">GitHub <span>↗</span></a>
              <a href="mailto:lavinexie@foxmail.com">Email <span>↗</span></a>
            </div>
          </section>

          <section className="reference-home-panel">
            <HomePanelHeading label="Education" />
            <div className="reference-home-panel-body">
              <p><strong>Computer Science</strong><small>City University of Hong Kong</small></p>
              <p><strong>Mathematics</strong><small>Applied mathematics background</small></p>
            </div>
          </section>

          <section className="reference-home-panel">
            <HomePanelHeading label="Tech Stack" />
            <div className="reference-home-tags">
              <span>Python</span><span>TypeScript</span><span>Agents</span><span>React</span><span>Three.js</span>
            </div>
          </section>

          <section className="reference-home-panel reference-home-projects">
            <HomePanelHeading label="Selected work" detail={<Link href="/projects">all projects ↗</Link>} />
            <div className="reference-home-project-list">
              {FEATURED_PROJECTS.map((project) => (
                <Link key={project.slug} href={`/projects/${project.slug}`} className="reference-home-project-card">
                  <span className="reference-home-project-id">{project.id}</span>
                  <span className="reference-home-project-copy"><strong>{project.name}</strong><small>{project.summary}</small></span>
                  <span className="reference-home-project-arrow">↗</span>
                </Link>
              ))}
            </div>
          </section>

          <section className="reference-home-panel reference-home-github">
            <HomePanelHeading label="GitHub Activity" detail={<a href="https://github.com/lavine888" target="_blank" rel="noreferrer">snapshot ↗</a>} />
            <div className="reference-activity" aria-label="GitHub activity snapshot">
              {ACTIVITY.map((level, index) => <i className={`level-${level}`} key={index} title={`activity cell ${index + 1}`} />)}
            </div>
            <div className="reference-home-activity-meta"><small>Less ░ ▒ ▓ █ More</small><small>371-day visual snapshot</small></div>
          </section>

          <section className="reference-home-panel reference-home-explore">
            <HomePanelHeading label="Quick access" detail={<span className="reference-home-online"><i /> live workspace</span>} />
            <div className="reference-home-quick-links">
              <Link href="/articles"><b>01</b><span>writing</span><small>notes & systems ↗</small></Link>
              <Link href="/projects"><b>02</b><span>projects</span><small>things built ↗</small></Link>
              <Link href="/about#now"><b>03</b><span>now</span><small>current direction ↗</small></Link>
              <a href="mailto:lavinexie@foxmail.com"><b>04</b><span>contact</span><small>start a conversation ↗</small></a>
            </div>
          </section>
        </div>

        <p className="reference-home-hint">Double click anywhere, type a command, or choose a route below.</p>
      </div>
      <TerminalCommandBar cwd="~/app" />
    </main>
  );
}

export { TerminalCommandBar };
