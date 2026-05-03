import type { Metadata } from 'next'
import SiteFrame from '@/components/SiteFrame'
import PageHeader from '@/components/PageHeader'
import WatchCard from '@/components/WatchCard'
import { getWatchesOnly } from '@/lib/watches'

export const metadata: Metadata = {
  title: 'Catalogue — Parker & Smith',
  description:
    "Sélection internationale de montres de luxe — neuf, occasion, vintage. Authentifiées, certifiées et garanties 2 ans.",
}

const BRAND_ORDER = [
  'AUDEMARS PIGUET',
  'BREGUET',
  'BREITLING',
  'CARTIER',
  'CHANEL',
  'CHOPARD',
  'HUBLOT',
  'OMEGA',
  'PANERAI',
  'ROLEX',
  'TAG HEUER',
  'TUDOR',
]

export default function MontresPage() {
  const all = getWatchesOnly()
  const vintage = all.filter((w) => w.isVintage)
  const contemporary = all.filter((w) => !w.isVintage)

  return (
    <SiteFrame>
      <PageHeader
        eyebrow="Catalogue"
        title="Sélection internationale — neuf, occasion, vintage"
        subtitle="Toutes nos pièces sont authentifiées, certifiées et garanties 2 ans par notre atelier horloger intégré ou après être passées dans les ateliers des marques. Expéditions sécurisées en France comme à l'étranger."
      />

      <section className="px-[clamp(20px,5vw,80px)]">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-wrap items-baseline justify-between gap-4 pb-10">
            <h2 className="font-mono text-[10px] uppercase tracking-[0.32em] text-text-muted">
              Sélection contemporaine — {contemporary.length} pièces
            </h2>
            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-text-dim">
              {BRAND_ORDER.length} maisons
            </p>
          </div>

          <ul className="grid grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
            {contemporary.map((w) => (
              <li key={w.slug}>
                <WatchCard watch={w} />
              </li>
            ))}
          </ul>
        </div>
      </section>

      {vintage.length > 0 ? (
        <section className="mt-[clamp(60px,10vw,140px)] px-[clamp(20px,5vw,80px)] pb-[clamp(60px,10vw,140px)]">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-wrap items-baseline justify-between gap-4 pb-10">
              <h2 className="font-mono text-[10px] uppercase tracking-[0.32em] text-brass">
                Vintage — Avant 1990
              </h2>
              <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-text-dim">
                {vintage.length}{' '}
                {vintage.length > 1 ? 'pièces rares' : 'pièce rare'}
              </p>
            </div>

            <ul className="grid grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
              {vintage.map((w) => (
                <li key={w.slug}>
                  <WatchCard watch={w} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}
    </SiteFrame>
  )
}
