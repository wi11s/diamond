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

      {/* Centered white card with dates */}
      <div className="fixed inset-0 flex items-center justify-center z-30 pointer-events-none">
        <div className="bg-white border border-black/10 shadow-md rounded-md px-5 py-4 w-[min(92vw,720px)] pointer-events-auto">
          <div>
            <div className="mb-3 text-center">
              <h1 className="text-xl font-semibold">Dates</h1>
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
    </div>
  )
}
