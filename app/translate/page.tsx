import { TranslationLab } from "@/components/form/translation-lab";
import { pageMetadata } from "@/config/metadata";

export const metadata = pageMetadata(
  "Translate a word",
  "Find fresh name ideas by translating a word into other languages."
);

export default function TranslatePage() {
  return (
    <main className="page-shell">
      <TranslationLab />
    </main>
  );
}
