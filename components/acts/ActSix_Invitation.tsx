'use client'

/**
 * Acte VI — L'invitation.
 * Plein écran. Phrase géante centrée. CTA principal vers le catalogue,
 * trois portes secondaires : bijoux, vendre, contact.
 */

import { useEffect, useRef } from 'react'
import Link from 'next/link'
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
        .from(ctaRef.current, { opacity: 0, y: 14, duration: 0.35 }, '-=0.25')
        .from(metaRef.current?.children ?? [], {
          opacity: 0,
          y: 10,
          stagger: 0.05,
          duration: 0.3,
        }, '-=0.2')
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  const titleWords = ['Venez', 'nous', 'rencontrer.']

  return (
    <section
      id="invitation"
      ref={sectionRef}
      data-act="6"
      className="relative flex min-h-[85vh] flex-col items-center justify-center overflow-hidden px-[clamp(20px,5vw,80px)] py-[10vh]"
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
        <MagneticButton href="/montres">Voir le catalogue</MagneticButton>
      </div>

      <div
        ref={metaRef}
        className="text-spotlight mt-20 grid grid-cols-1 gap-8 px-10 py-8 text-center font-mono text-[11px] uppercase tracking-[0.32em] text-text-muted md:grid-cols-3"
      >
        <Link href="/bijoux" className="group block">
          <p className="text-text-dim transition-colors group-hover:text-brass">
            Joaillerie
          </p>
          <p className="mt-2 text-text transition-colors group-hover:text-brass">
            Voir les bijoux
          </p>
        </Link>
        <Link href="/vendre-sa-montre" className="group block">
          <p className="text-text-dim transition-colors group-hover:text-brass">
            Vendre
          </p>
          <p className="mt-2 text-text transition-colors group-hover:text-brass">
            Faire estimer ma montre
          </p>
        </Link>
        <Link href="/contact" className="group block">
          <p className="text-text-dim transition-colors group-hover:text-brass">
            Contact
          </p>
          <p className="mt-2 text-text transition-colors group-hover:text-brass">
            Nous écrire
          </p>
        </Link>
      </div>
    </section>
  )
}
