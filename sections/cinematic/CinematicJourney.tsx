"use client"

import { useEffect, useRef, useState, Suspense } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Canvas, useFrame } from "@react-three/fiber"
import { Environment, ContactShadows } from "@react-three/drei"
import * as THREE from "three"

import PlywoodModel from "../hero/PlywoodModel"
import ExplodedPlywood from "../layers/ExplodedPlywood"
import "./cinematic.css"
import "../products/products.css"

gsap.registerPlugin(ScrollTrigger)

import { productsData, specsKerala, specsHariyana, brandPillars } from "./data"

import CinematicScene from "./CinematicScene"

function EcolushVideo({ src, aspect = "16/9" }: { src: string, aspect?: string }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  const togglePlay = async () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        try {
          await videoRef.current.play()
        } catch (error) {
          console.error("Video playback failed", error)
        }
      } else {
        videoRef.current.pause()
      }
    }
  }

  return (
    <div className="spec-vid-card" style={{
      position: "relative",
      width: "100%",
      aspectRatio: aspect,
      overflow: "hidden",
      border: "1px solid rgba(200,40,26,0.25)",
      boxShadow: "0 0 60px rgba(200,40,26,0.12), inset 0 0 30px rgba(0,0,0,0.4)",
      backgroundColor: "#050505",
      borderRadius: "4px",
      pointerEvents: "auto"
    }}>
      <video
        ref={videoRef}
        src={src}
        className="ecolush-vid"
        preload="metadata"
        playsInline
        controls={isPlaying}
        onPlay={(e) => {
          setIsPlaying(true)
          document.querySelectorAll('.ecolush-vid').forEach(v => {
            if (v !== e.target) (v as HTMLVideoElement).pause()
          })
        }}
        onPause={() => setIsPlaying(false)}
        onClick={(e) => {
          if (!isPlaying) { e.preventDefault(); togglePlay(); }
        }}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          display: "block",
          cursor: isPlaying ? "auto" : "pointer"
        }}
      />
      
      {/* Custom Play Button Overlay */}
      {!isPlaying && (
        <div 
          onClick={togglePlay}
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            background: "linear-gradient(135deg, rgba(200,40,26,0.08) 0%, transparent 60%)"
          }}
        >
          <div style={{
            width: "clamp(50px, 6vw, 72px)",
            height: "clamp(50px, 6vw, 72px)",
            backgroundColor: "rgba(200,40,26,0.85)",
            backdropFilter: "blur(4px)",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
            transition: "transform 0.2s ease, background-color 0.2s ease",
            pointerEvents: "none"
          }}>
            <svg width="35%" height="45%" viewBox="0 0 24 24" fill="none" style={{ marginLeft: "4px" }}>
              <path d="M5 3L19 12L5 21V3Z" fill="white" />
            </svg>
          </div>
        </div>
      )}
    </div>
  )
}

/* =====================================================================
   MAIN COMPONENT
   ===================================================================== */

export default function CinematicJourney() {
  const containerRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const scrollRef = useRef({ progress: 0 })
  const [isMobile, setIsMobile] = useState(false)
  const [lightboxImage, setLightboxImage] = useState<string | null>(null)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 900)
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  useEffect(() => {
    // Expose a global method for Navbar to trigger scrolls to specific sections
    ;(window as any).scrollToCinematicSection = (sectionId: string) => {
      const totalScroll = 110000 + (trackRef.current ? trackRef.current.scrollWidth : 0)
      let targetProgress = 0
      
      switch (sectionId) {
        case "products":
          targetProgress = 0.45
          break
        case "specifications":
          targetProgress = 0.81
          break
        case "applications":
          targetProgress = 1.05
          break
        case "story":
          targetProgress = 1.30
          break
        case "contact":
          // Contact is unpinned at the bottom, so just scroll to the very end
          window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" })
          return
      }
      
      if (targetProgress > 0) {
        const targetPixels = (targetProgress / 1.60) * totalScroll
        window.scrollTo({ top: targetPixels, behavior: "smooth" })
      }
    }
    
    return () => {
      delete (window as any).scrollToCinematicSection
    }
  }, [])

  useEffect(() => {
    // ── OPENING HERO ANIMATION (Runs once on mount)
    const ctx = gsap.context(() => {
      const tl = gsap.timeline()
      
      tl.fromTo(".hero-char", 
        { opacity: 0, y: 25, filter: "blur(8px)", scale: 0.96 },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          scale: 1,
          duration: 0.8,
          stagger: 0.06,
          ease: "power3.out"
        }, 
        0.2
      )
      
      tl.fromTo(".hero-intro-sub", 
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }, 
        1.15
      )
      
      tl.fromTo(".hero-intro-tagline", 
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }, 
        1.35
      )
    }, containerRef)

    return () => ctx.revert()
  }, [])

  useEffect(() => {
    if (!containerRef.current || !trackRef.current) return

    const ctx = gsap.context(() => {
      const totalWidth = trackRef.current!.scrollWidth - window.innerWidth
      // On mobile, disable horizontal scroll and use shorter timeline
      const isMobileViewport = isMobile
      const horizontalScrollAmount = isMobileViewport ? 0 : totalWidth
      const TOTAL_SCROLL = 110000 + totalWidth

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: `+=${TOTAL_SCROLL}`,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          onUpdate: (self) => { scrollRef.current.progress = self.progress * 1.60 },
        }
      })
      // ... (keep the rest of the tl setup the same)

      // ── Ch 01 → Ch 02 ──────────────────────────────────────────────
      tl.to(".hero-ui", { opacity: 0, duration: 0.02 }, 0.04)
      tl.set(".cinematic-macro-layer", { visibility: "visible" }, 0.10)
      tl.to(".cinematic-macro-layer", { opacity: 1, duration: 0.02 }, 0.11)
      tl.to(".cinematic-hero-bg", { opacity: 0, duration: 0.02 }, 0.11)
      tl.to(".cinematic-macro-img", { scale: 1.2, duration: 0.08 }, 0.12)
      tl.set(".material-ui", { visibility: "visible" }, 0.12)
      tl.to(".material-ui", { opacity: 1, duration: 0.02 }, 0.13)
      tl.to(".material-ui", { opacity: 0, duration: 0.02 }, 0.20)
      tl.set(".material-ui", { visibility: "hidden" }, 0.22)

      // ── Ch 02 → Ch 03 ──────────────────────────────────────────────
      tl.set(".cinematic-engineering-bg", { visibility: "visible" }, 0.21)
      tl.to(".cinematic-engineering-bg", { opacity: 1, duration: 0.02 }, 0.22)
      tl.to(".cinematic-macro-layer", { opacity: 0, duration: 0.02 }, 0.22)
      tl.set(".cinematic-macro-layer", { visibility: "hidden" }, 0.24)
      tl.set(".layers-ui", { visibility: "visible" }, 0.23)
      tl.to(".layers-ui", { opacity: 1, duration: 0.02 }, 0.24)
      
      // ── CHAPTER 03 BACKGROUND TYPOGRAPHY REVEAL ──────────────────
      tl.set(".layers-title", { visibility: "visible" }, 0.23)
      tl.fromTo(".layers-title", 
        { opacity: 0.02, filter: "brightness(0.3) contrast(0.8)", color: "rgba(100, 80, 60, 0.5)" },
        { opacity: 0.18, filter: "brightness(1) contrast(1.1)", color: "rgba(220, 195, 170, 0.7)", duration: 0.06, ease: "power2.inOut" }, 
        0.24
      )
      tl.to(".layers-title", { opacity: 0.02, filter: "brightness(0.3) contrast(0.8)", duration: 0.04, ease: "power2.inOut" }, 0.30)
      tl.set(".layers-title", { visibility: "hidden" }, 0.36)

      tl.to(".layers-ui", { opacity: 0, duration: 0.02 }, 0.34)
      tl.set(".layers-ui", { visibility: "hidden" }, 0.36)

      // ── Ch 03 → Ch 04 ──────────────────────────────────────────────
      tl.set(".cinematic-warehouse-bg", { visibility: "visible" }, 0.40)
      tl.to(".cinematic-warehouse-bg", { opacity: 1, duration: 0.03 }, 0.42)
      tl.to(".cinematic-engineering-bg", { opacity: 0, duration: 0.03 }, 0.42)
      tl.set(".cinematic-engineering-bg", { visibility: "hidden" }, 0.46)
      tl.set(".products-ui-layer", { visibility: "visible" }, 0.44)
      tl.to(".products-ui-layer", { opacity: 1, duration: 0.02 }, 0.45)

      // Horizontal scroll 0.50 → 0.72 (enabled on all devices)
      tl.to(trackRef.current, { x: -totalWidth, ease: "none", duration: 0.22 }, 0.50)
      tl.to(".warehouse-bg-img", { x: 300, ease: "none", duration: 0.24 }, 0.48)

      // ── Ch 04 → Ch 05 (Blueprint Transformation) ───────────────────
      // Completely hide products layer so it doesn't overlap the videos
      tl.to(".products-ui-layer", { opacity: 0, duration: 0.02 }, 0.72)
      tl.set(".products-ui-layer", { visibility: "hidden" }, 0.74)

      // Background: warehouse → blueprint
      tl.set(".cinematic-blueprint-bg", { visibility: "visible" }, 0.73)
      tl.to(".cinematic-blueprint-bg", { opacity: 1, duration: 0.04 }, 0.75)
      tl.to(".cinematic-warehouse-bg", { opacity: 0, duration: 0.04 }, 0.75)

      // Spec UI appears
      tl.set(".spec-ui-layer", { visibility: "visible" }, 0.80)
      tl.to(".spec-ui-layer", { opacity: 1, duration: 0.03 }, 0.81)
      tl.from(".spec-vid-card", { opacity: 0, y: 20, scale: 0.98, duration: 0.04, stagger: 0.015, ease: "power2.out" }, 0.815)

      // ── Ch 05 → Ch 06 (Blueprint → Material → Brand) ───────────────
      
      // Spec UI fades out
      tl.to(".spec-ui-layer", { opacity: 0, duration: 0.02 }, 0.86)
      tl.set(".spec-ui-layer", { visibility: "hidden" }, 0.88)
      
      // Fade out blueprint bg entirely, bringing in brand environment
      tl.set(".cinematic-brand-bg", { visibility: "visible" }, 0.88)
      tl.to(".cinematic-brand-bg", { opacity: 1, duration: 0.03 }, 0.885)
      tl.to(".cinematic-blueprint-bg", { opacity: 0, duration: 0.03 }, 0.885)
      
      // Base background zoom for the whole brand story
      tl.to(".cinematic-brand-bg img", { scale: 1.05, x: "-2vw", y: "1vh", duration: 0.01, ease: "none" }, 0.88)

      // 0.89: Transition into Brand UI
      // Setup Brand UI Layer
      tl.set(".brand-ui-layer", { visibility: "visible" }, 0.89)
      tl.to(".brand-ui-layer", { opacity: 1, duration: 0.02 }, 0.90)

      // ── PHASE 1: DRIVEN BY QUALITY
      tl.fromTo(".brand-phase-1", { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.008, ease: "power2.out" }, 0.89)
      tl.to(".brand-phase-1", { autoAlpha: 0, y: -30, duration: 0.008, ease: "power2.in" }, 0.902)
      
      // Animate the main plywood background material
      tl.to(".cinematic-brand-bg img", {
        scale: 1.3, x: "-8vw", y: "3vh",
        duration: 0.04, ease: "power1.inOut"
      }, 0.89)
      
      // ── PHASE 2: CUSTOMER SATISFACTION
      tl.fromTo(".brand-phase-2", { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.008, ease: "power2.out" }, 0.910)
      tl.to(".brand-phase-2", { autoAlpha: 0, y: -30, duration: 0.008, ease: "power2.in" }, 0.922)
      
      // Material shifts closer to edge
      tl.to(".cinematic-brand-bg img", {
        scale: 1.6, x: "-15vw", y: "5vh",
        duration: 0.04, ease: "power1.inOut"
      }, 0.91)
      
      // ── PHASE 3 — PILLAR 01: ECO FRIENDLY
      tl.fromTo(".brand-pillar-0", { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.008, ease: "power2.out" }, 0.930)
      tl.to(".brand-pillar-0", { autoAlpha: 0, y: -30, duration: 0.008, ease: "power2.in" }, 0.942)
      
      // subtle natural timber texture / warm light
      tl.to(".cinematic-brand-bg img", {
        scale: 1.8, x: "-18vw", y: "2vh",
        duration: 0.04, ease: "power1.inOut"
      }, 0.93)
      
      // ── PHASE 3 — PILLAR 02: CONSISTENT QUALITY
      tl.fromTo(".brand-pillar-1", { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.008, ease: "power2.out" }, 0.950)
      tl.to(".brand-pillar-1", { autoAlpha: 0, y: -30, duration: 0.008, ease: "power2.in" }, 0.962)
      
      // plywood edge / repeated veneer layers
      tl.to(".cinematic-brand-bg img", {
        scale: 2.1, x: "-22vw", y: "6vh",
        duration: 0.04, ease: "power2.out"
      }, 0.947)
      
      // ── PHASE 3 — PILLAR 03: TIMELY DELIVERY
      tl.fromTo(".brand-pillar-2", { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.008, ease: "power2.out" }, 0.970)
      tl.to(".brand-pillar-2", { autoAlpha: 0, y: -30, duration: 0.008, ease: "power2.in" }, 0.982)
      
      // subtle horizontal movement / directional line
      tl.to(".cinematic-brand-bg img", {
        scale: 2.3, x: "-15vw", y: "4vh",
        duration: 0.04, ease: "power2.inOut"
      }, 0.964)
      
      // ── PHASE 3 — PILLAR 04: TRANSPARENT SERVICE
      tl.fromTo(".brand-pillar-3", { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.005, ease: "power2.out" }, 0.990)
      
      // clean technical linework / precise typography
      tl.to(".cinematic-brand-bg img", {
        scale: 2.5, x: "-10vw", y: "0vh",
        duration: 0.04, ease: "power1.inOut"
      }, 0.981)


      // ── CHAPTER 07 TRANSITION (1.00)
      // Material sweeps toward camera, surface fills screen, becomes abstract texture
      tl.to(".brand-ui-layer", { opacity: 0, duration: 0.01 }, 0.995)
      tl.to(".cinematic-brand-bg img", {
        scale: 8, x: 0, y: 0,
        duration: 0.02, ease: "power3.in"
      }, 0.995)
      // Fade out brand background — construction layer takes over with its own dark bg
      tl.to(".cinematic-brand-bg", { opacity: 0, duration: 0.01 }, 1.00)
      tl.set(".cinematic-brand-bg", { visibility: "hidden" }, 1.01)
      
      // Screen is now filled with the board surface. Fade in construction layer.
      tl.set(".ch07-construction-layer", { visibility: "visible" }, 1.00)
      tl.to(".ch07-construction-layer", { opacity: 1, duration: 0.01 }, 1.00)
      
      // PHASE 3 — MATERIAL TRANSFORMATION
      // Abstract lines appear, scale up to feel like entering a blueprint/grid
      tl.from(".const-abstract-lines", { opacity: 0, scale: 0.5, duration: 0.02 }, 1.005)
      tl.to(".const-abstract-lines", { opacity: 0, scale: 1.5, duration: 0.02 }, 1.025)
      
      // PHASE 4 — CONSTRUCTION ENVIRONMENT
      // Reveal realistic construction site background, starting zoomed in
      tl.to(".const-bg-layer", { opacity: 1, duration: 0.02 }, 1.02)
      tl.set(".final-product", { visibility: "hidden" }, 1.03)

      // Start zoomed in at Formwork (bottom left-ish)
      tl.set(".const-bg-img", { scale: 2.5, x: "10%", y: "15%" }, 1.00)

      // ── APPLICATION IMAGE PANELS ─────────────────────────────────────
      // Each application gets its own dedicated cinematic image crossfading
      // with the existing label. Driven entirely by the master tl — no new ST.

      // 1. FORMWORK / SHUTTERING (1.04)
      tl.set(".const-app-img-formwork", { visibility: "visible" }, 1.02)
      tl.to(".const-app-img-formwork", { opacity: 1, duration: 0.02 }, 1.03)
      tl.set(".const-label-formwork", { visibility: "visible" }, 1.04)
      tl.from(".const-label-formwork", { opacity: 0, y: 20, duration: 0.01 }, 1.04)
      tl.to(".const-bg-img", { scale: 2.5, x: "5%", y: "10%", duration: 0.03, ease: "power1.inOut" }, 1.04)

      // 2. SLAB (1.07)
      tl.to(".const-label-formwork", { opacity: 0, y: -10, duration: 0.01 }, 1.07)
      tl.to(".const-app-img-formwork", { opacity: 0, duration: 0.015 }, 1.065)
      tl.set(".const-app-img-slab", { visibility: "visible" }, 1.065)
      tl.to(".const-app-img-slab", { opacity: 1, duration: 0.02 }, 1.07)
      tl.set(".const-label-slab", { visibility: "visible" }, 1.07)
      tl.from(".const-label-slab", { opacity: 0, y: 20, duration: 0.01 }, 1.07)
      // Camera rises (pan down on the image)
      tl.to(".const-bg-img", { scale: 2.2, x: 0, y: "25%", duration: 0.03, ease: "power2.inOut" }, 1.07)

      // 3. BEAM (1.10)
      tl.to(".const-label-slab", { opacity: 0, y: -10, duration: 0.01 }, 1.10)
      tl.to(".const-app-img-slab", { opacity: 0, duration: 0.015 }, 1.095)
      tl.set(".const-app-img-beam", { visibility: "visible" }, 1.095)
      tl.to(".const-app-img-beam", { opacity: 1, duration: 0.02 }, 1.10)
      tl.set(".const-label-beam", { visibility: "visible" }, 1.10)
      tl.from(".const-label-beam", { opacity: 0, y: 20, duration: 0.01 }, 1.10)
      // Camera moves laterally
      tl.to(".const-bg-img", { scale: 2.2, x: "-15%", y: "20%", duration: 0.03, ease: "power1.inOut" }, 1.10)

      // 4. COLUMN (1.13)
      tl.to(".const-label-beam", { opacity: 0, y: -10, duration: 0.01 }, 1.13)
      tl.to(".const-app-img-beam", { opacity: 0, duration: 0.015 }, 1.125)
      tl.set(".const-app-img-column", { visibility: "visible" }, 1.125)
      tl.to(".const-app-img-column", { opacity: 1, duration: 0.02 }, 1.13)
      tl.set(".const-label-column", { visibility: "visible" }, 1.13)
      tl.from(".const-label-column", { opacity: 0, y: 20, duration: 0.01 }, 1.13)
      // Camera moves vertically down the column
      tl.to(".const-bg-img", { scale: 2, x: "-10%", y: "-10%", duration: 0.03, ease: "power2.inOut" }, 1.13)

      // 5. INDUSTRIAL & SITE CASTING (1.16)
      tl.to(".const-label-column", { opacity: 0, y: -10, duration: 0.01 }, 1.16)
      tl.to(".const-app-img-column", { opacity: 0, duration: 0.015 }, 1.155)
      tl.set(".const-app-img-industrial", { visibility: "visible" }, 1.155)
      tl.to(".const-app-img-industrial", { opacity: 1, duration: 0.02 }, 1.16)
      tl.set(".const-label-structure", { visibility: "visible" }, 1.16)
      tl.from(".const-label-structure", { opacity: 0, y: 20, duration: 0.01 }, 1.16)
      // Camera pulls far back to reveal entire site
      tl.to(".const-bg-img", { scale: 1.05, x: "0%", y: "0%", duration: 0.04, ease: "power3.out" }, 1.16)

      // Darken industrial image on Ch08 handoff
      tl.to(".const-app-img-industrial", { opacity: 0, duration: 0.015 }, 1.19)

      // ── CHAPTER 08 PREPARATION (1.20)
      // Dust detaches, structure darkens
      tl.to(".const-label-structure", { opacity: 0, duration: 0.01 }, 1.19)
      tl.to(".const-bg-vignette", { opacity: 0.95, background: "radial-gradient(circle at center, rgba(5,5,5,0.7) 0%, rgba(5,5,5,0.98) 100%)", duration: 0.02 }, 1.20)
      tl.to(".const-dust-particles", { opacity: 1, duration: 0.02 }, 1.20)

      // ── CHAPTER 08 — CONSTRUCTION → ECOLUSH STORY (1.20 - 1.40)
      
      // Phase 1: Construction imagery fades, then entire Ch07 container fades out
      tl.to(".const-bg-layer", { opacity: 0.15, duration: 0.02 }, 1.21)
      tl.to(".const-bg-layer", { opacity: 0, duration: 0.02 }, 1.23)
      tl.to(".ch07-construction-layer", { opacity: 0, duration: 0.02 }, 1.23)
      tl.set(".ch07-construction-layer", { visibility: "hidden" }, 1.23)
      
      // Show Ch08 Layer
      tl.set(".ch08-story-layer", { visibility: "visible" }, 1.23)
      tl.to(".ch08-story-layer", { opacity: 1, duration: 0.01 }, 1.23)

      // Phase 4 & 5: Material Returns (Handled entirely by ExplodedPlywood.tsx 3D model)
      
      // Phase 6: Story Typography
      // 1. MATERIAL
      tl.set(".story-label-1", { visibility: "visible" }, 1.30)
      tl.from(".story-label-1", { opacity: 0, y: 30, duration: 0.015, ease: "power1.out" }, 1.30)

      // 2. ZERO CORE GAP
      tl.to(".story-label-1", { opacity: 0, y: -20, duration: 0.015 }, 1.32)
      tl.set(".story-label-2", { visibility: "visible" }, 1.32)
      tl.from(".story-label-2", { opacity: 0, y: 30, duration: 0.015 }, 1.32)

      // 3. CONSISTENT QUALITY
      tl.to(".story-label-2", { opacity: 0, y: -20, duration: 0.015 }, 1.34)
      tl.set(".story-label-3", { visibility: "visible" }, 1.34)
      tl.from(".story-label-3", { opacity: 0, y: 30, duration: 0.015 }, 1.34)

      // 4. HIGH DENSIFIED
      tl.to(".story-label-3", { opacity: 0, y: -20, duration: 0.015 }, 1.36)
      tl.set(".story-label-4", { visibility: "visible" }, 1.36)
      tl.from(".story-label-4", { opacity: 0, y: 30, duration: 0.015 }, 1.36)
      tl.to(".const-abstract-lines", { opacity: 0.15, scale: 1.2, duration: 0.02, ease: "none" }, 1.36) // Faint structural lines

      // 5. ECOLUSH PLY
      tl.to(".story-label-4", { opacity: 0, y: -20, duration: 0.015 }, 1.38)
      tl.set(".story-label-5", { visibility: "visible" }, 1.38)
      tl.from(".story-label-5", { opacity: 0, y: 30, duration: 0.015 }, 1.38)
      tl.to(".const-abstract-lines", { opacity: 0, duration: 0.015 }, 1.38)

      // ── CHAPTER 09 PREPARATION (1.40)
      tl.to(".story-label-5", { opacity: 0, duration: 0.015 }, 1.40)
      tl.to(".ch08-story-layer", { opacity: 0, duration: 0.02 }, 1.40)
      tl.set(".ch08-story-layer", { visibility: "hidden" }, 1.42)
      
      // Particles converge
      tl.to(".const-dust-particles", { scale: 0.2, opacity: 0, duration: 0.03, ease: "power2.in" }, 1.40)

      // ── CHAPTER 09 — FINAL CTA (1.44 - 1.60)
      tl.set(".ch09-cta-layer", { visibility: "visible" }, 1.44)
      tl.to(".ch09-cta-layer", { opacity: 1, duration: 0.01 }, 1.44)
      
      tl.from(".cta-line-1", { opacity: 0, y: 30, duration: 0.02, ease: "power2.out" }, 1.45)
      tl.from(".cta-line-2", { opacity: 0, y: 30, duration: 0.02, ease: "power2.out" }, 1.47)
      tl.from(".cta-line-3", { opacity: 0, y: 30, duration: 0.02, ease: "power2.out" }, 1.49)
      
      tl.to(".cta-action", { opacity: 1, y: 0, duration: 0.02, ease: "power2.out" }, 1.52)
      
      // Slight scale out of the board at the very end to give it life
      tl.to(".final-product .product-specimen-scene", { scale: 6.2, duration: 0.08, ease: "none" }, 1.52)

    }, containerRef)

    return () => ctx.revert()
  }, [])

  /* =====================================================================
     JSX
     ===================================================================== */

  return (
    <div className="cinematic-wrapper">
      <div id="cinematic" ref={containerRef} className="cinematic-pinned">

        {/* ── BACKGROUNDS ─────────────────────────────────────────── */}
        <div className="cinematic-bg-layer cinematic-hero-bg">
          <img src="/ecolush/backgrounds/hero.jpg" alt="" className="cinematic-bg-img" />
          <div className="cinematic-bg-vignette" />
        </div>
        <div className="cinematic-bg-layer cinematic-engineering-bg" style={{ visibility: "hidden", opacity: 0 }}>
          <img src="/ecolush/backgrounds/engineering.jpg" alt="" className="cinematic-bg-img" />
          <div className="cinematic-bg-vignette" />
        </div>
        <div className="cinematic-bg-layer cinematic-warehouse-bg" style={{ visibility: "hidden", opacity: 0 }}>
          <img src="/ecolush/backgrounds/warehouse.jpg" alt="" className="cinematic-bg-img warehouse-bg-img" />
          <div className="cinematic-bg-vignette" style={{ opacity: 0.8 }} />
        </div>
        <div className="cinematic-bg-layer cinematic-blueprint-bg" style={{ visibility: "hidden", opacity: 0 }}>
          <img src="/ecolush/backgrounds/blueprint.jpg" alt="" className="cinematic-bg-img" />
          <div className="cinematic-bg-vignette" style={{ opacity: 0.92, background: "radial-gradient(circle at center, rgba(5,5,5,0.1) 0%, #050505 85%)" }} />
        </div>
        <div className="cinematic-bg-layer cinematic-brand-bg" style={{ visibility: "hidden", opacity: 0 }}>
          <img src="/ecolush/backgrounds/brand-cinematic.jpg" alt="" className="cinematic-bg-img" />
          <div className="cinematic-bg-vignette" style={{ opacity: 0.88, background: "linear-gradient(to right, rgba(5,5,5,0.95) 0%, rgba(5,5,5,0.4) 60%, rgba(5,5,5,0.9) 100%)" }} />
        </div>

        {/* ── BACKGROUND TYPOGRAPHY LAYER (Ch 03) ─────────────────── */}
        <div className="cinematic-bg-ui-layer" style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none", overflow: "hidden" }}>
          <h2 className="layers-title" style={{ visibility: "hidden" }}><span>LAYER</span><span className="layers-title-accent">BY</span><span>LAYER</span></h2>
        </div>

        {/* ── 3D CANVAS ───────────────────────────────────────────── */}
        <div className="cinematic-canvas-layer">
          <Canvas camera={{ position: [0, 2, 12], fov: 42 }} style={{ width: "100%", height: "100%" }}
            dpr={typeof window !== "undefined" ? Math.min(window.devicePixelRatio, 2) : 1}
            gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}>
            <Suspense fallback={null}><CinematicScene scrollRef={scrollRef} /></Suspense>
          </Canvas>
        </div>

        {/* ── 2D MACRO (Ch 02) ────────────────────────────────────── */}
        <div className="cinematic-macro-layer" style={{ visibility: "hidden", opacity: 0 }}>
          <img src="/ecolush/layer-macro.jpg" alt="Plywood Edge Macro" className="cinematic-macro-img" />
          <div className="cinematic-macro-vignette" />
        </div>

        {/* ── UI LAYER ────────────────────────────────────────────── */}
        <div className="cinematic-ui-layer">

          {/* Ch 01 */}
          <div className="hero-ui">
            <div className="hero-intro-text">
              <h1 className="hero-intro-brand">
                <span className="hero-intro-ecolush">
                  {"ECOLUSH".split("").map((c, i) => <span key={`e-${i}`} className="hero-char" style={{ display: "inline-block", opacity: 0 }}>{c}</span>)}
                </span>
                <span className="hero-intro-ply">
                  {"PLY".split("").map((c, i) => <span key={`p-${i}`} className="hero-char" style={{ display: "inline-block", opacity: 0 }}>{c}</span>)}
                </span>
              </h1>
              <h2 className="hero-intro-sub" style={{ opacity: 0 }}>
                HIGH-DENSIFIED
              </h2>
              <p className="hero-intro-tagline" style={{ opacity: 0 }}>
                SHUTTERING PLYWOOD AND PHENOLIC SHEETS
              </p>
            </div>
            
            <div className="hero-chapter-tag chapter-tag">ECOLUSH PLY / 01</div>
          </div>

          {/* Ch 02 */}
          <div className="material-ui" style={{ visibility: "hidden", opacity: 0 }}>
            <div className="material-left">
              <div className="chapter-tag" style={{ marginBottom: "20px" }}>MATERIAL / 02</div>
              <h2 className="material-heading"><span>THE</span><br /><span className="material-heading-accent">MATERIAL</span></h2>
              <p className="material-desc">Every Ecolush Ply sheet begins with precision — responsibly sourced timber veneers, cross-laminated for structural integrity, finished with high-performance phenolic film for lasting durability.</p>
            </div>
            <div className="material-labels">
              <div className="material-label"><div className="material-label-line" /><div className="material-label-content"><span className="material-label-name">PHENOLIC FILM</span><span className="material-label-desc">Red & Brown High-Density Surface</span></div></div>
              <div className="material-label"><div className="material-label-line" /><div className="material-label-content"><span className="material-label-name">ALTERNATE VENEER LAYERS</span><span className="material-label-desc">Hardwood & Rubber Core</span></div></div>
              <div className="material-label"><div className="material-label-line" /><div className="material-label-content"><span className="material-label-name">H&C COMPRESSED CORE</span><span className="material-label-desc">0% Core Gap & High Load Bearing</span></div></div>
            </div>
          </div>

          {/* Ch 03 */}
          <div className="layers-ui" style={{ visibility: "hidden", opacity: 0 }}>
            <div className="chapter-tag" style={{ position: "absolute", top: "10vh", left: "5vw" }}>STRUCTURE / 03</div>
          </div>

          {/* Ch 04 — Products */}
          <div className="products-ui-layer" style={{ visibility: "hidden", opacity: 0, position: "absolute", inset: 0 }}>
            <div className="products-top" style={{ paddingTop: "clamp(80px,12vh,130px)", paddingLeft: "clamp(24px,5vw,80px)", position: "absolute", top: 0, left: 0, zIndex: 20 }}>
              <div className="products-chapter chapter-tag">PRODUCTS / 04</div>
              <h2 className="products-heading" id="products-heading">THE RANGE</h2>
              <p className="products-subhead">Engineered for every construction demand.</p>
            </div>

            <div className="products-track-wrap" style={{ position: "absolute", top: 0, height: "100vh", display: "flex", alignItems: "center" }}>
              <div className="products-track" ref={trackRef} style={{ display: "flex", paddingLeft: "40vw", paddingRight: "20vw" }}>
                {productsData.map((product, idx) => {
                  const isFinal = idx === productsData.length - 1
                  return (
                    <article key={product.id} className={`product-card${isFinal ? " final-product" : ""}`} aria-label={`${product.name} product`}>
                      <div className="product-card__visual">
                        <div className="product-specimen-scene" style={{ width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center", cursor: "pointer" }} onClick={() => setLightboxImage(product.image)}>
                          <img src={product.image} alt={product.name} className="product-real-image" style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain", borderRadius: "4px" }} />
                          {isFinal && (
                            <>
                              <div className="bp-dim bp-dim-h" style={{ opacity: 0 }}><div className="bp-dim-line" /><span className="bp-dim-text">1220 mm (4')</span></div>
                              <div className="bp-dim bp-dim-v" style={{ opacity: 0 }}><div className="bp-dim-line" /><span className="bp-dim-text">2440 mm (8')</span></div>
                            </>
                          )}
                          
                          {/* Consistency Boards for Brand Transition */}
                          {isFinal && [1, 2, 3].map(i => (
                            <img key={i} src={product.image} alt="" className="consistency-board product-real-image" style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", maxWidth: "100%", maxHeight: "100%", objectFit: "contain", opacity: 0, zIndex: -i, borderRadius: "4px" }} />
                          ))}
                        </div>
                        <div className="product-card__id">{product.id}</div>
                      </div>
                      <div className="product-card__info">
                        <div className="product-card__tag"><span className="tech-line" /><span className="section-label">{product.series}</span></div>
                        <h3 className="product-card__name">{product.name}</h3>
                        <p className="product-card__tagline">{product.tagline}</p>
                        <p className="product-card__desc">{product.description}</p>
                        <div className="product-card__specs">
                          <div className="product-card__spec"><span className="product-spec-label">SURFACE</span><span className="product-spec-value">{product.surface}</span></div>
                          <div className="product-card__spec"><span className="product-spec-label">SIZE</span><span className="product-spec-value">{product.spec}</span></div>
                        </div>
                      </div>
                    </article>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Ch 05 — Spec UI */}
          <div className="spec-ui-layer" style={{ visibility: "hidden", opacity: 0, position: "absolute", inset: 0, pointerEvents: "none" }}>
            <div className="spec-ui-container">

              {/* Left — Chapter + Headline + Desc */}
              <div className="spec-ui-left">
                <div className="chapter-tag" style={{ marginBottom: "32px" }}>SPECIFICATIONS / 05</div>
                <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(48px,6vw,90px)", lineHeight: 0.9, color: "#F5F0EB", letterSpacing: "0.02em" }}>
                  ECOLUSH<br /><span style={{ color: "#C8281A" }}>IN ACTION</span>
                </h2>
                <p style={{ marginTop: "28px", fontFamily: "'DM Sans', sans-serif", fontSize: "clamp(13px,1vw,16px)", color: "rgba(245,240,235,0.55)", lineHeight: 1.6, maxWidth: "340px" }}>
                  Ecolush Ply products are engineered with H&C Compression Technology, 0% core gap, and IS 4990 compliance — built for the heaviest concrete formwork demands.
                </p>
              </div>

              {/* Divider */}
              <div className="spec-ui-divider" />

              {/* Centre — Video 01 (Primary) */}
              <div className="spec-ui-center">
                <EcolushVideo src="/videos/ecolush-video-01.mp4" aspect="16/9" />
              </div>

              {/* Right — Video 02 (Secondary) */}
              <div className="spec-ui-right">
                <EcolushVideo src="/videos/ecolush-video-02.mp4" aspect="4/5" />
              </div>

            </div>
          </div>

          {/* Ch 06 — Brand Story Cinematic UI */}
          <div className="brand-ui-layer" style={{ visibility: "hidden", opacity: 0, position: "absolute", inset: 0, pointerEvents: "none" }}>
            
            {/* Persistent Chapter Header */}
            <div style={{ position: "absolute", top: "clamp(80px,11vh,120px)", left: "clamp(24px,5vw,80px)", zIndex: 10 }}>
              <div className="chapter-tag">WHY ECOLUSH / 06</div>
            </div>
            
            {/* Persistent Brand Label */}
            <div style={{ position: "absolute", bottom: "clamp(40px,5vh,80px)", left: "clamp(24px,5vw,80px)", fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(20px,2vw,28px)", color: "rgba(245,240,235,0.3)", letterSpacing: "0.2em", zIndex: 10 }}>
              ECOLUSH PLY
            </div>

            {/* Stable Text Stage on Left Negative Space */}
            <div className="chapter06-copy-stage" style={{ position: "absolute", left: "clamp(24px,5vw,80px)", top: "50%", transform: "translateY(-50%)", width: "45vw", minHeight: "300px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
              
              {/* PHASE 01: DRIVEN BY QUALITY */}
              <div className="chapter06-message brand-phase-1" style={{ position: "absolute", left: 0, width: "100%", opacity: 0, visibility: "hidden" }}>
                <p className="bp1-driven" style={{ fontFamily: "'Inter', sans-serif", fontSize: "clamp(12px,1.2vw,16px)", color: "rgba(245,240,235,0.4)", letterSpacing: "0.4em", marginBottom: "8px" }}>
                  DRIVEN BY
                </p>
                <h2 className="bp1-quality" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(70px,12vw,220px)", lineHeight: 0.85, letterSpacing: "0.02em", color: "#F5F0EB", whiteSpace: "nowrap" }}>
                  QUALITY
                </h2>
              </div>

              {/* PHASE 02: CUSTOMER SATISFACTION */}
              <div className="chapter06-message brand-phase-2" style={{ position: "absolute", left: 0, width: "100%", opacity: 0, visibility: "hidden" }}>
                <h2 className="bp2-customer" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(44px,8vw,140px)", lineHeight: 0.85, letterSpacing: "0.02em", color: "rgba(245,240,235,0.7)" }}>
                  CUSTOMER
                </h2>
                <h2 className="bp2-satisfaction" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(44px,8vw,140px)", lineHeight: 0.85, letterSpacing: "0.02em", color: "#F5F0EB" }}>
                  SATISFACTION
                </h2>
              </div>

              {/* PHASE 03: Four brand principles */}
              {brandPillars.map((pillar, i) => (
                <div
                  key={i}
                  className={`chapter06-message brand-pillar-${i}`}
                  style={{
                    position: "absolute",
                    left: 0,
                    width: "100%",
                    opacity: 0,
                    visibility: "hidden"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "flex-end", gap: "16px", marginBottom: "20px" }}>
                    <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "clamp(16px,2vw,24px)", fontWeight: 500, color: "rgba(245,240,235,0.5)", lineHeight: 1 }}>
                      0{i + 1}
                    </span>
                    <div style={{ flex: 1, height: "1px", background: "rgba(245,240,235,0.15)", marginBottom: "8px" }} />
                  </div>
                  <h2 style={{
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: "clamp(48px,10vw,200px)",
                    lineHeight: 0.85,
                    letterSpacing: "0.02em",
                    color: "#F5F0EB",
                    whiteSpace: "pre-line",
                    textShadow: "0 10px 40px rgba(0,0,0,0.5)"
                  }}>
                    {pillar.title}
                  </h2>
                </div>
              ))}
            </div>
          </div>

          {/* Ch 07 — Construction Site */}
          <div className="ch07-construction-layer" style={{ visibility: "hidden", opacity: 0, position: "absolute", inset: 0, zIndex: 12, backgroundColor: "#050505" }}>
            
            {/* Abstract structural lines */}
            <div className="const-abstract-lines" style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(20,20,20,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(20,20,20,0.5) 1px, transparent 1px)", backgroundSize: "100px 100px", opacity: 1, transformOrigin: "center center" }}>
              <div style={{ position: "absolute", inset: "20%", border: "2px solid rgba(10,10,10,0.8)", transform: "perspective(1000px) rotateX(60deg) rotateZ(45deg)" }} />
              <div style={{ position: "absolute", inset: "30%", border: "1px solid rgba(10,10,10,0.6)", transform: "perspective(1000px) rotateX(60deg) rotateZ(45deg) translateZ(100px)" }} />
            </div>

            {/* Realistic Construction Environment */}
            <div className="const-bg-layer" style={{ position: "absolute", inset: 0, opacity: 0, overflow: "hidden" }}>
              {/* Base construction background — panned by existing GSAP */}
              <img src="/ecolush/construction.jpg" alt="Construction Site" className="const-bg-img" style={{ width: "100%", height: "100%", objectFit: "cover", transformOrigin: "center center" }} />

              {/* ── Per-Application Cinematic Image Panels ────────────────
                   All start hidden+opacity:0. Crossfaded by master tl.
                   Each covers the full viewport so it replaces the base bg.
              ──────────────────────────────────────────────────────────── */}
              <div className="const-app-img-formwork" style={{
                position: "absolute", inset: 0, visibility: "hidden", opacity: 0,
                transition: "none" /* GSAP controls opacity entirely */
              }}>
                <img
                  src="/ecolush/applications/formwork-shuttering.webp"
                  alt="Formwork and Shuttering"
                  style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }}
                  loading="eager"
                />
                <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at center, transparent 30%, rgba(5,5,5,0.55) 100%), linear-gradient(to bottom, rgba(5,5,5,0.3) 0%, transparent 40%, rgba(5,5,5,0.8) 100%)" }} />
              </div>

              <div className="const-app-img-slab" style={{
                position: "absolute", inset: 0, visibility: "hidden", opacity: 0
              }}>
                <img
                  src="/ecolush/applications/slabs.webp"
                  alt="Slabs"
                  style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }}
                  loading="eager"
                />
                <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at center, transparent 30%, rgba(5,5,5,0.55) 100%), linear-gradient(to bottom, rgba(5,5,5,0.3) 0%, transparent 40%, rgba(5,5,5,0.8) 100%)" }} />
              </div>

              <div className="const-app-img-beam" style={{
                position: "absolute", inset: 0, visibility: "hidden", opacity: 0
              }}>
                <img
                  src="/ecolush/applications/beams.webp"
                  alt="Beams"
                  style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }}
                  loading="eager"
                />
                <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at center, transparent 30%, rgba(5,5,5,0.55) 100%), linear-gradient(to bottom, rgba(5,5,5,0.3) 0%, transparent 40%, rgba(5,5,5,0.8) 100%)" }} />
              </div>

              <div className="const-app-img-column" style={{
                position: "absolute", inset: 0, visibility: "hidden", opacity: 0
              }}>
                <img
                  src="/ecolush/applications/columns.webp"
                  alt="Columns"
                  style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }}
                  loading="eager"
                />
                <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at center, transparent 30%, rgba(5,5,5,0.55) 100%), linear-gradient(to bottom, rgba(5,5,5,0.3) 0%, transparent 40%, rgba(5,5,5,0.8) 100%)" }} />
              </div>

              <div className="const-app-img-industrial" style={{
                position: "absolute", inset: 0, visibility: "hidden", opacity: 0
              }}>
                <img
                  src="/ecolush/applications/industrial-site-casting.webp"
                  alt="Industrial and Site Casting"
                  style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }}
                  loading="eager"
                />
                <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at center, transparent 30%, rgba(5,5,5,0.55) 100%), linear-gradient(to bottom, rgba(5,5,5,0.3) 0%, transparent 40%, rgba(5,5,5,0.8) 100%)" }} />
              </div>

              <div className="const-bg-vignette" style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at center, transparent 30%, rgba(5,5,5,0.7) 100%), linear-gradient(to bottom, transparent 60%, rgba(5,5,5,0.9) 100%)", opacity: 0.6 }} />

              {/* Dust Particles for Ch 08 Handoff */}
              <div className="const-dust-particles" style={{ position: "absolute", inset: 0, opacity: 0, backgroundImage: "radial-gradient(circle, rgba(200,200,200,0.8) 1px, transparent 1px)", backgroundSize: "40px 40px", backgroundPosition: "0 0", animation: "drift 20s linear infinite" }} />
            </div>

            {/* Typography Labels */}
            <div className="const-labels" style={{ position: "absolute", inset: 0, pointerEvents: "none", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
              
              <div className="chapter-tag" style={{ position: "absolute", top: "clamp(80px,11vh,120px)", left: "clamp(24px,5vw,80px)" }}>APPLICATIONS / 07</div>

              <div className="const-label-formwork" style={{ visibility: "hidden", textAlign: "center" }}>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px", color: "#C8281A", letterSpacing: "0.2em", marginBottom: "8px" }}>APPLICATION 01</p>
                <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(60px,9vw,120px)", color: "#F5F0EB", letterSpacing: "0.04em", lineHeight: 0.9 }}>FORMWORK <span style={{ color: "rgba(245,240,235,0.4)" }}>&amp;</span><br />SHUTTERING</h2>
              </div>

              <div className="const-label-slab" style={{ visibility: "hidden", position: "absolute", textAlign: "center" }}>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px", color: "#C8281A", letterSpacing: "0.2em", marginBottom: "8px" }}>APPLICATION 02</p>
                <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(60px,9vw,120px)", color: "#F5F0EB", letterSpacing: "0.04em", lineHeight: 0.9 }}>SLABS</h2>
              </div>

              <div className="const-label-beam" style={{ visibility: "hidden", position: "absolute", textAlign: "center" }}>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px", color: "#C8281A", letterSpacing: "0.2em", marginBottom: "8px" }}>APPLICATION 03</p>
                <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(60px,9vw,120px)", color: "#F5F0EB", letterSpacing: "0.04em", lineHeight: 0.9 }}>BEAMS</h2>
              </div>

              <div className="const-label-column" style={{ visibility: "hidden", position: "absolute", textAlign: "center" }}>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px", color: "#C8281A", letterSpacing: "0.2em", marginBottom: "8px" }}>APPLICATION 04</p>
                <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(60px,9vw,120px)", color: "#F5F0EB", letterSpacing: "0.04em", lineHeight: 0.9 }}>COLUMNS</h2>
              </div>

              <div className="const-label-structure" style={{ visibility: "hidden", position: "absolute", textAlign: "center" }}>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px", color: "#C8281A", letterSpacing: "0.2em", marginBottom: "8px" }}>APPLICATION 05</p>
                <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(60px,9vw,120px)", color: "#F5F0EB", letterSpacing: "0.04em", lineHeight: 0.9 }}>INDUSTRIAL <span style={{ color: "rgba(245,240,235,0.4)" }}>&amp;</span><br />SITE CASTING</h2>
              </div>

            </div>
          </div>

          {/* Ch 08 — Story / Material Return
               zIndex 11 = above canvas (1) so it can receive clicks and display text.
               background: transparent so the 3D canvas shows through with the plywood. */}
          <div className="ch08-story-layer" style={{ visibility: "hidden", opacity: 0, position: "absolute", inset: 0, zIndex: 11, pointerEvents: "none", background: "transparent" }}>
            <div className="chapter-tag" style={{ position: "absolute", top: "clamp(80px,11vh,120px)", left: "clamp(24px,5vw,80px)" }}>OUR STORY / 08</div>
            
            <div className="story-labels" style={{ textAlign: "center", position: "relative", width: "100%", height: "100%" }}>
              <div className="story-label-1" style={{ visibility: "hidden", position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "100%" }}>
                <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(60px,10vw,160px)", color: "#F5F0EB", letterSpacing: "0.08em", opacity: 0.85, lineHeight: 1 }}>THE MATERIAL</h2>
              </div>
              <div className="story-label-2" style={{ visibility: "hidden", position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "100%" }}>
                <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(60px,10vw,160px)", color: "#F5F0EB", letterSpacing: "0.08em", opacity: 0.85, lineHeight: 1 }}>ZERO CORE GAP</h2>
              </div>
              <div className="story-label-3" style={{ visibility: "hidden", position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "100%" }}>
                <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(60px,10vw,160px)", color: "#F5F0EB", letterSpacing: "0.08em", opacity: 0.85, lineHeight: 1 }}>CONSISTENT QUALITY</h2>
              </div>
              <div className="story-label-4" style={{ visibility: "hidden", position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "100%" }}>
                <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(60px,10vw,160px)", color: "#F5F0EB", letterSpacing: "0.08em", opacity: 0.85, lineHeight: 1 }}>HIGH DENSIFIED</h2>
              </div>
              <div className="story-label-5" style={{ visibility: "hidden", position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "100%" }}>
                <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(80px,12vw,180px)", color: "#C8281A", letterSpacing: "0.08em", opacity: 0.9, lineHeight: 1 }}>ECOLUSH PLY</h2>
              </div>
            </div>
          </div>

          {/* Ch 09 — Final CTA */}
          <div className="ch09-cta-layer" style={{ visibility: "hidden", opacity: 0, position: "absolute", inset: 0, zIndex: 14, pointerEvents: "none", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
            <div className="chapter-tag" style={{ position: "absolute", top: "clamp(80px,11vh,120px)", left: "clamp(24px,5vw,80px)" }}>ENQUIRE / 09</div>
            
            <div className="cta-content" style={{ textAlign: "center", zIndex: 15, pointerEvents: "auto" }}>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "14px", color: "#C8281A", letterSpacing: "0.3em", marginBottom: "20px", fontWeight: 600 }}>ECOLUSH PLY</p>
              <h2 className="cta-headline" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(60px,10vw,160px)", color: "#F5F0EB", letterSpacing: "0.04em", lineHeight: 0.9, marginBottom: "40px", textShadow: "0 10px 40px rgba(0,0,0,0.5)" }}>
                <span className="cta-headline-line cta-line-1" style={{ display: "block" }}>BUILT FOR</span>
                <span className="cta-headline-line cta-line-2" style={{ display: "block" }}>THE STRUCTURES</span>
                <span className="cta-headline-line cta-line-3" style={{ display: "block", color: "#C8281A" }}>THAT MATTER.</span>
              </h2>
              
              <div className="cta-action" style={{ opacity: 0, transform: "translateY(20px)" }}>
                <a href="https://wa.me/919740355657" target="_blank" rel="noopener noreferrer" className="cta-button" style={{ display: "inline-block", padding: "18px 48px", backgroundColor: "#C8281A", color: "#fff", textDecoration: "none", fontFamily: "'Inter', sans-serif", fontWeight: 600, letterSpacing: "0.15em", fontSize: "14px", transition: "all 0.3s ease", border: "1px solid rgba(255,255,255,0.1)" }}>
                  ENQUIRE NOW
                </a>
              </div>
            </div>
          </div>

          {/* Global Scroll Hint */}
          <div className="scroll-hint-global">
            <div className="scroll-hint-line" />
            <span className="scroll-hint-text">SCROLL</span>
          </div>

        </div>
      </div>
      
      {/* Lightbox UI */}
      {lightboxImage && (
        <div style={{ position: "fixed", inset: 0, zIndex: 99999, background: "rgba(10, 10, 10, 0.95)", display: "flex", justifyContent: "center", alignItems: "center", cursor: "pointer", backdropFilter: "blur(10px)" }} onClick={() => setLightboxImage(null)}>
          <img src={lightboxImage} alt="Fullscreen Product" style={{ maxWidth: "90%", maxHeight: "90%", objectFit: "contain", borderRadius: "8px", boxShadow: "0 20px 60px rgba(0,0,0,0.5)" }} />
          <div style={{ position: "absolute", top: "30px", right: "30px", color: "rgba(255,255,255,0.7)", fontSize: "40px", cursor: "pointer", fontFamily: "sans-serif", lineHeight: 1, padding: "10px" }} onMouseEnter={(e) => (e.currentTarget.style.color = "white")} onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.7)")}>&times;</div>
        </div>
      )}
    </div>
  )
}
