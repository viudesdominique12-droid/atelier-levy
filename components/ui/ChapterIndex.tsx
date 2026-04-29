'use client'

/**
 * Index de chapitre vertical fixe à droite. Numérotation romaine.
 * Le chapitre actif passe en laiton, les autres restent en gris.
 * Met à jour son état via IntersectionObserver sur les sections marquées
 * `data-act` (numéro de l'acte).
 */

import { useEffect, useState } from 'react'
import { cn } from '@/lib/cn'

const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI']
const LABELS = [
  'Le silence',
  'Le démontage',
  'Le geste',
  'Le retour',
  'Le territoire',
  "L'invitation",
]

export default function ChapterIndex() {
  const [active, setActive] = useState(0)

  useEffect(() => {
    const sections = document.querySelectorAll<HTMLElement>('[data-act]')
    if (!sections.length) return

    const obs = new IntersectionObserver(
      (entries) => {
        // Garde le premier acte intersectant le centre du viewport
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
        if (visible.length) {
          const idx = parseInt(
            (visible[0].target as HTMLElement).dataset.act ?? '1',
            10,
          )
          setActive(idx - 1)
        }
      },
      { rootMargin: '-40% 0px -40% 0px', threshold: [0, 0.5, 1] },
    )

    sections.forEach((s) => obs.observe(s))
    return () => obs.disconnect()
  }, [])

  return (
    <aside
      aria-hidden
      className="pointer-events-none fixed right-[clamp(20px,3vw,48px)] top-1/2 z-40 hidden -translate-y-1/2 md:block"
    >
      <ol className="flex flex-col gap-5">
        {ROMAN.map((r, i) => {
          const isActive = i === active
          return (
            <li
              key={r}
              className={cn(
                'flex items-center gap-4 transition-all duration-500',
                isActive ? 'opacity-100' : 'opacity-40',
              )}
            >
              <span
                className={cn(
                  'h-px transition-all duration-500',
                  isActive ? 'w-10 bg-brass' : 'w-3 bg-text-dim',
                )}
              />
              <span
                className={cn(
                  'font-mono text-[10px] uppercase tracking-[0.32em] transition-colors duration-500',
                  isActive ? 'text-brass' : 'text-text-dim',
                )}
              >
                {r}
              </span>
              <span
                className={cn(
                  'font-mono text-[10px] uppercase tracking-[0.28em] transition-all duration-500',
                  isActive
                    ? 'max-w-[140px] text-text opacity-100'
                    : 'max-w-0 overflow-hidden text-text-dim opacity-0',
                )}
              >
                {LABELS[i]}
              </span>
            </li>
          )
        })}
      </ol>
    </aside>
  )
}
