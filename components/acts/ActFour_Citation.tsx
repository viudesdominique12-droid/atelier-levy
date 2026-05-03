'use client'

/**
 * Acte IV — La confiance. Climax du récit business.
 *
 * Trois temps : Authentique. → Garantie deux ans. → Acheter en confiance,
 * vendre en sérénité. Le point laiton pulse en continu — la cadence du
 * marché qu'on orchestre.
 */

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const BEATS = ['Authentique.', 'Garantie deux ans.', 'Acheter en confiance, vendre en sérénité.']

export default function ActFourRetour() {
  const sectionRef = useRef<HTMLElement>(null)
  const beatRefs = useRef<(HTMLDivElement | null)[]>([])
  const dotRef = useRef<HTMLSpanElement>(null)
  const counterRef = useRef<HTMLSpanElement>(null)
  const cadenceRef = useRef<number>(0)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return
    const ctx = gsap.context(() => {
      // Apparition en cascade rapide — toutes les phrases sur le même écran
      beatRefs.current.forEach((el, i) => {
        if (!el) return
        gsap.set(el, { opacity: 0, y: 16 })
        gsap.to(el, {
          opacity: 1,
          y: 0,
          duration: 0.5,
          delay: i * 0.22,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            toggleActions: 'play none none none',
          },
        })
      })

      // Cadence et compteur calés sur le progrès global de la section
      ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: 'bottom bottom',
        onUpdate: (s) => {
          cadenceRef.current = s.progress
          if (counterRef.current) {
            counterRef.current.textContent = String(
              Math.floor(s.progress * 28800).toLocaleString('fr-FR'),
            )
          }
        },
      })

      // Battement laiton — accélère avec la cadence
      const dot = dotRef.current
      if (dot) {
        gsap.set(dot, { opacity: 0.2 })
        const pulse = () => {
          if (!dot) return
          const cadence = cadenceRef.current
          const restDuration = Math.max(0.1, 0.9 - cadence * 0.75)
          gsap.to(dot, {
            opacity: 1,
            scale: 1.3,
            duration: 0.12,
            onComplete: () => {
              gsap.to(dot, {
                opacity: 0.2,
                scale: 1,
                duration: restDuration,
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
      data-act="4"
      className="relative"
      aria-label="Acte IV — La confiance"
    >
      {/* Étiquette verticale du chapitre */}
      <div className="pointer-events-none absolute left-[clamp(20px,5vw,80px)] top-[20vh] -rotate-90 origin-top-left">
        <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-text-dim whitespace-nowrap">
          Acte IV — La confiance
        </span>
      </div>

      {/* Une seule scène : les 3 temps empilés. Le pulse laiton et le
          compteur en bas continuent à donner du rythme. */}
      <div className="flex min-h-screen w-full flex-col items-center justify-center gap-6 px-6 py-[18vh] text-center md:gap-10">
        {BEATS.map((line, i) => (
          <div
            key={i}
            ref={(el) => {
              beatRefs.current[i] = el
            }}
            className="text-spotlight will-change-transform px-6 py-3"
          >
            <h2 className="font-display text-[clamp(36px,6vw,104px)] font-normal leading-[1.05] tracking-tightest text-text">
              {line}
            </h2>
          </div>
        ))}
      </div>

      {/* Battement laiton + compteur fixés en bas de section */}
      <div className="pointer-events-none absolute inset-x-0 bottom-[10vh] flex flex-col items-center gap-3">
        <span
          ref={dotRef}
          aria-hidden
          className="h-2.5 w-2.5 rounded-full bg-brass"
          style={{ opacity: 0.2 }}
        />
        <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-text-dim">
          <span ref={counterRef} className="text-brass">
            0
          </span>{' '}
          battements depuis le début du récit
        </p>
      </div>
    </section>
  )
}
