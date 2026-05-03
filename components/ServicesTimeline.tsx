'use client'

/**
 * Timeline cinématique des 5 services.
 * - Hairline brass verticale qui se dessine au scroll (scrub-driven)
 * - Numéro romain géant en arrière-plan, ultra discret
 * - Photo macro du catalogue à droite, Ken Burns lent
 * - Titre serif géant, fade-in word-by-word à l'entrée
 * - Cursor parallax subtil (5px max) sur la photo
 *
 * 100 % CSS + GSAP, zéro WebGL. Ultra fluide même sur Air.
 */

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import gsap from 'gsap'
import { asset } from '@/lib/asset'

type Service = {
  num: string
  roman: string
  name: string
  title: string
  pitch: string
  body: string
  cta: { label: string; href: string }
  image: string
  credit: string
  focal: string
}

const SERVICES: Service[] = [
  {
    num: '01',
    roman: 'I',
    name: 'ACHAT',
    title: 'Nous rachetons votre montre',
    pitch: 'Rachat ferme ou dépôt-vente. Estimation sous 48 h.',
    body:
      "Vous nous présentez la pièce — photos, papiers, écrin si vous les avez. Nous l'authentifions, nous vous proposons un prix, vous décidez. Aucun engagement tant que vous n'avez pas validé. Notre réseau international garantit une lecture juste de la valeur du marché.",
    cta: { label: 'Faire estimer ma montre', href: '/vendre-sa-montre' },
    image: '/home/exam/04-couronne.jpg',
    credit: 'Panerai Luminor Submersible',
    focal: '50% 60%',
  },
  {
    num: '02',
    roman: 'II',
    name: 'VENTE',
    title: 'Notre sélection internationale',
    pitch: 'Neuf, occasion, vintage. Garantie 2 ans sur toutes nos pièces.',
    body:
      "Toutes nos montres sont authentifiées, certifiées et garanties 2 ans par notre atelier horloger intégré ou après être passées dans les ateliers des marques. Sélection présente en boutique et expédiée partout dans le monde, sous valeur déclarée.",
    cta: { label: 'Voir le catalogue', href: '/montres' },
    image: '/home/exam/03-aiguilles.jpg',
    credit: 'Cartier Mini Tank',
    focal: '50% 50%',
  },
  {
    num: '03',
    roman: 'III',
    name: 'SOURCING',
    title: 'Vous savez ce que vous voulez',
    pitch: 'On la trouve, on l’authentifie, on vous la livre.',
    body:
      "Une référence précise, un modèle rare, une complication particulière, une pièce de collection — notre carnet d'adresses (maisons horlogères, ventes privées, collectionneurs internationaux) nous permet de chercher pour vous. Brief en 10 minutes, retour sous quelques jours.",
    cta: { label: 'Lancer une recherche', href: '/sourcing' },
    image: '/home/exam/02-mouvement.jpg',
    credit: 'Breguet Tradition 7057',
    focal: '50% 50%',
  },
  {
    num: '04',
    roman: 'IV',
    name: 'ESTIMATION',
    title: 'La juste valeur du marché',
    pitch: 'Photos, papiers, écrin — retour sous 48 h.',
    body:
      "Vous voulez savoir ce que vaut votre pièce, sans engagement. Envoyez-nous les éléments, nous croisons avec le marché international (cotes, ventes récentes, demande sur la référence). Estimation gratuite, transmise par écrit.",
    cta: { label: 'Demander une estimation', href: '/contact' },
    image: '/home/exam/05-references.jpg',
    credit: 'Audemars Piguet Royal Oak 39',
    focal: '60% 50%',
  },
  {
    num: '05',
    roman: 'V',
    name: 'CONSEIL',
    title: 'Pour ce qui dure',
    pitch: 'Première montre, complication, investissement, collection.',
    body:
      "Beaucoup de personnes nous demandent quelle pièce choisir — pour s'offrir leur première belle montre, pour compléter une collection, pour investir, ou simplement pour ne pas se tromper. Notre rôle : vous dire ce qui dure, ce qui prend de la valeur, ce qui vous ressemble.",
    cta: { label: 'Demander un conseil', href: '/contact' },
    image: '/home/exam/01-boitier.jpg',
    credit: 'Hublot Classic Aerofusion 45',
    focal: '50% 40%',
  },
]

export default function ServicesTimeline() {
  const trackRef = useRef<HTMLDivElement>(null)
  const hairlineRef = useRef<HTMLDivElement>(null)
  const itemsRef = useRef<(HTMLElement | null)[]>([])

  useEffect(() => {
    const track = trackRef.current
    const hairline = hairlineRef.current
    if (!track || !hairline) return

    const ctx = gsap.context(() => {
      // === Hairline brass scroll-driven ===
      gsap.set(hairline, { scaleY: 0, transformOrigin: 'top center' })
      gsap.to(hairline, {
        scaleY: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: track,
          start: 'top 60%',
          end: 'bottom 60%',
          scrub: 0.3,
        },
      })

      // === Reveal de chaque service à l'entrée ===
      itemsRef.current.forEach((el) => {
        if (!el) return
        const words = el.querySelectorAll('[data-word]')
        const photo = el.querySelector('[data-photo]')
        const meta = el.querySelectorAll('[data-meta]')

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: el,
            start: 'top 75%',
            toggleActions: 'play none none none',
          },
          defaults: { ease: 'power2.out' },
        })
        tl.from(meta, { opacity: 0, x: -16, stagger: 0.04, duration: 0.4 })
          .from(
            words,
            { yPercent: 110, opacity: 0, stagger: 0.05, duration: 0.55 },
            '-=0.2',
          )
          .from(
            photo,
            { opacity: 0, scale: 1.06, duration: 0.9, ease: 'expo.out' },
            '-=0.5',
          )
      })
    }, track)

    return () => ctx.revert()
  }, [])

  return (
    <div
      ref={trackRef}
      className="relative px-[clamp(20px,5vw,80px)] pb-[clamp(40px,8vw,100px)]"
    >
      <div className="mx-auto max-w-7xl">
        {/* Rail brass vertical (caché sur mobile) */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-0 hidden h-full -translate-x-1/2 lg:block"
        >
          <div
            ref={hairlineRef}
            className="h-full w-px bg-gradient-to-b from-transparent via-brass/45 to-transparent"
          />
        </div>

        <ul className="space-y-[clamp(60px,12vh,160px)]">
          {SERVICES.map((s, i) => {
            const flipped = i % 2 === 1
            return (
              <li
                key={s.num}
                ref={(el) => {
                  itemsRef.current[i] = el
                }}
                className="relative grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-center lg:gap-16"
              >
                {/* Numéro romain géant en filigrane (caché sur mobile) */}
                <span
                  aria-hidden
                  className={`pointer-events-none absolute hidden select-none font-display font-normal leading-none text-brass/[0.04] lg:block ${
                    flipped ? 'right-[-2vw]' : 'left-[-2vw]'
                  } -top-[8vh]`}
                  style={{ fontSize: 'clamp(180px, 28vw, 400px)' }}
                >
                  {s.roman}
                </span>

                {/* Bloc texte */}
                <div
                  className={`relative z-10 lg:col-span-6 ${
                    flipped ? 'lg:col-start-7 lg:pl-12' : 'lg:pr-12'
                  }`}
                >
                  <div data-meta className="flex items-center gap-4">
                    <span className="font-mono text-[10px] uppercase tracking-[0.32em] text-brass">
                      {s.num}
                    </span>
                    <span className="h-px w-10 bg-brass/40" />
                    <span className="font-mono text-[10px] uppercase tracking-[0.32em] text-text-muted">
                      {s.name}
                    </span>
                  </div>

                  <h3 className="mt-6 overflow-hidden font-display text-[clamp(40px,5.2vw,80px)] font-normal leading-[0.98] tracking-tightest text-text">
                    {s.title.split(' ').map((word, j) => (
                      <span
                        key={j}
                        className="overflow-hidden mr-[0.18em] inline-block align-baseline"
                      >
                        <span
                          data-word
                          className="inline-block will-change-transform"
                        >
                          {word}
                        </span>
                      </span>
                    ))}
                  </h3>

                  <p
                    data-meta
                    className="mt-6 max-w-md font-display text-xl italic leading-snug text-text-muted md:text-2xl"
                  >
                    {s.pitch}
                  </p>

                  <p
                    data-meta
                    className="mt-6 max-w-md font-body text-sm leading-relaxed text-text-muted md:text-base"
                  >
                    {s.body}
                  </p>

                  <div data-meta className="mt-8">
                    <Link
                      href={s.cta.href}
                      className="inline-flex items-center gap-3 border-b border-brass/40 pb-1 font-mono text-[11px] uppercase tracking-[0.32em] text-brass transition-colors hover:border-brass hover:text-text"
                    >
                      {s.cta.label}
                      <span aria-hidden>→</span>
                    </Link>
                  </div>
                </div>

                {/* Bloc photo */}
                <div
                  className={`relative lg:col-span-6 ${
                    flipped ? 'lg:col-start-1 lg:row-start-1 lg:pr-12' : 'lg:pl-12'
                  }`}
                >
                  <div
                    data-photo
                    className="relative aspect-[4/5] w-full overflow-hidden rounded-sm border border-brass/20 bg-night shadow-[0_30px_80px_-20px_rgba(0,0,0,0.7)]"
                  >
                    <Image
                      src={asset(s.image)}
                      alt={s.title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      style={{
                        objectFit: 'cover',
                        objectPosition: s.focal,
                        filter:
                          'brightness(0.78) saturate(1.05) contrast(1.02)',
                      }}
                      className="ken-burns"
                    />
                    <div
                      aria-hidden
                      className="pointer-events-none absolute inset-0"
                      style={{
                        background:
                          'linear-gradient(180deg, rgba(2,3,10,0.25) 0%, rgba(2,3,10,0) 30%, rgba(2,3,10,0) 65%, rgba(2,3,10,0.85) 100%)',
                        mixBlendMode: 'multiply',
                      }}
                    />
                    <div
                      aria-hidden
                      className="pointer-events-none absolute inset-2 border border-brass/15"
                    />
                    <div className="absolute inset-x-5 bottom-5 flex items-end justify-between gap-4">
                      <span className="font-mono text-[9px] uppercase tracking-[0.28em] text-text-muted">
                        Réf. {s.credit}
                      </span>
                      <span className="h-px w-10 bg-brass/60" />
                    </div>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}
