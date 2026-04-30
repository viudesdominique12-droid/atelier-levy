import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import SiteFrame from '@/components/SiteFrame'
import WatchGallery from '@/components/WatchGallery'
import {
  formatPrice,
  getJewelry,
  getWatchBySlug,
} from '@/lib/watches'

export function generateStaticParams() {
  return getJewelry().map((w) => ({ slug: w.slug }))
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
      w.description || `${w.brand} ${w.model} — bijou authentifié par Parker & Smith.`,
  }
}

export default function JewelryDetailPage({
  params,
}: {
  params: { slug: string }
}) {
  const piece = getWatchBySlug(params.slug)
  if (!piece || !piece.isJewelry) notFound()

  return (
    <SiteFrame>
      <div className="px-[clamp(20px,5vw,80px)] pb-[clamp(60px,10vw,140px)]">
        <div className="mx-auto max-w-7xl">
          <nav
            aria-label="Fil d'Ariane"
            className="pt-2 font-mono text-[10px] uppercase tracking-[0.28em] text-text-dim"
          >
            <Link href="/bijoux" className="text-text-muted hover:text-brass">
              Bijoux
            </Link>
            <span className="mx-2 text-text-dim/60">/</span>
            <span className="text-text-muted">{piece.brand}</span>
          </nav>

          <div className="mt-8 grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-16">
            <div>
              <WatchGallery
                images={piece.images}
                alt={`${piece.brand} ${piece.model}`}
              />
            </div>

            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-brass">
                {piece.brand}
              </p>
              <h1 className="mt-3 font-display text-[clamp(36px,5vw,68px)] leading-[0.98] tracking-tightest text-text">
                {piece.model}
              </h1>
              <p className="mt-4 font-mono text-sm text-text-muted">
                Réf. {piece.reference}
              </p>

              <div className="mt-8 font-display text-4xl text-text">
                {formatPrice(piece.price, piece.currency)}
              </div>

              <Link
                href="/contact"
                className="mt-8 inline-flex items-center justify-center bg-brass px-6 py-4 font-mono text-[11px] uppercase tracking-[0.32em] text-night transition-colors hover:bg-text"
              >
                Demander cette pièce
              </Link>

              {piece.description ? (
                <div className="mt-12">
                  <h2 className="font-mono text-[10px] uppercase tracking-[0.32em] text-brass">
                    L&apos;histoire
                  </h2>
                  <p className="mt-4 font-body text-base leading-relaxed text-text-muted">
                    {piece.description}
                  </p>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </SiteFrame>
  )
}
