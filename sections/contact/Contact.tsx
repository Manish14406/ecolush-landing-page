"use client"

import { useState } from "react"
import "./contact.css"

export default function Contact() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus("loading")

    const formData = new FormData(e.currentTarget)
    const name = formData.get("name")
    const contact = formData.get("contact")
    const message = formData.get("message")

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, contact, message }),
      })

      if (!res.ok) throw new Error("Failed to submit")
      
      setStatus("success")
      ;(e.target as HTMLFormElement).reset()
      setTimeout(() => setStatus("idle"), 5000)
    } catch (err) {
      console.error(err)
      setStatus("error")
      setTimeout(() => setStatus("idle"), 3000)
    }
  }

  return (
    <footer
      id="contact"
      className="contact-section"
      role="contentinfo"
      aria-labelledby="contact-heading"
    >
      <div className="contact-inner">
        {/* Top rule */}
        <div className="contact-rule" aria-hidden="true" />

        <div className="contact-body">
          {/* Left - Enquiry Form */}
          <div className="contact-left">
            <div className="contact-brand">
              <span className="contact-brand-name">ECOLUSH</span>
              <span className="contact-brand-sub">PLY</span>
            </div>
            <p className="contact-brand-desc" style={{ marginBottom: "20px" }}>
              HIGH-DENSIFIED SHUTTERING PLYWOOD
              <br />
              &amp; PHENOLIC SHEETS
            </p>

            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name" className="form-label">Name</label>
                <input type="text" id="name" name="name" className="form-input" required disabled={status === "loading"} />
              </div>
              <div className="form-group">
                <label htmlFor="contact" className="form-label">Phone / Email</label>
                <input type="text" id="contact" name="contact" className="form-input" required disabled={status === "loading"} />
              </div>
              <div className="form-group">
                <label htmlFor="message" className="form-label">Message</label>
                <textarea id="message" name="message" className="form-textarea" required disabled={status === "loading"}></textarea>
              </div>
              <button type="submit" className="form-submit" disabled={status === "loading" || status === "success"}>
                {status === "loading" ? "SENDING..." : status === "success" ? "MESSAGE SENT" : status === "error" ? "ERROR - TRY AGAIN" : "ENQUIRE NOW"}
              </button>
            </form>
          </div>

          {/* Nav columns */}
          <div className="contact-nav">
            <div className="contact-nav-col">
              <h3 className="contact-nav-heading">Products</h3>
              <ul role="list">
                <li>Shuttering Plywood</li>
                <li>Phenolic Sheets</li>
                <li>High-Density Ply</li>
              </ul>
            </div>

            <div className="contact-nav-col">
              <h3 className="contact-nav-heading">Applications</h3>
              <ul role="list">
                <li>Formwork</li>
                <li>Concrete Shuttering</li>
                <li>Floor Slabs</li>
                <li>Columns &amp; Beams</li>
                <li>Infrastructure</li>
              </ul>
            </div>

            <div className="contact-nav-col">
              <h3 className="contact-nav-heading">Information</h3>
              <ul role="list">
                <li>Specifications</li>
                <li>About Ecolush</li>
                <li>Quality Commitment</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="contact-rule" aria-hidden="true" />
        <div className="contact-bottom">
          <span className="contact-values">
            Eco Friendly · Consistent Quality · Timely Delivery · Transparent Service · Customer Satisfaction
          </span>
          <span className="contact-copy">© 2024 Ecolush Ply. All rights reserved.</span>
        </div>
      </div>
    </footer>
  )
}
