'use client'

/**
 * Acte I — La maison.
 *
 * Ouverture du récit Parker & Smith : pas un atelier, pas un revendeur —
 * une maison horlogère indépendante qui opère sur le neuf, l'occasion et
 * le vintage, à l'international. Trois lignes pour planter le décor.
 */

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const LINES = [
  'Une maison horlogère.',
  'Indépendante.',
  'Neuf, occasion, vintage. À l’international.',
]

export default function ActOneSilence() {
  const sectionRef = useRef<HTMLElement>(null)
  const lineRefs = useRef<(HTMLDivElement | null)[]>([])
  const dotRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return
    const ctx = gsap.context(() => {
      // Fondu d'entrée et de sortie pour chaque ligne, indépendant — chaque
      // bloc déclenche sa propre animation sur sa propre fenêtre de scroll.
      lineRefs.current.forEach((el, i) => {
        if (!el) return
        gsap.set(el, { opacity: 0, y: 16 })
        gsap.to(el, {
          opacity: 1,
          y: 0,
          duration: 0.5,
          delay: i * 0.18,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            toggleActions: 'play none none none',
          },
        })
      })

      // Battement laiton qui ralentit progressivement le long de la section
      const dot = dotRef.current
      if (dot) {
        gsap.set(dot, { opacity: 0.15 })
        let cadence = 1
        ScrollTrigger.create({
          trigger: section,
          start: 'top top',
          end: 'bottom bottom',
          onUpdate: (s) => {
            cadence = Math.max(0, 1 - s.progress * 1.2)
          },
        })
        const pulse = () => {
          if (cadence <= 0.01 || !dot) return
          gsap.to(dot, {
            opacity: 1,
            duration: 0.18,
            onComplete: () => {
              gsap.to(dot, {
                opacity: 0.15,
                duration: 0.42 + (1 - cadence) * 1.5,
                onComplete: pulse,
              })
            },
          })
        }
        pulse()
      }
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      data-act="1"
      className="relative"
      aria-label="Acte I — La maison"
    >
      {/* Étiquette verticale du chapitre, fixée à l'entrée de l'acte */}
      <div className="pointer-events-none absolute left-[clamp(20px,5vw,80px)] top-[20vh] -rotate-90 origin-top-left">
        <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-text-dim whitespace-nowrap">
          Acte I — La maison
        </span>
      </div>

      {/* Une seule scène : les 3 phrases empilées dans le même écran. Apparition
          rapide en cascade dès l'entrée dans le viewport — plus de scroll-trap
          à 3 écrans pour 3 phrases. */}
      <div className="flex min-h-screen w-full flex-col items-center justify-center gap-6 px-6 py-[18vh] text-center md:gap-10">
        {LINES.map((line, i) => (
          <div
            key={i}
            ref={(el) => {
              lineRefs.current[i] = el
            }}
            className="text-spotlight will-change-transform px-6 py-3"
          >
            <h2 className="font-display text-[clamp(36px,6vw,104px)] font-normal leading-[1.05] tracking-tightest text-text">
              {line}
            </h2>
          </div>
        ))}
      </div>

      {/* Battement laiton — fixé au coin bas, présent toute la durée de l'acte */}
      <div className="pointer-events-none absolute inset-x-0 bottom-[10vh] flex flex-col items-center">
        <span
          ref={dotRef}
          aria-hidden
          className="h-2 w-2 rounded-full bg-brass"
          style={{ opacity: 0.15 }}
        />
        <span className="mt-3 font-mono text-[10px] uppercase tracking-[0.32em] text-text-dim">
          Battement
        </span>
      </div>
    </section>
  )
}
