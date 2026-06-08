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
    <div className="min-h-screen text-black bg-white px-6 pt-40 pb-20 relative">
      <div className="max-w-2xl mx-auto relative z-10">
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
