import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import SiteFrame from '@/components/SiteFrame'
import PageHeader from '@/components/PageHeader'
import { formatPrice, getJewelry } from '@/lib/watches'
import { asset } from '@/lib/asset'

export const metadata: Metadata = {
  title: 'Bijoux — Parker & Smith',
  description:
    "Sélection de bijoux signés Cartier, Hermès, Pomellato, Piaget, Bulgari, Chopard, Chanel et de pièces non signées, anciennes ou contemporaines.",
}

const SIGNED_BRANDS = [
  'Cartier',
  'Hermès',
  'Pomellato',
  'Piaget',
  'Bulgari',
  'Chopard',
  'Chanel',
]

const CHECKS = [
  {
    title: 'Titres et poinçons',
    body: "Contrôle systématique des titres, poinçons d'origine et certificats de garantie.",
  },
  {
    title: 'Sertis et pierres',
    body: 'Vérification des sertis sur toutes les pièces de joaillerie, ainsi que de la qualité des pierres.',
  },
  {
    title: 'Création sur-mesure',
    body: 'Possibilité de créer votre bijou de A à Z avec nos partenaires créateurs.',
  },
]

export default function BijouxPage() {
  const items = getJewelry()

  return (
    <SiteFrame>
      <PageHeader
        eyebrow="Joaillerie"
        title="Parker & Smith, c'est aussi des bijoux"
        subtitle="Notre sélection de bijoux signés Cartier, Hermès, Pomellato, Piaget, Bulgari, Chopard, Chanel… et des pièces non signées, anciennes ou contemporaines, toutes assidûment examinées par nos experts bijoux."
      />

      <section className="px-[clamp(20px,5vw,80px)]">
        <div className="mx-auto max-w-7xl">
          <ul className="flex flex-wrap gap-3">
            {SIGNED_BRANDS.map((brand) => (
              <li
                key={brand}
                className="border border-brass/30 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.28em] text-brass"
              >
                {brand}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {items.length > 0 ? (
        <section className="mt-[clamp(60px,8vw,100px)] px-[clamp(20px,5vw,80px)]">
          <div className="mx-auto max-w-7xl">
            <h2 className="font-mono text-[10px] uppercase tracking-[0.32em] text-text-muted">
              Pièces actuellement en vitrine
            </h2>
            <ul className="mt-10 grid grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((w) => (
                <li key={w.slug}>
                  <Link
                    href={`/bijoux/${w.slug}`}
                    className="group block focus:outline-none"
                  >
                    <div className="relative aspect-square overflow-hidden rounded-xl bg-surface">
                      {w.mainImage ? (
                        <Image
                          src={asset(w.mainImage)}
                          alt={`${w.brand} ${w.model}`}
                          fill
                          sizes="(max-width: 1024px) 90vw, 30vw"
                          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                        />
                      ) : null}
                    </div>
                    <p className="mt-5 font-mono text-[10px] uppercase tracking-[0.28em] text-brass">
                      {w.brand}
                    </p>
                    <h3 className="mt-2 font-display text-2xl text-text">
                      {w.model}
                    </h3>
                    <p className="mt-2 font-display text-xl text-text-muted">
                      {formatPrice(w.price, w.currency)}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      <section className="mt-[clamp(80px,12vw,140px)] px-[clamp(20px,5vw,80px)] pb-[clamp(60px,10vw,140px)]">
        <div className="mx-auto max-w-5xl">
          <div className="hairline mb-14" />
          <h2 className="font-mono text-[10px] uppercase tracking-[0.32em] text-brass">
            Notre exigence joaillerie
          </h2>
          <div className="mt-10 grid grid-cols-1 gap-10 md:grid-cols-3">
            {CHECKS.map((c) => (
              <div key={c.title} className="border-t border-brass/30 pt-6">
                <h3 className="font-display text-2xl leading-tight text-text">
                  {c.title}
                </h3>
                <p className="mt-3 font-body text-sm leading-relaxed text-text-muted">
                  {c.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </SiteFrame>
  )
}
