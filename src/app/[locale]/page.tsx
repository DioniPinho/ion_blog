'use client';

import { motion } from 'framer-motion';
import { PostCard } from '@/components/blog/PostCard'
import { mockPosts } from '@/data/posts'
import SearchPosts from '@/components/blog/SearchPosts'
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/navigation';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.43, 0.13, 0.23, 0.96]
    }
  }
};

export default function Home() {
  const t = useTranslations('home');
  const locale = useLocale();
  const featuredPost = mockPosts[0];
  const latestPosts = mockPosts.slice(1, 4);

  return (
    <motion.div
      className="min-h-screen"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Hero Section */}
      <section className="relative min-h-screen overflow-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900 via-slate-900 to-black">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/0 to-black"></div>
        
        <motion.div 
          className="container relative z-10 mx-auto flex min-h-screen flex-col items-center justify-center px-4"
          variants={itemVariants}
        >
          <motion.div 
            className="relative flex flex-col items-center"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="absolute -top-32 -z-10 h-72 w-72 bg-indigo-500/30 blur-[120px]"></div>
            <h1 className="text-center text-5xl font-bold tracking-tighter text-white sm:text-7xl">
              {t('hero.title')}
              <span className="relative mt-2 block bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 bg-clip-text text-transparent">
                {t('hero.subtitle')}
                <motion.span
                  className="absolute -right-8 top-0 text-3xl"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                >
                  ✨
                </motion.span>
              </span>
            </h1>
            <p className="mt-6 max-w-2xl text-center text-lg text-white/60">
              {t('hero.description')}
            </p>
          </motion.div>

          <motion.div 
            className="mt-12 w-full max-w-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <SearchPosts />
          </motion.div>
        </motion.div>
      </section>

      {/* Featured Post */}
      <section className="relative z-20 bg-black px-4 py-16">
        <motion.div 
          className="container mx-auto"
          variants={itemVariants}
        >
          <div className="mb-8 flex items-center justify-between">
            <h2 className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 bg-clip-text text-3xl font-bold tracking-tight text-transparent">
              {t('featured.title')}
            </h2>
            <motion.button
              className="group flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white/80 transition-all hover:border-white/20 hover:bg-white/10"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {t('featured.viewAll')}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </motion.button>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/10 bg-white/5">
              <Image
                src={featuredPost.coverImage}
                alt={featuredPost.title}
                fill
                className="object-cover transition-all duration-500 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-60" />
              
              {/* Category Badge */}
              <div className="absolute left-4 top-4 z-10">
                {featuredPost.categories.map((category) => (
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
                  {featuredPost.readingTime} min read
                </span>
              </div>
            </div>

            <div className="flex flex-col justify-center space-y-6">
              <h3 className="text-3xl font-bold tracking-tight text-white">
                {featuredPost.title}
              </h3>
              <p className="text-lg text-white/60">
                {featuredPost.excerpt}
              </p>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="relative h-10 w-10 overflow-hidden rounded-full border border-white/10 bg-white/5">
                    <Image
                      src={featuredPost.author.avatar}
                      alt={featuredPost.author.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <span className="block text-sm font-medium text-white">
                      {featuredPost.author.name}
                    </span>
                    <time className="block text-xs text-white/60">
                      {new Date(featuredPost.publishDate).toLocaleDateString(locale, {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </time>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {featuredPost.tags.slice(0, 2).map((tag) => (
                    <span
                      key={tag.slug}
                      className="inline-flex items-center rounded-full bg-white/5 px-2 py-1 text-xs text-white/80"
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>
              </div>
              <motion.button
                className="group mt-4 flex w-fit items-center gap-2 rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 px-6 py-3 text-sm font-medium text-white transition-all hover:opacity-90"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {t('featured.readMore')}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </motion.button>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Latest Posts */}
      <section className="bg-black py-24">
        <div className="container mx-auto px-4">
          <motion.div 
            className="mb-12"
            variants={itemVariants}
          >
            <div className="flex flex-col items-center justify-center text-center">
              <h2 className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 bg-clip-text text-3xl font-bold tracking-tight text-transparent sm:text-4xl">
                {t('latest.title')}
              </h2>
              <p className="mt-4 max-w-2xl text-white/60">
                {t('latest.description')}
              </p>
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              {t.raw('latest.tags').map((tag: string) => (
                <motion.button
                  key={tag}
                  className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white/80 transition-all hover:border-white/20 hover:bg-white/10"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {tag}
                </motion.button>
              ))}
            </div>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {latestPosts.map((post, index) => (
              <motion.div
                key={post.slug}
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: index * 0.1 }}
              >
                <PostCard {...post} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="relative overflow-hidden bg-black py-24">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900 to-black"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        
        <motion.div 
          className="container relative mx-auto px-4"
          variants={itemVariants}
        >
          <div className="mx-auto max-w-2xl rounded-2xl border border-white/10 bg-white/5 p-8 text-center backdrop-blur-xl">
            <div className="absolute -left-20 -top-20 h-40 w-40 bg-blue-500/30 blur-[100px]"></div>
            <div className="absolute -bottom-20 -right-20 h-40 w-40 bg-purple-500/30 blur-[100px]"></div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h2 className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 bg-clip-text text-3xl font-bold tracking-tight text-transparent sm:text-4xl">
                {t('newsletter.title')}
              </h2>
              <p className="mt-4 text-white/80">
                {t('newsletter.description')}
              </p>
              <form className="mt-8 flex flex-col gap-4 sm:flex-row">
                <input
                  type="email"
                  placeholder={t('newsletter.placeholder')}
                  className="flex-1 rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/50 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  required
                />
                <motion.button
                  type="submit"
                  className="rounded-lg bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 px-8 py-3 font-medium text-white transition-all hover:opacity-90"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {t('newsletter.button')}
                </motion.button>
              </form>
              <p className="mt-4 text-sm text-white/60">
                {t('newsletter.stats')}
              </p>
            </motion.div>
          </div>
        </motion.div>
      </section>
    </motion.div>
  )
}
