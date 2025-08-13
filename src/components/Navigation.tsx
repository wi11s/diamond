'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, Camera, User, BookOpen, Home, Palette, Calendar, Instagram } from 'lucide-react'

const navItems = [
  { href: '/', label: 'HOME', icon: Home, color: 'text-white' },
  { href: '/dates', label: 'DATES', icon: Calendar, color: 'text-white' },
  { href: '/blog', label: 'BLOG', icon: BookOpen, color: 'text-white' },
  { href: 'https://www.instagram.com/its_taylor_diamond/', label: 'INSTAGRAM', icon: Instagram, color: 'text-white', external: true },
]

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  const isBlog = pathname?.startsWith('/blog')
  const isHome = pathname === '/'

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      {/* Desktop Navigation */}
      <motion.nav
        initial={isHome ? false : { y: -100 }}
        animate={isHome ? {} : { y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 p-6"
      >
        <div className="max-w-7xl mx-auto flex justify-end items-center">
          {/* Desktop Menu */}
          <div className="hidden md:flex gap-6">
            {navItems.map((item, index) => (
              <motion.div
                key={item.href}
                initial={isHome ? false : { opacity: 0, y: -20 }}
                animate={isHome ? {} : { opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {item.external ? (
                  <a href={item.href} target="_blank" rel="noopener noreferrer" className="group">
                    <motion.div
                      className="p-2"
                      whileHover={{ 
                        scale: 1.1,
                        transition: { duration: 0.2 }
                      }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <item.icon className={`${isBlog ? 'text-black hover:text-black/70' : 'text-white hover:text-white/80'} transition-colors`} size={24} />
                    </motion.div>
                  </a>
                ) : (
                  <Link href={item.href} className="group">
                  <motion.div
                    className="p-2"
                    whileHover={{ 
                      scale: 1.1,
                      transition: { duration: 0.2 }
                    }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <item.icon className={`${isBlog ? 'text-black hover:text-black/70' : 'text-white hover:text-white/80'} transition-colors`} size={24} />
                  </motion.div>
                  </Link>
                )}
              </motion.div>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {isOpen ? <X size={24} className="text-white" /> : <Menu size={24} className="text-white" />}
          </motion.button>
        </div>
      </motion.nav>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 md:hidden"
          >
            <div className="absolute inset-0 bg-black/95 backdrop-blur-xl" />
            <div className="relative flex flex-col items-center justify-center h-full space-y-8">
              {navItems.map((item, index) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, scale: 0.8, y: 50 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ 
                    delay: index * 0.1,
                    type: "spring",
                    stiffness: 200,
                    damping: 20
                  }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className="group"
                  >
                    <motion.div
                      className="p-8 flex flex-col items-center gap-4"
                      whileHover={{ 
                        scale: 1.1,
                        transition: { duration: 0.3 }
                      }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <item.icon className="text-white group-hover:scale-125 transition-transform" size={48} />
                    </motion.div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}