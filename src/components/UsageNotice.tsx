'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

export default function UsageNotice() {
  const pathname = usePathname()

  // Only show on portrait and landscape pages
  const allowed = pathname?.startsWith('/portraits') || pathname?.startsWith('/landscape')

  if (!allowed) return null

  return (
    <div
      className="auto-hide fixed inset-x-0 bottom-4 z-30 flex justify-center pointer-events-none transition-opacity duration-300"
      aria-hidden
    >
      <div className="px-3 py-1 rounded-full bg-white/80 border border-gray-200 text-[11px] leading-none text-gray-600 shadow-sm">
        All photos © Taylor Diamond
      </div>
    </div>
  )
}
