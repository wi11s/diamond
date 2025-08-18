'use client'

import { Calendar, MapPin, Clock, Music, Users } from 'lucide-react'

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
    <div className="min-h-screen bg-black text-white p-6 pt-24">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-12 text-center">Upcoming Events</h1>

        <div className="space-y-6">
          {upcomingEvents.map((event) => {
            const statusInfo = getStatusInfo(event.status)
            
            return (
              <div
                key={event.id}
                className="border border-white/20 p-6"
              >
                <div className="flex items-center gap-4 mb-4">
                  <Music size={20} />
                  <h3 className="text-xl font-medium">{event.title}</h3>
                  <span className={`px-2 py-1 text-xs ${statusInfo.color}`}>
                    {statusInfo.text}
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-white/80">
                  <div className="flex items-center gap-2">
                    <Calendar size={16} />
                    <div>
                      <div className="text-xs text-white/60">DATE</div>
                      <div>
                        {new Date(event.date).toLocaleDateString('en-US', { 
                          weekday: 'short', 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Clock size={16} />
                    <div>
                      <div className="text-xs text-white/60">TIME</div>
                      <div>{event.time}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <MapPin size={16} />
                    <div>
                      <div className="text-xs text-white/60">VENUE</div>
                      <div>{event.venue}</div>
                      <div className="text-xs text-white/60">{event.location}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Users size={16} />
                    <div>
                      <div className="text-xs text-white/60">CAPACITY</div>
                      <div>{event.capacity}</div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-white/10">
                  <div className="text-xs text-white/60 mb-1">GENRE</div>
                  <div className="text-white">{event.genre}</div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="text-center mt-16 pt-12 border-t border-white/20">
          <h2 className="text-2xl font-semibold mb-4">Book Events</h2>
          <p className="text-white/80 mb-8">
            Available for private events, clubs, festivals, and collaborations.
          </p>
          <a
            href="mailto:bookings@diamondcutz.com"
            className="inline-block px-8 py-3 border border-white text-white hover:bg-white hover:text-black transition-colors"
          >
            Get in Touch
          </a>
        </div>
      </div>
    </div>
  )
}