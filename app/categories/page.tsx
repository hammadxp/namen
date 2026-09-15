import { CategoryCards } from "@/components/category-cards"
import categories from "@/public/data/categories.json"
import type { Category } from "@/lib/types"

export default function CategoriesPage() {
  const entries = categories as Category[]
  return (
    <main className="page-shell">
      <section className="index-heading">
        <h1>Every category</h1>
        <p>
          Seven ways into the same question: what already exists that sounds
          like a great name?
        </p>
      </section>
      <CategoryCards categories={entries} />
    </main>
  )
}
