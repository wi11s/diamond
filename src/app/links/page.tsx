export const metadata = {
  title: 'Links — Taylor Diamond',
  description: 'Selected videos and projects',
}

const links: { title: string; href: string }[] = [
  { title: 'Steppin’ out @ pianos 2 (DJ Set)', href: 'https://youtu.be/XZSUoSw4gfo' },
  { title: 'Cash$tarr - Darling (Music Video)', href: 'https://www.youtube.com/watch?v=zA9VsQVUKQM' },
  { title: 'Ka$hkenni - Cupid (Music Video)', href: 'https://youtu.be/MbiPFdoaEKo' },
  { title: 'Steppin’ out @ pianos 1 (DJ Set)', href: 'https://youtu.be/UfW-7UnFlJI' },
  { title: 'Elliot Michaels - Mitsubishi (Music Video)', href: 'https://youtu.be/GnSlW4nXI5A' },
  { title: 'Rockaway short film (Short Film)', href: 'https://youtu.be/q---SR5yXt4' },
  { title: 'Tape 1 (Analog Visualizer)', href: 'https://youtu.be/XSrpJV9WugU' },
]

export default function LinksPage() {
  return (
    <div className="min-h-screen text-black bg-white px-6 pt-24 pb-20 relative">
      <div className="max-w-2xl mx-auto relative z-10">
        <h1 className="text-2xl font-semibold mb-6">Links</h1>
        <ul className="space-y-3 text-sm">
          {links.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:opacity-80"
              >
                {item.title}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

