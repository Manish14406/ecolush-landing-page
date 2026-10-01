"use client"

import { useEffect, useRef } from "react"

export default function ScrollProgress() {
  const fillRef = useRef<HTMLDivElement>(null)
  const chaptersRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      if (!fillRef.current) return
      const scrolled = window.scrollY
      const total = document.documentElement.scrollHeight - window.innerHeight
      const pct = total > 0 ? (scrolled / total) * 100 : 0
      fillRef.current.style.height = `${pct}%`
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div id="scroll-progress-bar" aria-hidden="true">
      <div id="scroll-progress-fill" ref={fillRef} />
    </div>
  )
}
