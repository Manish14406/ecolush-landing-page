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
            <h2>LUNDEV</h2>
            <p>Web Design</p>
            <p>
              Don't forget to subscribe to the channel to continuously
              <br />
              update interesting videos
            </p>
          </div>

          <div className="image">
            <img src="/images/mouth.png" alt="" />
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

        <h2 className="autoShow">Introduce</h2>

      </section>

      <section className="grid grid-2">

        <div className="autoShow">
          <figure>
            <img src="/images/6.png" alt="" />
          </figure>

          <p>
            When an unknown printer took a galley of type and scrambled it to
            make a type specimen.
          </p>
        </div>

        <div className="autoShow">
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry.
        </div>

        <div className="autoShow">
          <figure>
            <img src="/images/2.png" alt="" />
          </figure>

          <p>
            When an unknown printer took a galley of type.
          </p>
        </div>

        <div className="autoShow">
          <figure>
            <img src="/images/candy.png" alt="" />
          </figure>
        </div>

      </section>

      <section className="grid grid-3">

        <div className="autoBLur">LUNDEV</div>
        <div className="autoBLur">DESIGNER</div>
        <div className="autoBLur">DEVELOPER</div>
        <div className="autoBLur">SUBCRIBE +</div>
        <div className="autoBLur">SEE MORE ↗</div>

      </section>

    </main>
  );
}