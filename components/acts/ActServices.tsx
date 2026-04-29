'use client'

/**
 * Interlude — Le savoir-faire.
 *
 * Section concrète insérée entre Acte III (le geste abstrait) et Acte IV
 * (la vie revient). Pas de numéro d'acte : ne disrupte pas l'arc narratif,
 * n'apparaît pas dans le ChapterIndex. Sa fonction : le visiteur qui scroll
 * doit savoir, sans aucune ambiguïté, ce que cet atelier fait pour lui.
 *
 * Trois blocs concrets, chacun en spotlight pour rester lisible sur le fond
 * vidéo : services, processus, signaux de confiance.
 */

import { useEffect, useRef } from 'react'
import gsap from 'gsap'

const SERVICES = [
  {
    num: '01',
    name: 'Révision complète',
    body: 'Démontage intégral du mouvement, nettoyage par bain ultrasons, lubrification au point, remontage et réglage 5 positions.',
  },
  {
    num: '02',
    name: 'Réparation mécanique',
    body: "Pivots, ressort moteur, échappement, balancier — les pannes structurelles d'un mouvement mécanique ou automatique.",
  },
  {
    num: '03',
    name: 'Restauration & polissage',
    body: 'Polissage du boîtier et du bracelet acier ou or, traitement des montres vintages dans le respect de leur patine.',
  },
  {
    num: '04',
    name: 'Étanchéité & quartz',
    body: 'Test de pression, changement de joints, intervention sur calibres quartz, changement de pile garanti étanche.',
  },
]

const STEPS = [
  {
    num: '01',
    title: 'Vous apportez la montre',
    body: "À l'atelier de Mandelieu, sans rendez-vous. Un café, un échange, une première lecture du mouvement.",
  },
  {
    num: '02',
    title: 'Estimation sous 7 jours',
    body: 'Diagnostic complet, devis détaillé pièce par pièce. Aucun engagement tant que vous n\'avez pas validé.',
  },
  {
    num: '03',
    title: 'Restauration en atelier',
    body: 'Travail sur établi, garantie 24 mois sur la révision et 12 mois sur les pièces remplacées.',
  },
]

const TRUST = [
  '30 ans de pratique',
  'Tous mouvements',
  'Vintage à contemporain',
  'Garantie 24 mois',
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

  const titleWords = ['Ce', 'que', 'nous', 'faisons.']

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
              Atelier Levy · Mandelieu
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
            Quatre métiers sous un même établi, pour redonner vie aux montres
            mécaniques, automatiques, quartz, vintages ou contemporaines.
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
              De la première poignée de main à la montre rendue.
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
