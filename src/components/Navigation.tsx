'use client'

import { useState, useTransition, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { useGallery } from '@/context/GalleryContext'

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
  const { photosLoaded } = useGallery()

  const isGalleryPage = pathname?.startsWith('/portraits') || pathname?.startsWith('/landscape')
  const plainStyle = pathname === '/links' || pathname === '/bio' || (isGalleryPage && !photosLoaded)
  const whiteText = pathname === '/bio'

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
      {/* Desktop nav */}
      <nav className="fixed top-0 left-0 right-0 z-40 p-6 flex items-center">
        {/* Left spacer */}
        <div className="flex-1 hidden md:block" />

        {/* Centered pill */}
        <div
          className={`auto-hide hidden md:flex items-center gap-6 px-7 py-2.5 rounded-full ${plainStyle ? (whiteText ? 'text-white' : '') : 'invert-pill'}`}
          style={pathname === '/dates' ? { backdropFilter: 'invert(1) blur(16px)', WebkitBackdropFilter: 'invert(1) blur(16px)' } : undefined}
        >
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              prefetch
              onClick={(e) => handleNavClick(e, item.href)}
              className={`text-sm font-bold uppercase tracking-widest transition-opacity duration-150 ${
                isPending && clickedHref === item.href
                  ? 'opacity-40'
                  : pathname === item.href
                  ? 'underline underline-offset-4'
                  : 'opacity-55'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Work with me — right */}
        <div className="flex-1 hidden md:flex justify-end">
          <a
            href="mailto:taylordiamond10@gmail.com"
            className={`auto-hide text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full ${plainStyle ? 'invert-blend' : 'invert-pill'}`}
            style={pathname === '/dates' ? { backdropFilter: 'invert(1) blur(16px)', WebkitBackdropFilter: 'invert(1) blur(16px)' } : undefined}
          >
            Work with me
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 rounded-full"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile menu */}
      {isOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <img
            src="https://res.cloudinary.com/dpaytjafy/image/upload/v1755557549/IMG_7764_dnee02.jpg"
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="relative flex flex-col items-center justify-center h-full">
            <button
              aria-label="Close menu"
              onClick={() => setIsOpen(false)}
              className="absolute top-5 right-5 text-white p-2"
            >
              <X size={24} />
            </button>
            <div className="invert-pill flex flex-col items-center gap-8 px-12 py-10 rounded-3xl">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  prefetch
                  onClick={(e) => { setIsOpen(false); handleNavClick(e, item.href) }}
                  className={`text-base font-medium transition-opacity duration-150 ${
                    isPending && clickedHref === item.href ? 'opacity-40' : pathname === item.href ? 'underline underline-offset-4' : 'opacity-55'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              <a
                href="mailto:taylordiamond10@gmail.com"
                onClick={() => setIsOpen(false)}
                className="text-sm font-medium tracking-widest uppercase border border-white/50 hover:border-white text-white/80 hover:text-white px-5 py-2 rounded-full transition-colors duration-150"
              >
                Work with me
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
