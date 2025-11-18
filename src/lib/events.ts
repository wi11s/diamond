const SHEET_CSV_URL = process.env.EVENTS_SHEET_CSV_URL || ''

export type EventRow = {
  id?: string
  title?: string
  date?: string
  venue?: string
  location?: string
  link?: string
}

function normalizeHeader(h: string) {
  return h.replace(/\ufeff/g, '').trim().toLowerCase()
}

function parseCsv(csv: string): EventRow[] {
  // Basic CSV parser for simple comma‑separated Google Sheets export
  const trimmed = (csv.charCodeAt(0) === 0xfeff ? csv.slice(1) : csv).trim()
  const lines = trimmed.split(/\r?\n/).filter(Boolean)
  if (lines.length === 0) return []
  const headers = lines[0].split(',').map(normalizeHeader)

  return lines.slice(1)
    .filter((r) => r.trim().length > 0)
    .map((row) => {
      const cols = row.split(',').map((c) => c.replace(/\ufeff/g, '').trim())
      const obj: any = {}
      headers.forEach((h, i) => {
        obj[h] = cols[i] ?? ''
      })
      const out: EventRow = {
        id: obj['id'] ?? '',
        title: obj['title'] ?? '',
        date: obj['date'] ?? '',
        venue: obj['venue'] ?? '',
        location: obj['location'] ?? '',
        link: obj['link'] ?? '',
      }
      return out
    })
}

function toCsvUrl(input: string): string {
  try {
    const u = new URL(input)
    const host = u.hostname
    const path = u.pathname
    // Convert common Google Sheets share/edit links to CSV export
    if (host.includes('docs.google.com') && /\/spreadsheets\/d\//.test(path)) {
      const m = path.match(/\/spreadsheets\/d\/([^/]+)/)
      const id = m?.[1]
      const gid = u.searchParams.get('gid')
      if (id) {
        const csv = `https://docs.google.com/spreadsheets/d/${id}/export?format=csv${gid ? `&gid=${gid}` : ''}`
        return csv
      }
    }
  } catch (_) {
    // fall through
  }
  return input
}

export async function getEvents(): Promise<EventRow[]> {
  try {
    if (!SHEET_CSV_URL) return []

    const initialUrl = SHEET_CSV_URL
    let res = await fetch(initialUrl, { next: { revalidate: 60 } })
    if (!res.ok) return []

    let csv = await res.text()

    // Detect HTML response (e.g., Google Sheets edit page) and retry with export URL
    const looksHtml = /^\s*<!DOCTYPE html|^\s*<html/i.test(csv)
    if (looksHtml) {
      const exportUrl = toCsvUrl(initialUrl)
      res = await fetch(exportUrl, { next: { revalidate: 60 } })
      if (!res.ok) return []
      csv = await res.text()
    }

    const events = parseCsv(csv)

    // Filter valid rows (must have id) and sort ascending by date if present
    const filtered = events.filter((e) => (e.id || '').trim() !== '')
    const sorted = filtered.sort((a, b) => {
      const ta = a.date ? new Date(`${a.date}T00:00:00`).getTime() : Number.MAX_SAFE_INTEGER
      const tb = b.date ? new Date(`${b.date}T00:00:00`).getTime() : Number.MAX_SAFE_INTEGER
      return ta - tb
    })

    return sorted
  } catch (err) {
    return []
  }
}
