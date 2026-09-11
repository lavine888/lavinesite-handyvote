import { ReferencePageShell } from "@/components/ReferencePages";

export default function AboutPage() {
  return (
    <ReferencePageShell title="About" cwd="~/app">
      <p className="reference-page-lede">Lavine Xie · AI Product Builder / Quantitative Systems</p>
      <p>I work between product ideas, technical systems, and the people who use them. My background is in mathematics and applied mathematics, and I am currently studying computer science at City University of Hong Kong.</p>
      <p>I build agent systems, AI-native education, creative technology, and quantitative experiments from the first question to a working proof.</p>
      <section id="now" className="reference-about-section">
        <h2>Now</h2>
        <p>Shipping AI products with clearer user problems, stronger demos, and real feedback. In parallel, I am building cleaner quantitative research loops from data preparation to signal evaluation.</p>
      </section>
      <section id="contact" className="reference-about-section">
        <h2>Contact</h2>
        <p>Open to AI product, quantitative research, and early-stage collaboration.</p>
        <div className="reference-meta reference-about-meta"><span><b>Location</b> Hong Kong / Shenzhen</span><span><b>GitHub</b> <a href="https://github.com/lavine888" target="_blank" rel="noreferrer">lavine888 ↗</a></span><span><b>Email</b> <a href="mailto:lavinexie@foxmail.com">lavinexie@foxmail.com</a></span></div>
      </section>
    </ReferencePageShell>
  );
}
