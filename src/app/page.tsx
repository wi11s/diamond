'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Camera, User, BookOpen } from 'lucide-react'
import Scene3D from '@/components/Scene3D'

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
}

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.2
    }
  }
}

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <Scene3D />
      
      {/* Hero Section */}
      <section className="relative z-10 min-h-screen flex items-center justify-center px-6">
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="text-center max-w-4xl mx-auto"
        >
          <motion.h1
            variants={fadeInUp}
            className="text-6xl md:text-8xl font-bold mb-6 text-gradient"
          >
            Taylor Diamond
          </motion.h1>
          
          <motion.p
            variants={fadeInUp}
            className="text-xl md:text-2xl mb-8 text-gray-300 max-w-2xl mx-auto"
          >
            Photographer, Creative, and Storyteller. 
            Capturing moments that matter and sharing stories that inspire.
          </motion.p>
          
          <motion.div
            variants={fadeInUp}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link
              href="/photos"
              className="glass-effect px-8 py-4 rounded-full flex items-center space-x-2 hover:bg-white/20 transition-all group"
            >
              <span>View My Work</span>
              <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
            </Link>
            
            <Link
              href="/about"
              className="border border-white/30 px-8 py-4 rounded-full hover:bg-white/10 transition-all"
            >
              Learn More
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Quick Links Section */}
      <section className="relative z-10 py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-8"
          >
            <Link href="/photos" className="group">
              <div className="glass-effect p-8 rounded-2xl hover:bg-white/20 transition-all group-hover:scale-105">
                <Camera className="text-blue-400 mb-4 group-hover:scale-110 transition-transform" size={48} />
                <h3 className="text-2xl font-bold mb-3">Photography</h3>
                <p className="text-gray-400">
                  Explore my collection of captured moments and visual stories.
                </p>
              </div>
            </Link>

            <Link href="/about" className="group">
              <div className="glass-effect p-8 rounded-2xl hover:bg-white/20 transition-all group-hover:scale-105">
                <User className="text-purple-400 mb-4 group-hover:scale-110 transition-transform" size={48} />
                <h3 className="text-2xl font-bold mb-3">About Me</h3>
                <p className="text-gray-400">
                  Learn about my journey, passion, and creative process.
                </p>
              </div>
            </Link>

            <Link href="/blog" className="group">
              <div className="glass-effect p-8 rounded-2xl hover:bg-white/20 transition-all group-hover:scale-105">
                <BookOpen className="text-pink-400 mb-4 group-hover:scale-110 transition-transform" size={48} />
                <h3 className="text-2xl font-bold mb-3">Blog</h3>
                <p className="text-gray-400">
                  Read my thoughts, tips, and stories from behind the lens.
                </p>
              </div>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}