import Link from 'next/link'

const pages = [
  { href: '/portraits', label: 'Portraits' },
  { href: '/landscape', label: 'Landscape' },
  { href: '/dates', label: 'Dates' },
  { href: '/links', label: 'Links' },
  { href: '/bio', label: 'Bio' },
]

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="relative z-10 flex flex-col items-center gap-8">
        <p className="text-xs font-medium tracking-widest uppercase text-black/40">Taylor Diamond</p>
        <nav>
          <ul className="flex flex-col items-center gap-3">
            {pages.map((page) => (
              <li key={page.href}>
                <Link
                  href={page.href}
                  className="text-black/70 hover:text-black text-sm font-medium transition-colors duration-150"
                >
                  {page.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <a
          href="mailto:taylordiamond10@gmail.com"
          className="text-xs font-medium tracking-widest uppercase border border-black/20 hover:border-black/60 text-black/60 hover:text-black px-5 py-2 rounded-full transition-colors duration-150"
        >
          Work with me
        </a>
      </div>
    </div>
  )
}
