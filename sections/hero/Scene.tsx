"use client"

import { Canvas } from "@react-three/fiber"
import Model from "./Model"

export default function Scene({ scroll }: { scroll: number }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 15], fov: 50 }}
      style={{ width: "100%", height: "100vh" }}
    >
      <ambientLight intensity={1} />
      <directionalLight position={[2, 2, 2]} />

      <Model scroll={scroll} />
    </Canvas>
  )
}