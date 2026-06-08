"use client"

import "./footer.css"

const stack = ["Next.js", "Three.js", "GSAP", "TypeScript", "Tailwind CSS"]

export default function Footer() {
  return (
    <footer id="footer">
      <div className="footer-inner">

        <div className="footer-body">
          <div className="footer-left">
            <p className="footer-label">Scroll Storytelling</p>
            <h2 className="footer-heading">Modern<br />Frontend<br />Patterns</h2>
          </div>

          <div className="footer-right">
            <p className="footer-description">
              A curated set of scroll-driven techniques built for the modern web.
              Each section explores a different pattern — 3D rendering with Three.js,
              frame-by-frame canvas sequences, CSS scroll timelines, and GSAP
              scroll-triggered animations.
            </p>
            <p className="footer-description">
              Built as an open experiment. No frameworks beyond the stack.
              No magic. Just the browser doing its job.
            </p>
          </div>
        </div>

        <div className="footer-rule" />

        <div className="footer-bottom">
          <div className="footer-stack">
            {stack.map((tech, i) => (
              <span key={tech}>
                {tech}{i < stack.length - 1 && <span className="footer-dot">·</span>}
              </span>
            ))}
          </div>

          <div className="footer-credits">
            <a
              href="#"
              className="footer-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub ↗
            </a>
            <span>By Decriptcypher</span>
            <span>© 2026</span>
          </div>
        </div>

      </div>
    </footer>
  )
}
