"use client"

import { useEffect, useRef } from "react"
import "./experience.css"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

export default function Experience() {
  const sectionRef = useRef<HTMLDivElement | null>(null)
  const bgRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!sectionRef.current || !bgRef.current) return

    gsap.registerPlugin(ScrollTrigger)

    const ctx = gsap.context(() => {

      // 🔹 carregar SVG
      const loadSVG = async () => {
        const res = await fetch("/city.svg")
        const svg = await res.text()

        if (bgRef.current) {
          bgRef.current.innerHTML = svg

          const svgEl = bgRef.current.querySelector("svg")
          if (svgEl) {
            svgEl.setAttribute("preserveAspectRatio", "xMidYMid slice")
          }

          setAnimation()
        }
      }

      const setAnimation = () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "+=1000",
            scrub: true,
            pin: true,
          },
        })

        // 🔹 zoom + fade cidade inteira
        tl.add([
          gsap.to("#bg_city svg", {
            scale: 1.5,
            duration: 2,
          }),
          gsap.to("#full_city", {
            opacity: 0,
            duration: 2,
          }),
        ])

          // 🔹 desmontando exterior
          .add([
            gsap.to("#building_top", {
              y: -200,
              opacity: 0,
              duration: 2,
            }),
            gsap.to("#wall_side", {
              x: -200,
              opacity: 0,
              duration: 2,
            }),
            gsap.to("#wall_front", {
              x: 200,
              y: 200,
              opacity: 0,
              duration: 2,
            }),
          ])

          // 🔹 desmontando interior
          .add([
            gsap.to("#interior_wall_side", {
              x: -200,
              opacity: 0,
              duration: 2,
            }),
            gsap.to("#interior_wall_top", {
              y: -200,
              opacity: 0,
              duration: 2,
            }),
            gsap.to("#interior_wall_side_2", {
              opacity: 0,
              duration: 2,
            }),
            gsap.to("#interior_wall_front", {
              opacity: 0,
              duration: 2,
            }),
          ])
      }

      loadSVG()
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section id="experience" ref={sectionRef}>
      <div id="bg_city" ref={bgRef} />
    </section>
  )
}