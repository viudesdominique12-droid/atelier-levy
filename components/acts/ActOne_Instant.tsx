'use client'

/**
 * Acte I — L'arrivée.
 *
 * Une montre passe entre nos mains. Avant l'envie d'acheter, avant le prix,
 * avant le geste — on regarde. C'est l'ouverture du récit Parker & Smith.
 */

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const LINES = [
  'Une montre,',
  'qui a déjà vécu.',
  "Avant tout — on regarde.",
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
      lineRefs.current.forEach((el) => {
        if (!el) return
        gsap.set(el, { opacity: 0, y: 24 })
        gsap.to(el, {
          opacity: 1,
          y: 0,
          duration: 1.1,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 75%',
            end: 'bottom 35%',
            toggleActions: 'play reverse play reverse',
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
      aria-label="Acte I — L'arrivée"
    >
      {/* Étiquette verticale du chapitre, fixée à l'entrée de l'acte */}
      <div className="pointer-events-none absolute left-[clamp(20px,5vw,80px)] top-[20vh] -rotate-90 origin-top-left">
        <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-text-dim whitespace-nowrap">
          Acte I — L&apos;arrivée
        </span>
      </div>

      {/* Trois écrans de scroll, une phrase par écran. Chacune apparaît
          quand elle entre dans le viewport puis s'efface quand elle sort. */}
      {LINES.map((line, i) => (
        <div
          key={i}
          className="flex h-screen w-full items-center justify-center px-6 text-center"
        >
          <div
            ref={(el) => {
              lineRefs.current[i] = el
            }}
            className="text-spotlight will-change-transform px-8 py-6"
          >
            <h2 className="font-display text-[clamp(40px,7vw,128px)] font-normal leading-[1] tracking-tightest text-text">
              {line}
            </h2>
          </div>
        </div>
      ))}

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
