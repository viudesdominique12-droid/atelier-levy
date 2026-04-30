import { WATCHES, type Watch } from './watches-data'

export type { Watch, WatchImage } from './watches-data'
export { WATCHES }

export function formatPrice(price: string | number, currency = 'EUR'): string {
  const n = typeof price === 'string' ? Number(price) : price
  if (!Number.isFinite(n)) return ''
  const formatter = new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  })
  return formatter.format(n)
}

export function getWatchesOnly(): Watch[] {
  return WATCHES.filter((w) => !w.isJewelry)
}

export function getJewelry(): Watch[] {
  return WATCHES.filter((w) => w.isJewelry)
}

export function getWatchBySlug(slug: string): Watch | undefined {
  return WATCHES.find((w) => w.slug === slug)
}

export function getRelatedWatches(slug: string, limit = 3): Watch[] {
  const current = getWatchBySlug(slug)
  if (!current) return []
  const sameBrand = WATCHES.filter(
    (w) => w.slug !== slug && !w.isJewelry && w.brand === current.brand,
  )
  if (sameBrand.length >= limit) return sameBrand.slice(0, limit)
  const others = WATCHES.filter(
    (w) => w.slug !== slug && !w.isJewelry && w.brand !== current.brand,
  )
  return [...sameBrand, ...others].slice(0, limit)
}

export function formatYear(year: string | null): string {
  if (!year) return '—'
  return year
}
