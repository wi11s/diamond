'use client'

// Events
const upcomingEvents = [
  {
    id: '1',
    title: 'Press Pause Film Festival Screening',
    date: '2025-09-12',
    venue: 'Museum of the Moving Image',
    location: 'Astoria, Queens',
  },
]

const getEventColor = (type: string) => {
  switch (type) {
    case 'warehouse': return 'text-red-400'
    case 'rooftop': return 'text-orange-400'
    case 'club': return 'text-purple-400'
    case 'festival': return 'text-green-400'
    case 'afterparty': return 'text-pink-400'
    case 'outdoor': return 'text-blue-400'
    default: return 'text-white'
  }
}

const getStatusInfo = (status: string) => {
  switch (status) {
    case 'confirmed': return { text: 'Confirmed', color: 'bg-green-500/20 text-green-400' }
    case 'sold_out': return { text: 'Sold Out', color: 'bg-red-500/20 text-red-400' }
    case 'private': return { text: 'Private', color: 'bg-yellow-500/20 text-yellow-400' }
    default: return { text: 'TBA', color: 'bg-gray-500/20 text-gray-400' }
  }
}

export default function Dates() {
  return (
    <div className="min-h-screen bg-white text-black px-6 pt-24">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-semibold mb-8">Dates</h1>
        <ul className="space-y-3">
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
        <div className="mt-12">
          <a href="mailto:taylor.diamond10@gmail.com" className="underline">Bookings</a>
        </div>
      </div>
    </div>
  )
}
