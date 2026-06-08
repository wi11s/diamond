import Link from 'next/link'
import Image from 'next/image'

const pages = [
  { href: '/portraits', label: 'Portraits' },
  { href: '/landscape', label: 'Landscape' },
  { href: '/dates', label: 'Dates' },
  { href: '/links', label: 'Links' },
  { href: '/bio', label: 'Bio' },
]

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center relative">
      <Image
        src="https://res.cloudinary.com/dpaytjafy/image/upload/v1755557549/IMG_7764_dnee02.jpg"
        alt=""
        fill
        className="object-cover"
        priority
        unoptimized
      />
      <div className="invert-pill relative z-10 flex flex-col items-center gap-8 px-12 py-10 rounded-3xl">
        <p className="text-sm font-medium tracking-widest uppercase text-white/80">Taylor Diamond</p>
        <nav>
          <ul className="flex flex-col items-center gap-3">
            {pages.map((page) => (
              <li key={page.href}>
                <Link
                  href={page.href}
                  className="text-white hover:text-white text-base font-medium transition-colors duration-150"
                >
                  {page.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <a
          href="mailto:taylordiamond10@gmail.com"
          className="text-sm font-medium tracking-widest uppercase border border-white/50 hover:border-white text-white/80 hover:text-white px-5 py-2 rounded-full transition-colors duration-150"
        >
          Work with me
        </a>
      </div>
    </div>
  )
}
