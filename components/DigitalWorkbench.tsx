"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { CSS3DObject, CSS3DRenderer } from "three/examples/jsm/renderers/CSS3DRenderer.js";

type ViewMode = "loading" | "idle" | "desk" | "monitor" | "paper";

type CameraPose = {
  position: THREE.Vector3;
  target: THREE.Vector3;
};

const projects = [
  {
    name: "Minecraft × AI Education",
    desc: "AI-native spoken English inside a multiplayer world.",
    href: "https://github.com/lavine888",
    tag: "AI / EDUCATION",
  },
  {
    name: "Flux Evidence Lab",
    desc: "Evidence, verification and trustworthy AI workflows.",
    href: "https://github.com/lavine888/flux-evidence-lab",
    tag: "AI / WEB3",
  },
  {
    name: "Growth Agent OS",
    desc: "An agentic operating system for growth workflows.",
    href: "https://github.com/lavine888/Growth-Agent-OS",
    tag: "AGENTS",
  },
  {
    name: "CityU CS Notes",
    desc: "Computer science notes, organized and built in public.",
    href: "https://github.com/lavine888/CityU-CS-Notes",
    tag: "LEARNING",
  },
];

const poses: Record<ViewMode, CameraPose> = {
  loading: {
    position: new THREE.Vector3(-15, 11, 18),
    target: new THREE.Vector3(0, 1.2, 0),
  },
  idle: {
    position: new THREE.Vector3(-11.2, 6.8, 13.8),
    target: new THREE.Vector3(0.2, 2.1, -0.7),
  },
  desk: {
    position: new THREE.Vector3(7.8, 5.2, 9.4),
    target: new THREE.Vector3(0.1, 1.65, -0.2),
  },
  monitor: {
    position: new THREE.Vector3(0, 2.72, 4.0),
    target: new THREE.Vector3(0, 2.72, -1.08),
  },
  paper: {
    position: new THREE.Vector3(-3.05, 4.85, 2.65),
    target: new THREE.Vector3(-3.05, 0.3, 1.65),
  },
};

function buildScreenMarkup() {
  return `
    <div class="screen-page">
      <header class="screen-nav">
        <a class="screen-logo" href="#top"><span>~/</span>lavine</a>
        <nav>
          <a href="#about">about</a>
          <a href="#work">work</a>
          <a href="https://github.com/lavine888" target="_blank" rel="noreferrer">github ↗</a>
        </nav>
      </header>

      <main id="top" class="screen-content">
        <section class="screen-hero">
          <p class="screen-kicker">AI PRODUCT BUILDER · HONG KONG / SHENZHEN</p>
          <h1>Hi, I’m Lavine.<br/><span>I build weirdly useful things.</span></h1>
          <p class="screen-intro">Math → Computer Science → AI products. I work between product, engineering and fast prototypes — agents, education, creative technology and quantitative ideas.</p>
          <div class="screen-status"><i></i><span>currently building in public</span></div>
        </section>

        <section id="about" class="screen-section screen-about">
          <div class="screen-section-title"><b>01</b><span>ABOUT</span></div>
          <div class="about-grid">
            <p>I like projects that need someone to connect the product idea, the technical system and the thing users actually touch.</p>
            <div class="about-stack"><span>PRODUCT</span><span>AGENTS</span><span>AI-NATIVE EDUCATION</span><span>QUANT</span></div>
          </div>
        </section>

        <section id="work" class="screen-section">
          <div class="screen-section-title"><b>02</b><span>SELECTED WORK</span></div>
          <div class="screen-projects">
            ${projects.map((project, index) => `
              <a class="screen-project" href="${project.href}" target="_blank" rel="noreferrer">
                <span class="project-index">0${index + 1}</span>
                <div><small>${project.tag}</small><strong>${project.name}</strong><p>${project.desc}</p></div>
                <b>↗</b>
              </a>
            `).join("")}
          </div>
        </section>

        <section class="screen-section screen-now">
          <div class="screen-section-title"><b>03</b><span>NOW</span></div>
          <p><span>BUILD</span> → TEST → SHIP → WRITE ABOUT IT.</p>
        </section>
      </main>

      <footer class="screen-footer"><span>Lavine Xie · 2026</span><span>made with too many tabs open</span></footer>
    </div>
  `;
}

function addBox(
  group: THREE.Group,
  size: [number, number, number],
  position: [number, number, number],
  material: THREE.Material,
  rotation: [number, number, number] = [0, 0, 0],
) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(...size), material);
  mesh.position.set(...position);
  mesh.rotation.set(...rotation);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  group.add(mesh);
  return mesh;
}

function addCylinder(
  group: THREE.Group,
  radiusTop: number,
  radiusBottom: number,
  height: number,
  position: [number, number, number],
  material: THREE.Material,
  segments = 16,
) {
  const mesh = new THREE.Mesh(
    new THREE.CylinderGeometry(radiusTop, radiusBottom, height, segments),
    material,
  );
  mesh.position.set(...position);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  group.add(mesh);
  return mesh;
}

export default function DigitalWorkbench() {
  const rootRef = useRef<HTMLDivElement>(null);
  const webglRef = useRef<HTMLDivElement>(null);
  const cssRef = useRef<HTMLDivElement>(null);
  const [desktop3D, setDesktop3D] = useState(false);
  const [view, setView] = useState<ViewMode>("loading");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1024px) and (hover: hover) and (pointer: fine)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setDesktop3D(desktop.matches && !reduced.matches);
    sync();
    desktop.addEventListener("change", sync);
    reduced.addEventListener("change", sync);
    return () => {
      desktop.removeEventListener("change", sync);
      reduced.removeEventListener("change", sync);
    };
  }, []);

  useEffect(() => {
    if (!desktop3D) return;
    const root = rootRef.current;
    const webglMount = webglRef.current;
    const cssMount = cssRef.current;
    if (!root || !webglMount || !cssMount) return;

    const scene = new THREE.Scene();
    const cssScene = new THREE.Scene();
    scene.background = new THREE.Color(0x050706);
    scene.fog = new THREE.FogExp2(0x050706, 0.035);

    const camera = new THREE.PerspectiveCamera(
      35,
      window.innerWidth / window.innerHeight,
      0.1,
      120,
    );
    camera.position.copy(poses.loading.position);

    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.7));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.92;
    renderer.domElement.className = "workbench-webgl";
    webglMount.appendChild(renderer.domElement);

    const cssRenderer = new CSS3DRenderer();
    cssRenderer.setSize(window.innerWidth, window.innerHeight);
    cssRenderer.domElement.className = "workbench-css3d";
    cssMount.appendChild(cssRenderer.domElement);

    const room = new THREE.Group();
    room.rotation.y = -0.02;
    scene.add(room);

    const matte = new THREE.MeshStandardMaterial({ color: 0x242825, roughness: 0.88, metalness: 0.04 });
    const wall = new THREE.MeshStandardMaterial({ color: 0x101512, roughness: 1, metalness: 0 });
    const wood = new THREE.MeshStandardMaterial({ color: 0x4b3829, roughness: 0.72, metalness: 0.04 });
    const woodDark = new THREE.MeshStandardMaterial({ color: 0x241c16, roughness: 0.82, metalness: 0.02 });
    const black = new THREE.MeshStandardMaterial({ color: 0x0a0c0b, roughness: 0.48, metalness: 0.42 });
    const monitorBlack = new THREE.MeshStandardMaterial({ color: 0x050706, roughness: 0.28, metalness: 0.52 });
    const silver = new THREE.MeshStandardMaterial({ color: 0x555d58, roughness: 0.36, metalness: 0.72 });
    const paperMat = new THREE.MeshStandardMaterial({ color: 0xc9c2aa, roughness: 0.9, metalness: 0 });
    const green = new THREE.MeshStandardMaterial({ color: 0x315747, roughness: 0.85 });
    const leaf = new THREE.MeshStandardMaterial({ color: 0x34533f, roughness: 0.86 });
    const accent = new THREE.MeshStandardMaterial({ color: 0x75a77f, emissive: 0x183921, emissiveIntensity: 0.35, roughness: 0.4 });
    const gold = new THREE.MeshStandardMaterial({ color: 0xaa8753, emissive: 0x2c1c09, emissiveIntensity: 0.22, roughness: 0.45, metalness: 0.45 });
    const screenGlow = new THREE.MeshBasicMaterial({ color: 0x14231d });

    // Architectural shell — intentionally simple, so it reads like the same kind of baked 3D room without copying its assets.
    addBox(room, [26, 0.3, 22], [0, -0.55, -1], matte);
    addBox(room, [26, 13, 0.34], [0, 5.8, -8.8], wall);
    addBox(room, [0.34, 13, 22], [-12.3, 5.8, -1], wall);
    addBox(room, [5.7, 0.22, 3.8], [-7.6, 6.15, -8.35], woodDark);
    addBox(room, [5.7, 0.18, 3.8], [7.2, 4.6, -8.35], woodDark);

    // Main desk and legs.
    addBox(room, [12.8, 0.42, 5.7], [0, 0.15, -0.05], wood);
    addBox(room, [0.48, 4.1, 0.48], [-5.55, -1.9, -1.7], black);
    addBox(room, [0.48, 4.1, 0.48], [5.55, -1.9, -1.7], black);
    addBox(room, [0.48, 4.1, 0.48], [-5.55, -1.9, 1.55], black);
    addBox(room, [0.48, 4.1, 0.48], [5.55, -1.9, 1.55], black);

    // Monitor shell, stand, and glow plane.
    addBox(room, [6.55, 4.12, 0.38], [0, 2.75, -1.25], monitorBlack);
    addBox(room, [6.02, 3.55, 0.06], [0, 2.75, -1.025], screenGlow);
    addBox(room, [0.48, 1.55, 0.42], [0, 0.76, -1.38], silver);
    addBox(room, [2.55, 0.18, 1.14], [0, 0.12, -1.3], silver);

    // Keyboard with actual keys so the desk has the same dense prop feeling as the reference.
    addBox(room, [5.15, 0.2, 1.65], [0.35, 0.43, 1.32], black, [-0.06, 0, 0]);
    const keyMaterial = new THREE.MeshStandardMaterial({ color: 0x1b211e, roughness: 0.58, metalness: 0.12 });
    for (let rowIndex = 0; rowIndex < 4; rowIndex += 1) {
      const columns = rowIndex === 0 ? 14 : 13;
      for (let column = 0; column < columns; column += 1) {
        const x = -1.9 + column * 0.31 + rowIndex * 0.04;
        const z = 0.88 + rowIndex * 0.31;
        addBox(room, [0.24, 0.07, 0.22], [x, 0.565, z], keyMaterial, [-0.06, 0, 0]);
      }
    }
    addBox(room, [1.75, 0.07, 0.22], [0.15, 0.565, 1.82], keyMaterial, [-0.06, 0, 0]);

    // Mouse and mouse mat.
    addBox(room, [2.7, 0.035, 2.25], [3.95, 0.39, 1.26], new THREE.MeshStandardMaterial({ color: 0x141816, roughness: 0.94 }));
    const mouse = addBox(room, [0.72, 0.24, 1.08], [4.05, 0.57, 1.17], black, [0, -0.12, 0]);
    mouse.geometry.translate(0, 0.05, 0);

    // PC tower.
    addBox(room, [2.2, 3.7, 3.15], [4.65, 2.05, -2.55], black);
    const glass = new THREE.MeshPhysicalMaterial({ color: 0x27352f, transparent: true, opacity: 0.32, roughness: 0.16, transmission: 0.25, metalness: 0.08 });
    addBox(room, [0.04, 3.2, 2.7], [3.53, 2.05, -2.55], glass);
    const fanMat = new THREE.MeshStandardMaterial({ color: 0x577a66, emissive: 0x143923, emissiveIntensity: 1.15 });
    const fans: THREE.Mesh[] = [];
    for (const y of [1.15, 2.05, 2.95]) {
      const fan = addCylinder(room, 0.48, 0.48, 0.08, [4.7, y, -0.93], fanMat, 32);
      fan.rotation.x = Math.PI / 2;
      fans.push(fan);
    }

    // Speakers.
    for (const x of [-4.0, 3.1]) {
      addBox(room, [1.05, 2.15, 1.0], [x, 1.45, -1.5], black);
      const cone = addCylinder(room, 0.32, 0.32, 0.06, [x, 1.57, -0.96], silver, 32);
      cone.rotation.x = Math.PI / 2;
    }

    // Lamp.
    addCylinder(room, 0.5, 0.62, 0.13, [-4.85, 0.47, 1.48], black, 28);
    const lampArm = addBox(room, [0.16, 2.7, 0.16], [-4.65, 1.75, 1.28], silver, [0, 0, -0.28]);
    lampArm.castShadow = true;
    const shade = new THREE.Mesh(new THREE.ConeGeometry(0.72, 1.15, 28, 1, true), black);
    shade.position.set(-4.05, 3.02, 1.16);
    shade.rotation.z = -0.72;
    shade.castShadow = true;
    room.add(shade);

    // Books and small desk props.
    const bookColors = [0x6b5440, 0x344e44, 0x6b6b5a, 0x343d46];
    bookColors.forEach((color, index) => {
      addBox(room, [1.45, 0.15, 0.95], [-4.15, 0.43 + index * 0.16, -1.9], new THREE.MeshStandardMaterial({ color, roughness: 0.9 }), [0, 0.12 - index * 0.04, 0]);
    });
    addCylinder(room, 0.24, 0.21, 0.85, [2.68, 0.83, -2.15], green, 24);

    // Plant.
    addCylinder(room, 0.58, 0.43, 0.72, [-5.0, 0.72, -2.35], new THREE.MeshStandardMaterial({ color: 0x684d37, roughness: 0.9 }), 24);
    for (let i = 0; i < 9; i += 1) {
      const leafMesh = new THREE.Mesh(new THREE.SphereGeometry(0.34, 10, 8), leaf);
      leafMesh.scale.set(0.62, 1.55, 0.32);
      leafMesh.position.set(-5.0 + Math.sin(i * 1.7) * 0.55, 1.38 + (i % 3) * 0.28, -2.35 + Math.cos(i * 1.3) * 0.45);
      leafMesh.rotation.z = Math.sin(i) * 0.72;
      leafMesh.castShadow = true;
      room.add(leafMesh);
    }

    // Back-wall frame / board / notes.
    addBox(room, [5.3, 3.35, 0.18], [-5.5, 5.55, -8.52], black);
    addBox(room, [4.9, 2.95, 0.07], [-5.5, 5.55, -8.38], new THREE.MeshStandardMaterial({ color: 0x3b3427, roughness: 1 }));
    const stickyColors = [0xc4b886, 0xa8b69d, 0xb39b86, 0x8ea5a2];
    for (let i = 0; i < 8; i += 1) {
      addBox(room, [0.65, 0.52, 0.025], [-7.25 + (i % 4) * 1.05, 6.3 - Math.floor(i / 4) * 1.25, -8.28], new THREE.MeshStandardMaterial({ color: stickyColors[i % stickyColors.length], roughness: 0.95 }), [0, 0, (i % 3 - 1) * 0.06]);
    }

    // Shelf objects.
    for (let i = 0; i < 8; i += 1) {
      addBox(room, [0.42 + (i % 2) * 0.12, 1.25 + (i % 3) * 0.2, 1.15], [-9.6 + i * 0.62, 6.83, -8.08], new THREE.MeshStandardMaterial({ color: bookColors[i % bookColors.length], roughness: 0.88 }), [0, 0, (i % 2 ? -0.035 : 0.025)]);
    }

    // Desk paper is a second interaction target.
    const paper = addBox(room, [2.25, 0.04, 2.95], [-3.05, 0.4, 1.65], paperMat, [0, 0.14, 0]);
    paper.userData.interactive = "paper";
    const lineMaterial = new THREE.MeshBasicMaterial({ color: 0x57564d });
    for (let i = 0; i < 6; i += 1) {
      addBox(room, [1.45 - i * 0.07, 0.012, 0.035], [-3.08, 0.435, 0.92 + i * 0.31], lineMaterial, [0, 0.14, 0]);
    }
    addBox(room, [0.13, 0.02, 2.3], [-3.7, 0.44, 1.65], gold, [0, 0.14, 0]);

    // A tiny physical signature on the desk, not a HUD overlay.
    const labelCanvas = document.createElement("canvas");
    labelCanvas.width = 768;
    labelCanvas.height = 192;
    const labelCtx = labelCanvas.getContext("2d");
    if (labelCtx) {
      labelCtx.fillStyle = "#101411";
      labelCtx.fillRect(0, 0, labelCanvas.width, labelCanvas.height);
      labelCtx.fillStyle = "#9ab2a1";
      labelCtx.font = "600 64px ui-monospace, monospace";
      labelCtx.fillText("LAVINE // BUILD MODE", 48, 118);
    }
    const labelTexture = new THREE.CanvasTexture(labelCanvas);
    labelTexture.colorSpace = THREE.SRGBColorSpace;
    const label = new THREE.Mesh(new THREE.PlaneGeometry(2.8, 0.7), new THREE.MeshBasicMaterial({ map: labelTexture }));
    label.position.set(1.75, 0.385, -2.5);
    label.rotation.x = -Math.PI / 2;
    room.add(label);

    // Lights.
    scene.add(new THREE.HemisphereLight(0x9fb0a4, 0x15120f, 1.05));
    const key = new THREE.DirectionalLight(0xc5d3ca, 2.4);
    key.position.set(-6, 10, 8);
    key.castShadow = true;
    key.shadow.mapSize.set(2048, 2048);
    key.shadow.camera.near = 1;
    key.shadow.camera.far = 36;
    scene.add(key);

    const lampLight = new THREE.SpotLight(0xe8c99a, 32, 12, Math.PI / 5.5, 0.62, 1.7);
    lampLight.position.set(-3.9, 3.1, 1.1);
    lampLight.target.position.set(-2.9, 0.2, 0.7);
    lampLight.castShadow = true;
    scene.add(lampLight, lampLight.target);

    const monitorLight = new THREE.PointLight(0x74a88b, 8.5, 8, 2);
    monitorLight.position.set(0, 2.8, 0.2);
    scene.add(monitorLight);

    // CSS3D monitor: the page is real DOM, not a texture.
    const screen = document.createElement("div");
    screen.className = "monitor-dom";
    screen.innerHTML = buildScreenMarkup();
    const screenObject = new CSS3DObject(screen);
    screenObject.position.set(0, 2.75, -1.0);
    screenObject.scale.setScalar(0.00604);
    cssScene.add(screenObject);

    let currentView: ViewMode = "loading";
    let desiredView: ViewMode = "loading";
    const setCameraView = (next: ViewMode) => {
      desiredView = next;
      currentView = next;
      setView(next);
    };

    const mouseNdc = new THREE.Vector2();
    const pointer = new THREE.Vector2();
    const raycaster = new THREE.Raycaster();

    const onPointerMove = (event: PointerEvent) => {
      pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
      mouseNdc.x = pointer.x;
      mouseNdc.y = pointer.y;
    };

    const onScreenEnter = () => setCameraView("monitor");
    screen.addEventListener("pointerenter", onScreenEnter);

    const onPointerDown = (event: PointerEvent) => {
      if (screen.contains(event.target as Node)) return;
      pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);
      const intersections = raycaster.intersectObject(paper, false);
      if (intersections.length > 0 && desiredView !== "paper") {
        setCameraView("paper");
        return;
      }
      setCameraView(desiredView === "desk" ? "idle" : "desk");
    };

    root.addEventListener("pointermove", onPointerMove, { passive: true });
    root.addEventListener("pointerdown", onPointerDown);

    const position = poses.loading.position.clone();
    const target = poses.loading.target.clone();
    const clock = new THREE.Clock();
    let raf = 0;
    let introTimer = window.setTimeout(() => {
      setReady(true);
      setCameraView("idle");
    }, 720);

    const animate = () => {
      const elapsed = clock.getElapsedTime();
      const base = poses[desiredView];
      const nextPosition = base.position.clone();
      const nextTarget = base.target.clone();

      if (desiredView === "idle") {
        nextPosition.x += Math.sin(elapsed * 0.075) * 1.65 + mouseNdc.x * 0.55;
        nextPosition.y += Math.sin(elapsed * 0.045 + 1.3) * 0.34 - mouseNdc.y * 0.25;
        nextTarget.x += mouseNdc.x * 0.42;
        nextTarget.y -= mouseNdc.y * 0.2;
      } else if (desiredView === "desk") {
        nextPosition.x += mouseNdc.x * 0.38;
        nextPosition.y -= mouseNdc.y * 0.2;
        nextTarget.x += mouseNdc.x * 0.28;
      }

      const positionLambda = desiredView === "monitor" ? 0.085 : 0.052;
      const targetLambda = desiredView === "monitor" ? 0.09 : 0.058;
      position.lerp(nextPosition, positionLambda);
      target.lerp(nextTarget, targetLambda);
      camera.position.copy(position);
      camera.lookAt(target);

      fans.forEach((fan, index) => {
        fan.rotation.z = elapsed * (1.2 + index * 0.08);
      });

      renderer.render(scene, camera);
      cssRenderer.render(cssScene, camera);
      raf = requestAnimationFrame(animate);
    };

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      cssRenderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", onResize);
    raf = requestAnimationFrame(animate);

    return () => {
      window.clearTimeout(introTimer);
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      root.removeEventListener("pointermove", onPointerMove);
      root.removeEventListener("pointerdown", onPointerDown);
      screen.removeEventListener("pointerenter", onScreenEnter);
      renderer.dispose();
      labelTexture.dispose();
      room.traverse((object) => {
        if (!(object instanceof THREE.Mesh)) return;
        object.geometry.dispose();
        const materials = Array.isArray(object.material) ? object.material : [object.material];
        materials.forEach((material) => material.dispose());
      });
      webglMount.replaceChildren();
      cssMount.replaceChildren();
    };
  }, [desktop3D]);

  if (!desktop3D) {
    return (
      <main className="fallback-site">
        <div className="fallback-topbar"><span>~/lavine</span><span>AI PRODUCT BUILDER</span></div>
        <section className="fallback-hero">
          <p>HONG KONG / SHENZHEN · BUILD IN PUBLIC</p>
          <h1>Hi, I’m Lavine.<br /><em>I build weirdly useful things.</em></h1>
          <span>Math → Computer Science → AI products. Agents, AI-native education, creative technology and quantitative ideas.</span>
        </section>
        <section className="fallback-projects">
          {projects.map((project, index) => (
            <a href={project.href} target="_blank" rel="noreferrer" key={project.name}>
              <small>0{index + 1}</small>
              <div><b>{project.tag}</b><strong>{project.name}</strong><span>{project.desc}</span></div>
              <i>↗</i>
            </a>
          ))}
        </section>
      </main>
    );
  }

  return (
    <main ref={rootRef} className={`room-experience view-${view}`}>
      <div ref={cssRef} className="css3d-mount" />
      <div ref={webglRef} className="webgl-mount" />

      <div className={`scene-loader ${ready ? "scene-loader--done" : ""}`}>
        <span>LAVINE.EXE</span>
        <i />
        <small>loading workspace</small>
      </div>

      <div className="scene-caption">
        <span className="scene-caption-dot" />
        <span>LAVINE XIE</span>
        <small>{view === "monitor" ? "inside screen" : view === "paper" ? "desk note" : "digital workspace"}</small>
      </div>

      <div className="scene-instructions">
        <span>click room · change view</span>
        <span>hover monitor · enter site</span>
        <span>click paper · inspect</span>
      </div>

      {view === "paper" && (
        <div className="paper-note-overlay">
          <small>DESK NOTE / 2026</small>
          <h2>Math → CS → AI Product</h2>
          <p>Build → test → ship. The useful part is usually somewhere between the idea and the implementation.</p>
          <button type="button" onClick={() => setView("desk")}>click room to leave</button>
        </div>
      )}
    </main>
  );
}
