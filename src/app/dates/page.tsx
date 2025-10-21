import { getDjFliers } from '@/lib/cloudinary'
import FliersBackground from '@/components/FliersBackground'
import Link from 'next/link'

// Events
const upcomingEvents = [
  {
    id: '1',
    title: 'Halloween Costume Party (DJ Set)',
    date: '2025-10-31',
    venue: 'Private Brooklyn Location',
    location: '',
  },
  {
    id: '2',
    title: 'DJ Set with imaginary friends',
    date: '2025-11-06',
    venue: 'Jade Bar',
    location: 'Brooklyn',
  },
]

export default async function Dates() {
  const fliers = await getDjFliers(36)

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
                {upcomingEvents.map((event) => (
                  <li key={event.id} className="text-sm leading-6">
                    {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    {' — '}
                    {event.title}
                    {' — '}
                    {event.venue}
                    {event.location ? `, ${event.location}` : ''}
                  </li>
                ))}
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
