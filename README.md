# Lavine — 3D Personal Workspace

An interactive personal website for **Lavine Xie**, rebuilt around the spatial interaction pattern I liked in [HandyWote/MyWebsite](https://github.com/HandyWote/MyWebsite) / [handywote.top](https://www.handywote.top/).

The goal is not a conventional scroll portfolio. On desktop, the visitor starts inside a full-screen 3D room, can switch camera views by clicking the scene, inspect objects on the desk, and move into a **real HTML website embedded inside the 3D monitor**.

The current build includes the original site's `public/3d/v1` models/textures and `avatar.webp`, sourced from HandyWote/MyWebsite. Maintainers must confirm the applicable asset licenses before redistribution.

## Current interaction

- cinematic idle camera with subtle pointer tracking
- click the room to move between wide and desk views
- hover the monitor to fly into the website
- the monitor content is real interactive DOM via `CSS3DRenderer`
- click the desk paper for a close-up view
- lightweight non-3D fallback for touch devices and reduced-motion users
- terminal command bar with `cd`, `open latest`, and `help` navigation
- static `/articles`, `/projects`, and `/about` routes

## Identity

**Lavine Xie — AI Product Builder**

Math → Computer Science → AI products. Current threads include agent systems, AI-native education, creative technology, quantitative ideas, and building in public.

## Stack

- Next.js 16
- React 19
- Three.js
- CSS3DRenderer
- TypeScript

## Local development

```bash
npm install
npm run dev
```

Open `http://localhost:3000` on a desktop browser for the full 3D experience.
