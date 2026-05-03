'use client'

/**
 * Acte V — Le réseau international.
 *
 * (Le nom de fichier date de l'ancienne identité du projet.)
 *
 * Compteur 0 → 24 (mois de garantie) ou 0 → N pays. Étoiles laiton qui
 * se dessinent. Met en avant la dimension internationale : sourcing à
 * travers maisons, ventes privées et collectionneurs partout dans le
 * monde.
 */

import { useEffect, useRef } from 'react'
import gsap from 'gsap'

const COUNTRIES = ['Paris', 'Genève', 'Zurich', 'Hong Kong', 'Dubaï', 'Singapour', 'New York', 'Tokyo', 'Londres', 'Milan', 'Monaco']

export default function ActFiveMandelieu() {
  const sectionRef = useRef<HTMLElement>(null)
  const eyebrowRef = useRef<HTMLParagraphElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const counterRef = useRef<HTMLSpanElement>(null)
  const citiesRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!sectionRef.current) return
    const ctx = gsap.context(() => {
      const titleWords = titleRef.current?.querySelectorAll('[data-word]')

      const tl = gsap.timeline({
        defaults: { ease: 'power2.out' },
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      })

      tl.from(eyebrowRef.current, { opacity: 0, y: 14, duration: 0.35 })
        .from(
          titleWords ?? [],
          { yPercent: 110, opacity: 0, stagger: 0.04, duration: 0.5 },
          '-=0.15',
        )
        .from(
          citiesRef.current?.children ?? [],
          { opacity: 0, y: 10, stagger: 0.04, duration: 0.4 },
          '-=0.25',
        )
        .to({ v: 0 }, {
          v: COUNTRIES.length,
          duration: 0.9,
          ease: 'power2.out',
          onUpdate() {
            const v = Math.round((this.targets()[0] as { v: number }).v)
            if (counterRef.current) counterRef.current.textContent = String(v)
          },
        }, '-=0.4')
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  const titleWords = ['International.']

  return (
    <section
      ref={sectionRef}
      data-act="5"
      className="relative flex min-h-[80vh] items-center justify-center px-[clamp(20px,5vw,80px)] py-[10vh]"
      aria-label="Acte V — Le réseau international"
    >
      <div className="text-spotlight px-10 py-14 text-center">
        <span className="block font-mono text-[10px] uppercase tracking-[0.32em] text-brass">
          Acte V — Le réseau
        </span>

        <p
          ref={eyebrowRef}
          className="mt-12 font-mono text-[11px] uppercase tracking-[0.4em] text-text-muted"
        >
          De Paris à Genève, de Hong Kong à Dubaï
        </p>

        <h2
          ref={titleRef}
          className="mt-8 font-display text-hero font-normal leading-[0.92] tracking-tightest text-text"
        >
          {titleWords.map((w, i) => (
            <span
              key={i}
              className="overflow-hidden inline-block mr-[0.18em] align-baseline"
            >
              <span data-word className="inline-block will-change-transform">
                {w}
              </span>
            </span>
          ))}
        </h2>

        <div className="mt-16 flex flex-col items-center gap-8">
          {/* Liste des villes en mono — comme un carnet d'adresses */}
          <div
            ref={citiesRef}
            className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 max-w-3xl"
          >
            {COUNTRIES.map((city, i) => (
              <span
                key={city}
                className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.32em] text-text-muted"
              >
                <span className="h-1 w-1 rounded-full bg-brass" />
                {city}
                {i === COUNTRIES.length - 1 && (
                  <span className="ml-3 text-text-dim">…</span>
                )}
              </span>
            ))}
          </div>

          <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-text-muted">
            <span ref={counterRef} className="text-brass">
              {COUNTRIES.length}
            </span>{' '}
            destinations dans notre réseau
          </p>

          <p className="mt-2 max-w-2xl font-display text-lg italic leading-snug text-text-muted md:text-xl">
            Sourcing à travers maisons horlogères, ventes privées et
            collectionneurs internationaux. Expéditions sécurisées —
            en France comme à l&apos;étranger.
          </p>
        </div>
      </div>
    </section>
  )
}
