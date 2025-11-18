import { getDjFliers } from '@/lib/cloudinary'
import FliersBackground from '@/components/FliersBackground'
import Link from 'next/link'
import { getEvents } from '@/lib/events'

// This page reads events via a CSV with ISR handled in lib/events

export default async function Dates() {
  const fliers = await getDjFliers(36)
  const upcomingEvents = (await getEvents()).filter(e => !!(e.id && e.id.trim()))

  return (
    <div className="relative min-h-screen text-black">
      {/* Fliers masonry background */}
      <section className="px-0 pt-0">
        {fliers && fliers.length > 0 && <FliersBackground photos={fliers} absolute={false} />}
      </section>

      {/* Fixed white card near the top with nav + dates */}
      <div className="fixed top-8 left-1/2 -translate-x-1/2 z-30 w-[min(92vw,720px)]">
        <div className="bg-white border border-black/10 shadow-md rounded-md px-5 py-4">
          {/* Nav (match global order) */}
          <div className="flex justify-end gap-4">
            <Link href="/portraits" className="text-sm text-black/70 hover:text-black hover:underline underline-offset-4">Portraits</Link>
            <Link href="/landscape" className="text-sm text-black/70 hover:text-black hover:underline underline-offset-4">Landscape</Link>
            <Link href="/dates" className="text-sm text-black font-medium">Dates</Link>
            <Link href="/links" className="text-sm text-black/70 hover:text-black hover:underline underline-offset-4">Links</Link>
            <Link href="/bio" className="text-sm text-black/70 hover:text-black hover:underline underline-offset-4">Bio</Link>
          </div>

          {/* Dates content */}
          <div className="mt-4">
            <div className="mb-3 text-center">
              <h1 className="text-xl font-semibold">Dates</h1>
              <p className="text-xs text-black/60 mt-1">DJ sets and screenings</p>
            </div>
            <section>
              <ul className="space-y-2 text-center">
                {upcomingEvents.map((event) => {
                  let dt: Date | null = null
                  if (event.date) {
                    const raw = event.date.trim()
                    const candidate = /T|\d{2}:\d{2}/.test(raw) ? raw : raw.replace(' ', 'T')
                    const dtry = new Date(candidate)
                    dt = isNaN(dtry.getTime()) ? null : dtry
                  }
                  const dateStr = dt
                    ? dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                    : (event.date || '')
                  const timeStr = dt
                    ? dt.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
                    : ''
                  return (
                  <li key={event.id} className="text-sm leading-6">
                    {dateStr}{timeStr ? `, ${timeStr}` : ''}
                    {' — '}
                    {event.title}
                    {' — '}
                    {event.venue}
                    {event.location ? `, ${event.location}` : ''}
                    {event.link ? (
                      <a
                        href={event.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-2 inline-block text-xs underline"
                      >
                        View
                      </a>
                    ) : null}
                  </li>
                  )
                })}
              </ul>
              <div className="mt-6 text-center">
                <a href="mailto:taylor.diamond10@gmail.com" className="underline">Bookings</a>
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* Spacer to ensure scroll height even with floating card */}
      <div className="h-[45vh]" />
    </div>
  )
}
