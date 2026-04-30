'use client'

/**
 * Acte V — La promesse.
 *
 * (Le nom de fichier date de l'ancienne identité du projet — l'arc narratif
 * a été réécrit pour Parker & Smith. Plus de coordonnées Mandelieu : le
 * climax du parcours est désormais la garantie de 2 ans, sans condition.)
 *
 * Compteur 0 → 24 mois, étoiles laiton qui se dessinent, signature
 * "Garantie d'origine ou garantie 2 années fournie par Parker & Smith".
 */

import { useEffect, useRef } from 'react'
import gsap from 'gsap'

export default function ActFiveMandelieu() {
  const sectionRef = useRef<HTMLElement>(null)
  const eyebrowRef = useRef<HTMLParagraphElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const counterRef = useRef<HTMLSpanElement>(null)
  const starsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!sectionRef.current) return
    const ctx = gsap.context(() => {
      const titleWords = titleRef.current?.querySelectorAll('[data-word]')

      const tl = gsap.timeline({
        defaults: { ease: 'expo.out' },
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
          toggleActions: 'play none none reverse',
        },
      })

      tl.from(eyebrowRef.current, { opacity: 0, y: 20, duration: 0.6 })
        .from(
          titleWords ?? [],
          { yPercent: 110, opacity: 0, stagger: 0.08, duration: 1 },
          '-=0.2',
        )
        .from(
          starsRef.current?.children ?? [],
          { opacity: 0, scale: 0.4, stagger: 0.08, duration: 0.5, ease: 'back.out(2)' },
          '-=0.4',
        )
        .to({ v: 0 }, {
          v: 24,
          duration: 1.6,
          ease: 'power2.out',
          onUpdate() {
            const v = Math.round((this.targets()[0] as { v: number }).v)
            if (counterRef.current) counterRef.current.textContent = String(v)
          },
        }, '-=0.6')
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  const titleWords = ['Garantie', 'deux', 'ans.']

  return (
    <section
      ref={sectionRef}
      data-act="5"
      className="relative flex min-h-screen items-center justify-center px-[clamp(20px,5vw,80px)] py-[18vh]"
      aria-label="Acte V — La promesse"
    >
      <div className="text-spotlight px-10 py-14 text-center">
        <span className="block font-mono text-[10px] uppercase tracking-[0.32em] text-brass">
          Acte V — La promesse
        </span>

        <p
          ref={eyebrowRef}
          className="mt-12 font-mono text-[11px] uppercase tracking-[0.4em] text-text-muted"
        >
          Sans condition cachée
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

        <div className="mt-16 flex flex-col items-center gap-6">
          <div ref={starsRef} className="flex gap-2" aria-hidden>
            {[0, 1, 2, 3, 4].map((i) => (
              <svg
                key={i}
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="#D4B677"
                className="origin-center"
              >
                <path d="M12 2 L14.59 8.41 L21.5 9 L16.25 13.62 L17.77 20.5 L12 16.77 L6.23 20.5 L7.75 13.62 L2.5 9 L9.41 8.41 Z" />
              </svg>
            ))}
          </div>

          <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-text-muted">
            <span ref={counterRef} className="text-brass">
              24
            </span>{' '}
            mois de garantie
          </p>

          <p className="mt-2 max-w-xl font-display text-lg italic leading-snug text-text-muted md:text-xl">
            Garantie d&apos;origine ou garantie 2 années fournie par Parker
            &amp; Smith. Toutes nos pièces, sans exception.
          </p>
        </div>
      </div>
    </section>
  )
}
