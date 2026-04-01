"use client"

import { useRef, useState, useEffect } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import Scene from "./Scene"
import "./hero.css"

gsap.registerPlugin(ScrollTrigger)

export default function Hero() {
  const container = useRef<HTMLDivElement>(null)
  const [scroll, setScroll] = useState(0)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const trigger = ScrollTrigger.create({
        trigger: container.current,
        start: "top top",
        end: "+=2000", // controla duração do scroll
        scrub: true,
        pin: true, // fixa o hero
        anticipatePin: 1,
        onUpdate: (self) => {
          setScroll(self.progress)
        },
      })

      return () => trigger.kill()
    }, container)

    return () => ctx.revert()
  }, [])

  return (
    <section id="hero" ref={container} className="hero h-screen">
      <Scene scroll={scroll} />
    </section>
  )
}