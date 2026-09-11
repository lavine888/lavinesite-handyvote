<div align="center">

# Lavine · 3D Personal Workspace

**An interactive personal website built as a room you can enter.**

Not a conventional scroll portfolio, but a spatial workspace you can observe, approach, and eventually step into through the monitor.

**English** · [简体中文](./README.zh-CN.md)

![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=flat-square&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-19-20232A?style=flat-square&logo=react&logoColor=61DAFB)
![Three.js](https://img.shields.io/badge/Three.js-0.185-000000?style=flat-square&logo=threedotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat-square&logo=typescript&logoColor=white)

</div>

---

## ✦ What is this?

This is the 3D personal website experiment of **Lavine Xie**.

On desktop, the visitor does not land on a normal webpage. The experience begins inside a full-screen 3D workspace: the camera drifts through the room, the scene reacts subtly to the pointer, objects on the desk can be inspected, and the visitor can move all the way into the monitor.

The monitor is not a video or a flat texture. Its content is rendered as **real interactive DOM** through `CSS3DRenderer`, so the website inside the screen remains scrollable and clickable.

> **Spatial portfolio outside. Real website inside.**

---

## ✦ Core Experience

| Interaction | Behavior |
| --- | --- |
| **Idle Camera** | Cinematic establishing shot with subtle pointer parallax |
| **Desk View** | Click the scene to move between wide and desk views |
| **Monitor Focus** | Approach the monitor and the camera flies toward the screen |
| **Real DOM Screen** | A fully interactive webpage lives inside the 3D monitor |
| **Paper Focus** | Hover the paper on the desk to enter a dedicated close-up |
| **Terminal UI** | The inner website uses a terminal-inspired profile and command bar |
| **Responsive Fallback** | Touch devices and reduced-motion users receive a lightweight 2D version |

The camera experience is organized around a small state system:

```text
loading
   ↓
 idle  ⇄  desk
   ↓        ↓
monitor   paper
```

---

## ✦ Lavine Inside the Screen

The website inside the monitor is not just a decorative demo. It is the second layer of the portfolio itself.

The current identity is centered around:

- **AI Product Builder / Product Integrator**
- Agent Systems
- AI-native Education
- Creative Technology
- Quantitative Ideas
- Build in Public

The experience also exposes `/about`, `/projects`, and `/articles`, while the terminal command bar keeps navigation feeling closer to entering a personal computer than browsing a standard portfolio.

---

## ✦ How It Works

```text
Browser
│
├─ WebGL Layer
│  └─ Three.js scene / room / lighting / camera / props
│
├─ CSS3D Layer
│  └─ Real DOM mounted into the monitor
│
├─ Interaction Layer
│  ├─ pointer tracking
│  ├─ camera state transitions
│  ├─ monitor focus
│  └─ paper focus
│
└─ Next.js App
   ├─ profile
   ├─ projects
   ├─ articles
   └─ responsive fallback
```

### Stack

- **Next.js 16** — App Router and page structure
- **React 19** — UI and interaction state
- **Three.js** — 3D scene, camera, lighting and rendering
- **CSS3DRenderer** — real DOM embedded inside the 3D monitor
- **Tween.js + Bezier Easing** — camera transitions and motion curves
- **TypeScript** — typed application and scene architecture

---

## ✦ Local Development

```bash
# 1. Clone
 git clone https://github.com/lavine888/lavinesite-handyvote.git

# 2. Enter
 cd lavinesite-handyvote

# 3. Install
 npm install

# 4. Run
 npm run dev
```

Then open:

```text
http://localhost:3000
```

> A desktop Chromium-based browser is recommended for the full 3D experience.

### Production Build

```bash
npm run build
npm run start
```

Type checking:

```bash
npm run typecheck
```

---

## ✦ Project Structure

```text
lavinesite-handyvote/
├─ app/                 # Next.js routes & global styles
├─ components/          # 3D experience and UI components
├─ public/              # static assets / 3D resources
├─ docs/                # project notes and documentation
├─ .github/workflows/   # CI build verification
├─ package.json
└─ README.md
```

---

## ✦ Design Direction

This project is not trying to fit an entire résumé above the fold. It starts from a more interesting question:

> **What if a personal website were not a résumé page, but a place you could enter?**

That leads to a few deliberate choices:

- scenes instead of card stacks
- camera language instead of generic scroll animation
- information embedded in space instead of dense UI
- a transition from *looking at a website* to *entering the website*
- treating the portfolio itself as part of the work

---

## ✦ Inspiration & Credits

The spatial interaction and visual direction of this project were heavily inspired by:

- [HandyWote / MyWebsite](https://github.com/HandyWote/MyWebsite)
- [handywote.top](https://www.handywote.top/)

The current repository includes selected `public/3d/v1` models / textures and `avatar.webp` originating from `HandyWote/MyWebsite`. Copyright and redistribution rights for those assets remain subject to the original author's applicable terms. Please verify the corresponding permissions before public redistribution or commercial use.

Thanks to the original author for making the project structure and implementation ideas publicly inspectable — it made this experiment possible to study, rebuild, and extend.

---

<div align="center">

### Lavine Xie

**Math → Computer Science → AI Products**

Building agents, education products, creative technology and weirdly useful things.

[GitHub](https://github.com/lavine888)

</div>
