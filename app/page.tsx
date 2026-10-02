"use client"

import { useState, useEffect } from "react"
import Navbar from "@/components/Navbar"
import ScrollProgress from "@/components/ScrollProgress"
import Preloader from "@/components/Preloader"
import WhatsAppButton from "@/components/WhatsAppButton"

import CinematicJourney from "@/sections/cinematic/CinematicJourney"
import Contact from "@/sections/contact/Contact"

import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

export default function Page() {
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    if (isReady) {
      // Small delay to ensure CSS updates have painted before measuring
      setTimeout(() => {
        ScrollTrigger.refresh()
      }, 100)
    }
  }, [isReady])

  return (
    <>
      {!isReady && <Preloader onReady={() => setIsReady(true)} />}

      <div style={{ visibility: isReady ? "visible" : "hidden", height: isReady ? "auto" : "100vh", overflow: isReady ? "visible" : "hidden" }}>
        {/* Fixed UI elements */}
        <Navbar />
        <ScrollProgress />
        <WhatsAppButton />

        <main id="main-content" style={{ position: "relative" }}>
          {/* CHAPTERS 01-09: One Continuous Cinematic Prototype */}
          <CinematicJourney />

          {/* CHAPTER 10: Contact */}
          <Contact />
        </main>
      </div>
    </>
  )
}