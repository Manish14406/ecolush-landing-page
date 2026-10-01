"use client"

import { useEffect, useState } from "react"
import "./preloader.css"

const CRITICAL_ASSETS = [
  "/ecolush/backgrounds/hero.jpg",
  "/ecolush/backgrounds/engineering.jpg",
  "/ecolush/backgrounds/warehouse.jpg",
  "/ecolush/backgrounds/blueprint.jpg",
  "/ecolush/backgrounds/brand-stacked.jpg",
  "/ecolush/layer-macro.jpg",
  "/ecolush/hero-product.jpg",
  "/ecolush/construction.jpg",
]

export default function Preloader({ onReady }: { onReady: () => void }) {
  const [loaded, setLoaded] = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    // Lock scroll immediately
    document.body.style.overflow = "hidden"

    let loadedCount = 0
    const totalAssets = CRITICAL_ASSETS.length

    const updateProgress = () => {
      loadedCount++
      setProgress(Math.round((loadedCount / totalAssets) * 100))
      
      if (loadedCount === totalAssets) {
        // Give a tiny delay for smoothness, then wait for fonts
        setTimeout(() => {
          document.fonts.ready.then(() => {
            setLoaded(true)
            document.body.style.overflow = ""
            // Call onReady after transition out
            setTimeout(onReady, 800)
          })
        }, 400)
      }
    }

    // Preload images
    CRITICAL_ASSETS.forEach(src => {
      const img = new Image()
      img.onload = updateProgress
      img.onerror = updateProgress // Don't block on failure
      img.src = src
    })

    // Fallback if images hang indefinitely
    const fallbackTimer = setTimeout(() => {
      if (!loaded) {
        document.fonts.ready.then(() => {
          setLoaded(true)
          document.body.style.overflow = ""
          setTimeout(onReady, 800)
        })
      }
    }, 8000)

    return () => {
      clearTimeout(fallbackTimer)
      document.body.style.overflow = ""
    }
  }, [loaded, onReady])

  return (
    <div className={`ecolush-preloader ${loaded ? "fade-out" : ""}`} role="status" aria-live="polite">
      <div className="preloader-content">
        <h1 className="preloader-brand">ECOLUSH PLY</h1>
        <p className="preloader-sub">HIGH &mdash; DENSIFIED</p>
        
        <div className="preloader-divider" />
        
        <p className="preloader-status">
          LOADING CINEMATIC EXPERIENCE
        </p>
        
        <div className="preloader-progress-bar">
          <div className="preloader-progress-fill" style={{ width: `${progress}%` }} />
        </div>
        
        <p className="preloader-footer">
          SHUTTERING PLYWOOD AND PHENOLIC SHEETS
        </p>
      </div>
    </div>
  )
}
