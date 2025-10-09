import { getDjFliers } from '@/lib/cloudinary'
import FliersBackground from '@/components/FliersBackground'
import Link from 'next/link'

// Events (placeholder — extend as needed)
const upcomingEvents = [
  {
    id: '1',
    title: 'Press Pause Film Festival Screening',
    date: '2025-09-12',
    venue: 'Museum of the Moving Image',
    location: 'Astoria, Queens',
  },
]

export default async function Dates() {
  const fliers = await getDjFliers(36)

  return (
    <div className="relative min-h-screen text-black">
      {/* Fliers masonry at the very top */}
      <section className="px-0 pt-0">
        {fliers && fliers.length > 0 && <FliersBackground photos={fliers} absolute={false} />}
      </section>

      {/* Local nav below the fliers */}
      <div className="px-6 mt-6 max-w-6xl mx-auto">
        <div className="flex justify-end gap-4">
          <Link href="/portraits" className="text-sm text-black/70 hover:text-black hover:underline underline-offset-4">Portraits</Link>
          <Link href="/landscape" className="text-sm text-black/70 hover:text-black hover:underline underline-offset-4">Landscape</Link>
          <Link href="/bio" className="text-sm text-black/70 hover:text-black hover:underline underline-offset-4">Bio</Link>
          <Link href="/dates" className="text-sm text-black font-medium">Dates</Link>
        </div>
      </div>

      {/* Dates content centered below nav */}
      <div className="px-6 pt-10 pb-20 max-w-6xl mx-auto flex justify-center">
        <div className="max-w-2xl w-full">
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-semibold">Dates</h1>
            <p className="text-sm text-black/60 mt-1">DJ sets and screenings</p>
          </div>

        {/* The fliers collage now lives as the page background */}

        {/* Dates list */}
        <section>
          <ul className="space-y-3 text-center">
            {upcomingEvents.map((event) => (
              <li key={event.id} className="text-sm leading-6">
                {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                {' — '}
                {event.title}
                {' — '}
                {event.venue}, {event.location}
              </li>
            ))}
          </ul>
          <div className="mt-10 text-center">
            <a href="mailto:taylor.diamond10@gmail.com" className="underline">Bookings</a>
          </div>
        </section>
        </div>
      </div>
    </div>
  )
}
