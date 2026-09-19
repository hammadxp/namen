import { TranslationLab } from "@/components/form/translation-lab";
import { pageMetadata } from "@/config/metadata";

export const metadata = pageMetadata(
  "Translate a word",
  "Find fresh name ideas by translating a word into other languages."
);

export default function TranslatePage() {
  return (
    <main className="mx-auto max-w-[1500px] px-4 py-[clamp(3.625rem,7vw,6.5rem)] sm:px-[clamp(1.125rem,4vw,3.875rem)]">
      <TranslationLab />
    </main>
  );
}
