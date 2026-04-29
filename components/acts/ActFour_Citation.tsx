'use client'

/**
 * Acte IV — Le retour à la vie. Climax de l'arc narratif.
 *
 * Refonte : plus de pinned 250vh, plus de scroll-trap. Le scroll global est
 * piloté par la montre en fond (WatchBackground), donc on laisse la page
 * défiler naturellement façon Apple. Trois temps : Tic. → Tic. Tac. → Elle
 * bat à nouveau. Chaque temps occupe son propre écran, fade-in à l'entrée,
 * fade-out à la sortie. Le point laiton pulse de plus en plus vite à mesure
 * que l'utilisateur descend dans la section. Compteur de battements en bas.
 */

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const BEATS = ['Tic.', 'Tic. Tac.', 'Elle bat à nouveau.']

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
      // Fondu d'entrée / sortie pour chaque temps, par ScrollTrigger autonome
      beatRefs.current.forEach((el) => {
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
      aria-label="Acte IV — Le retour à la vie"
    >
      {/* Étiquette verticale du chapitre */}
      <div className="pointer-events-none absolute left-[clamp(20px,5vw,80px)] top-[20vh] -rotate-90 origin-top-left">
        <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-text-dim whitespace-nowrap">
          Acte IV — Le retour à la vie
        </span>
      </div>

      {/* Trois écrans, un temps par écran. */}
      {BEATS.map((line, i) => (
        <div
          key={i}
          className="flex h-screen w-full items-center justify-center px-6 text-center"
        >
          <div
            ref={(el) => {
              beatRefs.current[i] = el
            }}
            className="text-spotlight will-change-transform px-8 py-6"
          >
            <h2 className="font-display text-[clamp(40px,7vw,128px)] font-normal leading-[1] tracking-tightest text-text">
              {line}
            </h2>
          </div>
        </div>
      ))}

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
          battements depuis le réveil
        </p>
      </div>
    </section>
  )
}
