import type { Metadata } from "next"
import { Archivo_Black, DM_Sans } from "next/font/google"
import "./globals.css"

const display = Archivo_Black({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-display",
})

const body = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body",
})

export const metadata: Metadata = {
  title: "Coolname | Names hiding in plain sight",
  description: "Find memorable name ideas in cities from around the world.",
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body>{children}</body>
    </html>
  )
}
