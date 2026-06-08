# Scroll Storytelling

A collection of scroll-driven frontend patterns built with Next.js, Three.js, and GSAP.

[Live Demo →](#) &nbsp;·&nbsp; [GitHub](https://github.com/decriptcypher/scroll-storytelling)

---

## About

Each section of this project is an independent experiment exploring a different scroll-driven technique. The goal is to demonstrate what the modern browser — and a focused set of libraries — can do when scroll position becomes the primary input.

No page transitions, no routing. One long scroll, five patterns.

---

## Sections

**Hero — Three.js + React Three Fiber**  
When a 3D model carries its own built-in animations, you can take full control of their playback via scroll progress. This section drives both the model's animation timeline and its rotation simultaneously, all tied to a single scroll value from GSAP ScrollTrigger.

**Text — CSS Scroll-Driven Animations**  
CSS is a first-class animation tool. Using `animation-timeline: view()` natively in the browser — no JavaScript — elements reveal on scroll, images auto-rotate as they enter the viewport, and text blurs in and out based on scroll position. No library needed.

**Rotate — FFmpeg Frame Extraction + Canvas Sequence**  
Take an MP4 video, run it through FFmpeg to extract every frame as a JPEG, then load them into a canvas element. As the user scrolls, the canvas advances through the frames — giving the illusion of scroll-controlled video without a `<video>` element. Smooth, precise, and very performant.

**Mask — GSAP CSS Mask Reveal**  
Content elements fade out as scroll progresses, uncovering a masked image underneath. The mask — defined via CSS `mask-image` — scales up dramatically, creating a cinematic reveal. Orchestrated with a GSAP ScrollTrigger timeline.

**Experience — SVG Anatomy + GSAP**  
An inline SVG illustration of a city building is loaded and injected into the DOM. GSAP then targets individual named groups inside the SVG — rooftop, walls, interior layers — and animates them apart on scroll, deconstructing the building piece by piece like an exploded architectural diagram.

---

## Stack

- Next.js 16 · React 19 · TypeScript
- Three.js · @react-three/fiber · @react-three/drei
- GSAP · ScrollTrigger
- Tailwind CSS v4

---

## Getting Started

```bash
git clone https://github.com/decriptcypher/scroll-storytelling.git
cd scroll-storytelling
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

Built by [Decriptcypher](https://github.com/decriptcypher)
