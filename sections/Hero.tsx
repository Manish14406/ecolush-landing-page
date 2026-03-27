"use client"

import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, useGLTF } from "@react-three/drei"
import { Suspense, useRef } from "react"
import * as THREE from "three"

function Model() {
  const { scene, animations } = useGLTF("/traveler.glb")
  const mixer = useRef<THREE.AnimationMixer | null>(null)

  if (animations?.length && !mixer.current) {
    mixer.current = new THREE.AnimationMixer(scene)
    animations.forEach((clip) => mixer.current!.clipAction(clip).play())
  }

  useFrame((_, delta) => {
    if (mixer.current) mixer.current.update(delta)
  })

  return <primitive object={scene} scale={0.5} />
}

export default function Hero() {
  return (
    <section
      style={{
        width: "100vw",
        height: "100vh",
        background: "#05070d",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* 🌌 CANVAS */}
      <Canvas
        style={{ width: "100%", height: "100%" }}
        camera={{ position: [0, 0, 10], fov: 50 }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={1.5} />
          <directionalLight position={[5, 5, 5]} intensity={1} />

          <Model />

          <OrbitControls enableZoom={false} enablePan={false} />
        </Suspense>
      </Canvas>

      {/* ✨ ESTRELAS CSS (FORÇADO INLINE SAFE) */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          backgroundImage: `
            radial-gradient(1px 1px at 20px 30px, white, transparent),
            radial-gradient(1px 1px at 200px 120px, white, transparent),
            radial-gradient(1px 1px at 400px 300px, white, transparent),
            radial-gradient(1px 1px at 600px 200px, white, transparent)
          `,
          backgroundSize: "600px 600px",
          opacity: 0.5,
          animation: "moveStars 80s linear infinite",
        }}
      />

      <style>{`
        @keyframes moveStars {
          from { transform: translateY(0px); }
          to { transform: translateY(-600px); }
        }
      `}</style>
    </section>
  )
}