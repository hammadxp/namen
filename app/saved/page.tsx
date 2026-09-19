import { SavedBrowser } from "./_components/saved-browser";
import { pageMetadata } from "@/config/metadata";

export const metadata = pageMetadata("Saved names", "Review the names saved in this browser.");

export default function SavedPage() {
  return (
    <main className="page-shell">
      <section className="page-heading saved-heading">
        <div>
          <p>Your shortlist</p>
          <h1>Saved names</h1>
        </div>
        <p>Keep the names that deserve another look in one local collection.</p>
      </section>
      <SavedBrowser />
    </main>
  );
}
