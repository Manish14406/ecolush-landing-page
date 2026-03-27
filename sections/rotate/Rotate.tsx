"use client"

import { useEffect, useRef } from "react"
import "./rotate.css"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

export default function Rotate() {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)

  useEffect(() => {
    if (!containerRef.current || !videoRef.current) return

    gsap.registerPlugin(ScrollTrigger)

    const video = videoRef.current

    // evita bug de iOS / autoplay
    const initVideo = () => {
      video.play().then(() => {
        video.pause()
      }).catch(() => {})
    }

    initVideo()

    const proxy = { time: 0 }

    video.onloadedmetadata = () => {
      const duration = video.duration * 0.8 // corta os últimos 40%

      gsap.to(proxy, {
        time: duration,
        ease: "none", // ESSENCIAL pra não pular frame
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=4000", // mais scroll = mais suavidade
          scrub: 1.5,
          pin: true,
        },
        onUpdate: () => {
          if (video.readyState >= 2) {
            video.currentTime = proxy.time
          }
        },
      })
    }

  }, [])

  return (
    <section id="rotate" ref={containerRef}>
      <video
        ref={videoRef}
        className="video"
        src="/slow_smooth_light.mp4" // 🔥 seu vídeo novo
        muted
        playsInline
        preload="auto"
      />
    </section>
  )
}