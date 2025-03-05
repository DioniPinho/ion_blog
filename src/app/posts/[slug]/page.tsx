import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { mockPosts } from '@/data/posts'

interface PostPageProps {
  params: {
    slug: string
  }
}

export default async function PostPage({ params }: PostPageProps) {
  const post = mockPosts.find((post) => post.slug === params.slug)

  if (!post) {
    notFound()
  }

  return (
    <article className="container mx-auto px-4 py-8">
      {/* Header */}
      <header className="mb-8 space-y-4">
        <div className="flex items-center gap-2">
          {post.categories.map((category) => (
            <Link
              key={category.slug}
              href={`/categories/${category.slug}`}
              className="text-sm text-muted-foreground hover:text-primary"
            >
              {category.name}
            </Link>
          ))}
        </div>
        <h1 className="text-4xl font-bold tracking-tight">{post.title}</h1>
        <p className="text-xl text-muted-foreground">{post.excerpt}</p>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Image
              src={post.author.avatar}
              alt={post.author.name}
              width={40}
              height={40}
              className="rounded-full"
            />
            <span className="text-sm text-muted-foreground">
              {post.author.name}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>{post.readingTime}</span>
            <span>•</span>
            <time dateTime={post.publishDate}>
              {new Date(post.publishDate).toLocaleDateString('pt-BR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </time>
          </div>
        </div>
      </header>

      {/* Cover Image */}
      <div className="relative mb-8 aspect-video overflow-hidden rounded-lg">
        <Image
          src={post.coverImage}
          alt={post.title}
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Content */}
      <div className="prose prose-lg mx-auto max-w-4xl">
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
          tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
          veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
          commodo consequat.
        </p>

        <h2>Subtítulo do Post</h2>

        <p>
          Duis aute irure dolor in reprehenderit in voluptate velit esse cillum
          dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
          proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
        </p>

        <pre>
          <code className="language-typescript">
            {`function exemplo() {
  console.log('Hello, World!')
}`}
          </code>
        </pre>

        <p>
          Sed ut perspiciatis unde omnis iste natus error sit voluptatem
          accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab
          illo inventore veritatis et quasi architecto beatae vitae dicta sunt
          explicabo.
        </p>
      </div>

      {/* Tags */}
      <div className="mx-auto mt-8 max-w-4xl">
        <div className="flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <Link
              key={tag.slug}
              href={`/tags/${tag.slug}`}
              className="rounded-full bg-secondary px-3 py-1 text-xs text-secondary-foreground hover:bg-secondary/80"
            >
              {tag.name}
            </Link>
          ))}
        </div>
      </div>
    </article>
  )
} 