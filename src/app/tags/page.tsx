import Link from 'next/link'
import { mockPosts } from '@/data/posts'

// Extrair tags únicas dos posts
const tags = Array.from(new Set(mockPosts.flatMap((post) => post.tags))).sort(
  (a, b) => a.name.localeCompare(b.name)
)

export default function TagsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <section className="space-y-6">
        <h1 className="text-4xl font-bold tracking-tight">Tags</h1>
        <p className="text-xl text-muted-foreground">
          Explore nossos posts por tag
        </p>
      </section>

      <section className="mt-16">
        <div className="flex flex-wrap gap-4">
          {tags.map((tag) => {
            const postsWithTag = mockPosts.filter((post) =>
              post.tags.some((t) => t.slug === tag.slug)
            )

            return (
              <Link
                key={tag.slug}
                href={`/tags/${tag.slug}`}
                className="group relative overflow-hidden rounded-full border bg-card px-6 py-3 transition-colors hover:bg-accent"
              >
                <div className="flex items-center gap-2">
                  <span className="font-medium">{tag.name}</span>
                  <span className="text-sm text-muted-foreground">
                    ({postsWithTag.length})
                  </span>
                </div>
              </Link>
            )
          })}
        </div>
      </section>
    </div>
  )
} 