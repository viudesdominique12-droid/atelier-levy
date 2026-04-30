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
    body: "Vérification du boîtier, du mouvement et de leur correspondance. Contrôle des éléments périphériques : aiguilles, boucles, tiges couronne. Croisement des références et numéros de série.",
  },
  {
    num: '02',
    name: 'Garantie 2 ans',
    body: "Toutes nos montres bénéficient d'une garantie d'origine ou d'une garantie de 2 années fournie par Parker & Smith. Sans condition cachée.",
  },
  {
    num: '03',
    name: 'Atelier intégré',
    body: "Bon fonctionnement contrôlé par notre atelier horloger interne, ou retour dans les ateliers des marques. Aucune pièce ne quitte la maison sans cette étape.",
  },
  {
    num: '04',
    name: 'Bracelets neufs',
    body: "Lorsque les bracelets d'origine ne répondent pas à nos critères d'exigence, nous les remplaçons par des modèles neufs. Aucune approximation tolérée.",
  },
]

const STEPS = [
  {
    num: '01',
    title: 'Vous nous présentez la pièce',
    body: "Vous cherchez à acheter ou à vendre. Photos, papiers, écrin si vous les avez. Plus le dossier est complet, plus la lecture est précise.",
  },
  {
    num: '02',
    title: 'Nous expertisons',
    body: "Authentification rigoureuse, vérification du fonctionnement, confrontation des numéros. Aucun engagement tant que vous n'avez pas validé.",
  },
  {
    num: '03',
    title: 'Vous repartez tranquille',
    body: 'Garantie 2 ans en main, traçabilité complète, transaction limpide. Acheter en confiance, vendre en sérénité.',
  },
]

const TRUST = [
  'Aucune marque représentée',
  'Spécialistes occasion',
  'Vintage et contemporain',
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
        defaults: { ease: 'expo.out' },
        scrollTrigger: {
          trigger: section,
          start: 'top 70%',
          toggleActions: 'play none none reverse',
        },
      })
      tl.from(headingRef.current?.querySelectorAll('[data-word]') ?? [], {
        yPercent: 110,
        opacity: 0,
        stagger: 0.07,
        duration: 0.9,
      })
        .from(
          servicesRef.current?.children ?? [],
          { opacity: 0, y: 28, stagger: 0.1, duration: 0.6 },
          '-=0.4',
        )
        .from(
          processRef.current?.children ?? [],
          { opacity: 0, y: 20, stagger: 0.08, duration: 0.5 },
          '-=0.3',
        )
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  const titleWords = ['Ce', 'que', 'nous', 'garantissons.']

  return (
    <section
      ref={sectionRef}
      // pas de data-act : section informative hors arc narratif
      className="relative px-[clamp(20px,5vw,80px)] py-[20vh]"
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
            Parker &amp; Smith n&apos;est ni agent, ni représentant, ni
            concessionnaire officiel. Notre métier — l&apos;expertise et le
            conseil en montres et bijoux de luxe.
          </p>
        </div>

        {/* Grille des 4 services */}
        <div
          ref={servicesRef}
          className="mt-24 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4"
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
              De la première poignée de main à la pièce qui change de main.
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
