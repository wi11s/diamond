import Link from 'next/link'
import { getEvents } from '@/lib/events'

export const revalidate = 3600

export default async function Dates() {
  const upcomingEvents = (await getEvents()).filter(e => !!(e.id && e.id.trim()))

  return (
    <div className="relative min-h-screen text-black">
      {/* Static fliers background */}
      <div
        className="fixed inset-0 -z-10"
        style={{ backgroundImage: 'url(/dates-bg.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}
      />

      {/* Centered white card with dates */}
      <div className="fixed inset-0 flex items-center justify-center z-30 pointer-events-none">
        <div
          className="invert-pill rounded-3xl px-10 py-8 w-fit max-w-[min(92vw,680px)] pointer-events-auto"
          style={{
            backdropFilter: 'invert(1) blur(16px)',
            WebkitBackdropFilter: 'invert(1) blur(16px)',
            background: 'rgba(255,255,255,0.22)',
          }}
        >
          <section>
            <ul className="space-y-2 text-center whitespace-nowrap">
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
                  <li key={event.id} className="text-sm font-semibold leading-7" style={{ textShadow: '0 1px 8px rgba(0,0,0,0.7)' }}>
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
              <a href="mailto:taylor.diamond10@gmail.com" className="underline font-semibold" style={{ textShadow: '0 1px 8px rgba(0,0,0,0.7)' }}>Bookings</a>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
