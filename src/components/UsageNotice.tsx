'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

export default function UsageNotice() {
  const pathname = usePathname()

  // Only show on portrait and landscape pages
  const allowed = (
    pathname?.startsWith('/portraits') ||
    pathname?.startsWith('/landscape')
  )

  if (!allowed) return null

  return (
    <div
      className="invert-blend fixed inset-x-0 bottom-4 z-30 flex justify-center pointer-events-none"
      aria-hidden
    >
      <div className="text-sm leading-none">
        All photos © Taylor Diamond
      </div>
    </div>
  )
}
