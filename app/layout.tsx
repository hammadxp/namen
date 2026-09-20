import { Archivo_Black, DM_Sans } from "next/font/google";
import { SiteFooter } from "@/components/layout/site-footer";
import { FocusModality } from "@/components/layout/focus-modality";
import { SiteHeader } from "@/components/layout/site-header";
import { siteMetadata } from "@/config/metadata";
import dataMetadata from "@/public/data/metadata.json";
import "./globals.css";

const display = Archivo_Black({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-display",
});

const body = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body",
});

export const metadata = siteMetadata;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`} data-scroll-behavior="smooth">
      <body>
        <FocusModality />
        <SiteHeader />
        {children}
        <SiteFooter updatedAt={dataMetadata.updatedAt} />
      </body>
    </html>
  );
}
