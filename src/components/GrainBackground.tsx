const bgPhoto = 'https://res.cloudinary.com/dpaytjafy/image/upload/w_1920,q_auto,f_auto/IMG_5636_ysqz7g.jpg'

export default function GrainBackground() {
  return (
    <div className="fixed inset-0 -z-10">
      <div className="absolute inset-0 landing-page" />
      <div
        className="absolute inset-0 bg-cover bg-center opacity-[0.04]"
        style={{ backgroundImage: `url(${bgPhoto})` }}
      />
      <div className="grain-overlay" />
    </div>
  )
}
