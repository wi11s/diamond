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

  useEffect(() => {
    setClickedHref(null)
  }, [pathname])

  if (pathname === '/' || pathname === '/scroll') return null

  const handleNavClick = (e: React.MouseEvent, href: string) => {
    e.preventDefault()
    setClickedHref(href)
    startTransition(() => router.push(href))
  }

  return (
    <>
      <nav className="auto-hide fixed top-0 left-0 right-0 z-40 p-6">
        <div className="max-w-7xl mx-auto flex justify-center items-center">

          {/* Desktop */}
          <div className="hidden md:flex items-center gap-8 px-4 py-2 -mr-4 -mt-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                prefetch
                onClick={(e) => handleNavClick(e, item.href)}
                className={`text-sm font-medium transition-all duration-150 ${
                  isPending && clickedHref === item.href ? 'opacity-50' : ''
                } ${pathname === item.href ? 'text-black' : 'text-black/70 hover:text-black'}`}
              >
                {item.label}
              </Link>
            ))}
            <a
              href="mailto:taylordiamond10@gmail.com"
              className="text-xs font-medium tracking-widest uppercase border border-black/30 hover:border-black/70 text-black/60 hover:text-black px-4 py-1.5 rounded-full transition-all duration-150"
            >
              Work with me
            </a>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-full text-black"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {isOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/95" />
          <div className="relative flex flex-col items-center justify-center h-full space-y-8">
            <button
              aria-label="Close menu"
              onClick={() => setIsOpen(false)}
              className="absolute top-5 right-5 text-white p-2"
            >
              <X size={24} />
            </button>
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                prefetch
                onClick={(e) => { setIsOpen(false); handleNavClick(e, item.href) }}
                className={`text-xl font-medium transition-all duration-150 ${
                  isPending && clickedHref === item.href ? 'opacity-50' : ''
                } ${pathname === item.href ? 'text-white' : 'text-white/70 hover:text-white'}`}
              >
                {item.label}
              </Link>
            ))}
            <a
              href="mailto:taylordiamond10@gmail.com"
              onClick={() => setIsOpen(false)}
              className="text-xs font-medium tracking-widest uppercase border border-white/30 hover:border-white/70 text-white/60 hover:text-white px-6 py-2 rounded-full transition-all duration-150 mt-4"
            >
              Work with me
            </a>
          </div>
        </div>
      )}
    </>
  )
}
