import "./text.css";

export default function Text() {
  return (
    <main id="text" className="animations-page">
    
      <header>
        <img src="/images/5.png" alt="" />
        <img src="/images/6.png" alt="" />
      </header>

      <section className="banner">
        <div className="content">

          <h1 className="left">CSS ONLY</h1>

          <div className="right">
            <h2>SCROLL</h2>
            <p>Driven by CSS</p>
            <p>
              No JavaScript. No libraries. Just the browser
              <br />
              and a scroll position.
            </p>
          </div>


        </div>
      </section>

      <section className="grid grid-1">

        <figure>
          <img src="/images/sich.png" alt="" />
        </figure>

        <figure>
          <img src="/images/3.png" alt="" className="autoRotate" />
        </figure>

        <h2 className="autoShow">Animate</h2>

      </section>

      <section className="grid grid-2">

        <div className="autoShow">
          <figure>
            <img src="/images/Prisma_3.png" alt="" className="autoRotate" />
          </figure>

          <p>
            Elements reveal, rotate and fade — all driven
            by scroll position alone.
          </p>
        </div>

        <div className="autoShow">
          animation-timeline: view() — no polyfill, no dependencies.
        </div>

        <div className="autoShow">
          <figure>
            <img src="/images/Prisma_1.png" alt="" className="autoRotate" />
          </figure>

          <p>
            Scale, blur, opacity — all CSS, all scroll-driven.
          </p>
        </div>

        <div className="autoShow">
          <figure>
            <img src="/images/Prisma_4.png" alt="" className="autoRotate" />
          </figure>
        </div>

      </section>

      <section className="grid grid-3">

        <div className="autoBLur">SCROLL</div>
        <div className="autoBLur">ANIMATE</div>
        <div className="autoBLur">REVEAL</div>
        <div className="autoBLur">CSS ONLY</div>
        <div className="autoBLur">NO JS ↗</div>

      </section>

    </main>
  );
}