export const metadata = {
  title: 'Bio - Taylor Diamond',
  description: 'About Taylor Diamond - multimedia artist and educator',
}

import React from 'react'
import Image from 'next/image'
import { getDjHeadshot } from '@/lib/cloudinary'

export const revalidate = 3600

const GOOGLE_DOC_EXPORT_URL =
  'https://docs.google.com/document/d/12Dh1vXZpPg1aeuAQiIKtnKHrC56NMZOfpjCIWA9Qcas/export?format=txt'

function renderWithItalics(text: string): React.ReactNode[] {
  return text.split(/\*([^*]+)\*/).map((chunk, i) =>
    i % 2 === 1 ? <em key={i}>{chunk}</em> : chunk
  )
}

async function getBioParagraphs(): Promise<string[]> {
  try {
    const res = await fetch(GOOGLE_DOC_EXPORT_URL, { next: { revalidate: 3600 } })
    const text = await res.text()
    return text
      .replace(/^﻿/, '')
      .replace(/\r\n/g, '\n')
      .split(/\n{2,}/)
      .map((p) => p.trim())
      .filter(Boolean)
  } catch {
    return []
  }
}

export default async function BioPage() {
  const [headshot, paragraphs] = await Promise.all([getDjHeadshot(), getBioParagraphs()])

  return (
    <div className="min-h-screen text-black bg-white px-6 pt-24 pb-20 relative">
      <div className="max-w-2xl mx-auto relative z-10">
        <h1 className="text-2xl font-semibold mb-6">Bio</h1>
        <div className="space-y-5 text-sm leading-7 text-black/90">
          {paragraphs.map((p, i) => (
            <p key={i}>{renderWithItalics(p)}</p>
          ))}
        </div>

        {headshot && (
          <div className="mt-8 relative">
            <Image
              src={headshot.src}
              alt={headshot.alt}
              width={headshot.width}
              height={headshot.height}
              className="w-full h-auto object-contain"
              sizes="(max-width: 768px) 92vw, 640px"
            />
          </div>
        )}

        <div className="mt-10">
          <a href="mailto:taylor.diamond10@gmail.com" className="underline">Contact</a>
        </div>
      </div>
    </div>
  )
}
