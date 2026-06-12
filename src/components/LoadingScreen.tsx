export default function LoadingScreen({ done = false }: { done?: boolean }) {
  return (
    <div
      aria-hidden
      className={`fixed inset-0 bg-white z-[60] pointer-events-none flex flex-col items-center justify-center gap-4 transition-opacity duration-700 ${done ? 'opacity-0' : 'opacity-100'}`}
    >
      <div className="grain-overlay" />
      <span className="text-[11px] font-medium uppercase tracking-[0.4em] pl-[0.4em] text-black/50">
        loading
        <span className="loading-dots">
          <span>.</span>
          <span>.</span>
          <span>.</span>
        </span>
      </span>
    </div>
  )
}
