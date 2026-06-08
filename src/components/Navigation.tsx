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
      <nav className={`ui-chrome auto-hide fixed top-0 left-0 right-0 z-40 p-6 flex items-center ${plainStyle ? 'text-black' : 'invert-blend'}`}>
        {/* Left spacer */}
        <div className="flex-1 hidden md:block" />

        {/* Centered pill */}
        <div className={`hidden md:flex items-center gap-10 px-10 py-4 rounded-full ${plainStyle ? '' : 'invert-pill'}`}>
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              prefetch
              onClick={(e) => handleNavClick(e, item.href)}
              className={`text-xl font-bold transition-opacity duration-150 ${
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
            className="bg-black text-white text-sm font-bold tracking-widest uppercase px-5 py-2.5 rounded-full"
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
              className="text-xs font-bold tracking-widest uppercase bg-white text-black px-6 py-2.5 rounded-full mt-4"
            >
              Work with me
            </a>
          </div>
        </div>
      )}
    </>
  )
}
