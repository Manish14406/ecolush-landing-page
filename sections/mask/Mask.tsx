"use client"

import { useEffect } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import "./mask.css"

gsap.registerPlugin(ScrollTrigger)

export default function Mask() {

useEffect(() => {

const tl = gsap.timeline({
scrollTrigger: {
trigger: "#art",
start: "top top",
end: "bottom center",
scrub: 1.5,
pin: true
}
})

tl
.to(".will-fade", {
opacity: 0,
stagger: 0.2,
ease: "power1.inOut"
})

.to(".masked-img", {
scale: 1.3,
maskPosition: "center",
maskSize: "400%",
duration: 1,
ease: "power1.inOut"
})

.to("#masked-content", {
opacity: 1,
duration: 1
})

}, [])

return (

<section id="art">

<div className="art-container">

<h2 className="art-title will-fade">The ART</h2>

<div className="art-content">

<ul className="art-list will-fade">

<li>
<img src="/images/check.png" alt="check"/>
<p>Crafted with premium ingredients</p>
</li>

<li>
<img src="/images/check.png" alt="check"/>
<p>Balanced flavors</p>
</li>

<li>
<img src="/images/check.png" alt="check"/>
<p>Signature mixology</p>
</li>

</ul>

<div className="cocktail-img">

<img
src="/images/under-img.jpg"
alt="cocktail"
className="masked-img"
/>

</div>

<ul className="art-list will-fade">

<li>
<img src="/images/check.png" alt="check"/>
<p>Bold and smooth taste</p>
</li>

<li>
<img src="/images/check.png" alt="check"/>
<p>Perfect for special moments</p>
</li>

<li>
<img src="/images/check.png" alt="check"/>
<p>Handcrafted presentation</p>
</li>

</ul>

</div>

<div className="masked-container">

<h2 className="will-fade">Sip-Worthy Perfection</h2>

<div id="masked-content">

<h3>Made with Craft, Poured with Passion</h3>

<p>
This isn’t just a drink. It’s a carefully crafted moment made just for you.
</p>

</div>

</div>

</div>

</section>

)

}