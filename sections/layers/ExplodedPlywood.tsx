"use client"

import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"

interface ExplodedPlywoodProps {
  scrollRef: React.MutableRefObject<{ progress: number }>
}

// Individual plywood layer
function PlywoodLayer({
  index,
  total,
  scrollRef,
  color,
  thickness,
  isFilm = false,
}: {
  index: number
  total: number
  scrollRef: React.MutableRefObject<{ progress: number }>
  color: string
  thickness: number
  isFilm?: boolean
}) {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame(() => {
    if (!meshRef.current) return

    const p = scrollRef.current.progress
    let explodeProgress = 0
    
    // Explode between 0.28 and 0.38
    if (p >= 0.28 && p <= 0.33) {
      explodeProgress = (p - 0.28) / 0.05
    } else if (p > 0.33 && p <= 0.38) {
      explodeProgress = 1 - (p - 0.33) / 0.05
    } else if (p >= 1.32 && p <= 1.34) {
      // Subtle separation to demonstrate veneer layers for ZERO CORE GAP
      explodeProgress = Math.sin(((p - 1.32) / 0.02) * Math.PI) * 0.25
    }

    const center = (total - 1) / 2
    const offset = (index - center)

    // Smooth explosion
    const eased = explodeProgress < 0.5
      ? 2 * explodeProgress * explodeProgress
      : 1 - Math.pow(-2 * explodeProgress + 2, 2) / 2

    // Very restrained, premium delamination to show layers
    const isMobile = window.innerWidth < 900
    const distanceMult = isMobile ? 0.06 : 0.12
    const targetY = offset * eased * distanceMult

    meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, targetY, 0.06)

    // Subtle rotation as layers separate
    meshRef.current.rotation.y = THREE.MathUtils.lerp(
      meshRef.current.rotation.y,
      eased * offset * 0.015,
      0.06
    )
    meshRef.current.rotation.z = THREE.MathUtils.lerp(
      meshRef.current.rotation.z,
      eased * offset * 0.008,
      0.06
    )
  })

  return (
    <mesh ref={meshRef} castShadow receiveShadow>
      <boxGeometry args={[5.4, thickness, 3.2, 2, 1, 1]} />
      <meshPhysicalMaterial
        color={color}
        roughness={isFilm ? 0.25 : 0.85}
        metalness={isFilm ? 0.15 : 0.02}
        envMapIntensity={isFilm ? 1.4 : 0.4}
        clearcoat={isFilm ? 0.4 : 0}
        clearcoatRoughness={isFilm ? 0.3 : 0}
        reflectivity={isFilm ? 0.5 : 0.1}
      />
    </mesh>
  )
}

export default function ExplodedPlywood({ scrollRef }: ExplodedPlywoodProps) {
  const groupRef = useRef<THREE.Group>(null)

  // 15 layers for a realistic 18mm high-density plywood structure
  const layers = [
    { color: "#821B12", thickness: 0.015, isFilm: true },
    { color: "#A88365", thickness: 0.027, isFilm: false },
    { color: "#7B5C44", thickness: 0.027, isFilm: false },
    { color: "#9E7A5A", thickness: 0.027, isFilm: false },
    { color: "#705039", thickness: 0.027, isFilm: false },
    { color: "#A37C58", thickness: 0.027, isFilm: false },
    { color: "#7B5C44", thickness: 0.027, isFilm: false },
    { color: "#997352", thickness: 0.027, isFilm: false }, // Core
    { color: "#7B5C44", thickness: 0.027, isFilm: false },
    { color: "#A37C58", thickness: 0.027, isFilm: false },
    { color: "#705039", thickness: 0.027, isFilm: false },
    { color: "#9E7A5A", thickness: 0.027, isFilm: false },
    { color: "#7B5C44", thickness: 0.027, isFilm: false },
    { color: "#A88365", thickness: 0.027, isFilm: false },
    { color: "#821B12", thickness: 0.015, isFilm: true },
  ]

  useFrame(({ clock }) => {
    if (!groupRef.current) return

    const p = scrollRef.current.progress
    const t = clock.getElapsedTime()

    let rotationProgress = 0
    let scale = 1.0
    let positionX = 0
    let positionY = 0

    // Phase mapping:
    // 0.22 - 0.28: Approach the flat surface
    // 0.28 - 0.34: Rotate to edge view
    // 0.34 - 0.42: Settle into isometric structure
    if (p >= 0.22 && p <= 0.28) {
      const tProgress = (p - 0.22) / 0.06
      rotationProgress = tProgress * 0.1
      scale = 0.8 + tProgress * 0.4 // approach from 0.8 to 1.2
    } else if (p > 0.28 && p <= 0.34) {
      const tProgress = (p - 0.28) / 0.06
      rotationProgress = 0.1 + tProgress * 0.6 // 0.1 to 0.7 (edge view)
      scale = 1.2 + tProgress * 0.4 // zoom into the edge (1.2 to 1.6)
    } else if (p > 0.34 && p <= 0.42) {
      const tProgress = (p - 0.34) / 0.08
      rotationProgress = 0.7 + tProgress * 0.3 // 0.7 to 1.0 (isometric)
      scale = 1.6 - tProgress * 0.6 // pull back to 1.0
    } else if (p > 0.42 && p < 1.22) {
      rotationProgress = 1
      scale = 1.0
      const progressT = Math.min((p - 0.42) / 0.04, 1)
      positionX = -progressT * 20
    }
    
    // Rotations based on rotationProgress
    let targetRotY = 0
    let targetRotX = 0
    let breathingAmount = 0
    
    if (p < 1.22) {
      if (rotationProgress <= 0.7) {
        // Flat (0) to Edge-on (0.7)
        const tP = rotationProgress / 0.7
        const easeT = tP < 0.5 ? 2 * tP * tP : 1 - Math.pow(-2 * tP + 2, 2) / 2
        targetRotY = easeT * (Math.PI * 0.48) // almost full 90 degrees
        targetRotX = easeT * 0.08 // slight tilt
      } else {
        // Edge-on (0.7) to Isometric (1.0)
        const tP = (rotationProgress - 0.7) / 0.3
        const easeT = tP < 0.5 ? 2 * tP * tP : 1 - Math.pow(-2 * tP + 2, 2) / 2
        targetRotY = (1 - easeT) * (Math.PI * 0.48) + easeT * (Math.PI * 0.15)
        targetRotX = (1 - easeT) * 0.08 + easeT * 0.4
      }
      breathingAmount = Math.max(0, Math.sin(Math.PI * (rotationProgress))) 
    } else {
      // ── CHAPTER 08 & 09 (Story Sequence) ──
      // Instant reset if it was previously off-screen
      if (groupRef.current.position.x < -3) {
        groupRef.current.position.x = 0
        groupRef.current.position.y = 0
      }
      positionX = 0
      positionY = 0
      breathingAmount = 0.5
      
      if (p <= 1.28) {
        // Phase: Enter Chapter 08 smoothly — board glides into 3D isometric position
        const t = (p - 1.22) / 0.06
        targetRotY = THREE.MathUtils.lerp(-0.4, 0.35, t)
        targetRotX = THREE.MathUtils.lerp(0.3, 0.20, t)
        scale = THREE.MathUtils.lerp(0.9, 1.20, t)
      } else if (p <= 1.32) {
        // 1.30: THE MATERIAL — Heroic 3/4 isometric angle
        const t = (p - 1.28) / 0.04
        targetRotY = THREE.MathUtils.lerp(0.35, 0.42, t)
        targetRotX = THREE.MathUtils.lerp(0.20, 0.18, t)
        scale = THREE.MathUtils.lerp(1.20, 1.25, t)
      } else if (p <= 1.34) {
        // 1.32: ZERO CORE GAP — Rotates to edge view displaying 15 tight veneer layers
        const t = (p - 1.32) / 0.02
        targetRotY = THREE.MathUtils.lerp(0.42, Math.PI * 0.46, t)
        targetRotX = THREE.MathUtils.lerp(0.18, 0.06, t)
        scale = THREE.MathUtils.lerp(1.25, 1.35, t)
      } else if (p <= 1.36) {
        // 1.34: CONSISTENT QUALITY — Dynamic perspective swing
        const t = (p - 1.34) / 0.02
        targetRotY = THREE.MathUtils.lerp(Math.PI * 0.46, -0.32, t)
        targetRotX = THREE.MathUtils.lerp(0.06, 0.22, t)
        scale = THREE.MathUtils.lerp(1.35, 1.22, t)
      } else if (p <= 1.38) {
        // 1.36: HIGH DENSIFIED — Architectural isometric tilt
        const t = (p - 1.36) / 0.02
        targetRotY = THREE.MathUtils.lerp(-0.32, 0.22, t)
        targetRotX = THREE.MathUtils.lerp(0.22, 0.28, t)
        scale = THREE.MathUtils.lerp(1.22, 1.28, t)
      } else if (p <= 1.40) {
        // 1.38: ECOLUSH PLY — Majestic hero angle
        const t = (p - 1.38) / 0.02
        targetRotY = THREE.MathUtils.lerp(0.22, -0.06, t)
        targetRotX = THREE.MathUtils.lerp(0.28, 0.12, t)
        scale = THREE.MathUtils.lerp(1.28, 1.32, t)
      } else {
        // > 1.40: Chapter 09 Final CTA — board floats gracefully below CTA button
        const t = Math.min((p - 1.40) / 0.15, 1)
        targetRotY = THREE.MathUtils.lerp(-0.06, -0.15, t)
        targetRotX = THREE.MathUtils.lerp(0.12, 0.22, t)
        scale = THREE.MathUtils.lerp(1.32, 1.18, t)
        
        const isMobile = window.innerWidth < 900
        const finalY = isMobile ? -1.5 : -0.5
        positionY = THREE.MathUtils.lerp(0, finalY, t)
      }
    }
    
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      targetRotY + Math.sin(t * 0.25) * 0.03 * breathingAmount,
      0.04
    )
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      targetRotX + Math.cos(t * 0.15) * 0.015 * breathingAmount,
      0.04
    )
    
    groupRef.current.position.y = THREE.MathUtils.lerp(
      groupRef.current.position.y,
      positionY + Math.sin(t * 0.3) * 0.04 * breathingAmount,
      0.05
    )
    groupRef.current.position.x = THREE.MathUtils.lerp(
      groupRef.current.position.x,
      positionX,
      0.05
    )
    
    const isMobile = window.innerWidth < 900
    const mobileScaleFactor = isMobile ? 0.6 : 1.0

    groupRef.current.scale.setScalar(
      THREE.MathUtils.lerp(groupRef.current.scale.x, scale * mobileScaleFactor, 0.05)
    )
  })

  // Stack layers correctly
  const totalThickness = layers.reduce((s, l) => s + l.thickness, 0)
  let currentY = -totalThickness / 2

  return (
    <group ref={groupRef}>
      {layers.map((layer, i) => {
        const y = currentY + layer.thickness / 2
        currentY += layer.thickness
        return (
          <group key={i} position={[0, y, 0]}>
            <PlywoodLayer
              index={i}
              total={layers.length}
              scrollRef={scrollRef}
              color={layer.color}
              thickness={layer.thickness}
              isFilm={layer.isFilm}
            />
          </group>
        )
      })}
    </group>
  )
}
