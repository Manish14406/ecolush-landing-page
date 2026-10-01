"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import "./navbar.css"

gsap.registerPlugin(ScrollTrigger)

const navLinks = [
  { label: "Products", href: "#products" },
  { label: "Applications", href: "#applications" },
  { label: "Specifications", href: "#specifications" },
  { label: "About", href: "#story" },
]

export default function Navbar() {
  const navRef = useRef<HTMLElement>(null)
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  const scrollTo = useCallback((href: string) => {
    const el = document.querySelector(href)
    if (el) {
      el.scrollIntoView({ behavior: "smooth" })
    }
    setMenuOpen(false)
  }, [])

  // Close menu on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && menuOpen) {
        setMenuOpen(false)
      }
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [menuOpen])

  // Body scroll lock when menu open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => { document.body.style.overflow = "" }
  }, [menuOpen])

  // Scroll detection with throttling
  useEffect(() => {
    let ticking = false
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrolled(window.scrollY > 80)
          ticking = false
        })
        ticking = true
      }
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <>
      <a href="#main-content" className="skip-link">Skip to main content</a>
      
      <nav
        ref={navRef}
        className={`ecolush-nav ${scrolled ? "ecolush-nav--scrolled" : ""}`}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="ecolush-nav__inner">
          <button
            className="ecolush-nav__logo"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            aria-label="Ecolush Ply — Back to top"
          >
            <span className="ecolush-nav__logo-text">ECOLUSH</span>
            <span className="ecolush-nav__logo-sub">PLY</span>
          </button>

          <ul className="ecolush-nav__links" role="list">
            {navLinks.map((link) => (
              <li key={link.label}>
                <button
                  className="ecolush-nav__link"
                  onClick={() => scrollTo(link.href)}
                >
                  {link.label}
                </button>
              </li>
            ))}
          </ul>

          <button
            className="ecolush-nav__cta"
            onClick={() => scrollTo("#contact")}
          >
            <span>Enquire Now</span>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path d="M1 11L11 1M11 1H4M11 1V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>

          <button
            className={`ecolush-nav__hamburger ${menuOpen ? "open" : ""}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
          >
            <span aria-hidden="true" />
            <span aria-hidden="true" />
            <span aria-hidden="true" />
          </button>
        </div>
      </nav>

      <div 
        id="mobile-menu"
        className={`ecolush-mobile-menu ${menuOpen ? "open" : ""}`} 
        aria-hidden={!menuOpen}
        role="dialog"
        aria-modal={menuOpen}
        aria-label="Navigation menu"
      >
        <div className="ecolush-mobile-menu__inner">
          <ul role="list">
            {navLinks.map((link) => (
              <li key={link.label}>
                <button onClick={() => scrollTo(link.href)}>
                  {link.label}
                </button>
              </li>
            ))}
            <li>
              <button
                className="ecolush-mobile-cta"
                onClick={() => scrollTo("#contact")}
              >
                Enquire Now →
              </button>
            </li>
          </ul>
        </div>
      </div>
    </>
  )
}