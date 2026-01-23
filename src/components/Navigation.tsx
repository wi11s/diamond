'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
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
  const pathname = usePathname()
  const isLightNav = pathname === '/dates'

  // On landing page, the page itself is navigation
  if (pathname === '/') {
    return null
  }

  const needsPillBg = pathname === '/dates'

  return (
    <>
      {/* Desktop Navigation */}
      <nav className={`auto-hide fixed top-0 left-0 right-0 z-40 p-6`}>
        <div className="max-w-7xl mx-auto flex justify-end items-center">
          {/* Desktop Menu */}
          <div className={`hidden md:flex gap-8 ${needsPillBg ? 'bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full -mr-4 -mt-2' : ''}`}>
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                prefetch
                className={`text-sm font-medium transition-colors ${
                  pathname === item.href
                    ? (isLightNav ? 'text-black' : 'text-white')
                    : (isLightNav ? 'text-black/70 hover:text-black' : 'text-white/70 hover:text-white')
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`md:hidden p-2 rounded-full ${needsPillBg ? 'bg-white/90 backdrop-blur-sm' : ''} ${isLightNav ? 'text-black' : 'text-white'}`}
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
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                prefetch
                className={`text-xl font-medium transition-colors ${
                  pathname === item.href
                    ? 'text-white'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  )
}
