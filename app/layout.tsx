import "./globals.css"

export const metadata = {
  title: "Scroll Storytelling",
  description: "Experimentos com scroll",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  )
}