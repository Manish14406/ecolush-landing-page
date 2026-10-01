import "./globals.css"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Ecolush Ply — High-Densified Shuttering Plywood & Phenolic Sheets",
  description: "Ecolush Ply manufactures premium high-densified shuttering plywood and phenolic sheets for demanding construction applications. Consistent quality, eco-friendly, timely delivery.",
  keywords: "shuttering plywood, phenolic sheets, film-faced plywood, high-density plywood, formwork plywood, construction plywood",
  openGraph: {
    title: "Ecolush Ply — High-Densified Shuttering Plywood & Phenolic Sheets",
    description: "Premium shuttering plywood and phenolic sheets for demanding construction. Built for consistent performance.",
    type: "website",
  },
}

export const viewport = {
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        {/* Preloads for cinematic application images removed to improve FCP. Images will load progressively. */}
      </head>
      <body>
        {children}
      </body>
    </html>
  )
}