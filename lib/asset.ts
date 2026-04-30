// next/image avec `images.unoptimized: true` n'applique PAS automatiquement
// le basePath aux URLs `src`. Sur GitHub Pages le site est servi à
// /atelier-levy/, donc une src `/products/foo.jpg` se résout en
// https://…/products/foo.jpg → 404. Ce helper préfixe à la main.
const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? ''

export function asset(path: string | null | undefined): string {
  if (!path) return ''
  if (!path.startsWith('/')) return path
  return `${BASE}${path}`
}
