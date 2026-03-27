"use client"

import { useEffect, useRef } from "react"
import "./rotate.css"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

export default function Rotate() {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    if (!containerRef.current || !canvasRef.current) return

    gsap.registerPlugin(ScrollTrigger)

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")!

    let images: HTMLImageElement[] = []
    let currentFrame = 0
    let targetFrame = 0
    let rafId: number

    // 🎯 resize canvas (isolado por section)
    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resize()
    window.addEventListener("resize", resize)

    // 🚀 preload frames (SEGURADO dentro da section)
    const frameCount = 48 // seus 2s @ 24fps

    for (let i = 1; i <= frameCount; i++) {
      const img = new Image()
      img.src = `/frames/frame_${String(i).padStart(4, "0")}.jpg`
      images.push(img)
    }

    // 🎬 render loop isolado
    const render = () => {
      currentFrame += (targetFrame - currentFrame) * 0.15

      const frame = images[Math.floor(currentFrame)]

      if (frame && frame.complete) {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.drawImage(frame, 0, 0, canvas.width, canvas.height)
      }

      rafId = requestAnimationFrame(render)
    }

    render()

    // 📜 scroll control isolado (NÃO global)
    ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top top",
      end: "+=2000",
      scrub: true,
      pin: true,

      onUpdate: (self) => {
        targetFrame = self.progress * (frameCount - 1)
      },
    })

    return () => {
      window.removeEventListener("resize", resize)
      cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <section id="rotate" ref={containerRef}>
      <canvas ref={canvasRef} className="canvas" />
    </section>
  )
}