'use client'

import { motion } from 'framer-motion'
import { Calendar, MapPin, Clock, Camera } from 'lucide-react'

// Mock upcoming photography sessions and events
const upcomingDates = [
  {
    id: '1',
    title: 'Golden Hour Portrait Session',
    date: '2024-02-15',
    time: '17:30',
    location: 'Central Park, NYC',
    type: 'portrait',
    available: true
  },
  {
    id: '2',
    title: 'Wedding Photography',
    date: '2024-02-18',
    time: '14:00',
    location: 'Brooklyn Bridge Park',
    type: 'wedding',
    available: false
  },
  {
    id: '3',
    title: 'Street Photography Walk',
    date: '2024-02-22',
    time: '10:00',
    location: 'SoHo District',
    type: 'street',
    available: true
  },
  {
    id: '4',
    title: 'Landscape Sunrise Shoot',
    date: '2024-02-25',
    time: '06:30',
    location: 'Bear Mountain',
    type: 'landscape',
    available: true
  },
  {
    id: '5',
    title: 'Corporate Headshots',
    date: '2024-03-01',
    time: '09:00',
    location: 'Manhattan Studio',
    type: 'corporate',
    available: false
  },
  {
    id: '6',
    title: 'Fashion Editorial',
    date: '2024-03-05',
    time: '13:00',
    location: 'DUMBO Rooftop',
    type: 'fashion',
    available: true
  }
]

const getTypeColor = (type: string) => {
  switch (type) {
    case 'portrait': return 'text-blue-400'
    case 'wedding': return 'text-pink-400'
    case 'street': return 'text-yellow-400'
    case 'landscape': return 'text-green-400'
    case 'corporate': return 'text-purple-400'
    case 'fashion': return 'text-orange-400'
    default: return 'text-white'
  }
}

export default function Dates() {
  return (
    <div className="min-h-screen bg-black text-white overflow-auto">
      <div className="max-w-4xl mx-auto px-6 py-24">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-3 mb-8">
            <Calendar className="text-white" size={32} />
            <h1 className="chunky-font text-4xl md:text-6xl font-light">
              UPCOMING DATES
            </h1>
          </div>
          
          <p className="text-white/70 text-lg max-w-2xl mx-auto leading-relaxed">
            Photography sessions, workshops, and collaborative projects. 
            Available dates are open for bookings.
          </p>
        </motion.div>

        {/* Dates Grid */}
        <div className="space-y-6">
          {upcomingDates.map((session, index) => (
            <motion.div
              key={session.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`bg-black/40 backdrop-blur-sm border border-white/10 p-6 
                         hover:border-white/20 transition-all duration-300 ${
                           session.available ? 'hover:bg-white/5' : 'opacity-60'
                         }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <Camera className={getTypeColor(session.type)} size={20} />
                    <h3 className="text-xl font-light">
                      {session.title}
                    </h3>
                    {!session.available && (
                      <span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs font-mono uppercase tracking-wider">
                        Booked
                      </span>
                    )}
                    {session.available && (
                      <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs font-mono uppercase tracking-wider">
                        Available
                      </span>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-white/60 text-sm font-mono">
                    <div className="flex items-center gap-2">
                      <Calendar size={16} />
                      <span>{new Date(session.date).toLocaleDateString('en-US', { 
                        weekday: 'short', 
                        month: 'short', 
                        day: 'numeric' 
                      })}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Clock size={16} />
                      <span>{session.time}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <MapPin size={16} />
                      <span>{session.location}</span>
                    </div>
                  </div>
                </div>
                
                {session.available && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 border border-white/30 text-white/80 hover:bg-white/10 
                             hover:text-white transition-all duration-200 text-sm font-mono uppercase tracking-wider"
                  >
                    Book
                  </motion.button>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Contact Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center mt-16 pt-16 border-t border-white/10"
        >
          <h2 className="text-2xl font-light mb-4">
            Don't see what you're looking for?
          </h2>
          <p className="text-white/60 mb-8">
            Custom sessions and collaborations always welcome.
          </p>
          <motion.a
            href="mailto:taylor@example.com"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block px-8 py-3 border border-white text-white hover:bg-white 
                     hover:text-black transition-all duration-300 font-mono uppercase tracking-wider"
          >
            Get in Touch
          </motion.a>
        </motion.div>
      </div>
    </div>
  )
}