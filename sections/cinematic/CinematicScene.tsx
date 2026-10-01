"use client"

import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { Environment, ContactShadows } from "@react-three/drei"
import * as THREE from "three"

import PlywoodModel from "../hero/PlywoodModel"
import ExplodedPlywood from "../layers/ExplodedPlywood"

export default function CinematicScene({ scrollRef }: { scrollRef: React.MutableRefObject<{ progress: number }> }) {
  const plywoodGroup = useRef<THREE.Group>(null)
  const explodedGroup = useRef<THREE.Group>(null)

  useFrame(() => {
    const p = scrollRef.current.progress

    if (p <= 0.12) {
      // Ch 01: Hero plywood model visible
      if (plywoodGroup.current) plywoodGroup.current.visible = true
      if (explodedGroup.current) explodedGroup.current.visible = false
    } else if (p > 0.12 && p < 0.22) {
      // Ch 02: Macro shot — both 3D hidden
      if (plywoodGroup.current) plywoodGroup.current.visible = false
      if (explodedGroup.current) explodedGroup.current.visible = false
    } else if (p >= 0.22 && p <= 0.48) {
      // Ch 03: Exploded plywood sequence
      if (plywoodGroup.current) plywoodGroup.current.visible = false
      if (explodedGroup.current) explodedGroup.current.visible = true
    } else if (p > 0.48 && p < 1.22) {
      // Ch 04–07: Products / Specs / Applications — 3D canvas hidden
      if (plywoodGroup.current) plywoodGroup.current.visible = false
      if (explodedGroup.current) explodedGroup.current.visible = false
    } else if (p >= 1.22) {
      // Ch 08–09: Story sequence + Final CTA — board returns
      if (plywoodGroup.current) plywoodGroup.current.visible = false
      if (explodedGroup.current) explodedGroup.current.visible = true
    }
  })

  return (
    <>
      <ambientLight intensity={0.4} color="#e8d5c0" />
      <directionalLight position={[5, 8, 5]} intensity={2.5} color="#fff8f0" castShadow />
      <directionalLight position={[-4, 2, -2]} intensity={0.5} color="#C8281A" />
      <pointLight position={[0, -3, 3]} intensity={0.6} color="#8B6343" />
      <Environment preset="warehouse" />
      <ContactShadows position={[0, -3.5, 0]} opacity={0.5} scale={16} blur={3} far={6} />
      <group ref={plywoodGroup}><PlywoodModel scrollRef={scrollRef} /></group>
      <group ref={explodedGroup} visible={false}>
        <ExplodedPlywood scrollRef={scrollRef} />
      </group>
    </>
  )
}
