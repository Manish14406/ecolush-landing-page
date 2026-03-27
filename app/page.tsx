import Navbar from "@/components/Navbar"

import Hero from "@/sections/Hero"
import Text from "@/sections/text/Text"
import Rotate from "@/sections/rotate/Rotate"
import Mask from "@/sections/mask/Mask"
import Experience from "@/sections/experience/Experience"
import Footer from "@/sections/footer/Footer"


export default function Page(){
  return(
    <>
      <Navbar/>

      <Hero/>
      <Text/>
      <Rotate/>
      <Mask/>
      <Experience />
      <Footer />

    </>
  )
}