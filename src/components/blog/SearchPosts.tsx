"use client"

import { Search } from 'lucide-react'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'

interface SearchPostsProps {
  className?: string
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
}

export default function SearchPosts({ className }: SearchPostsProps) {
  const t = useTranslations('Search')
  const trendingTags = t.raw('trendingTags') as string[]

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className={`w-full max-w-3xl mx-auto px-4 ${className}`}
    >
      <motion.div 
        variants={itemVariants}
        className="relative w-full bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 rounded-lg p-0.5"
      >
        <form className="relative flex items-center bg-background rounded-lg">
          <Search className="absolute left-4 text-muted-foreground" size={20} />
          <input
            type="text"
            placeholder={t('placeholder')}
            className="w-full py-3 px-12 bg-transparent focus:outline-none text-foreground"
          />
          <kbd className="absolute right-4 text-xs text-muted-foreground">
            {t('shortcut')}
          </kbd>
        </form>
      </motion.div>

      <motion.div 
        variants={itemVariants}
        className="mt-4 flex items-center gap-2 text-sm"
      >
        <span className="text-muted-foreground">{t('trending')}:</span>
        <div className="flex flex-wrap gap-2">
          {trendingTags.map((tag: string) => (
            <button
              key={tag}
              className="px-2 py-1 rounded-full bg-primary/10 hover:bg-primary/20 text-primary transition-colors"
            >
              {tag}
            </button>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
} 