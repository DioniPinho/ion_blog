"use client"

import * as React from 'react'
import Link from 'next/link'
import { Menu, X, Search } from 'lucide-react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { AnimatedPulseLogo } from './AnimatedPulseLogo'
import { Link as NavigationLink } from "@/i18n/navigation"
import { useTranslations } from 'next-intl'
import { ModeToggle } from "@/components/mode-toggle"
import { LanguageSelector } from "@/components/common/LanguageSelector"

const navigation = [
  { name: 'Posts', href: '/posts' },
  { name: 'Categories', href: '/categories' },
  { name: 'Tags', href: '/tags' },
  { name: 'About', href: '/about' },
]

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false)
  const [isScrolled, setIsScrolled] = React.useState(false)
  const { scrollY } = useScroll()
  const t = useTranslations('Navigation')

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Transformações suaves baseadas no scroll
  const headerBg = useTransform(
    scrollY,
    [0, 100],
    ['rgba(0, 0, 0, 0)', 'rgba(255, 255, 255, 0.95)']
  )
  
  const headerBorder = useTransform(
    scrollY,
    [0, 100],
    ['rgba(255, 255, 255, 0)', 'rgba(0, 0, 0, 0.1)']
  )

  // Variantes de animação
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { y: -20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24
      }
    }
  }

  const logoVariants = {
    hidden: { 
      scale: 0.8,
      opacity: 0
    },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 20,
        duration: 0.8
      }
    }
  }

  const titleVariants = {
    hidden: { 
      opacity: 0,
      x: -30,
      y: -20,
      scale: 0.8,
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20,
        duration: 0.8,
        ease: [0.43, 0.13, 0.23, 0.96]
      }
    }
  }

  return (
    <motion.header
      style={{
        backgroundColor: headerBg,
        borderBottom: '1px solid',
        borderColor: headerBorder,
      }}
      className="fixed top-0 w-full z-50 backdrop-blur-[8px]"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <motion.div
            className="flex items-center gap-3"
            variants={logoVariants}
          >
            <Link href="/" className="flex items-center gap-3 group">
              <AnimatedPulseLogo isScrolled={isScrolled} />
              <motion.span 
                variants={titleVariants}
                className={cn(
                  "text-2xl font-bold tracking-tight transition-all duration-300 origin-left",
                  isScrolled
                    ? "bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600"
                    : "text-white"
                )}
              >
                IonSphere Blog
              </motion.span>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <motion.nav 
            className="hidden md:flex items-center gap-8"
            variants={containerVariants}
          >
            <motion.div 
              className={cn(
                "flex items-center gap-1 px-2 py-1.5 rounded-full transition-all duration-300",
                !isScrolled && "bg-white/10 border border-white/20 backdrop-blur-sm"
              )}
            >
              {navigation.map((item, index) => (
                <motion.div
                  key={item.name}
                  variants={itemVariants}
                  custom={index}
                >
                  <Link
                    href={item.href}
                    className={cn(
                      "relative px-4 py-1.5 text-sm font-medium rounded-full transition-all duration-300",
                      isScrolled 
                        ? "text-gray-700 hover:text-indigo-600" 
                        : "text-white/90 hover:text-white hover:bg-white/10"
                    )}
                  >
                    {item.name}
                    <motion.div
                      className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-500 rounded-full"
                      initial={{ scaleX: 0 }}
                      whileHover={{ scaleX: 1 }}
                      transition={{ duration: 0.2 }}
                    />
                  </Link>
                </motion.div>
              ))}
            </motion.div>
            <motion.div
              variants={itemVariants}
              className="ml-2 flex items-center gap-4"
            >
              <div className={cn(
                "flex items-center gap-2 p-1 rounded-full transition-all duration-300",
                isScrolled
                  ? "bg-gray-100"
                  : "bg-white/10 backdrop-blur-sm"
              )}>
                <LanguageSelector />
                <div className="h-4 w-px bg-gray-300/20"></div>
                <ModeToggle />
              </div>
            </motion.div>
          </motion.nav>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-4 md:hidden">
            <div className={cn(
              "flex items-center gap-2 p-1 rounded-full transition-all duration-300",
              isScrolled
                ? "bg-gray-100"
                : "bg-white/10 backdrop-blur-sm"
            )}>
              <LanguageSelector />
              <div className="h-4 w-px bg-gray-300/20"></div>
              <ModeToggle />
            </div>
            <button
              type="button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-full transition-all duration-300",
                isScrolled
                  ? "text-gray-700 hover:text-indigo-600"
                  : "bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-sm text-white"
              )}
            >
              {isMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              <span className="sr-only">Menu</span>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className={cn(
                "border-t transition-all duration-300 md:hidden",
                isScrolled
                  ? "border-gray-200 bg-white/95"
                  : "border-white/20 bg-black/20"
              )}
            >
              <nav className="container py-4">
                <ul className="flex flex-col space-y-4">
                  {navigation.map((item) => (
                    <motion.li
                      key={item.name}
                      variants={itemVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      <Link
                        href={item.href}
                        className={cn(
                          "block px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300",
                          isScrolled
                            ? "text-gray-700 hover:text-indigo-600 hover:bg-gray-50"
                            : "text-white/90 hover:text-white hover:bg-white/10"
                        )}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {item.name}
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  )
}