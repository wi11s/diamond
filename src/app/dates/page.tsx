'use client'

// Upcoming DJ sets and events
const upcomingEvents = [
  {
    id: '1',
    title: 'Midnight Warehouse Session',
    date: '2024-02-16',
    time: '23:00',
    venue: 'Underground NYC',
    location: 'Brooklyn, NY',
    type: 'warehouse',
    genre: 'Techno • Dark House',
    capacity: '500',
    status: 'confirmed'
  },
  {
    id: '2',
    title: 'Rooftop Sunset Vibes',
    date: '2024-02-23',
    time: '18:00',
    venue: 'Sky Lounge',
    location: 'Manhattan, NY',
    type: 'rooftop',
    genre: 'Deep House • Progressive',
    capacity: '200',
    status: 'confirmed'
  },
  {
    id: '3',
    title: 'Underground Friday',
    date: '2024-03-01',
    time: '22:00',
    venue: 'The Basement',
    location: 'Queens, NY',
    type: 'club',
    genre: 'Tech House • Minimal',
    capacity: '300',
    status: 'sold_out'
  },
  {
    id: '4',
    title: 'Festival Main Stage',
    date: '2024-03-08',
    time: '20:00',
    venue: 'Electric Dreams Festival',
    location: 'Central Park, NY',
    type: 'festival',
    genre: 'Progressive House • Trance',
    capacity: '5000',
    status: 'confirmed'
  },
  {
    id: '5',
    title: 'Late Night Sessions',
    date: '2024-03-15',
    time: '01:00',
    venue: 'After Hours',
    location: 'Brooklyn, NY',
    type: 'afterparty',
    genre: 'Melodic Techno • Deep',
    capacity: '150',
    status: 'private'
  },
  {
    id: '6',
    title: 'Summer Kickoff Party',
    date: '2024-03-22',
    time: '19:00',
    venue: 'Harbor Club',
    location: 'Jersey City, NJ',
    type: 'outdoor',
    genre: 'House • Disco • Funk',
    capacity: '800',
    status: 'confirmed'
  }
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
              {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              {' — '}
              {event.title}
              {' — '}
              {event.venue}, {event.location}
            </li>
          ))}
        </ul>
        <div className="mt-12">
          <a href="mailto:bookings@diamondcutz.com" className="underline">Bookings</a>
        </div>
      </div>
    </div>
  )
}