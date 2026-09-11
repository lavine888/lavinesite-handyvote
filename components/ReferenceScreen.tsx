/** HTML used by the CSS3D monitor and by the readable standalone screen. */
export function screenHTML(): string {
  return `<div class="reference-screen"><div class="reference-body">
      <aside class="reference-sidebar">
        <img class="reference-avatar" src="/avatar.webp" alt="Lavine Xie" />
        <h1>Lavine Xie</h1><p class="reference-role">AI Product Builder</p>
        <nav><a href="/about">~/about</a><a href="/articles">~/articles</a><a href="/projects">~/projects</a></nav>
        <section><h2>Social</h2><a href="https://github.com/lavine888" target="_blank" rel="noreferrer">GitHub ↗</a><a href="mailto:lavine@example.com">Email ↗</a></section>
        <section><h2>Education</h2><p>Computer Science<br/><small>City University of Hong Kong</small></p><p>Mathematics<br/><small>China</small></p></section>
        <section><h2>Tech Stack</h2><p class="reference-tags">TypeScript · React · Next.js<br/>Python · AI Agents · Three.js</p></section>
      </aside>
      <main class="reference-main" id="home">
        <p class="reference-command">guest@~/app $ <span>cat intro.md</span></p>
        <div class="reference-intro"><img class="reference-avatar reference-inline-avatar" src="/avatar.webp" alt="Lavine Xie"/><p class="reference-eyebrow">// welcome to my workspace</p><h2>double click to enter articles</h2><p class="reference-name">Lavine Xie <span>— AI Product Builder</span></p><p>Math → Computer Science → AI products.</p><p>I build agent systems, AI-native education, creative technology and quantitative experiments.</p></div>
        <div class="reference-meta"><span><b>Social</b> <a href="https://github.com/lavine888" target="_blank" rel="noreferrer">GitHub ↗</a></span><span><b>Education</b> Computer Science · CityU HK</span><span><b>Tech Stack</b> TypeScript · React · AI Agents · Three.js</span></div>
        <section class="reference-panel"><h3>GitHub Activity <a href="https://github.com/lavine888" target="_blank" rel="noreferrer">view profile ↗</a></h3><div class="reference-activity">${Array.from({length: 35}, (_, i) => `<i class="level-${(i * 7 + 2) % 5}" title="${(i % 9) + 1} contributions"></i>`).join("")}</div><small>Less&nbsp; ░ ▒ ▓ █ &nbsp;More</small></section>
        <section class="reference-links"><a href="/articles"><b>01</b><span>Articles</span><em>writing on products, agents and learning ↗</em></a><a href="/projects"><b>02</b><span>Projects</span><em>things built in public ↗</em></a><a href="/about"><b>03</b><span>About</span><em>the person behind the terminal ↗</em></a></section>
        <p class="reference-command reference-bottom">guest@~/app $ <span class="reference-caret">_</span></p>
      </main>
    </div></div>`;
}

export default function ReferenceScreen({ className = "" }: { className?: string }) {
  return <div className={className} dangerouslySetInnerHTML={{ __html: screenHTML() }} />;
}
