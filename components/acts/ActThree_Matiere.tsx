'use client'

/**
 * Acte II — L'examen.
 * Filmstrip horizontal scrub : carton d'intro puis 5 points d'authentification,
 * chacun illustré par une vraie photo macro tirée du catalogue Parker & Smith.
 * Le visuel devient cohérent avec le label (boîtier → photo de boîtier, etc.)
 * et reste dans la palette nuit / laiton du reste du site.
 */

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { asset } from '@/lib/asset'

type Piece = {
  num: string
  name: string
  fr: string
  poem: string
  image: string
  // Origine de la photo — affiché en micro-crédit, renforce le message
  // « ce qu'on vous montre, c'est ce que vous pouvez réellement acheter ».
  credit: string
  // focal point pour object-position : aligne le sujet (boîtier, dial,
  // couronne, papier...) au centre du cadre malgré le crop.
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
  const trackRef = useRef<HTMLDivElement>(null)
  const indexRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (!sectionRef.current || !trackRef.current) return
    const ctx = gsap.context(() => {
      const track = trackRef.current!
      const totalWidth = track.scrollWidth - window.innerWidth
      // distance = scroll vertical nécessaire pour traverser le filmstrip.
      // On garde un facteur 0.55 pour que la traversée soit deux fois plus
      // rapide qu'au format 1:1 — moins de scroll-jacking.
      const distance = totalWidth * 0.55 + 60
      // Le track lui-même doit toujours parcourir totalWidth en x.
      const trackTravel = totalWidth

      const trig = ScrollTrigger.create({
        trigger: sectionRef.current!,
        start: 'top top',
        end: () => `+=${distance}`,
        scrub: 0.3,
        pin: true,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          gsap.set(track, { x: -trackTravel * self.progress })
          if (indexRef.current) {
            const total = PIECES.length + 1 // +1 pour le carton intro
            const cardIdx = Math.min(
              total - 1,
              Math.floor(self.progress * total),
            )
            const pieceIdx = Math.max(0, cardIdx - 1)
            indexRef.current.textContent = `${PIECES[pieceIdx].num} / 0${PIECES.length}`
          }
        },
      })

      return () => trig.kill()
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      data-act="2"
      className="relative h-screen w-full overflow-hidden"
      aria-label="Acte II — L'examen"
    >
      {/* Tag haut gauche */}
      <div className="absolute left-[clamp(20px,5vw,80px)] top-[8vh] z-10 flex items-center gap-4">
        <span className="font-mono text-[10px] uppercase tracking-[0.32em] text-brass">
          Acte II
        </span>
        <span className="h-px w-12 bg-brass/40" />
        <span className="font-mono text-[10px] uppercase tracking-[0.32em] text-text-muted">
          L&apos;examen
        </span>
      </div>

      <span
        ref={indexRef}
        className="absolute right-[clamp(20px,5vw,80px)] top-[8vh] z-10 font-mono text-[10px] uppercase tracking-[0.32em] text-text-dim"
      >
        01 / 05
      </span>

      {/* Filmstrip horizontal */}
      <div
        ref={trackRef}
        className="absolute left-0 top-0 flex h-full items-center will-change-transform"
        style={{ paddingLeft: 'clamp(20px,5vw,80px)' }}
      >
        {/* Carton d'intro */}
        <article className="text-spotlight relative mr-[10vw] flex w-[78vw] shrink-0 flex-col justify-center px-8 py-10 md:w-[55vw]">
          <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-brass">
            L&apos;authentification
          </p>
          <h2 className="mt-8 font-display text-massive font-normal leading-[0.95] tracking-tightest text-text">
            On vérifie.
          </h2>
          <p className="mt-8 max-w-md font-display text-xl italic leading-snug text-text-muted md:text-2xl">
            Cinq points qui ne mentent pas. Le boîtier, son mouvement,
            la correspondance de l&apos;un avec l&apos;autre, et tous les
            éléments périphériques.
          </p>
          <p className="mt-12 font-mono text-[10px] uppercase tracking-[0.32em] text-text-dim">
            Continuez à scroller →
          </p>
        </article>

        {/* Pièces */}
        {PIECES.map((p, i) => (
          <article
            key={i}
            className="relative mr-[6vw] flex w-[78vw] shrink-0 flex-col justify-center md:w-[52vw]"
          >
            {/* Carte photo : pleine bleed, traitement nuit + voile laiton.
                - filter: brightness(0.82) saturate(1.05) → atténue les fonds
                  blancs des photos catalogue, harmonise avec la palette nuit
                - mix-blend overlay laiton → réintroduit la chaleur du laiton
                  sans altérer le sujet
                - vignette radiale → fond se fond dans le décor de la home
                - liseré laiton + ombre : conserve la signature visuelle
                  des cartes existantes (savoir-faire, services). */}
            <div className="group relative mb-10 h-[44vh] w-full max-w-[480px] overflow-hidden rounded-sm border border-brass/20 bg-night shadow-[0_30px_80px_-20px_rgba(0,0,0,0.7)]">
              <Image
                src={asset(p.image)}
                alt={p.fr}
                fill
                sizes="(max-width: 768px) 78vw, 480px"
                style={{
                  objectFit: 'cover',
                  objectPosition: p.focal,
                  filter: 'brightness(0.82) saturate(1.05) contrast(1.02)',
                }}
                className="transition-transform duration-[2s] ease-out group-hover:scale-[1.03]"
              />

              {/* Voile laiton très léger : harmonise les blancs du fond marbre */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    'linear-gradient(180deg, rgba(2,3,10,0.25) 0%, rgba(2,3,10,0) 30%, rgba(2,3,10,0) 65%, rgba(2,3,10,0.7) 100%)',
                  mixBlendMode: 'multiply',
                }}
              />
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    'radial-gradient(ellipse 130% 90% at 50% 50%, transparent 35%, rgba(2,3,10,0.55) 100%)',
                }}
              />

              {/* Liseré laiton intérieur, façon cadre de tableau */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-2 border border-brass/20"
              />

              {/* Label en haut à gauche — sur fond sombre, lisible */}
              <div className="absolute left-5 top-5 font-mono text-[10px] uppercase tracking-[0.32em] text-text">
                {p.name}
              </div>

              {/* Numéro en haut à droite */}
              <div className="absolute right-5 top-5 font-mono text-[10px] uppercase tracking-[0.32em] text-brass">
                {p.num}
              </div>

              {/* Crédit photo en bas — précise la pièce du catalogue */}
              <div className="absolute right-5 bottom-5 left-5 flex items-end justify-between gap-4">
                <span className="font-mono text-[9px] uppercase tracking-[0.28em] text-text-muted">
                  Réf. {p.credit}
                </span>
                <span className="h-px w-10 bg-brass/60" />
              </div>
            </div>

            <h3 className="font-display text-[clamp(48px,7.5vw,120px)] font-normal leading-[0.9] tracking-tightest text-text">
              {p.fr}
            </h3>
            <p className="mt-6 max-w-md font-display text-xl italic leading-snug text-text-muted md:text-2xl">
              {p.poem}
            </p>
          </article>
        ))}
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 font-mono text-[10px] uppercase tracking-[0.32em] text-text-dim">
        Scroll →
      </div>
    </section>
  )
}
