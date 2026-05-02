'use client'

/**
 * Acte II — L'examen.
 *
 * Disposition : à gauche le carton "L'authentification / On vérifie",
 * à droite un cadrillage de 5 cartes photo (les 5 points d'examen).
 * Plus de filmstrip horizontal scrub : on lit tout d'un coup, comme une
 * planche d'expertise. Animation d'entrée : les cartes apparaissent en
 * cascade depuis la droite quand la section entre dans le viewport.
 */

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import { asset } from '@/lib/asset'

type Piece = {
  num: string
  name: string
  fr: string
  poem: string
  image: string
  credit: string
  focal: string
}

const PIECES: Piece[] = [
  {
    num: '01',
    name: 'BOÎTIER',
    fr: 'Le boîtier',
    poem: 'Numéro de série, finitions, gravures — la première lecture.',
    image: '/home/exam/01-boitier.jpg',
    credit: 'Hublot Classic Aerofusion 45',
    focal: '50% 40%',
  },
  {
    num: '02',
    name: 'MOUVEMENT',
    fr: 'Le mouvement',
    poem: "On l'ouvre. Le calibre doit correspondre au boîtier.",
    image: '/home/exam/02-mouvement.jpg',
    credit: 'Breguet Tradition 7057',
    focal: '50% 50%',
  },
  {
    num: '03',
    name: 'AIGUILLES',
    fr: 'Les aiguilles',
    poem: "Forme, finition, position. Chaque détail trahit l'âge.",
    image: '/home/exam/03-aiguilles.jpg',
    credit: 'Cartier Mini Tank',
    focal: '50% 50%',
  },
  {
    num: '04',
    name: 'PÉRIPHÉRIQUES',
    fr: 'Boucle & couronne',
    poem: 'Boucles, tiges couronne, fermoirs. Souvent les plus parlants.',
    image: '/home/exam/04-couronne.jpg',
    credit: 'Panerai Luminor Submersible',
    focal: '50% 60%',
  },
  {
    num: '05',
    name: 'RÉFÉRENCES',
    fr: 'Les numéros',
    poem: 'Référence et numéro de série. Ils datent. Ils prouvent.',
    image: '/home/exam/05-references.jpg',
    credit: 'Audemars Piguet Royal Oak 39',
    focal: '60% 50%',
  },
]

export default function ActTwoDemontage() {
  const sectionRef = useRef<HTMLElement>(null)
  const introRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLUListElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: 'power2.out' },
        scrollTrigger: {
          trigger: section,
          start: 'top 78%',
          toggleActions: 'play none none none',
        },
      })

      tl.from(introRef.current?.children ?? [], {
        opacity: 0,
        x: -24,
        stagger: 0.06,
        duration: 0.5,
      }).from(
        gridRef.current?.children ?? [],
        {
          opacity: 0,
          x: 28,
          y: 16,
          scale: 0.96,
          stagger: 0.08,
          duration: 0.55,
        },
        '-=0.35',
      )
    }, section)
    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      data-act="2"
      className="relative px-[clamp(20px,5vw,80px)] py-[12vh]"
      aria-label="Acte II — L'examen"
    >
      <div className="mx-auto max-w-7xl">
        {/* Bandeau de tag — comme les autres actes */}
        <div className="flex items-center gap-4">
          <span className="font-mono text-[10px] uppercase tracking-[0.32em] text-brass">
            Acte II
          </span>
          <span className="h-px w-12 bg-brass/40" />
          <span className="font-mono text-[10px] uppercase tracking-[0.32em] text-text-muted">
            L&apos;examen
          </span>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-16">
          {/* Colonne gauche — l'intro */}
          <div
            ref={introRef}
            className="text-spotlight md:col-span-5 md:sticky md:top-[18vh] md:self-start md:px-6 md:py-8"
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-brass">
              L&apos;authentification
            </p>
            <h2 className="mt-6 font-display text-[clamp(56px,8vw,128px)] font-normal leading-[0.95] tracking-tightest text-text">
              On vérifie.
            </h2>
            <p className="mt-8 max-w-md font-display text-xl italic leading-snug text-text-muted md:text-2xl">
              Cinq points qui ne mentent pas. Le boîtier, son mouvement,
              la correspondance de l&apos;un avec l&apos;autre, et tous les
              éléments périphériques.
            </p>
            <p className="mt-10 font-mono text-[10px] uppercase tracking-[0.32em] text-text-dim">
              5 / 5 — chacun authentifié
            </p>
          </div>

          {/* Colonne droite — le cadrillage de 5 cartes */}
          <ul
            ref={gridRef}
            className="grid grid-cols-2 gap-4 md:col-span-7 md:gap-5"
          >
            {PIECES.map((p, i) => (
              <li
                key={i}
                // 5e carte = pleine largeur (le verdict des références)
                className={i === 4 ? 'col-span-2' : ''}
              >
                <article
                  className={`group relative w-full overflow-hidden rounded-sm border border-brass/20 bg-night shadow-[0_24px_60px_-20px_rgba(0,0,0,0.7)] ${
                    i === 4 ? 'aspect-[2/1]' : 'aspect-square'
                  }`}
                >
                  <Image
                    src={asset(p.image)}
                    alt={p.fr}
                    fill
                    sizes="(max-width: 768px) 45vw, (max-width: 1280px) 28vw, 320px"
                    style={{
                      objectFit: 'cover',
                      objectPosition: p.focal,
                      filter: 'brightness(0.82) saturate(1.05) contrast(1.02)',
                    }}
                    className="transition-transform duration-[1.4s] ease-out group-hover:scale-[1.04]"
                  />

                  {/* Voile sombre + vignette pour intégrer la photo
                      à la palette nuit du site */}
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0"
                    style={{
                      background:
                        'linear-gradient(180deg, rgba(2,3,10,0.25) 0%, rgba(2,3,10,0) 28%, rgba(2,3,10,0) 55%, rgba(2,3,10,0.85) 100%)',
                      mixBlendMode: 'multiply',
                    }}
                  />
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0"
                    style={{
                      background:
                        'radial-gradient(ellipse 140% 100% at 50% 50%, transparent 35%, rgba(2,3,10,0.5) 100%)',
                    }}
                  />

                  {/* Liseré laiton intérieur, façon cadre de tableau */}
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-2 border border-brass/15"
                  />

                  {/* Numéro en haut à droite */}
                  <div className="absolute right-3 top-3 font-mono text-[10px] uppercase tracking-[0.32em] text-brass">
                    {p.num}
                  </div>

                  {/* Bas de carte : nom + poème */}
                  <div className="absolute inset-x-4 bottom-4">
                    <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-text">
                      {p.name}
                    </p>
                    <h3
                      className={`mt-1.5 font-display font-normal leading-tight tracking-tightest text-text ${
                        i === 4 ? 'text-2xl md:text-3xl' : 'text-xl md:text-2xl'
                      }`}
                    >
                      {p.fr}
                    </h3>
                    <p className="mt-1.5 font-display text-xs italic leading-snug text-text-muted md:text-sm">
                      {p.poem}
                    </p>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
