"use client"

import { useRef, useMemo, useEffect } from "react"
import { useFrame } from "@react-three/fiber"
import gsap from "gsap"
import * as THREE from "three"

/* ─────────────────────────────────────────────────────────────────────────
   EASING HELPERS
   ───────────────────────────────────────────────────────────────────────── */

function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v))
}

function mapRange(v: number, inMin: number, inMax: number, outMin: number, outMax: number): number {
  return outMin + ((clamp(v, inMin, inMax) - inMin) / (inMax - inMin)) * (outMax - outMin)
}

/* ─────────────────────────────────────────────────────────────────────────
   CINEMATIC KEYFRAME MOTION
   Each keyframe is [scrollProgress, value].
   interpKF smoothly eases between adjacent keyframes.
   ───────────────────────────────────────────────────────────────────────── */

type KF = [number, number]

function easeInOut(t: number): number {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
}

function interpKF(kf: KF[], p: number): number {
  const clamped = Math.max(kf[0][0], Math.min(kf[kf.length - 1][0], p))
  for (let i = 0; i < kf.length - 1; i++) {
    const [t0, v0] = kf[i]
    const [t1, v1] = kf[i + 1]
    if (clamped >= t0 && clamped <= t1) {
      const alpha = (clamped - t0) / (t1 - t0)
      return v0 + easeInOut(alpha) * (v1 - v0)
    }
  }
  return kf[kf.length - 1][1]
}

/*
  Rotation Y keyframes — the cinematic product-reveal arc (p=0.00 to p=0.12):
    p=0.00  → -20° : front face visible, slightly angled (hero composition)
    p=0.04  →  -8° : slow start, drifting toward centre as text fades
    p=0.08  →  45° : accelerating rotation to show depth
    p=0.12  →  88° : near-edge-on — full laminate stack revealed right before macro transition
*/
const ROT_Y_KF: KF[] = [
  [0.00, -0.35],
  [0.04, -0.15],
  [0.08,  0.80],
  [0.12,  1.54],
  [1.00,  1.54], // fallback
]

/*
  Rotation X keyframes — subtle fore/aft tilt for depth reading:
*/
const ROT_X_KF: KF[] = [
  [0.00,  0.08],
  [0.06,  0.04],
  [0.12, -0.06], // slight upward tilt at edge-on — reads as floating
  [1.00, -0.06], // fallback
]

/* Position Y keyframes — slow vertical drift */
const POS_Y_KF: KF[] = [
  [0.00, -0.15],
  [0.12,  0.10],
  [1.00,  0.10],
]

/* ─────────────────────────────────────────────────────────────────────────
   PROCEDURAL TEXTURES — edges, film, back face wood
   ───────────────────────────────────────────────────────────────────────── */

function buildWoodFaceTexture(size = 1024): THREE.CanvasTexture {
  const canvas = document.createElement("canvas")
  canvas.width = size; canvas.height = size
  const ctx = canvas.getContext("2d")!
  const base = ctx.createLinearGradient(0, 0, size, size)
  base.addColorStop(0,    "#b8782a"); base.addColorStop(0.35, "#d4953d")
  base.addColorStop(0.65, "#c8853a"); base.addColorStop(1,    "#a06020")
  ctx.fillStyle = base; ctx.fillRect(0, 0, size, size)
  for (let i = 0; i < 320; i++) {
    const y = (i / 320) * size
    const alpha = 0.03 + Math.random() * 0.13
    ctx.strokeStyle = Math.random() > 0.45
      ? `rgba(38,16,3,${alpha})` : `rgba(255,210,120,${alpha * 0.5})`
    ctx.lineWidth = 0.4 + Math.random() * 2.2
    ctx.beginPath(); ctx.moveTo(0, y + (Math.random()-0.5)*6)
    ctx.bezierCurveTo(size*.25+(Math.random()-.5)*20,y+(Math.random()-.5)*22,
      size*.75+(Math.random()-.5)*20,y+(Math.random()-.5)*22,size,y+(Math.random()-.5)*6)
    ctx.stroke()
  }
  for (let n = 0; n < 6000; n++) {
    const a = 0.02 + Math.random() * 0.05
    ctx.fillStyle = Math.random()>.5 ? `rgba(32,14,2,${a})` : `rgba(255,220,140,${a*.4})`
    ctx.fillRect(Math.random()*size, Math.random()*size, 1, Math.random()<.6?1:2)
  }
  const tex = new THREE.CanvasTexture(canvas)
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping; tex.repeat.set(1.5,1)
  return tex
}

function buildFilmTexture(size = 512): THREE.CanvasTexture {
  const canvas = document.createElement("canvas")
  canvas.width = size; canvas.height = size
  const ctx = canvas.getContext("2d")!
  ctx.fillStyle = "#7a1208"; ctx.fillRect(0,0,size,size)
  for (let i = 0; i < size; i += 8) {
    ctx.strokeStyle = "rgba(0,0,0,0.16)"; ctx.lineWidth = 0.5
    ctx.beginPath(); ctx.moveTo(i,0); ctx.lineTo(i,size); ctx.stroke()
    ctx.beginPath(); ctx.moveTo(0,i); ctx.lineTo(size,i); ctx.stroke()
  }
  return new THREE.CanvasTexture(canvas)
}

function buildEdgeTexture(size = 256): THREE.CanvasTexture {
  const canvas = document.createElement("canvas")
  canvas.width = size; canvas.height = size
  const ctx = canvas.getContext("2d")!
  ctx.fillStyle = "#b07030"; ctx.fillRect(0,0,size,size)
  const layers = 9
  for (let l = 0; l < layers; l++) {
    const y = (l/layers)*size, h = size/layers
    ctx.fillStyle = l%2===0 ? "rgba(38,16,4,0.35)" : "rgba(200,155,80,0.18)"
    ctx.fillRect(0,y,size,h-1)
    ctx.strokeStyle = "rgba(18,6,1,0.55)"; ctx.lineWidth = 1.2
    ctx.beginPath(); ctx.moveTo(0,y+h-.5); ctx.lineTo(size,y+h-.5); ctx.stroke()
  }
  for (let i = 0; i < 120; i++) {
    const y = Math.random()*size
    ctx.strokeStyle = `rgba(50,22,5,${.03+Math.random()*.08})`; ctx.lineWidth = 0.5
    ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(size,y+(Math.random()-.5)*4); ctx.stroke()
  }
  const tex = new THREE.CanvasTexture(canvas)
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping
  return tex
}

import { useTexture } from "@react-three/drei"

/* ─────────────────────────────────────────────────────────────────────────
   DUST PARTICLES
   ───────────────────────────────────────────────────────────────────────── */

function DustParticles({ count = 140 }: { count?: number }) {
  const geoRef   = useRef<THREE.BufferGeometry>(null)
  const clockRef = useRef(0)

  const { positions, speeds, phases } = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const speeds    = new Float32Array(count)
    const phases    = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      positions[i*3]   = (Math.random()-.5)*8
      positions[i*3+1] = (Math.random()-.5)*5+0.5
      positions[i*3+2] = (Math.random()-.5)*5
      speeds[i] = 0.003 + Math.random()*0.006
      phases[i] = Math.random()*Math.PI*2
    }
    return { positions, speeds, phases }
  }, [count])

  useEffect(() => {
    if (!geoRef.current) return
    geoRef.current.setAttribute("position", new THREE.BufferAttribute(positions, 3))
  }, [positions])

  useFrame((_, delta) => {
    if (!geoRef.current) return
    const attr = geoRef.current.getAttribute("position") as THREE.BufferAttribute | undefined
    if (!attr) return

    clockRef.current += delta
    const pos  = attr.array as Float32Array
    for (let i = 0; i < count; i++) {
      const t = clockRef.current * speeds[i] + phases[i]
      pos[i*3]   += Math.sin(t*.6)*.003
      pos[i*3+1] += 0.004 + Math.sin(t*1.2)*.001
      pos[i*3+2] += Math.cos(t*.4)*.002
      if (pos[i*3+1] > 5) {
        pos[i*3+1] = -1.5
        pos[i*3]   = (Math.random()-.5)*8
        pos[i*3+2] = (Math.random()-.5)*5
      }
    }
    attr.needsUpdate = true
  })

  return (
    <points>
      <bufferGeometry ref={geoRef} />
      <pointsMaterial size={0.022} color="#e8c87a" transparent opacity={0.38} sizeAttenuation depthWrite={false} />
    </points>
  )
}

/* ─────────────────────────────────────────────────────────────────────────
   MAIN PLYWOOD MODEL
   ───────────────────────────────────────────────────────────────────────── */

interface PlywoodModelProps {
  scrollRef: React.MutableRefObject<{ progress: number }>
}

export default function PlywoodModel({ scrollRef }: PlywoodModelProps) {
  const groupRef = useRef<THREE.Group>(null)

  // Board dimensions — 4′×8′ plywood sheet
  const W = 5.8
  const H = 3.8
  const D = 0.45

  /* ── MATERIALS ─────────────────────────────────────────────────────────
     Front face (+Z, index 4): Phenolic film
     Back face  (-Z, index 5): Procedural wood grain
     Edges (+X,-X, index 0,1): Lamination cross-section
     Top/bottom (+Y,-Y, index 2,3): Phenolic red film
  ─────────────────────────────────────────────────────────────────────── */

  const filmMat = useMemo(() => new THREE.MeshStandardMaterial({
    map: buildFilmTexture(512),
    roughness: 0.35, metalness: 0.02, envMapIntensity: 1.2,
  }), [])

  const edgeMat = useMemo(() => new THREE.MeshStandardMaterial({
    map: buildEdgeTexture(256),
    roughness: 0.85, metalness: 0.0, envMapIntensity: 0.5,
  }), [])

  const backFaceMat = useMemo(() => new THREE.MeshStandardMaterial({
    map: buildWoodFaceTexture(1024),
    roughness: 0.75, metalness: 0.02, envMapIntensity: 0.8,
  }), [])

  const crownTex = useTexture("/ecolush/hero/crown-hero.webp")
  
  // Configure the texture to display upright while mapped to the landscape box face
  useEffect(() => {
    crownTex.colorSpace = THREE.SRGBColorSpace
    // The Crown PDF is portrait (3744x6912). The board is landscape (W=5.8, H=3.8).
    // If the physical board prints the branding horizontally along the 8ft edge:
    crownTex.center.set(0.5, 0.5)
    crownTex.rotation = -Math.PI / 2
    // We adjust repeat slightly to fit
    // Rotation turns the texture width to 6912 and height to 3744.
    // Box aspect = 5.8 / 3.8 = 1.52
    // Tex aspect = 6912 / 3744 = 1.84
    // To 'cover', we crop the left/right edges slightly:
    const scaleX = 1.52 / 1.84
    crownTex.repeat.set(scaleX, 1)
    crownTex.offset.set((1 - scaleX) / 2, 0)
    crownTex.needsUpdate = true
  }, [crownTex])

  const crownMat = useMemo(() => new THREE.MeshStandardMaterial({
    map: crownTex,
    roughness: 0.35, 
    metalness: 0.02, 
    envMapIntensity: 1.2,
  }), [crownTex])

  // BoxGeometry material index order: +X, -X, +Y, -Y, +Z (FRONT), -Z (BACK)
  const materials = useMemo(() => [
    edgeMat,      // 0: +X right edge
    edgeMat,      // 1: -X left edge
    filmMat,      // 2: +Y top (phenolic film)
    filmMat,      // 3: -Y bottom (phenolic film)
    crownMat,     // 4: +Z FRONT FACE (Crown Artwork)
    backFaceMat,  // 5: -Z back face (wood grain)
  ], [edgeMat, filmMat, crownMat, backFaceMat])

  // ── LERP STATE — mutable refs, never cause React re-render
  const lerpRot   = useRef({ x: 0.08, y: -0.35, z: 0.0 })
  const lerpPos   = useRef({ y: -0.15, z: 0.0 })
  const lerpScale = useRef(1.0)

  /* ── FRAME LOOP ─────────────────────────────────────────────────────── */

  useFrame((_, delta) => {
    if (!groupRef.current) return

    const p = scrollRef.current.progress

    // Responsive mobile check inside frame (safe from SSR issues)
    const isMobile = window.innerWidth < 900

    // ── TARGET VALUES from keyframes
    // Reduce rotation amplitude on mobile to prevent clipping
    const rotAmp = isMobile ? 0.75 : 1.0
    const targetRotY = interpKF(ROT_Y_KF, p) * rotAmp
    const targetRotX = interpKF(ROT_X_KF, p) * rotAmp
    
    // Very subtle Z roll — a barely perceptible lean that reads as weight
    const targetRotZ = Math.sin(p * Math.PI * 0.9) * 0.028
    
    // Move the board down on mobile during the hero section (p near 0) so it clears the text
    const mobileYOffset = (isMobile && p < 0.15) ? -0.8 : 0
    const targetPosY = interpKF(POS_Y_KF, p) + mobileYOffset
    
    const targetPosZ = p * 0.55
    
    // Scale down significantly on mobile to fit the screen width
    const baseScale = isMobile ? 0.6 : 1.0
    const targetScale = baseScale + p * 0.08

    // ── EXPONENTIAL LERP — frame-rate independent, silky smooth
    // Higher = snappier tracking. Desktop 10, mobile 14.
    const lerpSpeed = isMobile ? 14 : 10
    const α = 1 - Math.exp(-lerpSpeed * delta)

    lerpRot.current.x += (targetRotX - lerpRot.current.x) * α
    lerpRot.current.y += (targetRotY - lerpRot.current.y) * α
    lerpRot.current.z += (targetRotZ - lerpRot.current.z) * α
    lerpPos.current.y += (targetPosY - lerpPos.current.y) * α
    lerpPos.current.z += (targetPosZ - lerpPos.current.z) * α
    lerpScale.current += (targetScale - lerpScale.current) * α

    groupRef.current.rotation.x = lerpRot.current.x
    groupRef.current.rotation.y = lerpRot.current.y
    groupRef.current.rotation.z = lerpRot.current.z
    groupRef.current.position.y = lerpPos.current.y
    groupRef.current.position.z = lerpPos.current.z
    groupRef.current.scale.setScalar(lerpScale.current)
  })

  const introGroupRef = useRef<THREE.Group>(null)
  // Track flash opacity for the arrival burst
  const flashRef = useRef(0)

  // ── INTRO ANIMATION (Runs once on mount)
  useEffect(() => {
    if (!introGroupRef.current) return
    const tl = gsap.timeline({ delay: 0.15 })

    // ── Phase 1: Rocket in from deep background ──────────────────────
    // Start: far back, tiny, tilted
    tl.fromTo(introGroupRef.current.position,
      { z: -5.5, y: -1.2 },
      { z: 0, y: 0, duration: 1.4, ease: "expo.out" }, 0
    )
    tl.fromTo(introGroupRef.current.scale,
      { x: 0.55, y: 0.55, z: 0.55 },
      { x: 1, y: 1, z: 1, duration: 1.4, ease: "expo.out" }, 0
    )
    // Dramatic angular tilt straightening out
    tl.fromTo(introGroupRef.current.rotation,
      { x: -0.18, y: 0.35, z: 0.08 },
      { x: 0, y: 0, z: 0, duration: 1.4, ease: "expo.out" }, 0
    )

    // ── Phase 2: Flash burst at arrival (opacity punch) ──────────────
    // Invisible → over-bright snap → settles to normal
    const flashProxy = { v: 0 }
    tl.fromTo(flashProxy,
      { v: 0 },
      {
        v: 1, duration: 1.4, ease: "expo.out",
        onUpdate: () => { flashRef.current = flashProxy.v }
      }, 0
    )

    return () => { tl.kill() }
  }, [])

  /* ── JSX ─────────────────────────────────────────────────────────────── */

  return (
    <group ref={groupRef} rotation={[0.08, -0.35, 0.0]} position={[0, -0.15, 0]}>

      <group ref={introGroupRef}>
        <mesh castShadow receiveShadow material={materials}>
          <boxGeometry args={[W, H, D, 1, 1, 1]} />
        </mesh>
      </group>

      {/* ── FLOATING SAWDUST PARTICLES */}
      <DustParticles count={140} />

    </group>
  )
}