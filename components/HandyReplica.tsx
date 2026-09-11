"use client";

import { useEffect, useState, type ReactNode } from "react";
import ReferenceScene from "./ReferenceScene";

const DESKTOP_3D_MEDIA = "(min-width: 1024px) and (hover: hover) and (pointer: fine)";

type Props = { children: ReactNode };

function PaperContent() {
  return (
    <div className="reference-paper-content">
      <p>SCRATCHPAD / ACTIVE THREADS</p>
      <h2>Build things that feel one step ahead.</h2>
      <hr />
      <span>AI-native education</span>
      <span>Agent systems</span>
      <span>Quant experiments</span>
      <small>Lavine · build in public</small>
    </div>
  );
}

function MobileFrame({ children }: Props) {
  return (
    <main className="reference-mobile-frame">
      <header className="reference-mobile-header">
        <span>&gt;_ Lavine</span>
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
