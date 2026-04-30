import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'

import SiteFrame from '@/components/SiteFrame'
import WatchGallery from '@/components/WatchGallery'
import {
  WATCHES,
  formatPrice,
  formatYear,
  getRelatedWatches,
  getWatchBySlug,
} from '@/lib/watches'

export function generateStaticParams() {
  return WATCHES.map((w) => ({ slug: w.slug }))
}

export function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Metadata {
  const w = getWatchBySlug(params.slug)
  if (!w) return { title: 'Pièce introuvable — Parker & Smith' }
  return {
    title: `${w.brand} ${w.model} — Parker & Smith`,
    description:
      w.description ||
      `${w.brand} ${w.model} — référence ${w.reference}, authentifiée et garantie 2 ans par Parker & Smith.`,
  }
}

const HIGHLIGHTS = [
  {
    label: 'Authentifiée',
    body: 'Boîtier, mouvement et correspondance des numéros vérifiés par nos experts.',
  },
  {
    label: 'Garantie 2 ans',
    body: 'Garantie d’origine ou garantie 2 années fournie par Parker & Smith.',
  },
  {
    label: 'Bon fonctionnement',
    body: 'Atelier horloger intégré, ou retour dans les ateliers des marques.',
  },
]

export default function WatchDetailPage({
  params,
}: {
  params: { slug: string }
}) {
  const watch = getWatchBySlug(params.slug)
  if (!watch || watch.isJewelry) notFound()

  const yearPrefix = watch.yearApproximate && watch.year ? 'Vers ' : ''
  const yearLabel = formatYear(watch.year)
  const onSale = watch.onSale && watch.priceOriginal
  const related = getRelatedWatches(watch.slug, 3)

  return (
    <SiteFrame>
      <div className="px-[clamp(20px,5vw,80px)]">
        <div className="mx-auto max-w-7xl">
          <nav
            aria-label="Fil d'Ariane"
            className="pt-2 font-mono text-[10px] uppercase tracking-[0.28em] text-text-dim"
          >
            <Link href="/montres" className="text-text-muted hover:text-brass">
              Montres
            </Link>
            <span className="mx-2 text-text-dim/60">/</span>
            <span className="text-text-muted">{watch.brand}</span>
          </nav>

          <div className="mt-8 grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-16">
            <div>
              <WatchGallery
                images={watch.images}
                alt={`${watch.brand} ${watch.model}`}
              />
            </div>

            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-brass">
                {watch.brand}
              </p>
              <h1 className="mt-3 font-display text-[clamp(36px,5vw,68px)] leading-[0.98] tracking-tightest text-text">
                {watch.model}
              </h1>

              <dl className="mt-6 grid grid-cols-2 gap-x-8 gap-y-4 border-y border-text/10 py-6">
                <div>
                  <dt className="font-mono text-[9px] uppercase tracking-[0.3em] text-text-dim">
                    Référence
                  </dt>
                  <dd className="mt-1 font-mono text-sm text-text">
                    {watch.reference}
                  </dd>
                </div>
                <div>
                  <dt className="font-mono text-[9px] uppercase tracking-[0.3em] text-text-dim">
                    Année
                  </dt>
                  <dd className="mt-1 font-mono text-sm text-text">
                    {yearPrefix}
                    {yearLabel}
                  </dd>
                </div>
                <div>
                  <dt className="font-mono text-[9px] uppercase tracking-[0.3em] text-text-dim">
                    Statut
                  </dt>
                  <dd className="mt-1 font-mono text-sm text-text">
                    {watch.isVintage ? 'Vintage' : 'Contemporaine'}
                  </dd>
                </div>
                <div>
                  <dt className="font-mono text-[9px] uppercase tracking-[0.3em] text-text-dim">
                    Disponibilité
                  </dt>
                  <dd className="mt-1 font-mono text-sm text-text">
                    En boutique
                  </dd>
                </div>
              </dl>

              <div className="mt-8 flex items-baseline gap-4">
                {onSale ? (
                  <span className="font-mono text-sm text-text-dim line-through">
                    {formatPrice(watch.priceOriginal as string, watch.currency)}
                  </span>
                ) : null}
                <span className="font-display text-4xl text-text">
                  {formatPrice(watch.price, watch.currency)}
                </span>
                {onSale ? (
                  <span className="bg-copper/90 px-2 py-1 font-mono text-[9px] uppercase tracking-[0.32em] text-text">
                    Promotion
                  </span>
                ) : null}
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center bg-brass px-6 py-4 font-mono text-[11px] uppercase tracking-[0.32em] text-night transition-colors hover:bg-text"
                >
                  Demander cette pièce
                </Link>
                <Link
                  href="/vendre-sa-montre"
                  className="inline-flex items-center justify-center border border-text/15 px-6 py-4 font-mono text-[11px] uppercase tracking-[0.32em] text-text transition-colors hover:border-brass hover:text-brass"
                >
                  Vendre la mienne
                </Link>
              </div>

              {watch.description ? (
                <div className="mt-12">
                  <h2 className="font-mono text-[10px] uppercase tracking-[0.32em] text-brass">
                    L&apos;histoire
                  </h2>
                  <p className="mt-4 font-body text-base leading-relaxed text-text-muted">
                    {watch.description}
                  </p>
                </div>
              ) : null}

              <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-3">
                {HIGHLIGHTS.map((h) => (
                  <div
                    key={h.label}
                    className="border-l border-brass/40 pl-4"
                  >
                    <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-brass">
                      {h.label}
                    </p>
                    <p className="mt-2 font-body text-xs leading-relaxed text-text-muted">
                      {h.body}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {related.length > 0 ? (
            <section className="mt-[clamp(80px,12vw,160px)] pb-[clamp(60px,10vw,140px)]">
              <div className="hairline mb-12" />
              <h2 className="font-mono text-[10px] uppercase tracking-[0.32em] text-text-muted">
                Dans la même vitrine
              </h2>
              <ul className="mt-10 grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
                {related.map((r) => (
                  <li key={r.slug}>
                    <Link
                      href={`/montres/${r.slug}`}
                      className="group block focus:outline-none"
                    >
                      <div className="relative aspect-square overflow-hidden rounded-xl bg-surface">
                        {r.mainImage ? (
                          <Image
                            src={r.mainImage}
                            alt={`${r.brand} ${r.model}`}
                            fill
                            sizes="(max-width: 1024px) 50vw, 30vw"
                            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                          />
                        ) : null}
                      </div>
                      <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.28em] text-brass">
                        {r.brand}
                      </p>
                      <h3 className="mt-1 font-display text-xl text-text">
                        {r.model}
                      </h3>
                      <p className="mt-1 font-display text-base text-text-muted">
                        {formatPrice(r.price, r.currency)}
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </div>
      </div>
    </SiteFrame>
  )
}
