import type { Metadata } from "next"
import { Archivo_Black, DM_Sans } from "next/font/google"
import { FocusMode } from "@/components/focus-mode"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import dataMetadata from "@/public/data/metadata.json"
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
  title: "Coolname | A colorful collection of names",
  description:
    "Search memorable names found in cities, colors, fruit, science, elements, and stars.",
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body>
        <FocusMode />
        <SiteHeader />
        {children}
        <SiteFooter updatedAt={dataMetadata.updatedAt} />
      </body>
    </html>
  )
}
