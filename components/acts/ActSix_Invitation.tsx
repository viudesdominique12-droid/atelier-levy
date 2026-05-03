'use client'

/**
 * Acte VI — Trois portes.
 *
 * Final du récit : trois portes 3D en perspective CSS, chacune représentant
 * une façon d'entrer en relation. Acheter, faire estimer, faire chercher.
 * Au hover, la porte s'entrouvre légèrement vers le visiteur, une lueur
 * brass apparaît derrière. Click → navigation.
 */

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import gsap from 'gsap'

type Porte = {
  num: string
  title: string
  href: string
  hint: string
}

const PORTES: Porte[] = [
  {
    num: 'I',
    title: 'Voir le catalogue',
    href: '/montres',
    hint: 'Notre sélection neuve, occasion et vintage',
  },
  {
    num: 'II',
    title: 'Faire estimer ma montre',
    href: '/vendre-sa-montre',
    hint: 'Photos, papiers — retour sous 48 h',
  },
  {
    num: 'III',
    title: 'Faire chercher une pièce',
    href: '/sourcing',
    hint: 'Vous savez ce que vous voulez. On trouve.',
  },
]

export default function ActSixInvitation() {
  const sectionRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const portesRef = useRef<HTMLDivElement>(null)
  const metaRef = useRef<HTMLDivElement>(null)
  const [hoverIdx, setHoverIdx] = useState<number | null>(null)

  useEffect(() => {
    if (!sectionRef.current) return
    const ctx = gsap.context(() => {
      const words = titleRef.current?.querySelectorAll('[data-word]')

      const tl = gsap.timeline({
        defaults: { ease: 'power2.out' },
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
      })

      tl.from(words ?? [], {
        yPercent: 110,
        opacity: 0,
        stagger: 0.04,
        duration: 0.5,
      })
        .from(
          portesRef.current?.children ?? [],
          {
            opacity: 0,
            y: 30,
            rotateY: -12,
            stagger: 0.1,
            duration: 0.7,
          },
          '-=0.25',
        )
        .from(
          metaRef.current,
          { opacity: 0, y: 10, duration: 0.4 },
          '-=0.2',
        )
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  const titleWords = ['Par', 'où', 'voulez-vous', 'entrer', '?']

  return (
    <section
      id="invitation"
      ref={sectionRef}
      data-act="6"
      className="relative flex min-h-[100vh] flex-col items-center justify-center overflow-hidden px-[clamp(20px,5vw,80px)] py-[10vh]"
      aria-label="Acte VI — Trois portes"
    >
      {/* Cadre laiton fin */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-[clamp(20px,5vw,80px)] border border-brass/15"
      />

      <span className="font-mono text-[10px] uppercase tracking-[0.32em] text-brass">
        Acte VI — Trois portes
      </span>

      <h2
        ref={titleRef}
        className="text-spotlight mt-10 max-w-5xl px-8 py-6 text-center font-display text-massive font-normal leading-[0.95] tracking-tightest text-text"
      >
        {titleWords.map((w, i) => (
          <span
            key={i}
            className="overflow-hidden inline-block mr-[0.2em] align-baseline"
          >
            <span data-word className="inline-block will-change-transform">
              {w}
            </span>
          </span>
        ))}
      </h2>

      {/* Trois portes en perspective 3D */}
      <div
        ref={portesRef}
        className="mt-16 flex flex-col items-stretch gap-6 md:flex-row md:gap-8"
        style={{
          perspective: '1400px',
          perspectiveOrigin: '50% 50%',
        }}
      >
        {PORTES.map((porte, i) => {
          const isHover = hoverIdx === i
          return (
            <Link
              key={porte.href + porte.title}
              href={porte.href}
              onMouseEnter={() => setHoverIdx(i)}
              onMouseLeave={() => setHoverIdx(null)}
              className="group relative block focus:outline-none"
              style={{
                transformStyle: 'preserve-3d',
              }}
            >
              {/* Halo brass derrière la porte, visible au hover */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 -z-10 transition-opacity duration-700"
                style={{
                  opacity: isHover ? 1 : 0,
                  background:
                    'radial-gradient(ellipse 80% 100% at 50% 50%, rgba(201,165,91,0.35) 0%, transparent 70%)',
                  filter: 'blur(20px)',
                  transform: 'translateZ(-40px)',
                }}
              />

              {/* La porte elle-même */}
              <div
                className="relative h-[58vh] w-[78vw] max-w-[280px] cursor-pointer overflow-hidden rounded-sm border border-brass/30 bg-night/80 backdrop-blur-md md:h-[50vh] md:w-[240px]"
                style={{
                  transformOrigin: 'left center',
                  transform: isHover
                    ? 'rotateY(-14deg) translateZ(20px)'
                    : 'rotateY(0deg) translateZ(0px)',
                  transition: 'transform 700ms cubic-bezier(0.22, 1, 0.36, 1)',
                  boxShadow: isHover
                    ? '0 30px 80px -20px rgba(0,0,0,0.8), 0 0 60px -10px rgba(201,165,91,0.3)'
                    : '0 30px 80px -30px rgba(0,0,0,0.6)',
                }}
              >
                {/* Liseré brass intérieur, signature des cartes */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-3 border border-brass/15"
                />

                {/* Reflet diagonal subtle (effet bois précieux) */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 transition-opacity duration-700"
                  style={{
                    opacity: isHover ? 0.6 : 0.15,
                    background:
                      'linear-gradient(135deg, transparent 30%, rgba(201,165,91,0.15) 50%, transparent 70%)',
                  }}
                />

                {/* Numéro romain en haut */}
                <div className="absolute left-1/2 top-8 -translate-x-1/2 font-mono text-[10px] uppercase tracking-[0.32em] text-brass">
                  {porte.num}
                </div>

                {/* Poignée stylisée */}
                <div
                  aria-hidden
                  className="absolute right-4 top-1/2 h-8 w-1 -translate-y-1/2 rounded-full bg-brass/60"
                />

                {/* Titre + hint en bas */}
                <div className="absolute inset-x-6 bottom-8 text-center">
                  <h3 className="font-display text-2xl font-normal leading-tight tracking-tightest text-text md:text-3xl">
                    {porte.title}
                  </h3>
                  <p className="mt-3 font-display text-xs italic leading-snug text-text-muted md:text-sm">
                    {porte.hint}
                  </p>
                  <span className="mt-5 inline-block font-mono text-[9px] uppercase tracking-[0.32em] text-brass opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                    Entrer →
                  </span>
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      {/* Pied : maison indépendante */}
      <div
        ref={metaRef}
        className="text-spotlight mt-20 px-10 py-6 text-center"
      >
        <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-text-muted">
          Maison horlogère indépendante
        </p>
        <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.32em] text-text-dim">
          Ni agent · Ni représentant · Ni concessionnaire officiel
        </p>
      </div>
    </section>
  )
}
