'use client';

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Post } from '@/data/posts'
import { cn } from '@/lib/utils'
import { ArrowUpRight } from 'lucide-react'

export interface PostCardProps extends Post {
  featured?: boolean
}

export function PostCard({
  title,
  slug,
  excerpt,
  coverImage,
  author,
  publishDate,
  readingTime,
  categories,
  tags,
  featured,
}: PostCardProps) {
  return (
    <motion.article
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-white/5 to-white/[0.02] transition-all duration-300 hover:border-white/20",
        featured ? "md:col-span-2" : ""
      )}
      whileHover={{ scale: 1.02 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Link href={`/posts/${slug}`} className="block">
        <div className="relative aspect-video overflow-hidden">
          <Image
            src={coverImage}
            alt={title}
            fill
            className="object-cover transition-all duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-60 transition-opacity duration-300 group-hover:opacity-50" />
          
          {/* Category Badge */}
          <div className="absolute left-4 top-4 z-10">
            {categories.map((category) => (
              <span
                key={category.slug}
                className="inline-flex items-center rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-medium text-white backdrop-blur-md"
              >
                {category.name}
              </span>
            ))}
          </div>
          
          {/* Reading Time */}
          <div className="absolute right-4 top-4 z-10">
            <span className="inline-flex items-center rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-medium text-white backdrop-blur-md">
              {readingTime} min read
            </span>
          </div>
        </div>

        <div className="relative space-y-4 p-6">
          <div className="space-y-2">
            <h3 className={cn(
              "font-bold tracking-tight text-white group-hover:text-white/90",
              featured ? "text-3xl" : "text-xl"
            )}>
              {title}
              <motion.span
                className="ml-2 inline-block opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100"
                initial={false}
              >
                <ArrowUpRight className="h-4 w-4" />
              </motion.span>
            </h3>
            <p className="line-clamp-2 text-sm text-white/60 group-hover:text-white/70">
              {excerpt}
            </p>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="relative h-8 w-8 overflow-hidden rounded-full border border-white/10 bg-white/5">
                <Image
                  src={author.avatar}
                  alt={author.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <span className="block text-sm font-medium text-white">
                  {author.name}
                </span>
                <time className="block text-xs text-white/60">
                  {new Date(publishDate).toLocaleDateString('en-US', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </time>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {tags.slice(0, 2).map((tag) => (
                <span
                  key={tag.slug}
                  className="inline-flex items-center rounded-full bg-white/5 px-2 py-1 text-xs text-white/80"
                >
                  {tag.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Link>
    </motion.article>
  )
} 