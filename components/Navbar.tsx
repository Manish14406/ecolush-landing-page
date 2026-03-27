"use client"

export default function Navbar() {

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth"
    })
  }

  return (
    <nav className="navbar">

      <button onClick={() => scrollTo("hero")}>Hero</button>
      <button onClick={() => scrollTo("text")}>Text</button>
      <button onClick={() => scrollTo("rotate")}>Rotate</button>
      <button onClick={() => scrollTo("mask")}>Mask</button>
      <button onClick={() => scrollTo("experience")}>Experience</button>
      <button onClick={() => scrollTo("footer")}>Footer</button>
      

    </nav>
  )
} 