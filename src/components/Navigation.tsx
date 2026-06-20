'use client'

import { useState, useTransition, useEffect, useRef } from 'react'
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
  const [visible, setVisible] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const visibleRef = useRef(true)
  const hidePos = useRef<{ x: number; y: number } | null>(null)
  const lastPos = useRef<{ x: number; y: number } | null>(null)
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    setIsMobile(mq.matches)
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  useEffect(() => {
    setClickedHref(null)
    visibleRef.current = true
    setVisible(true)
    hidePos.current = null
    if (hideTimer.current) clearTimeout(hideTimer.current)
    hideTimer.current = setTimeout(() => {
      visibleRef.current = false
      hidePos.current = lastPos.current
      setVisible(false)
    }, 3500)
  }, [pathname])

  useEffect(() => {
    let scrolling = false
    let scrollClear: ReturnType<typeof setTimeout> | null = null

    const onScroll = () => {
      scrolling = true
      if (scrollClear) clearTimeout(scrollClear)
      scrollClear = setTimeout(() => { scrolling = false }, 200)
    }

    const show = (e?: MouseEvent) => {
      // Mouse movement during a scroll gesture should not reset the timer
      if (scrolling && e?.type === 'mousemove') return

      if (e) lastPos.current = { x: e.clientX, y: e.clientY }

      // Require 30px of movement from where it hid before reappearing
      if (!visibleRef.current && hidePos.current && e) {
        const dx = e.clientX - hidePos.current.x
        const dy = e.clientY - hidePos.current.y
        if (Math.sqrt(dx * dx + dy * dy) < 30) return
      }

      visibleRef.current = true
      setVisible(true)
      if (hideTimer.current) clearTimeout(hideTimer.current)
      hideTimer.current = setTimeout(() => {
        visibleRef.current = false
        hidePos.current = lastPos.current
        setVisible(false)
      }, 3500)
    }
    const onGalleryReady = () => {
      visibleRef.current = true
      setVisible(true)
      hidePos.current = null
      if (hideTimer.current) clearTimeout(hideTimer.current)
      hideTimer.current = setTimeout(() => {
        visibleRef.current = false
        hidePos.current = lastPos.current
        setVisible(false)
      }, 3500)
    }

    show()
    document.addEventListener('mousemove', show)
    document.addEventListener('click', show as EventListener)
    document.addEventListener('wheel', onScroll, { passive: true })
    document.addEventListener('touchmove', onScroll, { passive: true })
    document.addEventListener('gallery-ready', onGalleryReady)
    return () => {
      document.removeEventListener('mousemove', show)
      document.removeEventListener('click', show as EventListener)
      document.removeEventListener('wheel', onScroll)
      document.removeEventListener('touchmove', onScroll)
      document.removeEventListener('gallery-ready', onGalleryReady)
      if (hideTimer.current) clearTimeout(hideTimer.current)
      if (scrollClear) clearTimeout(scrollClear)
    }
  }, [])

  if (pathname === '/' || pathname === '/scroll') return null

  const isDates = pathname === '/dates'
  const posClass = isDates
    ? 'fixed top-0 inset-x-0 z-40'
    : 'fixed top-3 left-1/2 -translate-x-1/2 z-40 w-[calc(100%-2rem)] max-w-5xl rounded-full'
  const barStyle = isDates
    ? 'bg-white text-black'
    : pathname === '/links'
    ? ''
    : pathname === '/bio'
    ? 'blur-pill'
    : 'invert-pill'

  const handleNavClick = (e: React.MouseEvent, href: string) => {
    e.preventDefault()
    setClickedHref(href)
    startTransition(() => router.push(href))
  }

  return (
    <>
      <nav
        className={`${posClass} transition-opacity duration-500 ${barStyle} ${isMobile || visible || isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      >
        <div className="relative flex items-center justify-between h-14 px-5 md:px-7">
          <div className="flex items-baseline gap-3">
            <Link href="/" className="text-sm font-bold tracking-widest uppercase">
              Taylor Diamond
            </Link>
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
              className="text-xs font-bold tracking-widest uppercase hover:opacity-70 transition-opacity duration-150"
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
        <div className="fixed inset-0 z-50 md:hidden">
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
            <div className="bw-pill rounded-2xl relative z-10 flex flex-col items-center gap-8 px-12 py-10">
              <p className="text-sm font-medium tracking-widest uppercase text-white/80">Taylor Diamond</p>
              <nav>
                <ul className="flex flex-col items-center gap-3">
                  {navItems.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        prefetch
                        onClick={(e) => { setIsOpen(false); handleNavClick(e, item.href) }}
                        className={`text-base font-medium transition-colors duration-150 ${
                          isPending && clickedHref === item.href
                            ? 'text-white/40'
                            : pathname === item.href
                            ? 'text-white underline underline-offset-4'
                            : 'text-white/90 hover:text-white'
                        }`}
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
              <div className="flex items-center gap-4">
                <a
                  href="mailto:taylordiamond10@gmail.com"
                  onClick={() => setIsOpen(false)}
                  className="text-sm font-medium tracking-widest uppercase border border-white/50 hover:border-white text-white/80 hover:text-white px-5 py-2 transition-colors duration-150"
                >
                  Work with me
                </a>
                <a
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram @its_taylor_diamond"
                  className="text-white/80 hover:text-white transition-colors duration-150"
                >
                  <Instagram size={18} />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
