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
      <nav className="relative z-10">
        <ul className="flex flex-col items-center gap-3">
          {pages.map((page) => (
            <li key={page.href}>
              <Link
                href={page.href}
                className="text-black/70 hover:text-black text-xs font-light tracking-widest uppercase transition-colors duration-200"
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
