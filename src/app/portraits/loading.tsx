const bgPhoto = 'https://res.cloudinary.com/dpaytjafy/image/upload/w_1920,q_auto,f_auto/IMG_5636_ysqz7g.jpg'

export default function Loading() {
  return (
    <div className="landing-page min-h-screen flex items-center justify-center">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-[0.04]"
        style={{ backgroundImage: `url(${bgPhoto})` }}
      />
      <div className="grain-overlay" />
      <div className="relative z-10 w-6 h-6 border-[3px] border-transparent border-t-white/30 rounded-full animate-spin" />
    </div>
  )
}
