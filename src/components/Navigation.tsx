'use client'

import { useState, useTransition, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Menu, X } from 'lucide-react'

const navItems = [
  { href: '/portraits', label: 'Portraits' },
  { href: '/landscape', label: 'Landscape' },
  { href: '/dates', label: 'Dates' },
  { href: '/links', label: 'Links' },
  { href: '/bio', label: 'Bio' },
]

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [clickedHref, setClickedHref] = useState<string | null>(null)
  const pathname = usePathname()
  const router = useRouter()

  // Clear clicked state when navigation completes
  useEffect(() => {
    setClickedHref(null)
  }, [pathname])

  const handleNavClick = (e: React.MouseEvent, href: string) => {
    e.preventDefault()
    setClickedHref(href)
    startTransition(() => {
      router.push(href)
    })
  }

  // Pages with white/light backgrounds need dark nav text
  const isLightPage = pathname === '/dates' || pathname === '/bio' || pathname === '/links'
  // Dates has a busy flier background so the nav needs a pill
  const needsPillBg = pathname === '/dates'

  // On landing page, the page itself is navigation; scroll page has no UI
  if (pathname === '/' || pathname === '/scroll') {
    return null
  }

  const textActive = isLightPage ? 'text-black' : 'text-white'
  const textInactive = isLightPage ? 'text-black/70 hover:text-black' : 'text-white/70 hover:text-white'

  return (
    <>
      {/* Desktop Navigation */}
      <nav className={`auto-hide fixed top-0 left-0 right-0 z-40 p-6`}>
        <div className="max-w-7xl mx-auto flex justify-end items-center">
          {/* Desktop Menu */}
          <div className={`hidden md:flex gap-8 ${needsPillBg ? 'bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full -mr-4 -mt-2' : ''}`}>
            {navItems.map((item) => {
              const isActive = pathname === item.href
              const isLoading = isPending && clickedHref === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  prefetch
                  onClick={(e) => handleNavClick(e, item.href)}
                  className={`text-sm font-medium transition-all duration-150 ${
                    isLoading ? 'opacity-50' : ''
                  } ${isActive ? textActive : textInactive}`}
                >
                  {item.label}
                </Link>
              )
            })}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`md:hidden p-2 rounded-full ${isLightPage ? 'text-black' : 'text-white'} ${needsPillBg ? 'bg-white/90 backdrop-blur-sm' : ''}`}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/95" />
          <div className="relative flex flex-col items-center justify-center h-full space-y-8">
            {/* Close button (top-right) */}
            <button
              aria-label="Close menu"
              onClick={() => setIsOpen(false)}
              className="absolute top-5 right-5 text-white p-2"
            >
              <X size={24} />
            </button>
            {navItems.map((item) => {
              const isActive = pathname === item.href
              const isLoading = isPending && clickedHref === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={(e) => {
                    setIsOpen(false)
                    handleNavClick(e, item.href)
                  }}
                  prefetch
                  className={`text-xl font-medium transition-all duration-150 ${
                    isLoading ? 'opacity-50' : ''
                  } ${
                    isActive
                      ? 'text-white'
                      : 'text-white/70 hover:text-white'
                  }`}
                >
                  {item.label}
                </Link>
              )
            })}
          </div>
        </div>
      )}
    </>
  )
}
