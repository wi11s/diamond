'use client'

import { motion } from 'framer-motion'
import { Calendar, MapPin, Clock, Music, Volume2, Users } from 'lucide-react'

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
    <div className="min-h-screen bg-black text-white overflow-auto relative">
      {/* DIAMONDCUTZ Background */}
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.05, scale: 1 }}
          transition={{ duration: 2 }}
          className="text-[20vw] font-black leading-none select-none"
          style={{
            fontFamily: 'Arial Black, sans-serif',
            letterSpacing: '-0.1em',
            transform: 'rotate(-15deg)'
          }}
        >
          DIAMONDCUTZ
        </motion.div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-24">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="mb-8"
          >
            <h1 className="chunky-font text-6xl md:text-8xl font-black mb-4 bg-gradient-to-r from-white via-gray-300 to-white bg-clip-text text-transparent">
              DIAMONDCUTZ
            </h1>
            <div className="flex items-center justify-center gap-4 text-white/60">
              <Volume2 size={20} />
              <span className="font-mono uppercase tracking-[0.3em] text-sm">
                Upcoming Sets & Events
              </span>
              <Volume2 size={20} />
            </div>
          </motion.div>
        </motion.div>

        {/* Events Grid */}
        <div className="space-y-8">
          {upcomingEvents.map((event, index) => {
            const statusInfo = getStatusInfo(event.status)
            
            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: index * 0.15 }}
                className="bg-black/60 backdrop-blur-sm border border-white/10 hover:border-white/30 
                         transition-all duration-500 overflow-hidden group"
              >
                <div className="p-8">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-4">
                        <Music className={getEventColor(event.type)} size={24} />
                        <h3 className="text-2xl md:text-3xl font-light">
                          {event.title}
                        </h3>
                        <span className={`px-3 py-1 text-xs font-mono uppercase tracking-wider ${statusInfo.color}`}>
                          {statusInfo.text}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-white/70">
                        <div className="flex items-center gap-3">
                          <Calendar size={18} />
                          <div>
                            <div className="text-sm font-mono opacity-60">DATE</div>
                            <div className="font-medium">
                              {new Date(event.date).toLocaleDateString('en-US', { 
                                weekday: 'short', 
                                month: 'short', 
                                day: 'numeric' 
                              })}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <Clock size={18} />
                          <div>
                            <div className="text-sm font-mono opacity-60">TIME</div>
                            <div className="font-medium">{event.time}</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <MapPin size={18} />
                          <div>
                            <div className="text-sm font-mono opacity-60">VENUE</div>
                            <div className="font-medium">{event.venue}</div>
                            <div className="text-sm opacity-60">{event.location}</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <Users size={18} />
                          <div>
                            <div className="text-sm font-mono opacity-60">CAPACITY</div>
                            <div className="font-medium">{event.capacity}</div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-4 pt-4 border-t border-white/10">
                        <div className="text-sm font-mono opacity-60 mb-1">SOUND</div>
                        <div className="text-lg font-medium text-white/90">{event.genre}</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Animated bottom bar */}
                <div className="h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent 
                               transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700" />
              </motion.div>
            )
          })}
        </div>

        {/* Booking Section */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="text-center mt-24 pt-16 border-t border-white/10"
        >
          <h2 className="text-3xl font-light mb-6">
            Book DIAMONDCUTZ
          </h2>
          <p className="text-white/60 mb-10 text-lg">
            Available for private events, clubs, festivals, and collaborations.
          </p>
          <motion.a
            href="mailto:bookings@diamondcutz.com"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block px-12 py-4 border-2 border-white text-white hover:bg-white 
                     hover:text-black transition-all duration-400 font-mono uppercase tracking-[0.2em] text-sm"
          >
            Get in Touch
          </motion.a>
        </motion.div>
      </div>
    </div>
  )
}