'use client'

/**
 * Interlude — Le savoir-faire.
 *
 * Section concrète insérée entre Acte III (la signature) et Acte IV
 * (le verdict). Pas de numéro d'acte : ne disrupte pas l'arc narratif,
 * n'apparaît pas dans le ChapterIndex. Sa fonction : dire en clair ce que
 * Parker & Smith fait pour le client — pas un atelier de restauration,
 * mais un expert qui sécurise l'achat et la revente d'une montre de luxe.
 */

import { useEffect, useRef } from 'react'
import gsap from 'gsap'

const SERVICES = [
  {
    num: '01',
    name: 'Authentification',
    body: "Boîtier, mouvement, correspondance, périphériques, références. Cinq vérifications systématiques avant qu'une pièce porte notre nom.",
  },
  {
    num: '02',
    name: 'Atelier intégré',
    body: "Bon fonctionnement contrôlé par notre atelier horloger interne, ou retour dans les ateliers des marques. Aucune pièce ne quitte la maison sans cette étape.",
  },
  {
    num: '03',
    name: 'Garantie 2 ans',
    body: "Garantie d'origine sur le neuf, garantie 2 ans Parker & Smith sur l'occasion et le vintage. Sans condition cachée.",
  },
]

const STEPS = [
  {
    num: '01',
    title: 'Le brief',
    body: "Acheter, vendre, faire chercher, faire estimer. Vous décrivez ce que vous voulez. On entend.",
  },
  {
    num: '02',
    title: 'L\'expertise',
    body: "Authentification, retour atelier si besoin, sourcing dans notre réseau international. Aucun engagement tant que vous n'avez pas validé.",
  },
  {
    num: '03',
    title: 'La transaction',
    body: 'Garantie 2 ans en main, traçabilité complète, expédition sécurisée — y compris à l\'international. Acheter en confiance, vendre en sérénité.',
  },
]

const TRUST = [
  'Maison indépendante',
  'Neuf, occasion, vintage',
  'Réseau international',
  'Garantie 2 ans',
]

export default function ActServices() {
  const sectionRef = useRef<HTMLElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const servicesRef = useRef<HTMLDivElement>(null)
  const processRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: 'power2.out' },
        scrollTrigger: {
          trigger: section,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      })
      tl.from(headingRef.current?.querySelectorAll('[data-word]') ?? [], {
        yPercent: 110,
        opacity: 0,
        stagger: 0.035,
        duration: 0.45,
      })
        .from(
          servicesRef.current?.children ?? [],
          { opacity: 0, y: 18, stagger: 0.05, duration: 0.35 },
          '-=0.25',
        )
        .from(
          processRef.current?.children ?? [],
          { opacity: 0, y: 14, stagger: 0.04, duration: 0.3 },
          '-=0.2',
        )
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  const titleWords = ['Notre', 'exigence.']

  return (
    <section
      ref={sectionRef}
      // pas de data-act : section informative hors arc narratif
      className="relative px-[clamp(20px,5vw,80px)] py-[10vh]"
      aria-label="Le savoir-faire"
    >
      <div className="mx-auto max-w-7xl">
        {/* En-tête : tag + titre */}
        <div className="text-spotlight max-w-3xl px-6 py-8">
          <div className="flex items-center gap-4">
            <span className="font-mono text-[10px] uppercase tracking-[0.32em] text-brass">
              Le savoir-faire
            </span>
            <span className="h-px w-12 bg-brass/40" />
            <span className="font-mono text-[10px] uppercase tracking-[0.32em] text-text-muted">
              Parker &amp; Smith · Expertise & conseil
            </span>
          </div>

          <h2
            ref={headingRef}
            className="mt-10 font-display text-massive font-normal leading-[0.95] tracking-tightest text-text"
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

          <p className="mt-8 max-w-xl font-display text-xl italic leading-snug text-text-muted md:text-2xl">
            Parker &amp; Smith n&apos;est ni agent, ni concessionnaire
            officiel. Notre indépendance est notre seul engagement —
            envers la pièce et envers vous.
          </p>
        </div>

        {/* Grille des 4 services */}
        <div
          ref={servicesRef}
          className="mt-24 grid grid-cols-1 gap-6 md:grid-cols-3"
        >
          {SERVICES.map((s) => (
            <article
              key={s.num}
              className="group relative rounded-sm border border-brass/15 bg-surface/70 p-7 backdrop-blur-md transition-colors duration-500 hover:border-brass/40 hover:bg-surfaceHi/80"
            >
              <span className="font-mono text-[10px] uppercase tracking-[0.32em] text-brass">
                {s.num}
              </span>
              <h3 className="mt-5 font-display text-2xl font-normal leading-tight tracking-tightest text-text md:text-3xl">
                {s.name}
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-text-muted">
                {s.body}
              </p>
            </article>
          ))}
        </div>

        {/* Processus en 3 étapes */}
        <div className="mt-32">
          <div className="text-spotlight mx-auto max-w-2xl px-6 py-6 text-center">
            <span className="font-mono text-[10px] uppercase tracking-[0.32em] text-brass">
              Le processus
            </span>
            <p className="mt-6 font-display text-3xl font-normal italic leading-snug text-text md:text-4xl">
              Trois étapes pour acheter, vendre, ou faire chercher.
            </p>
          </div>

          <div
            ref={processRef}
            className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-12"
          >
            {STEPS.map((s) => (
              <div
                key={s.num}
                className="rounded-sm border border-brass/15 bg-surface/65 p-7 backdrop-blur-md"
              >
                <span className="font-mono text-[10px] uppercase tracking-[0.32em] text-brass">
                  Étape {s.num}
                </span>
                <h4 className="mt-5 font-display text-xl font-normal leading-tight tracking-tightest text-text md:text-2xl">
                  {s.title}
                </h4>
                <p className="mt-4 text-sm leading-relaxed text-text-muted">
                  {s.body}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Bandeau signaux de confiance */}
        <div className="text-spotlight mt-24 flex flex-wrap items-center justify-center gap-x-10 gap-y-4 px-8 py-7 text-center">
          {TRUST.map((t, i) => (
            <span key={i} className="flex items-center gap-3">
              <span className="h-1 w-1 rounded-full bg-brass" />
              <span className="font-mono text-[11px] uppercase tracking-[0.32em] text-text-muted">
                {t}
              </span>
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
