import Link from 'next/link'

const pages = [
  { href: '/portraits', label: 'Portraits' },
  { href: '/landscape', label: 'Landscape' },
  { href: '/dates', label: 'Dates' },
  { href: '/links', label: 'Links' },
  { href: '/bio', label: 'Bio' },
]

const bgPhoto = 'https://res.cloudinary.com/dpaytjafy/image/upload/w_1920,q_auto,f_auto/IMG_5636_ysqz7g.jpg'

export default function Home() {
  return (
    <div className="landing-page min-h-screen flex items-center justify-center">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-[0.04]"
        style={{ backgroundImage: `url(${bgPhoto})` }}
      />
      <div className="grain-overlay" />
      <nav className="relative z-10">
        <ul className="flex flex-col items-center gap-3">
          {pages.map((page) => (
            <li key={page.href}>
              <Link
                href={page.href}
                className="text-white/70 hover:text-white text-xs font-light tracking-widest uppercase transition-colors duration-200"
              >
                {page.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}
