"use client"

import { useEffect, useState } from "react"
import "./whatsapp-button.css"

export default function WhatsAppButton() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // Pop in 2s after page load — after the hero animation has played
    const t = setTimeout(() => setVisible(true), 2000)
    return () => clearTimeout(t)
  }, [])

  return (
    <a
      href="https://wa.me/919740355657?text=Hi%2C%20I%20am%20interested%20in%20Ecolush%20Ply%20products."
      target="_blank"
      rel="noopener noreferrer"
      className={"wa-btn" + (visible ? " wa-btn--visible" : "")}
      aria-label="Chat with us on WhatsApp"
      title="Chat on WhatsApp"
    >
      <svg
        className="wa-btn__icon"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 32 32"
        fill="none"
        aria-hidden="true"
      >
        <circle cx="16" cy="16" r="16" fill="#25D366" />
        <path
          d="M22.6 9.4A9.2 9.2 0 0 0 7.1 20.5L6 26l5.7-1.5A9.2 9.2 0 0 0 22.6 9.4zm-6.6 14.1a7.6 7.6 0 0 1-3.9-1.1l-.28-.17-2.89.76.77-2.82-.18-.29a7.65 7.65 0 1 1 6.5 3.63zm4.2-5.7c-.23-.12-1.37-.68-1.58-.75-.21-.08-.37-.12-.52.12s-.6.75-.74.9c-.13.16-.27.18-.5.06a6.3 6.3 0 0 1-1.85-1.14 6.9 6.9 0 0 1-1.28-1.6c-.13-.23 0-.35.1-.47l.36-.42c.1-.12.13-.21.2-.35.06-.14.03-.26-.02-.37-.05-.12-.52-1.25-.71-1.71-.19-.45-.38-.39-.52-.4h-.44c-.16 0-.4.06-.61.29s-.8.78-.8 1.9.82 2.2.93 2.35c.12.16 1.61 2.46 3.9 3.45.55.23.97.37 1.3.48.55.17 1.05.15 1.44.09.44-.07 1.37-.56 1.56-1.1.2-.54.2-1 .14-1.1-.06-.1-.22-.16-.45-.28z"
          fill="white"
        />
      </svg>
      <span className="wa-btn__label">Chat with us</span>
      <span className="wa-btn__pulse" aria-hidden="true" />
    </a>
  )
}
