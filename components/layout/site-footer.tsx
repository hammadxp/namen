import Link from "next/link";

export function SiteFooter({ updatedAt }: { updatedAt: string }) {
  const formatted = new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
  }).format(new Date(updatedAt));
  return (
    <footer className="site-footer">
      <div className="footer-ribbon" aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
        <span />
      </div>
      <div>
        <Link className="footer-mark" href="/">
          cool<span>name</span>
        </Link>
        <p>Built for names that feel found, not generated.</p>
      </div>
      <nav aria-label="Footer navigation">
        <Link href="/categories">Categories</Link>
        <Link href="/countries">Countries</Link>
        <Link href="/translate">Translate</Link>
        <Link href="/saved">Saved</Link>
      </nav>
      <p className="updated-at">Local data updated {formatted}</p>
    </footer>
  );
}
