import Image from 'next/image'

export const metadata = {
  title: 'Links - Taylor Diamond',
  description: 'Selected videos and projects',
}

export const revalidate = 3600

const GOOGLE_SHEET_CSV_URL =
  'https://docs.google.com/spreadsheets/d/1yv6dFsyyVzyuzNvRScSOFySOTRyBC3ZUSv5j6lcarzw/export?format=csv'

async function getLinks(): Promise<{ title: string; href: string }[]> {
  try {
    const res = await fetch(GOOGLE_SHEET_CSV_URL, { next: { revalidate: 3600 } })
    const text = await res.text()
    return text
      .replace(/\r\n/g, '\n')
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const comma = line.indexOf(',')
        return {
          title: line.slice(0, comma).trim(),
          href: line.slice(comma + 1).trim(),
        }
      })
      .filter((link) => link.title && link.href)
  } catch {
    return []
  }
}

export default async function LinksPage() {
  const links = await getLinks()

  return (
    <div className="min-h-screen flex items-center justify-center relative">
      <Image
        src="https://res.cloudinary.com/dpaytjafy/image/upload/f_auto,q_auto,w_1600/v1755556468/IMG_5071_kwkkun.jpg"
        alt=""
        fill
        className="object-cover"
        priority
        unoptimized
      />
      <div className="bw-pill relative z-10 px-12 py-10">
        <ul className="space-y-3 text-base">
          {links.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="no-underline hover:underline hover:opacity-80"
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
