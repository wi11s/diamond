'use client'

import { motion } from 'framer-motion'
import { Camera, Heart, Award, Users } from 'lucide-react'

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
}

const stats = [
  { icon: Camera, label: 'Photos Captured', value: '10,000+' },
  { icon: Heart, label: 'Happy Clients', value: '250+' },
  { icon: Award, label: 'Awards Won', value: '15' },
  { icon: Users, label: 'Workshops Taught', value: '50+' },
]

export default function About() {
  return (
    <div className="min-h-screen pt-24 pb-12 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-gradient">
            About Me
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Passionate photographer dedicated to capturing life&apos;s most authentic moments
            and telling stories that resonate with the human experience.
          </p>
        </motion.div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
          <motion.div
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <div className="glass-effect p-8 rounded-2xl">
              <h2 className="text-3xl font-bold mb-6">My Journey</h2>
              <div className="space-y-4 text-gray-300">
                <p>
                  Photography found me during a transformative trip to Iceland in 2018. 
                  What started as documenting memories quickly evolved into a deep passion 
                  for visual storytelling and capturing the extraordinary in the everyday.
                </p>
                <p>
                  Over the years, I&apos;ve specialized in portrait photography, landscape 
                  work, and documentary-style shoots. My approach combines technical 
                  precision with emotional authenticity, creating images that not only 
                  look beautiful but feel meaningful.
                </p>
                <p>
                  When I&apos;m not behind the camera, you&apos;ll find me teaching workshops, 
                  exploring new locations, or experimenting with new techniques to push 
                  the boundaries of my creative vision.
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="relative"
          >
            <div className="glass-effect p-8 rounded-2xl">
              <div className="w-full h-80 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl flex items-center justify-center">
                <Camera size={64} className="text-white/50" />
              </div>
              <p className="text-center text-gray-400 mt-4 italic">
                Profile photo coming soon
              </p>
            </div>
          </motion.div>
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h2 className="text-3xl font-bold text-center mb-12">By the Numbers</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="glass-effect p-6 rounded-xl text-center"
              >
                <stat.icon className="mx-auto mb-4 text-blue-400" size={40} />
                <div className="text-2xl font-bold mb-2">{stat.value}</div>
                <div className="text-gray-400 text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Philosophy Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="glass-effect p-8 rounded-2xl text-center"
        >
          <h2 className="text-3xl font-bold mb-6">My Philosophy</h2>
          <blockquote className="text-xl text-gray-300 italic max-w-4xl mx-auto">
            &quot;Every photograph is a story waiting to be told. My role isn&apos;t just to 
            capture what I see, but to reveal what others might miss – the fleeting 
            emotions, the perfect light, the decisive moment that makes an image 
            unforgettable.&quot;
          </blockquote>
          <p className="text-gray-400 mt-4">— Taylor Diamond</p>
        </motion.div>
      </div>
    </div>
  )
}