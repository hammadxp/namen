import Link from "next/link"
import { Bookmark } from "lucide-react"

const links = [
  ["Categories", "/categories"],
  ["Cities", "/categories/cities"],
  ["Countries", "/countries"],
  ["Translate", "/translate"],
]

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="header-inner">
        <Link className="wordmark" href="/" aria-label="Coolname home">
          cool<span>name</span>
        </Link>
        <p className="header-thesis">
          <span /> Names hiding in plain sight.
        </p>
        <nav aria-label="Primary navigation">
          {links.map(([label, href]) => (
            <Link href={href} key={href}>
              {label}
            </Link>
          ))}
          <Link className="saved-link" href="/saved">
            <Bookmark size={15} /> Saved
          </Link>
        </nav>
      </div>
    </header>
  )
}
