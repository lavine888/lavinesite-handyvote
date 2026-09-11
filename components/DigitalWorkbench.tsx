"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { CSS3DObject, CSS3DRenderer } from "three/examples/jsm/renderers/CSS3DRenderer.js";

const projects = [
  {
    name: "Minecraft × AI Education",
    meta: "AI-native spoken English · multiplayer agents",
    href: "https://github.com/lavine888",
    code: "01",
  },
  {
    name: "Flux Evidence Lab",
    meta: "AI × evidence × verification",
    href: "https://github.com/lavine888/flux-evidence-lab",
    code: "02",
  },
  {
    name: "Growth Agent OS",
    meta: "Agentic growth infrastructure",
    href: "https://github.com/lavine888/Growth-Agent-OS",
    code: "03",
  },
  {
    name: "CityU CS Notes",
    meta: "Learning in public · computer science",
    href: "https://github.com/lavine888/CityU-CS-Notes",
    code: "04",
  },
];

const lerp3 = (a: THREE.Vector3, b: THREE.Vector3, t: number) => a.clone().lerp(b, t);
const ease = (t: number) => t * t * (3 - 2 * t);

function screenMarkup() {
  return `
    <main class="monitor-ui">
      <header class="monitor-topbar">
        <div class="monitor-brand"><span class="brand-dot"></span>LAVINE / WORKBENCH</div>
        <div class="monitor-status">AVAILABLE FOR INTERESTING BUILDS</div>
      </header>
      <section class="monitor-hero">
        <p class="eyebrow">AI PRODUCT BUILDER · HONG KONG / SHENZHEN</p>
        <h1>Build things that feel<br/><em>one step ahead.</em></h1>
        <p class="lede">I work across agent systems, AI-native education, creative technology and quantitative ideas — usually somewhere between product, engineering and a slightly unreasonable prototype.</p>
        <div class="hero-tags"><span>AGENTS</span><span>PRODUCT</span><span>QUANT</span><span>BUILD IN PUBLIC</span></div>
      </section>
      <section class="monitor-grid">
        ${projects
          .map(
            (project) => `
          <a class="project-card" href="${project.href}" target="_blank" rel="noreferrer">
            <span class="project-code">${project.code}</span>
            <div><strong>${project.name}</strong><small>${project.meta}</small></div>
            <span class="arrow">↗</span>
          </a>`,
          )
          .join("")}
      </section>
      <footer class="monitor-footer">
        <span>lavine888</span><span>AI / SYSTEMS / STORIES</span><span>SCROLL TO ENTER</span>
      </footer>
    </main>`;
}

export default function DigitalWorkbench() {
  const rootRef = useRef<HTMLDivElement>(null);
  const webglRef = useRef<HTMLDivElement>(null);
  const cssRef = useRef<HTMLDivElement>(null);
  const [desktop3D, setDesktop3D] = useState(false);
  const [progress, setProgress] = useState(0);
  const projectList = useMemo(() => projects, []);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 1024px) and (hover: hover) and (pointer: fine)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setDesktop3D(media.matches && !reduce.matches);
    sync();
    media.addEventListener("change", sync);
    reduce.addEventListener("change", sync);
    return () => {
      media.removeEventListener("change", sync);
      reduce.removeEventListener("change", sync);
    };
  }, []);

  useEffect(() => {
    if (!desktop3D) return;
    const root = rootRef.current;
    const webglMount = webglRef.current;
    const cssMount = cssRef.current;
    if (!root || !webglMount || !cssMount) return;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050814, 0.045);

    const camera = new THREE.PerspectiveCamera(34, window.innerWidth / window.innerHeight, 0.1, 100);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.65));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.domElement.className = "workbench-webgl";
    webglMount.appendChild(renderer.domElement);

    const cssRenderer = new CSS3DRenderer();
    cssRenderer.setSize(window.innerWidth, window.innerHeight);
    cssRenderer.domElement.className = "workbench-css3d";
    cssMount.appendChild(cssRenderer.domElement);

    const world = new THREE.Group();
    scene.add(world);

    const metal = new THREE.MeshStandardMaterial({ color: 0x10192b, metalness: 0.78, roughness: 0.3 });
    const darkMetal = new THREE.MeshStandardMaterial({ color: 0x070b14, metalness: 0.82, roughness: 0.24 });
    const deskMaterial = new THREE.MeshStandardMaterial({ color: 0x0a1222, metalness: 0.35, roughness: 0.56 });
    const gold = new THREE.MeshStandardMaterial({ color: 0xcaa45d, emissive: 0x3a2811, emissiveIntensity: 0.35, metalness: 0.84, roughness: 0.24 });
    const blue = new THREE.MeshStandardMaterial({ color: 0x2f6fff, emissive: 0x102d86, emissiveIntensity: 0.7, metalness: 0.45, roughness: 0.28 });
    const glass = new THREE.MeshPhysicalMaterial({ color: 0x26354f, transmission: 0.35, transparent: true, opacity: 0.5, roughness: 0.15, metalness: 0.15 });

    const desk = new THREE.Mesh(new THREE.BoxGeometry(10.6, 0.34, 5.5), deskMaterial);
    desk.position.set(0, -0.15, 0.25);
    world.add(desk);

    const monitorShell = new THREE.Mesh(new THREE.BoxGeometry(5.9, 3.65, 0.34), metal);
    monitorShell.position.set(0, 2.15, -1.0);
    world.add(monitorShell);

    const screenBacking = new THREE.Mesh(new THREE.BoxGeometry(5.35, 3.18, 0.08), darkMetal);
    screenBacking.position.set(0, 2.15, -0.8);
    world.add(screenBacking);

    const stand = new THREE.Mesh(new THREE.BoxGeometry(0.54, 1.2, 0.42), metal);
    stand.position.set(0, 0.48, -1.12);
    world.add(stand);
    const base = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.18, 1.1), metal);
    base.position.set(0, -0.03, -1.0);
    world.add(base);

    const keyboard = new THREE.Mesh(new THREE.BoxGeometry(4.8, 0.16, 1.45), darkMetal);
    keyboard.position.set(0, 0.12, 1.18);
    keyboard.rotation.x = -0.05;
    world.add(keyboard);

    const keyGlow = new THREE.Mesh(new THREE.BoxGeometry(3.9, 0.025, 0.05), blue);
    keyGlow.position.set(0, 0.215, 1.2);
    world.add(keyGlow);

    const notebook = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.09, 2.25), glass);
    notebook.position.set(-3.6, 0.08, 0.85);
    notebook.rotation.y = 0.14;
    world.add(notebook);
    const notebookLine = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.02, 1.8), gold);
    notebookLine.position.set(-3.6, 0.14, 0.85);
    notebookLine.rotation.y = 0.14;
    world.add(notebookLine);

    const token = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 0.08, 48), gold);
    token.rotation.x = Math.PI / 2;
    token.position.set(3.65, 0.17, 0.35);
    world.add(token);

    const agentCore = new THREE.Mesh(new THREE.IcosahedronGeometry(0.52, 1), blue);
    agentCore.position.set(3.15, 1.0, -0.05);
    world.add(agentCore);

    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.8, 0.025, 12, 90), gold);
    ring.position.copy(agentCore.position);
    ring.rotation.x = Math.PI / 2.4;
    world.add(ring);

    const leftPanel = new THREE.Mesh(new THREE.BoxGeometry(1.4, 2.25, 0.07), glass);
    leftPanel.position.set(-4.35, 2.0, -0.35);
    leftPanel.rotation.y = 0.24;
    world.add(leftPanel);

    const rightPanel = new THREE.Mesh(new THREE.BoxGeometry(1.35, 1.7, 0.07), glass);
    rightPanel.position.set(4.25, 2.3, -0.5);
    rightPanel.rotation.y = -0.28;
    world.add(rightPanel);

    const ambient = new THREE.HemisphereLight(0x8ea8ff, 0x04060b, 1.55);
    scene.add(ambient);
    const key = new THREE.DirectionalLight(0xd7e2ff, 2.9);
    key.position.set(-4, 7, 6);
    scene.add(key);
    const warm = new THREE.PointLight(0xd3aa62, 16, 11, 2);
    warm.position.set(4.3, 2.1, 3.1);
    scene.add(warm);
    const cool = new THREE.PointLight(0x3d72ff, 18, 12, 2);
    cool.position.set(-4.5, 3.4, 2.2);
    scene.add(cool);

    const stars = new THREE.BufferGeometry();
    const count = 420;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      positions[i * 3] = (Math.random() - 0.5) * 38;
      positions[i * 3 + 1] = Math.random() * 18 - 3;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 34;
    }
    stars.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    scene.add(new THREE.Points(stars, new THREE.PointsMaterial({ color: 0x8197c9, size: 0.025, transparent: true, opacity: 0.48 })));

    const screen = document.createElement("div");
    screen.className = "monitor-dom";
    screen.innerHTML = screenMarkup();
    const screenObject = new CSS3DObject(screen);
    screenObject.position.set(0, 2.15, -0.605);
    screenObject.scale.setScalar(0.00506);
    scene.add(screenObject);

    const keyframes = [
      { p: 0, pos: new THREE.Vector3(9.8, 5.9, 12.8), target: new THREE.Vector3(0, 1.5, -0.6) },
      { p: 0.28, pos: new THREE.Vector3(6.5, 4.1, 8.2), target: new THREE.Vector3(-0.1, 1.65, -0.7) },
      { p: 0.62, pos: new THREE.Vector3(2.2, 2.8, 5.0), target: new THREE.Vector3(0, 2.0, -0.8) },
      { p: 1, pos: new THREE.Vector3(0, 2.2, 4.05), target: new THREE.Vector3(0, 2.15, -0.72) },
    ];

    const mouse = new THREE.Vector2();
    const onPointer = (event: PointerEvent) => {
      mouse.x = (event.clientX / window.innerWidth - 0.5) * 2;
      mouse.y = (event.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("pointermove", onPointer, { passive: true });

    const getProgress = () => {
      const rect = root.getBoundingClientRect();
      const total = Math.max(root.offsetHeight - window.innerHeight, 1);
      return THREE.MathUtils.clamp(-rect.top / total, 0, 1);
    };

    const cameraPosition = new THREE.Vector3();
    const cameraTarget = new THREE.Vector3();
    let animationFrame = 0;
    let lastProgress = -1;

    const animate = (time: number) => {
      const raw = getProgress();
      if (Math.abs(raw - lastProgress) > 0.001) {
        lastProgress = raw;
        setProgress(raw);
      }

      let from = keyframes[0];
      let to = keyframes[1];
      for (let i = 0; i < keyframes.length - 1; i += 1) {
        if (raw >= keyframes[i].p && raw <= keyframes[i + 1].p) {
          from = keyframes[i];
          to = keyframes[i + 1];
          break;
        }
      }
      const local = ease(THREE.MathUtils.clamp((raw - from.p) / (to.p - from.p), 0, 1));
      cameraPosition.copy(lerp3(from.pos, to.pos, local));
      cameraTarget.copy(lerp3(from.target, to.target, local));

      const mouseWeight = 1 - raw * 0.78;
      cameraPosition.x += mouse.x * 0.28 * mouseWeight;
      cameraPosition.y += -mouse.y * 0.18 * mouseWeight;
      camera.position.lerp(cameraPosition, 0.075);
      camera.lookAt(cameraTarget);

      agentCore.rotation.y = time * 0.00055;
      agentCore.rotation.x = time * 0.00025;
      ring.rotation.z = time * 0.00022;
      leftPanel.position.y = 2.0 + Math.sin(time * 0.0007) * 0.08;
      rightPanel.position.y = 2.3 + Math.sin(time * 0.0006 + 1.5) * 0.07;

      renderer.render(scene, camera);
      cssRenderer.render(scene, camera);
      animationFrame = requestAnimationFrame(animate);
    };

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      cssRenderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", onResize);
    animationFrame = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onPointer);
      screen.remove();
      renderer.dispose();
      stars.dispose();
      [metal, darkMetal, deskMaterial, gold, blue, glass].forEach((material) => material.dispose());
      webglMount.replaceChildren();
      cssMount.replaceChildren();
    };
  }, [desktop3D]);

  if (!desktop3D) {
    return (
      <main className="fallback-site">
        <p className="fallback-kicker">LAVINE XIE / DIGITAL WORKBENCH</p>
        <h1>Build things that feel <em>one step ahead.</em></h1>
        <p className="fallback-copy">AI Product Builder working across agent systems, AI-native education, creative technology and quantitative ideas.</p>
        <div className="fallback-tags"><span>AGENTS</span><span>PRODUCT</span><span>QUANT</span><span>BUILD IN PUBLIC</span></div>
        <section className="fallback-projects">
          {projectList.map((project) => (
            <a href={project.href} target="_blank" rel="noreferrer" key={project.name}>
              <small>{project.code}</small><div><strong>{project.name}</strong><span>{project.meta}</span></div><b>↗</b>
            </a>
          ))}
        </section>
      </main>
    );
  }

  return (
    <main ref={rootRef} className="experience-root">
      <div className="experience-sticky">
        <div className="scene-backdrop" />
        <div ref={cssRef} className="css3d-mount" />
        <div ref={webglRef} className="webgl-mount" />

        <header className="hud-top">
          <span>LAVINE / 2026</span>
          <span className="hud-center">DIGITAL WORKBENCH</span>
          <span>AI PRODUCT BUILDER</span>
        </header>

        <div className={`opening-copy ${progress > 0.26 ? "opening-copy--hide" : ""}`}>
          <p>ENTERING WORKSPACE / 01</p>
          <h1>LAVINE<br />XIE</h1>
          <div className="opening-rule" />
          <span>Agents · Product · Quant · Creative Technology</span>
        </div>

        <div className={`side-note side-note--left ${progress > 0.15 && progress < 0.72 ? "is-visible" : ""}`}>
          <small>ACTIVE THREADS</small>
          <span>AI-NATIVE EDUCATION</span>
          <span>AGENT SYSTEMS</span>
          <span>QUANT RESEARCH</span>
        </div>

        <div className={`side-note side-note--right ${progress > 0.38 && progress < 0.8 ? "is-visible" : ""}`}>
          <small>CURRENT MODE</small>
          <strong>BUILD → TEST → SHIP</strong>
          <span>More prototype, less theatre.</span>
        </div>

        <div className={`enter-hint ${progress > 0.72 ? "is-visible" : ""}`}>
          <span>YOU'RE INSIDE THE WORKBENCH</span>
          <b>↓</b>
        </div>

        <div className="progress-rail"><i style={{ height: `${Math.max(progress * 100, 4)}%` }} /></div>
      </div>
    </main>
  );
}
