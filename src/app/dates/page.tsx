import { getEvents } from '@/lib/events'

export const revalidate = 3600

function parseDate(raw?: string): Date | null {
  if (!raw) return null
  const t = raw.trim()
  const candidate = /T|\d{2}:\d{2}/.test(t) ? t : t.replace(' ', 'T')
  const d = new Date(candidate)
  return isNaN(d.getTime()) ? null : d
}

export default async function Dates() {
  const events = (await getEvents())
    .filter((e) => !!e.id?.trim())
    .map((e) => ({ ...e, dt: parseDate(e.date) }))
    .sort((a, b) => (a.dt?.getTime() ?? Infinity) - (b.dt?.getTime() ?? Infinity))

  return (
    <div className="relative min-h-screen">
      {/* Flyer wall in full color, lightly washed so the list reads */}
      <div className="fixed inset-0 -z-10 bg-[url('/dates-bg.jpg')] bg-cover bg-center" />
      <div className="fixed inset-0 -z-10 bg-white/40" />

      <main className="min-h-screen flex items-center justify-center px-4 pt-28 pb-20">
        <div className="w-full max-w-xl bg-white text-black shadow-[0_24px_60px_-24px_rgba(0,0,0,0.4)]">
          <header className="flex items-baseline justify-between px-8 pt-7 pb-4 border-b border-black/10">
            <h1 className="text-xs font-bold uppercase tracking-[0.3em]">Dates</h1>
            <a
              href="mailto:taylor.diamond10@gmail.com"
              className="text-xs font-medium underline underline-offset-4 hover:opacity-60 transition-opacity"
            >
              Bookings
            </a>
          </header>

          {events.length === 0 ? (
            <p className="px-8 py-12 text-center text-xs uppercase tracking-[0.25em] text-black/40">
              No upcoming dates
            </p>
          ) : (
            <ul className="py-2">
              {events.map((event) => {
                const hasTime = /\d{1,2}:\d{2}/.test(event.date ?? '')
                const time = event.dt && hasTime
                  ? event.dt.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
                  : ''
                const dateStr = event.dt
                  ? event.dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                  : (event.date || '')
                const where = [event.venue, event.location].filter(Boolean).join(', ')
                const Row = (event.link ? 'a' : 'div') as React.ElementType
                return (
                  <li key={event.id}>
                    <Row
                      {...(event.link ? { href: event.link, target: '_blank', rel: 'noopener noreferrer' } : {})}
                      className="group flex items-baseline gap-4 px-8 py-3.5 transition-colors duration-150 hover:bg-black hover:text-white"
                    >
                      <span className="w-14 shrink-0 text-xs font-medium uppercase tracking-wider opacity-50 tabular-nums">
                        {dateStr}
                      </span>
                      <span className="min-w-0 flex-1 text-sm leading-snug">
                        <span className="font-semibold">{event.title}</span>
                        {where && <span className="opacity-50"> — {where}</span>}
                      </span>
                      {time && <span className="shrink-0 text-xs tabular-nums opacity-50">{time}</span>}
                      {event.link && (
                        <span className="shrink-0 text-sm opacity-30 group-hover:opacity-100 transition-opacity">↗</span>
                      )}
                    </Row>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </main>
    </div>
  )
}
