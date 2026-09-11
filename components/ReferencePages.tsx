"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import TerminalCommandBar from "./TerminalCommandBar";

export function ReferencePageShell({ title, children }: { title: string; children: React.ReactNode }) {
  return <main className="reference-page-shell"><p className="reference-eyebrow">~/app/{title.toLowerCase()} $ cat index.md</p><h1>{title}</h1><div className="reference-page-content">{children}</div><p className="reference-page-links"><Link href="/">home</Link> · <Link href="/articles">articles</Link> · <Link href="/projects">projects</Link> · <Link href="/about">about</Link></p><TerminalCommandBar /></main>;
}

export function HomeScreen() {
  const router = useRouter();
  const lastTouch = useRef(0);
  const enterArticles = (event: React.MouseEvent<HTMLDivElement>) => { const target = event.target as HTMLElement; if (!target.closest("a,button,input,textarea,select")) router.push("/articles"); };
  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => { if (event.pointerType !== "touch") return; const target = event.target as HTMLElement; if (target.closest("a,button,input,textarea,select")) return; const now = Date.now(); if (now - lastTouch.current < 320) router.push("/articles"); lastTouch.current = now; };
  return <main className="reference-page-shell reference-home-screen">
    <div className="reference-home-content" onDoubleClick={enterArticles} onPointerUp={handlePointerUp}>
    <div className="reference-home-intro" tabIndex={0} onKeyDown={(event) => { if (event.key === "Enter") router.push("/articles"); }}>
      <p className="reference-eyebrow">~/intro.md - double click to enter articles</p>
      <img className="reference-avatar" src="/avatar.webp" alt="Lavine Xie" />
      <h1>Lavine Xie <span>— AI Product Builder</span></h1>
      <p className="reference-name">$ Math → Computer Science → AI products.</p>
    <div className="reference-home-sections">
      <section><h2>Social</h2><a href="https://github.com/lavine888">GitHub ↗</a><a href="mailto:lavinexie@foxmail.com">Email</a></section>
      <section><h2>Education</h2><p>Computer Science<br/><small>City University of Hong Kong</small></p><p>Mathematics</p></section>
      <section><h2>Tech Stack</h2><p>TypeScript · React · Next.js<br/>Python · AI Agents · Three.js</p></section>
      <section className="reference-home-github"><h2>GitHub Activity <a href="https://github.com/lavine888">view ↗</a></h2><div className="reference-activity">{Array.from({ length: 371 }, (_, i) => <i className={`level-${(i * 7 + 2) % 5}`} key={i} />)}</div><small>Less ░ ▒ ▓ █ More</small></section>
    </div><p className="reference-home-hint">Double click anywhere, type a command, or click a hint below.</p></div>
    </div><TerminalCommandBar />
  </main>;
}

export { TerminalCommandBar };
