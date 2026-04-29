'use client'

/**
 * Acte II — Le démontage.
 * Filmstrip horizontal scrub : carton d'intro puis 5 pièces de montre,
 * chacune avec un petit dessin SVG, son nom serif, une note poétique.
 */

import { useEffect, useRef, type ReactNode } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

type Piece = {
  num: string
  name: string
  fr: string
  poem: string
  draw: ReactNode
}

const PIECES: Piece[] = [
  {
    num: '01',
    name: 'PIGNON',
    fr: 'Le pignon',
    poem: 'Six dents pour transmettre une impulsion entière.',
    draw: (
      <svg viewBox="0 0 100 100" fill="none" stroke="#C9A55B" strokeWidth="0.6">
        <circle cx="50" cy="50" r="22" />
        <circle cx="50" cy="50" r="3" fill="#C9A55B" />
        {Array.from({ length: 12 }).map((_, i) => {
          const a = (i / 12) * Math.PI * 2
          const x1 = 50 + Math.cos(a) * 22
          const y1 = 50 + Math.sin(a) * 22
          const x2 = 50 + Math.cos(a) * 30
          const y2 = 50 + Math.sin(a) * 30
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} />
        })}
      </svg>
    ),
  },
  {
    num: '02',
    name: 'ÉCHAPPEMENT',
    fr: "L'échappement",
    poem: 'Le cœur qui dose le temps, dent après dent.',
    draw: (
      <svg viewBox="0 0 100 100" fill="none" stroke="#C9A55B" strokeWidth="0.6">
        <circle cx="50" cy="50" r="20" />
        {Array.from({ length: 16 }).map((_, i) => {
          const a = (i / 16) * Math.PI * 2
          const x = 50 + Math.cos(a) * 20
          const y = 50 + Math.sin(a) * 20
          const x2 = 50 + Math.cos(a + 0.18) * 26
          const y2 = 50 + Math.sin(a + 0.18) * 26
          return <line key={i} x1={x} y1={y} x2={x2} y2={y2} strokeWidth="0.8" />
        })}
        <circle cx="50" cy="50" r="2" fill="#C9A55B" />
      </svg>
    ),
  },
  {
    num: '03',
    name: 'BALANCIER',
    fr: 'Le balancier',
    poem: 'Vingt-huit mille battements par jour. Inlassable.',
    draw: (
      <svg viewBox="0 0 100 100" fill="none" stroke="#C9A55B" strokeWidth="0.6">
        <circle cx="50" cy="50" r="32" />
        <line x1="18" y1="50" x2="82" y2="50" strokeWidth="0.9" />
        <line x1="50" y1="18" x2="50" y2="82" strokeWidth="0.9" />
        <circle cx="50" cy="50" r="3.5" fill="#C9A55B" />
      </svg>
    ),
  },
  {
    num: '04',
    name: 'SPIRAL',
    fr: 'Le ressort spiral',
    poem: "L'âme du mouvement. Lovée, tendue, libérée.",
    draw: (
      <svg viewBox="0 0 100 100" fill="none" stroke="#C9A55B" strokeWidth="0.6">
        <path d="M 50 50 m -2 0 a 2 2 0 1 1 4 0 a 4 4 0 1 1 -8 0 a 6 6 0 1 1 12 0 a 8 8 0 1 1 -16 0 a 10 10 0 1 1 20 0 a 12 12 0 1 1 -24 0 a 14 14 0 1 1 28 0 a 16 16 0 1 1 -32 0 a 18 18 0 1 1 36 0 a 20 20 0 1 1 -40 0 a 22 22 0 1 1 44 0" />
      </svg>
    ),
  },
  {
    num: '05',
    name: 'RUBIS',
    fr: 'Les rubis',
    poem: "Quinze gouttes de feu pour quinze pivots — nul frottement.",
    draw: (
      <svg viewBox="0 0 100 100" fill="none">
        <path d="M50 22 L72 50 L50 78 L28 50 Z" fill="#8B2230" stroke="#C9A55B" strokeWidth="0.5" />
        <path d="M50 22 L60 36 L72 50 L60 36 Z" fill="#9E2B3A" />
        <path d="M50 22 L40 36 L28 50 L40 36 Z" fill="#6E1A26" />
      </svg>
    ),
  },
]

export default function ActTwoDemontage() {
  const sectionRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const indexRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (!sectionRef.current || !trackRef.current) return
    const ctx = gsap.context(() => {
      const track = trackRef.current!
      const totalWidth = track.scrollWidth - window.innerWidth
      const distance = totalWidth + 60

      const trig = ScrollTrigger.create({
        trigger: sectionRef.current!,
        start: 'top top',
        end: () => `+=${distance}`,
        scrub: 0.5,
        pin: true,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          gsap.set(track, { x: -distance * self.progress })
          if (indexRef.current) {
            const total = PIECES.length + 1 // +1 pour le carton intro
            const cardIdx = Math.min(
              total - 1,
              Math.floor(self.progress * total),
            )
            const pieceIdx = Math.max(0, cardIdx - 1)
            indexRef.current.textContent = `${PIECES[pieceIdx].num} / 0${PIECES.length}`
          }
        },
      })

      return () => trig.kill()
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      data-act="2"
      className="relative h-screen w-full overflow-hidden"
      aria-label="Acte II — Le démontage"
    >
      {/* Tag haut gauche */}
      <div className="absolute left-[clamp(20px,5vw,80px)] top-[8vh] z-10 flex items-center gap-4">
        <span className="font-mono text-[10px] uppercase tracking-[0.32em] text-brass">
          Acte II
        </span>
        <span className="h-px w-12 bg-brass/40" />
        <span className="font-mono text-[10px] uppercase tracking-[0.32em] text-text-muted">
          Le démontage
        </span>
      </div>

      <span
        ref={indexRef}
        className="absolute right-[clamp(20px,5vw,80px)] top-[8vh] z-10 font-mono text-[10px] uppercase tracking-[0.32em] text-text-dim"
      >
        01 / 05
      </span>

      {/* Filmstrip horizontal */}
      <div
        ref={trackRef}
        className="absolute left-0 top-0 flex h-full items-center will-change-transform"
        style={{ paddingLeft: 'clamp(20px,5vw,80px)' }}
      >
        {/* Carton d'intro */}
        <article className="text-spotlight relative mr-[10vw] flex w-[78vw] shrink-0 flex-col justify-center px-8 py-10 md:w-[55vw]">
          <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-brass">
            Pièce par pièce
          </p>
          <h2 className="mt-8 font-display text-massive font-normal leading-[0.95] tracking-tightest text-text">
            On l&apos;ouvre.
          </h2>
          <p className="mt-8 max-w-md font-display text-xl italic leading-snug text-text-muted md:text-2xl">
            Cinq pièces, cinq fonctions, cinq dialogues entre l&apos;atelier
            et l&apos;horloger d&apos;origine. Chaque démontage est un acte
            de respect.
          </p>
          <p className="mt-12 font-mono text-[10px] uppercase tracking-[0.32em] text-text-dim">
            Continuez à scroller →
          </p>
        </article>

        {/* Pièces */}
        {PIECES.map((p, i) => (
          <article
            key={i}
            className="relative mr-[6vw] flex w-[78vw] shrink-0 flex-col justify-center md:w-[52vw]"
          >
            {/* Carte sombre avec dessin */}
            <div className="relative mb-10 flex h-[44vh] w-full max-w-[480px] items-center justify-center rounded-sm border border-brass/15 bg-surface/60 p-12 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)]">
              <div className="aspect-square w-2/3">{p.draw}</div>
              <div className="absolute left-6 top-6 font-mono text-[10px] uppercase tracking-[0.32em] text-text-dim">
                {p.name}
              </div>
              <div className="absolute right-6 bottom-6 font-mono text-[10px] uppercase tracking-[0.32em] text-brass">
                {p.num}
              </div>
            </div>

            <h3 className="font-display text-[clamp(48px,7.5vw,120px)] font-normal leading-[0.9] tracking-tightest text-text">
              {p.fr}
            </h3>
            <p className="mt-6 max-w-md font-display text-xl italic leading-snug text-text-muted md:text-2xl">
              {p.poem}
            </p>
          </article>
        ))}
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 font-mono text-[10px] uppercase tracking-[0.32em] text-text-dim">
        Scroll →
      </div>
    </section>
  )
}
