import type { Metadata } from 'next'
import Link from 'next/link'
import SiteFrame from '@/components/SiteFrame'
import PageHeader from '@/components/PageHeader'
import ServicesTimeline from '@/components/ServicesTimeline'

export const metadata: Metadata = {
  title: 'Nos métiers — Parker & Smith',
  description:
    "Cinq services pour entrer dans le marché horloger de luxe : achat, vente, sourcing personnalisé, estimation, conseil. Maison indépendante, réseau international, garantie 2 ans.",
}

export default function ServicesPage() {
  return (
    <SiteFrame>
      <PageHeader
        eyebrow="Maison horlogère"
        title="Cinq portes pour le marché horloger"
        subtitle="Acheter, vendre, sourcer, estimer, conseiller — cinq façons d'entrer dans le marché horloger de luxe avec un interlocuteur indépendant. Neuf, occasion, vintage. À l'international."
      />

      <ServicesTimeline />

      <section className="px-[clamp(20px,5vw,80px)] pb-[clamp(60px,10vw,140px)]">
        <div className="mx-auto max-w-3xl text-center">
          <div className="hairline mb-14" />
          <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-brass">
            Une question ?
          </p>
          <h2 className="mt-6 font-display text-[clamp(36px,5vw,68px)] leading-[1.05] tracking-tightest text-text">
            Décrivez ce que vous cherchez. On répond.
          </h2>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center bg-brass px-6 py-4 font-mono text-[11px] uppercase tracking-[0.32em] text-night transition-colors hover:bg-text"
            >
              Nous écrire
            </Link>
            <Link
              href="/sourcing"
              className="inline-flex items-center justify-center border border-text/15 px-6 py-4 font-mono text-[11px] uppercase tracking-[0.32em] text-text transition-colors hover:border-brass hover:text-brass"
            >
              Recherche personnalisée
            </Link>
          </div>
        </div>
      </section>
    </SiteFrame>
  )
}
