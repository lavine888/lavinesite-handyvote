import { ReferencePageShell } from "@/components/ReferencePages";

export default function AboutPage() {
  return (
    <ReferencePageShell title="About">
      <p className="reference-page-lede">Lavine Xie · AI Product Builder / Quantitative Systems</p>
      <p>I work between product ideas, technical systems, and the people who use them. My background is in mathematics and applied mathematics, and I am currently studying computer science at City University of Hong Kong.</p>
      <p>I build agent systems, AI-native education, creative technology, and quantitative experiments from the first question to a working proof.</p>
      <div className="reference-meta reference-about-meta"><span><b>Location</b> Hong Kong / Shenzhen</span><span><b>GitHub</b> <a href="https://github.com/lavine888" target="_blank" rel="noreferrer">lavine888 ↗</a></span><span><b>Email</b> <a href="mailto:lavinexie@foxmail.com">lavinexie@foxmail.com</a></span></div>
    </ReferencePageShell>
  );
}
