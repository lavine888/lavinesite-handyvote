"use client";

import { useEffect, useState, type ReactNode } from "react";
import ReferenceScene from "./ReferenceScene";
import PaperDoodle from "./PaperDoodle";

const DESKTOP_3D_MEDIA = "(min-width: 1024px) and (hover: hover) and (pointer: fine)";

type Props = { children: ReactNode };

function PaperContent() {
  return (
    <div className="reference-paper-content">
      <div className="reference-paper-static">
        <div className="reference-paper-intro">
          <p>NOW / CURRENT DIRECTION</p>
          <h2>Small systems,<br />real feedback.</h2>
          <p className="reference-paper-summary">A working page for ideas that become places, tools, and decisions you can inspect.</p>
        </div>
        <div className="reference-paper-links" aria-label="Current work">
          <a href="/projects/bull-bear-exchange-island"><strong>01</strong><span>AI-native learning worlds<small>turn abstract ideas into places you can explore</small></span><b>↗</b></a>
          <a href="/projects/agent-jam"><strong>02</strong><span>Agent workbench / review loop<small>make context and decisions visible</small></span><b>↗</b></a>
          <a href="/projects/pandaai-quant"><strong>03</strong><span>Point-in-time quant research<small>keep signals auditable from data to result</small></span><b>↗</b></a>
        </div>
        <small className="reference-paper-updated">Updated · September 2026 · Hong Kong</small>
      </div>
      <PaperDoodle />
    </div>
  );
}

function MobileFrame({ children }: Props) {
  return (
    <main className="reference-mobile-frame">
      <header className="reference-mobile-header">
        <span className="reference-mobile-brand"><img src="/lavine-logo.png" alt="" />&gt;_ Lavine</span>
        <span>AI PRODUCT BUILDER</span>
      </header>
      <div className="reference-mobile-content">{children}</div>
    </main>
  );
}

/** Persistent 3D shell. Route changes update the DOM living inside the monitor. */
export default function HandyReplica({ children }: Props) {
  const [desktop, setDesktop] = useState<boolean | null>(null);

  useEffect(() => {
    const capable = window.matchMedia(DESKTOP_3D_MEDIA);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setDesktop(capable.matches && !reduced.matches);
    sync();
    capable.addEventListener("change", sync);
    reduced.addEventListener("change", sync);
    return () => {
      capable.removeEventListener("change", sync);
      reduced.removeEventListener("change", sync);
    };
  }, []);

  if (desktop !== true) return <MobileFrame>{children}</MobileFrame>;

  return (
    <main className="reference-experience" data-reference-experience="desktop">
      <ReferenceScene
        className="reference-experience__scene"
        screenContent={children}
        paperContent={<PaperContent />}
      />
      <div className="reference-loader" aria-hidden="true">
        <span>LAVINE / WORKSPACE</span>
        <i />
      </div>
    </main>
  );
}
