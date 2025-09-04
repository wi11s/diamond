export default function Loading() {
  return (
    <div className="min-h-screen bg-white text-black flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-2 border-black/30 border-t-black rounded-full animate-spin" />
        <div className="text-xs tracking-widest uppercase text-black/60">Loading</div>
      </div>
    </div>
  )
}


