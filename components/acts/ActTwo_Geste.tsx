'use client'

/**
 * Acte III — La signature.
 * Asymétrique. Titre serif géant + liste verbale stagger + citation centrale
 * + signature. La séquence d'authentification dans la voix de Parker & Smith.
 */

import { useEffect, useRef } from 'react'
import gsap from 'gsap'

const VERBS = [
  'Confronter.',
  'Tracer.',
  'Dater.',
  'Authentifier.',
  'Certifier.',
  'Garantir.',
]

const QUOTE = 'Les références et les numéros de série ne mentent jamais.'

export default function ActThreeGeste() {
  const sectionRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const verbsRef = useRef<HTMLUListElement>(null)
  const quoteRef = useRef<HTMLQuoteElement>(null)
  const tagRef = useRef<HTMLDivElement>(null)
  const lineRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!sectionRef.current) return
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: 'power2.out' },
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      })

      tl.from(tagRef.current, { opacity: 0, x: -16, duration: 0.4 })
        .from(
          lineRef.current,
          { scaleX: 0, transformOrigin: 'left center', duration: 0.6 },
          '-=0.2',
        )
        .from(
          titleRef.current?.querySelectorAll('[data-word]') ?? [],
          { yPercent: 110, opacity: 0, stagger: 0.04, duration: 0.5 },
          '-=0.4',
        )
        .from(
          verbsRef.current?.querySelectorAll('li') ?? [],
          { opacity: 0, x: 20, stagger: 0.06, duration: 0.35 },
          '-=0.3',
        )
        .from(
          quoteRef.current?.querySelectorAll('[data-word]') ?? [],
          { yPercent: 110, opacity: 0, stagger: 0.025, duration: 0.45 },
          '-=0.2',
        )
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  const titleWords = ['La', 'signature', 'tient', 'aux', 'numéros.']
  const quoteWords = QUOTE.split(' ')

  return (
    <section
      ref={sectionRef}
      data-act="3"
      className="relative px-[clamp(20px,5vw,80px)] py-[12vh]"
      aria-label="Acte III — La signature"
    >
      <div className="text-spotlight mx-auto grid max-w-7xl grid-cols-1 gap-16 px-6 py-16 md:grid-cols-12 md:gap-24 md:px-12">
        {/* Colonne gauche : tag + titre */}
        <div className="md:col-span-7">
          <div ref={tagRef} className="flex items-center gap-4">
            <span className="font-mono text-[10px] uppercase tracking-[0.32em] text-brass">
              Acte III
            </span>
            <span className="h-px w-12 bg-brass/40" />
            <span className="font-mono text-[10px] uppercase tracking-[0.32em] text-text-muted">
              La signature
            </span>
          </div>

          <div
            ref={lineRef}
            className="mt-12 h-px w-32 origin-left bg-brass/60"
          />

          <h2
            ref={titleRef}
            className="mt-12 font-display text-massive font-normal leading-[0.95] tracking-tightest text-text"
          >
            {titleWords.map((w, i) => (
              <span
                key={i}
                className="overflow-hidden inline-block mr-[0.22em] align-baseline"
              >
                <span data-word className="inline-block will-change-transform">
                  {w}
                </span>
              </span>
            ))}
          </h2>
        </div>

        {/* Colonne droite : verbes du geste */}
        <div className="md:col-span-5 md:pt-40">
          <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-text-muted">
            La séquence
          </p>
          <ul
            ref={verbsRef}
            className="mt-8 space-y-3 font-display text-2xl italic leading-tight text-text md:text-3xl"
          >
            {VERBS.map((v, i) => (
              <li key={i} className="flex items-baseline gap-4">
                <span className="font-mono text-[10px] not-italic text-text-dim">
                  {`0${i + 1}`}
                </span>
                <span>{v}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Citation centrée plus bas */}
      <div className="text-spotlight mx-auto mt-[10vh] max-w-4xl px-8 py-10 text-center">
        <blockquote
          ref={quoteRef}
          className="font-display text-[clamp(28px,4vw,64px)] font-normal italic leading-[1.15] tracking-tightest text-text"
        >
          <span className="text-brass">«</span>{' '}
          {quoteWords.map((w, i) => (
            <span
              key={i}
              className="overflow-hidden inline-block mr-[0.18em] align-baseline"
            >
              <span data-word className="inline-block will-change-transform">
                {w}
              </span>
            </span>
          ))}
          <span className="text-brass">»</span>
        </blockquote>
        <p className="mt-8 font-mono text-[10px] uppercase tracking-[0.32em] text-text-dim">
          — Parker &amp; Smith
        </p>
      </div>
    </section>
  )
}
