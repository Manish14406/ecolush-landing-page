"use client"

import { useGLTF, useAnimations } from "@react-three/drei"
import { useRef, useEffect } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"

export default function Model({ scroll }: { scroll: number }) {
  const group = useRef<THREE.Group>(null)

  const { scene, animations } = useGLTF("/skull.glb")
  const { actions } = useAnimations(animations, group)

  const actionRef = useRef<THREE.AnimationAction | null>(null)

  // 🎬 inicializa (igual seu código antigo)
  useEffect(() => {
    const action = actions?.[Object.keys(actions)[0]]

    if (action) {
      action.play()
      action.paused = true
      actionRef.current = action
    }

    scene.scale.set(0.3, 0.3, 0.3)
    scene.position.y = -1

  }, [actions, scene])

  // 🔥 AQUI ESTÁ A CORREÇÃO REAL
  useFrame(() => {
    if (!actionRef.current || !group.current) return

    const duration = actionRef.current.getClip().duration

    // controla animação
    actionRef.current.time = duration * scroll

    // rotação
    group.current.rotation.y = scroll * Math.PI * 0.3
  })

  return (
    <group ref={group}>
      <primitive object={scene} />
    </group>
  )
}