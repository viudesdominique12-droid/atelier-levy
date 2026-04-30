'use client'

/**
 * Acte VI — L'invitation.
 * Plein écran. Phrase géante centrée. CTA magnétique laiton. Coordonnées
 * (téléphone + email) en placeholder, marquees en mono.
 */

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import MagneticButton from '@/components/ui/MagneticButton'

export default function ActSixInvitation() {
  const sectionRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)
  const metaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!sectionRef.current) return
    const ctx = gsap.context(() => {
      const words = titleRef.current?.querySelectorAll('[data-word]')

      const tl = gsap.timeline({
        defaults: { ease: 'expo.out' },
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 60%',
          toggleActions: 'play none none reverse',
        },
      })

      tl.from(words ?? [], {
        yPercent: 110,
        opacity: 0,
        stagger: 0.07,
        duration: 1,
      })
        .from(ctaRef.current, { opacity: 0, y: 20, duration: 0.6 }, '-=0.4')
        .from(metaRef.current?.children ?? [], {
          opacity: 0,
          y: 14,
          stagger: 0.1,
          duration: 0.5,
        }, '-=0.4')
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  const titleWords = ['Confiez-nous', 'votre', 'montre.']

  return (
    <section
      id="invitation"
      ref={sectionRef}
      data-act="6"
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-[clamp(20px,5vw,80px)] py-[16vh]"
      aria-label="Acte VI — L'invitation"
    >
      {/* Cadre laiton fin */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-[clamp(20px,5vw,80px)] border border-brass/15"
      />

      <span className="font-mono text-[10px] uppercase tracking-[0.32em] text-brass">
        Acte VI — L&apos;invitation
      </span>

      <h2
        ref={titleRef}
        className="text-spotlight mt-12 max-w-5xl px-8 py-6 text-center font-display text-massive font-normal leading-[0.95] tracking-tightest text-text"
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

      <div ref={ctaRef} className="mt-16">
        <MagneticButton href="/contact">Prendre rendez-vous</MagneticButton>
      </div>

      <div
        ref={metaRef}
        className="text-spotlight mt-20 grid grid-cols-1 gap-10 px-10 py-8 text-center font-mono text-[11px] uppercase tracking-[0.32em] text-text-muted md:grid-cols-3"
      >
        <div>
          <p className="text-text-dim">Téléphone</p>
          {/* TODO CLIENT : numéro réel */}
          <a href="tel:+33XXXXXXXXX" className="mt-2 block text-text hover:text-brass">
            +33 X XX XX XX XX
          </a>
        </div>
        <div>
          <p className="text-text-dim">Email</p>
          <a
            href="mailto:contact@parkeretsmith.com"
            className="mt-2 block text-text hover:text-brass normal-case tracking-normal"
          >
            contact@parkeretsmith.com
          </a>
        </div>
        <div>
          <p className="text-text-dim">Atelier</p>
          <p className="mt-2 text-text">Mandelieu-la-Napoule</p>
        </div>
      </div>
    </section>
  )
}
