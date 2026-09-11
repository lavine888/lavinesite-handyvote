"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { CSS3DObject, CSS3DRenderer } from "three/examples/jsm/renderers/CSS3DRenderer.js";

type ViewKey = "loading" | "idle" | "desk" | "monitor" | "paper";

type Pose = {
  position: THREE.Vector3;
  target: THREE.Vector3;
  duration: number;
};

const VIEWS: Record<ViewKey, Pose> = {
  loading: {
    position: new THREE.Vector3(-17, 11, 18),
    target: new THREE.Vector3(0, 1.5, -0.8),
    duration: 0,
  },
  idle: {
    position: new THREE.Vector3(-12.6, 7.35, 14.2),
    target: new THREE.Vector3(0, 1.7, -0.8),
    duration: 1.8,
  },
  desk: {
    position: new THREE.Vector3(0, 3.55, 7.35),
    target: new THREE.Vector3(0, 1.85, -0.62),
    duration: 1.1,
  },
  monitor: {
    position: new THREE.Vector3(0, 2.8, 4.18),
    target: new THREE.Vector3(0, 2.72, -1.04),
    duration: 2,
  },
  paper: {
    position: new THREE.Vector3(-3.12, 5.05, 1.72),
    target: new THREE.Vector3(-3.12, 0.42, 1.72),
    duration: 1,
  },
};

const PROJECTS = [
  ["Minecraft × AI Education", "AI-native spoken English inside a multiplayer world.", "https://github.com/lavine888", "AI / EDUCATION"],
  ["Flux Evidence Lab", "Evidence, verification and trustworthy AI workflows.", "https://github.com/lavine888/flux-evidence-lab", "AI / EVIDENCE"],
  ["Growth Agent OS", "Agentic infrastructure for growth workflows.", "https://github.com/lavine888/Growth-Agent-OS", "AGENTS"],
  ["CityU CS Notes", "Computer science notes, organized and built in public.", "https://github.com/lavine888/CityU-CS-Notes", "LEARNING"],
] as const;

function screenHTML() {
  return `
    <div class="replica-screen-page">
      <header class="replica-screen-nav">
        <a class="replica-brand" href="#home"><span>&gt;_</span> Lavine</a>
        <nav>
          <a href="#about">about</a>
          <a href="#work">work</a>
          <a href="https://github.com/lavine888" target="_blank" rel="noreferrer">github↗</a>
        </nav>
      </header>
      <main id="home" class="replica-screen-main">
        <section class="replica-screen-hero">
          <p class="replica-terminal-line"><span>lavine@workbench</span>:~$ whoami</p>
          <h1>Lavine Xie</h1>
          <p class="replica-role">AI Product Builder / Product Integrator</p>
          <p class="replica-lede">Math → Computer Science → AI products. I build agent systems, AI-native education, creative technology and quantitative experiments.</p>
          <div class="replica-chips"><span>AGENTS</span><span>PRODUCT</span><span>QUANT</span><span>BUILD IN PUBLIC</span></div>
        </section>
        <section id="about" class="replica-screen-section">
          <div class="replica-section-head"><span>01</span><b>ABOUT</b></div>
          <p>I like work that sits between the product idea, the technical system, and the thing a real user actually touches. Build first, explain second.</p>
        </section>
        <section id="work" class="replica-screen-section">
          <div class="replica-section-head"><span>02</span><b>SELECTED WORK</b></div>
          <div class="replica-project-grid">
            ${PROJECTS.map(([name, desc, href, tag], i) => `
              <a class="replica-project" href="${href}" target="_blank" rel="noreferrer">
                <small>0${i + 1} / ${tag}</small>
                <strong>${name}</strong>
                <p>${desc}</p>
                <i>↗</i>
              </a>
            `).join("")}
          </div>
        </section>
        <section class="replica-screen-section replica-now">
          <div class="replica-section-head"><span>03</span><b>CURRENT MODE</b></div>
          <p>BUILD → TEST → SHIP → WRITE ABOUT IT.</p>
        </section>
      </main>
      <footer class="replica-screen-footer"><span>Lavine Xie · 2026</span><span>HK ↔ SZ</span></footer>
    </div>`;
}

function paperHTML() {
  return `
    <div class="replica-paper-ui">
      <p class="replica-paper-kicker">SCRATCHPAD / ACTIVE THREADS</p>
      <h2>Build things that feel<br/>one step ahead.</h2>
      <div class="replica-paper-rule"></div>
      <p>AI-native education</p>
      <p>Agent systems</p>
      <p>Quant experiments</p>
      <small>Lavine · build in public</small>
    </div>`;
}

function box(
  parent: THREE.Group,
  size: [number, number, number],
  pos: [number, number, number],
  mat: THREE.Material,
  rot: [number, number, number] = [0, 0, 0],
) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(...size), mat);
  mesh.position.set(...pos);
  mesh.rotation.set(...rot);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  parent.add(mesh);
  return mesh;
}

function cylinder(
  parent: THREE.Group,
  radius: number,
  height: number,
  pos: [number, number, number],
  mat: THREE.Material,
  segments = 24,
) {
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, height, segments), mat);
  mesh.position.set(...pos);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  parent.add(mesh);
  return mesh;
}

function makeOverlayTexture(kind: "smudge" | "shadow") {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 768;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.CanvasTexture(canvas);
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (kind === "shadow") {
    const gradient = ctx.createRadialGradient(512, 355, 220, 512, 355, 610);
    gradient.addColorStop(0, "rgba(0,0,0,0)");
    gradient.addColorStop(0.7, "rgba(0,0,0,0.05)");
    gradient.addColorStop(1, "rgba(0,0,0,0.72)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 1024, 768);
  } else {
    ctx.globalCompositeOperation = "source-over";
    for (let i = 0; i < 22; i += 1) {
      const x = 120 + ((i * 197) % 790);
      const y = 90 + ((i * 113) % 580);
      const r = 18 + (i % 5) * 8;
      const gradient = ctx.createRadialGradient(x, y, 1, x, y, r);
      gradient.addColorStop(0, "rgba(220,230,222,0.055)");
      gradient.addColorStop(1, "rgba(220,230,222,0)");
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function easeQuintic(t: number) {
  const x = THREE.MathUtils.clamp(t, 0, 1);
  return x < 0.5 ? 16 * x ** 5 : 1 - ((-2 * x + 2) ** 5) / 2;
}

function easeMonitor(t: number) {
  const x = THREE.MathUtils.clamp(t, 0, 1);
  return 1 - (1 - x) ** 4;
}

export default function HandyReplica() {
  const rootRef = useRef<HTMLDivElement>(null);
  const cssRef = useRef<HTMLDivElement>(null);
  const webglRef = useRef<HTMLDivElement>(null);
  const [desktop, setDesktop] = useState(false);
  const [view, setViewState] = useState<ViewKey>("loading");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const capable = window.matchMedia("(min-width: 1024px) and (hover: hover) and (pointer: fine)");
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

  useEffect(() => {
    if (!desktop) return;
    const root = rootRef.current;
    const cssMount = cssRef.current;
    const webglMount = webglRef.current;
    if (!root || !cssMount || !webglMount) return;

    THREE.ColorManagement.enabled = true;

    const scene = new THREE.Scene();
    const cssScene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x070907, 0.035);

    const camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 120);
    camera.position.copy(VIEWS.loading.position);
    camera.lookAt(VIEWS.loading.target);

    const webgl = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    webgl.setPixelRatio(Math.min(window.devicePixelRatio, 1.65));
    webgl.setSize(window.innerWidth, window.innerHeight);
    webgl.setClearColor(0x000000, 0);
    webgl.shadowMap.enabled = true;
    webgl.shadowMap.type = THREE.PCFSoftShadowMap;
    webgl.outputColorSpace = THREE.SRGBColorSpace;
    webgl.toneMapping = THREE.ACESFilmicToneMapping;
    webgl.toneMappingExposure = 0.9;
    webgl.domElement.className = "replica-webgl-canvas";
    webglMount.appendChild(webgl.domElement);

    const cssRenderer = new CSS3DRenderer();
    cssRenderer.setSize(window.innerWidth, window.innerHeight);
    cssRenderer.domElement.className = "replica-css-renderer";
    cssMount.appendChild(cssRenderer.domElement);

    const world = new THREE.Group();
    scene.add(world);

    const wall = new THREE.MeshStandardMaterial({ color: 0x121713, roughness: 1 });
    const floor = new THREE.MeshStandardMaterial({ color: 0x1a1d1a, roughness: 0.98 });
    const wood = new THREE.MeshStandardMaterial({ color: 0x4a3728, roughness: 0.75 });
    const woodDark = new THREE.MeshStandardMaterial({ color: 0x241b15, roughness: 0.86 });
    const black = new THREE.MeshStandardMaterial({ color: 0x0b0d0c, roughness: 0.48, metalness: 0.34 });
    const monitorMat = new THREE.MeshStandardMaterial({ color: 0x070908, roughness: 0.31, metalness: 0.5 });
    const metal = new THREE.MeshStandardMaterial({ color: 0x626862, roughness: 0.4, metalness: 0.72 });
    const keyMat = new THREE.MeshStandardMaterial({ color: 0x1b201d, roughness: 0.68 });
    const cream = new THREE.MeshStandardMaterial({ color: 0xd1c9b0, roughness: 0.95 });
    const plantMat = new THREE.MeshStandardMaterial({ color: 0x34533e, roughness: 0.9 });
    const potMat = new THREE.MeshStandardMaterial({ color: 0x674c38, roughness: 0.88 });
    const speakerCone = new THREE.MeshStandardMaterial({ color: 0x636a65, roughness: 0.45, metalness: 0.35 });

    // Room shell.
    box(world, [27, 0.35, 23], [0, -0.68, -1], floor);
    box(world, [27, 13.5, 0.35], [0, 5.85, -9.15], wall);
    box(world, [0.35, 13.5, 23], [-12.65, 5.85, -1], wall);

    // Desk and legs.
    box(world, [13.3, 0.42, 5.7], [0, 0.12, -0.05], wood);
    for (const [x, z] of [[-5.7, -1.75], [5.7, -1.75], [-5.7, 1.5], [5.7, 1.5]] as const) {
      box(world, [0.45, 4.2, 0.45], [x, -1.92, z], black);
    }

    // Monitor: four bezel bars leave a real hole for CSS3D content.
    const tilt = -3 * THREE.MathUtils.DEG2RAD;
    box(world, [6.6, 0.28, 0.38], [0, 4.64, -1.24], monitorMat, [tilt, 0, 0]);
    box(world, [6.6, 0.28, 0.38], [0, 0.82, -1.04], monitorMat, [tilt, 0, 0]);
    box(world, [0.28, 3.55, 0.38], [-3.16, 2.73, -1.14], monitorMat, [tilt, 0, 0]);
    box(world, [0.28, 3.55, 0.38], [3.16, 2.73, -1.14], monitorMat, [tilt, 0, 0]);
    box(world, [0.5, 1.52, 0.42], [0, 0.02, -1.34], metal);
    box(world, [2.6, 0.18, 1.18], [0, -0.66, -1.26], metal);

    // Keyboard with dense key detail.
    box(world, [5.25, 0.18, 1.64], [0.25, 0.43, 1.33], black, [-0.055, 0, 0]);
    for (let row = 0; row < 4; row += 1) {
      const cols = row === 0 ? 14 : 13;
      for (let col = 0; col < cols; col += 1) {
        box(world, [0.24, 0.065, 0.21], [-1.95 + col * 0.31 + row * 0.035, 0.555, 0.88 + row * 0.3], keyMat, [-0.055, 0, 0]);
      }
    }
    box(world, [1.7, 0.065, 0.21], [0.15, 0.555, 1.81], keyMat, [-0.055, 0, 0]);

    // Mouse pad + mouse.
    box(world, [2.8, 0.035, 2.25], [4.02, 0.39, 1.28], new THREE.MeshStandardMaterial({ color: 0x151916, roughness: 0.96 }));
    box(world, [0.73, 0.23, 1.06], [4.08, 0.55, 1.2], black, [0, -0.12, 0]);

    // PC tower and three emissive front fans.
    box(world, [2.2, 3.75, 3.15], [4.72, 2.05, -2.58], black);
    const glass = new THREE.MeshPhysicalMaterial({ color: 0x26352e, transmission: 0.25, opacity: 0.32, transparent: true, roughness: 0.18 });
    box(world, [0.04, 3.25, 2.7], [3.59, 2.05, -2.58], glass);
    const fanMat = new THREE.MeshStandardMaterial({ color: 0x5e846d, emissive: 0x173c28, emissiveIntensity: 1.25 });
    const fans: THREE.Mesh[] = [];
    for (const y of [1.14, 2.05, 2.96]) {
      const fan = cylinder(world, 0.47, 0.08, [4.75, y, -0.93], fanMat, 36);
      fan.rotation.x = Math.PI / 2;
      fans.push(fan);
    }

    // Speakers.
    for (const x of [-4.03, 3.05]) {
      box(world, [1.06, 2.18, 1.02], [x, 1.48, -1.52], black);
      const cone = cylinder(world, 0.32, 0.06, [x, 1.55, -0.98], speakerCone, 32);
      cone.rotation.x = Math.PI / 2;
    }

    // Articulated desk lamp.
    cylinder(world, 0.57, 0.14, [-4.96, 0.48, 1.46], black, 30);
    box(world, [0.15, 2.75, 0.15], [-4.7, 1.76, 1.28], metal, [0, 0, -0.28]);
    const shade = new THREE.Mesh(new THREE.ConeGeometry(0.72, 1.18, 28, 1, true), black);
    shade.position.set(-4.03, 3.05, 1.14);
    shade.rotation.z = -0.72;
    shade.castShadow = true;
    world.add(shade);

    // Books, cup, plant and board make the wide shot read like a lived-in room.
    const bookColors = [0x6a5140, 0x344c42, 0x696958, 0x3e464b];
    bookColors.forEach((color, i) => box(world, [1.46, 0.15, 0.95], [-4.15, 0.43 + i * 0.16, -1.95], new THREE.MeshStandardMaterial({ color, roughness: 0.92 }), [0, 0.1 - i * 0.035, 0]));
    cylinder(world, 0.24, 0.86, [2.72, 0.83, -2.18], new THREE.MeshStandardMaterial({ color: 0x355246, roughness: 0.9 }), 28);
    cylinder(world, 0.52, 0.72, [-5.08, 0.72, -2.38], potMat, 26);
    for (let i = 0; i < 10; i += 1) {
      const leaf = new THREE.Mesh(new THREE.SphereGeometry(0.34, 10, 8), plantMat);
      leaf.scale.set(0.62, 1.55, 0.3);
      leaf.position.set(-5.08 + Math.sin(i * 1.7) * 0.54, 1.35 + (i % 3) * 0.28, -2.38 + Math.cos(i * 1.31) * 0.45);
      leaf.rotation.z = Math.sin(i) * 0.74;
      leaf.castShadow = true;
      world.add(leaf);
    }

    box(world, [5.45, 3.45, 0.18], [-5.55, 5.6, -8.72], black);
    box(world, [5.08, 3.08, 0.07], [-5.55, 5.6, -8.58], new THREE.MeshStandardMaterial({ color: 0x3c3529, roughness: 1 }));
    const sticky = [0xc1b584, 0xa6b39a, 0xb19883, 0x8fa5a0];
    for (let i = 0; i < 8; i += 1) {
      box(world, [0.66, 0.53, 0.02], [-7.3 + (i % 4) * 1.08, 6.34 - Math.floor(i / 4) * 1.28, -8.51], new THREE.MeshStandardMaterial({ color: sticky[i % sticky.length], roughness: 0.98 }), [0, 0, (i % 3 - 1) * 0.055]);
    }
    box(world, [6.2, 0.18, 1.2], [-6.2, 7.78, -8.55], woodDark);
    for (let i = 0; i < 8; i += 1) {
      box(world, [0.42 + (i % 2) * 0.1, 1.2 + (i % 3) * 0.18, 0.95], [-8.75 + i * 0.62, 8.44, -8.43], new THREE.MeshStandardMaterial({ color: bookColors[i % bookColors.length], roughness: 0.9 }), [0, 0, i % 2 ? -0.035 : 0.025]);
    }

    // Paper interaction target.
    const paper = box(world, [2.28, 0.045, 3.0], [-3.12, 0.4, 1.72], cream, [0, 0.14, 0]);
    const ink = new THREE.MeshBasicMaterial({ color: 0x55564f });
    for (let i = 0; i < 6; i += 1) box(world, [1.48 - i * 0.07, 0.01, 0.033], [-3.13, 0.435, 0.96 + i * 0.31], ink, [0, 0.14, 0]);

    // Lighting.
    scene.add(new THREE.HemisphereLight(0x9caea2, 0x17130f, 1.04));
    const keyLight = new THREE.DirectionalLight(0xc8d4cc, 2.35);
    keyLight.position.set(-6, 10, 8);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.set(2048, 2048);
    keyLight.shadow.camera.near = 1;
    keyLight.shadow.camera.far = 38;
    scene.add(keyLight);

    const warm = new THREE.SpotLight(0xe6c391, 31, 12, Math.PI / 5.5, 0.6, 1.7);
    warm.position.set(-3.92, 3.12, 1.1);
    warm.target.position.set(-2.85, 0.2, 0.7);
    warm.castShadow = true;
    scene.add(warm, warm.target);

    const monitorGlow = new THREE.PointLight(0x77a58b, 7.5, 8, 2);
    monitorGlow.position.set(0, 2.75, 0.1);
    scene.add(monitorGlow);

    // Real DOM monitor, physically aligned with the 3D bezel.
    const screen = document.createElement("div");
    screen.className = "replica-monitor-dom";
    screen.innerHTML = screenHTML();
    const screenObject = new CSS3DObject(screen);
    screenObject.position.set(0, 2.73, -1.03);
    screenObject.rotation.x = tilt;
    screenObject.scale.setScalar(0.00575);
    cssScene.add(screenObject);

    // Real DOM paper overlay: hidden as a readable interface until the close-up.
    const paperElement = document.createElement("div");
    paperElement.className = "replica-paper-dom";
    paperElement.innerHTML = paperHTML();
    const paperObject = new CSS3DObject(paperElement);
    paperObject.position.set(-3.12, 0.445, 1.72);
    paperObject.rotation.x = -Math.PI / 2;
    paperObject.rotation.z = -0.14;
    paperObject.scale.setScalar(0.0034);
    cssScene.add(paperObject);

    // Procedural screen wear + vignette in WebGL, above the CSS3D page.
    const smudgeTexture = makeOverlayTexture("smudge");
    const shadowTexture = makeOverlayTexture("shadow");
    const screenOverlays: THREE.Mesh[] = [];
    const addScreenPlane = (texture: THREE.Texture, z: number, opacity = 1) => {
      const mesh = new THREE.Mesh(
        new THREE.PlaneGeometry(6.08, 3.54),
        new THREE.MeshBasicMaterial({ map: texture, transparent: true, opacity, depthWrite: false, side: THREE.DoubleSide }),
      );
      mesh.position.set(0, 2.73, z);
      mesh.rotation.x = tilt;
      scene.add(mesh);
      screenOverlays.push(mesh);
      return mesh;
    };
    addScreenPlane(smudgeTexture, -0.995, 0.75);
    addScreenPlane(shadowTexture, -0.985, 0.68);
    const dimmer = new THREE.Mesh(
      new THREE.PlaneGeometry(6.08, 3.54),
      new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.35, depthWrite: false, side: THREE.DoubleSide }),
    );
    dimmer.position.set(0, 2.73, -0.975);
    dimmer.rotation.x = tilt;
    scene.add(dimmer);
    screenOverlays.push(dimmer);

    const mouse = new THREE.Vector2();
    const raycaster = new THREE.Raycaster();
    let currentView: ViewKey = "loading";
    let transitionStarted = performance.now();
    let transitionFromPosition = camera.position.clone();
    let transitionFromTarget = VIEWS.loading.target.clone();
    let cameraTarget = VIEWS.loading.target.clone();
    let paperHovering = false;

    const enterView = (next: ViewKey) => {
      if (next === currentView) return;
      transitionFromPosition = camera.position.clone();
      transitionFromTarget = cameraTarget.clone();
      transitionStarted = performance.now();
      currentView = next;
      setViewState(next);
    };

    const updatePointer = (event: PointerEvent) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    const isInside = (element: HTMLElement, event: Event) => event.target instanceof Node && element.contains(event.target);

    const onPointerMove = (event: PointerEvent) => {
      if (isInside(screen, event)) {
        paperHovering = false;
        enterView("monitor");
        return;
      }
      if (isInside(paperElement, event)) {
        paperHovering = true;
        enterView("paper");
        return;
      }

      updatePointer(event);
      raycaster.setFromCamera(mouse, camera);
      paper.updateWorldMatrix(true, false);
      const hovering = raycaster.intersectObject(paper, false).length > 0;
      if (hovering && !paperHovering) enterView("paper");
      paperHovering = hovering;
    };

    const onPointerDown = (event: PointerEvent) => {
      if (isInside(screen, event)) return;
      if (paperHovering || isInside(paperElement, event)) {
        event.stopImmediatePropagation();
        return;
      }
      updatePointer(event);
      enterView(currentView === "desk" ? "idle" : "desk");
    };

    document.addEventListener("pointermove", onPointerMove);
    document.addEventListener("pointerdown", onPointerDown);

    let raf = 0;
    const clock = new THREE.Clock();
    const intro = window.setTimeout(() => {
      setReady(true);
      enterView("idle");
    }, 520);

    const animate = () => {
      const elapsed = clock.getElapsedTime();
      const pose = VIEWS[currentView];
      const transitionSeconds = Math.max(pose.duration, 0.001);
      const raw = (performance.now() - transitionStarted) / (transitionSeconds * 1000);
      const eased = currentView === "monitor" ? easeMonitor(raw) : easeQuintic(raw);
      const destinationPosition = pose.position.clone();
      const destinationTarget = pose.target.clone();

      // Idle and desk react gently to the pointer after the transition settles.
      if (currentView === "idle") {
        destinationPosition.x += Math.sin((elapsed + 19) * 0.08) * 2.0 + mouse.x * 0.42;
        destinationPosition.y += Math.sin((elapsed + 1) * 0.04) * 0.42 - mouse.y * 0.2;
      } else if (currentView === "desk") {
        destinationTarget.x += mouse.x * 0.36;
        destinationTarget.y += mouse.y * 0.18;
        destinationPosition.x += mouse.x * 0.28;
      }

      if (raw < 1) {
        camera.position.copy(transitionFromPosition.clone().lerp(destinationPosition, eased));
        cameraTarget.copy(transitionFromTarget.clone().lerp(destinationTarget, eased));
      } else {
        // Slow damping after arrival keeps the scene alive without fighting the camera transition.
        camera.position.lerp(destinationPosition, currentView === "idle" ? 0.025 : 0.055);
        cameraTarget.lerp(destinationTarget, currentView === "idle" ? 0.03 : 0.06);
      }
      camera.lookAt(cameraTarget);

      fans.forEach((fan, i) => { fan.rotation.z = elapsed * (1.3 + i * 0.09); });

      // Match the reference's screen dimming: more opaque from far/oblique views, almost gone close-up.
      const viewVector = camera.position.clone().sub(new THREE.Vector3(0, 2.73, -1.03)).normalize();
      const facing = THREE.MathUtils.clamp(viewVector.dot(new THREE.Vector3(0, 0, 1)), -1, 1);
      const distance = camera.position.distanceTo(new THREE.Vector3(0, 2.73, -1.03));
      const distanceOpacity = THREE.MathUtils.clamp((distance - 4.6) / 11, 0, 1);
      const angleOpacity = THREE.MathUtils.clamp((1 - facing) * 0.65, 0, 0.55);
      (dimmer.material as THREE.MeshBasicMaterial).opacity = currentView === "monitor" ? 0.025 : Math.min(0.62, distanceOpacity * 0.48 + angleOpacity);

      paperElement.dataset.focused = currentView === "paper" ? "true" : "false";

      webgl.render(scene, camera);
      cssRenderer.render(cssScene, camera);
      raf = requestAnimationFrame(animate);
    };

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      webgl.setSize(window.innerWidth, window.innerHeight);
      cssRenderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", onResize);
    raf = requestAnimationFrame(animate);

    return () => {
      window.clearTimeout(intro);
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerdown", onPointerDown);
      cssScene.remove(screenObject, paperObject);
      screen.remove();
      paperElement.remove();
      smudgeTexture.dispose();
      shadowTexture.dispose();
      screenOverlays.forEach((mesh) => {
        scene.remove(mesh);
        mesh.geometry.dispose();
        (mesh.material as THREE.Material).dispose();
      });
      world.traverse((object) => {
        if (!(object instanceof THREE.Mesh)) return;
        object.geometry.dispose();
        const mats = Array.isArray(object.material) ? object.material : [object.material];
        mats.forEach((mat) => mat.dispose());
      });
      webgl.dispose();
      cssMount.replaceChildren();
      webglMount.replaceChildren();
    };
  }, [desktop]);

  if (!desktop) {
    return (
      <main className="replica-fallback">
        <header><span>&gt;_ Lavine</span><span>AI PRODUCT BUILDER</span></header>
        <section className="replica-fallback-hero">
          <p>HONG KONG / SHENZHEN · BUILD IN PUBLIC</p>
          <h1>Lavine Xie</h1>
          <h2>I build weirdly useful things.</h2>
          <span>Math → Computer Science → AI products. Agents, AI-native education, creative technology and quantitative ideas.</span>
        </section>
        <section className="replica-fallback-projects">
          {PROJECTS.map(([name, desc, href, tag], i) => (
            <a key={name} href={href} target="_blank" rel="noreferrer">
              <small>0{i + 1} / {tag}</small><strong>{name}</strong><span>{desc}</span><i>↗</i>
            </a>
          ))}
        </section>
      </main>
    );
  }

  return (
    <main ref={rootRef} className={`replica-experience replica-view-${view}`}>
      <div ref={cssRef} className="replica-css-mount" />
      <div ref={webglRef} className="replica-webgl-mount" />
      <div className={`replica-loader ${ready ? "is-done" : ""}`}><span>LAVINE / WORKSPACE</span><i /></div>
      <div className="replica-corner replica-corner-left"><span>CLICK EMPTY SPACE</span><b>TOGGLE VIEW</b></div>
      <div className="replica-corner replica-corner-right"><span>HOVER SCREEN / PAPER</span><b>ENTER FOCUS</b></div>
      <div className="replica-view-label"><small>VIEW</small><b>{view.toUpperCase()}</b></div>
    </main>
  );
}
