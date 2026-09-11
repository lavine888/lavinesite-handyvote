<div align="center">

# Lavine · 3D Personal Workspace

**一个把个人主页放进 3D 房间里的交互式数字空间。**

不是传统的滚动作品集，而是一间可以进入、观察、靠近，并最终走进屏幕的个人工作室。

[English](./README.md) · **简体中文**

![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=flat-square&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-19-20232A?style=flat-square&logo=react&logoColor=61DAFB)
![Three.js](https://img.shields.io/badge/Three.js-0.185-000000?style=flat-square&logo=threedotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat-square&logo=typescript&logoColor=white)

</div>

---

## ✦ 项目是什么

这是 **Lavine Xie** 的 3D 个人网站实验。

桌面端访问时，用户不会直接进入一个普通网页，而是先进入一个全屏 3D 工作空间：镜头会在房间中缓慢移动，你可以切换视角、观察桌面物件、靠近显示器，并最终进入一块真正嵌在 3D 屏幕里的 HTML 网站。

显示器不是视频，也不是贴图。内部内容由 `CSS3DRenderer` 渲染为真实 DOM，因此可以继续滚动、点击和交互。

> **Spatial portfolio outside. Real website inside.**
>
> 外面是一间 3D 工作室，里面仍然是一个真正的网站。

---

## ✦ 核心体验

| 交互 | 行为 |
| --- | --- |
| **Idle Camera** | 开场进入电影感远景，并带有轻微的鼠标视差 |
| **Desk View** | 点击场景，在远景与桌面视角之间切换 |
| **Monitor Focus** | 鼠标靠近显示器时，镜头自动推进到屏幕前 |
| **Real DOM Screen** | 3D 显示器内部嵌入可交互的真实网页 |
| **Paper Focus** | 悬停桌面纸张，进入独立 close-up 视角 |
| **Terminal UI** | 屏幕内部采用 terminal-style 个人主页与命令栏 |
| **Responsive Fallback** | 触屏设备与 reduced-motion 环境自动使用轻量 2D 页面 |

当前镜头状态围绕以下路径组织：

```text
loading
   ↓
 idle  ⇄  desk
   ↓        ↓
monitor   paper
```

---

## ✦ 屏幕里的 Lavine

显示器内部不是独立 demo，而是整个体验真正的第二层。

当前内容围绕我的个人方向组织：

- **AI Product Builder / Product Integrator**
- Agent Systems
- AI-native Education
- Creative Technology
- Quantitative Ideas
- Build in Public

同时提供 `/about`、`/projects`、`/articles` 等内容入口，并通过 terminal command bar 保留一种更像“进入个人电脑”的导航体验。

---

## ✦ 技术实现

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

- **Next.js 16** — App Router 与页面结构
- **React 19** — UI 与交互状态
- **Three.js** — 3D 场景、相机、光照与渲染
- **CSS3DRenderer** — 将真实 DOM 放进 3D 显示器
- **Tween.js + Bezier Easing** — 镜头过渡与缓动
- **TypeScript** — 类型安全与工程结构

---

## ✦ 本地运行

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

然后打开：

```text
http://localhost:3000
```

> 推荐使用桌面端 Chromium 浏览器体验完整 3D 版本。

### Build

```bash
npm run build
npm run start
```

类型检查：

```bash
npm run typecheck
```

---

## ✦ 项目结构

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

## ✦ 设计方向

这个项目不是为了把所有经历都塞进首页，而是尝试回答一个更有趣的问题：

> **如果个人网站不是一张简历，而是一个可以进入的空间，会是什么样？**

因此这里更强调：

- 场景，而不是卡片堆叠
- 镜头语言，而不是单纯滚动动画
- 空间中的信息，而不是一屏塞满文字
- 从“看网页”到“进入网页”的转场
- 让个人主页本身成为作品的一部分

---

## ✦ Inspiration & Credits

本项目的空间交互与视觉实现深受以下项目启发：

- [HandyWote / MyWebsite](https://github.com/HandyWote/MyWebsite)
- [handywote.top](https://www.handywote.top/)

当前仓库中包含来源于 `HandyWote/MyWebsite` 的部分 `public/3d/v1` 模型 / 纹理资源与 `avatar.webp`。这些资源的版权与再分发权限以原作者及原项目实际授权为准；在用于公开分发或商业用途前，请自行确认对应许可。

感谢原作者公开项目结构与实现思路，让这个实验得以被研究、拆解和继续探索。

---

<div align="center">

### Lavine Xie

**Math → Computer Science → AI Products**

Building agents, education products, creative technology and weirdly useful things.

[GitHub](https://github.com/lavine888)

</div>
