import Link from 'next/link'
import { mockPosts } from '@/data/posts'

// Extrair categorias únicas dos posts
const categories = Array.from(
  new Set(mockPosts.flatMap((post) => post.categories))
).sort((a, b) => a.name.localeCompare(b.name))

export default function CategoriesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <section className="space-y-6">
        <h1 className="text-4xl font-bold tracking-tight">Categorias</h1>
        <p className="text-xl text-muted-foreground">
          Explore nossos posts por categoria
        </p>
      </section>

      <section className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => {
          const postsInCategory = mockPosts.filter((post) =>
            post.categories.some((c) => c.slug === category.slug)
          )

          return (
            <Link
              key={category.slug}
              href={`/categories/${category.slug}`}
              className="group relative overflow-hidden rounded-lg border bg-card p-6 transition-colors hover:bg-accent"
            >
              <div className="space-y-2">
                <h2 className="text-2xl font-semibold">{category.name}</h2>
                <p className="text-sm text-muted-foreground">
                  {postsInCategory.length} post
                  {postsInCategory.length === 1 ? '' : 's'}
                </p>
              </div>
            </Link>
          )
        })}
      </section>
    </div>
  )
} 