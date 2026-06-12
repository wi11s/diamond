'use client'

import { useState, useTransition, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Instagram, Menu, X } from 'lucide-react'

const navItems = [
  { href: '/portraits', label: 'Portraits' },
  { href: '/landscape', label: 'Landscape' },
  { href: '/dates', label: 'Dates' },
  { href: '/links', label: 'Links' },
  { href: '/bio', label: 'Bio' },
]

const INSTAGRAM_URL = 'https://www.instagram.com/its_taylor_diamond/'

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

  // Full-width header band: inverted by default, plain blur on bio, bare on links
  const barStyle = pathname === '/links' ? '' : pathname === '/bio' ? 'blur-pill' : 'invert-pill'

  const handleNavClick = (e: React.MouseEvent, href: string) => {
    e.preventDefault()
    setClickedHref(href)
    startTransition(() => router.push(href))
  }

  return (
    <>
      <nav className={`fixed top-0 inset-x-0 z-40 ${barStyle}`}>
        <div className="relative flex items-center justify-between h-14 px-5 md:px-7">
          <div className="flex items-baseline gap-3">
            <Link href="/" className="text-sm font-bold tracking-widest uppercase">
              Taylor Diamond
            </Link>
            {(pathname?.startsWith('/portraits') || pathname?.startsWith('/landscape')) && (
              <span className="text-[10px] font-medium uppercase tracking-[0.2em] opacity-50 whitespace-nowrap">
                All photos ©
              </span>
            )}
          </div>

          {/* Centered nav links */}
          <div className="hidden md:flex items-center gap-6 absolute left-1/2 -translate-x-1/2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                prefetch
                onClick={(e) => handleNavClick(e, item.href)}
                className={`text-sm font-medium uppercase tracking-widest transition-opacity duration-150 ${
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

          {/* Instagram + Work with me — right */}
          <div className="hidden md:flex items-center gap-5">
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram @its_taylor_diamond"
              className="opacity-70 hover:opacity-100 transition-opacity duration-150"
            >
              <Instagram size={18} />
            </a>
            <a
              href="mailto:taylordiamond10@gmail.com"
              className="bg-white/20 backdrop-blur-md text-xs font-bold tracking-widest uppercase px-3 py-1.5 hover:bg-white/35 transition-colors duration-150"
            >
              Work with me
            </a>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 -mr-2"
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {isOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <img
            src="https://res.cloudinary.com/dpaytjafy/image/upload/f_auto,q_auto,w_1600/v1755557549/IMG_7764_dnee02.jpg"
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
            <div className="invert-pill flex flex-col items-center gap-8 px-12 py-10">
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
                className="bg-white/20 backdrop-blur-md text-sm font-bold tracking-widest uppercase px-5 py-2 hover:bg-white/35 transition-colors duration-150"
              >
                Work with me
              </a>
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram @its_taylor_diamond"
                className="opacity-70 hover:opacity-100 transition-opacity duration-150 -mt-2"
              >
                <Instagram size={20} />
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
