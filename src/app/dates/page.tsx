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
      {/* Flyer wall pushed back to black & white so the schedule reads */}
      <div className="fixed inset-0 -z-10 bg-[url('/dates-bg.jpg')] bg-cover bg-center grayscale" />
      <div className="fixed inset-0 -z-10 bg-white/55" />

      <main className="min-h-screen flex items-center justify-center px-4 pt-28 pb-20">
        {/* The schedule: a white sheet taped over the poster wall */}
        <div className="relative w-full max-w-2xl bg-white text-black shadow-[0_40px_80px_-24px_rgba(0,0,0,0.5)] rotate-[-0.4deg]">
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-32 h-7 bg-white/60 backdrop-blur-[2px] rotate-[-2deg] shadow-sm" />

          <header className="flex items-end justify-between gap-4 px-7 sm:px-10 pt-10 pb-6 border-b-2 border-black">
            <h1 className="text-5xl sm:text-6xl font-black tracking-tighter leading-none">Dates</h1>
            <p className="text-[10px] sm:text-xs font-medium uppercase tracking-[0.3em] text-black/50 pb-1.5">
              Catch me out
            </p>
          </header>

          {events.length === 0 ? (
            <p className="px-7 sm:px-10 py-14 text-center text-xs font-medium uppercase tracking-[0.25em] text-black/40">
              No upcoming dates — check back soon
            </p>
          ) : (
            <ul>
              {events.map((event) => {
                const hasTime = /\d{1,2}:\d{2}/.test(event.date ?? '')
                const time = event.dt && hasTime
                  ? event.dt.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
                  : ''
                const where = [event.venue, event.location].filter(Boolean).join(', ')
                const Row = (event.link ? 'a' : 'div') as React.ElementType
                return (
                  <li key={event.id} className="border-b border-black/10 last:border-b-0">
                    <Row
                      {...(event.link ? { href: event.link, target: '_blank', rel: 'noopener noreferrer' } : {})}
                      className="group grid grid-cols-[3.5rem_1fr_auto] sm:grid-cols-[4.5rem_1fr_auto] items-center gap-4 sm:gap-6 px-7 sm:px-10 py-5 transition-colors duration-200 hover:bg-black hover:text-white"
                    >
                      <div className="text-center">
                        {event.dt ? (
                          <>
                            <div className="text-[10px] font-medium uppercase tracking-[0.25em] opacity-50">
                              {event.dt.toLocaleDateString('en-US', { month: 'short' })}
                            </div>
                            <div className="text-2xl sm:text-3xl font-black leading-none tabular-nums">
                              {event.dt.getDate()}
                            </div>
                          </>
                        ) : (
                          <div className="text-xs font-bold">{event.date}</div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="text-base sm:text-lg font-bold leading-snug">{event.title}</div>
                        {where && <div className="text-xs sm:text-sm opacity-60 truncate">{where}</div>}
                      </div>
                      <div className="text-right">
                        {time && <div className="text-xs sm:text-sm tabular-nums opacity-70">{time}</div>}
                        {event.link && (
                          <div className="text-lg leading-none mt-1 opacity-40 group-hover:opacity-100 transition-opacity">
                            ↗
                          </div>
                        )}
                      </div>
                    </Row>
                  </li>
                )
              })}
            </ul>
          )}

          <footer className="flex items-center justify-between gap-4 px-7 sm:px-10 py-6 border-t-2 border-black text-sm">
            <span className="text-black/50">Want me at your event?</span>
            <a
              href="mailto:taylor.diamond10@gmail.com"
              className="font-medium underline underline-offset-4 hover:opacity-60 transition-opacity"
            >
              Bookings ↗
            </a>
          </footer>
        </div>
      </main>
    </div>
  )
}
