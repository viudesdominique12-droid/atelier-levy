import type { Metadata } from 'next'
import Link from 'next/link'
import SiteFrame from '@/components/SiteFrame'
import PageHeader from '@/components/PageHeader'

export const metadata: Metadata = {
  title: 'Vendre sa montre — Parker & Smith',
  description:
    "Estimez et vendez votre montre de luxe. Expertise, certification et accompagnement par Parker & Smith.",
}

const STEPS = [
  {
    num: '01',
    title: 'Vous nous présentez la pièce',
    body: 'Photos, références, papiers et écrin si vous les avez. Plus le dossier est complet, plus l\'estimation est précise.',
  },
  {
    num: '02',
    title: 'Nous expertisons',
    body: 'Vérification du boîtier, du mouvement et de leur correspondance. Contrôle des éléments périphériques : aiguilles, boucles, tiges couronne. Confrontation des références et numéros de série.',
  },
  {
    num: '03',
    title: 'Nous vous faisons une offre',
    body: "Rachat ferme ou dépôt-vente, selon ce qui vous arrange. Notre offre s'appuie sur la connaissance pointue du marché de la seconde main.",
  },
  {
    num: '04',
    title: 'Vous repartez tranquille',
    body: 'Paiement sous garantie, contrat clair, traçabilité des numéros. Aucune mauvaise surprise.',
  },
]

const COMMITMENTS = [
  'Authentification rigoureuse, sans concession',
  'Expertise du marché de la seconde main',
  'Confidentialité totale sur la transaction',
  'Aucun engagement tant que vous n\'avez pas validé',
]

export default function VendreSaMontrePage() {
  return (
    <SiteFrame>
      <PageHeader
        eyebrow="Vendre"
        title="Vendez votre montre en toute sérénité"
        subtitle="Acquérir une montre de luxe d'occasion n'est pas toujours une chose aisée. La revendre non plus. Parker & Smith vous apporte tout son savoir-faire et son expérience pour que la transaction soit nette, juste et rapide."
      />

      <section className="px-[clamp(20px,5vw,80px)]">
        <div className="mx-auto max-w-5xl">
          <h2 className="font-mono text-[10px] uppercase tracking-[0.32em] text-brass">
            La méthode
          </h2>
          <ol className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-2">
            {STEPS.map((step) => (
              <li
                key={step.num}
                className="border-t border-brass/30 pt-6"
              >
                <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-brass">
                  {step.num}
                </p>
                <h3 className="mt-3 font-display text-2xl leading-tight text-text">
                  {step.title}
                </h3>
                <p className="mt-3 font-body text-sm leading-relaxed text-text-muted">
                  {step.body}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="mt-[clamp(80px,12vw,140px)] px-[clamp(20px,5vw,80px)]">
        <div className="mx-auto max-w-5xl">
          <div className="hairline mb-14" />
          <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
            <div>
              <h2 className="font-display text-3xl leading-[1.05] tracking-tightest text-text md:text-4xl">
                Notre engagement vis-à-vis de chaque vendeur
              </h2>
              <p className="mt-6 font-body text-base leading-relaxed text-text-muted">
                Spécialistes du marché de la montre d&apos;occasion depuis de
                nombreuses années, nous certifions l&apos;authenticité de chaque
                pièce qui passe entre nos mains et vérifions son bon
                fonctionnement avant toute remise en vente.
              </p>
            </div>
            <ul className="space-y-4">
              {COMMITMENTS.map((c) => (
                <li
                  key={c}
                  className="flex items-start gap-4 border-l border-brass/40 pl-4"
                >
                  <span className="mt-1 font-mono text-[10px] uppercase tracking-[0.28em] text-brass">
                    ✓
                  </span>
                  <span className="font-body text-sm leading-relaxed text-text">
                    {c}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="mt-[clamp(80px,12vw,140px)] px-[clamp(20px,5vw,80px)] pb-[clamp(60px,10vw,140px)]">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-display text-[clamp(32px,4.5vw,56px)] leading-[1.05] tracking-tightest text-text">
            Prêt à passer la main ?
          </h2>
          <p className="mt-6 font-body text-base leading-relaxed text-text-muted">
            Envoyez-nous quelques photos et les informations dont vous
            disposez. Nous revenons vers vous avec une première lecture sous
            quelques jours.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center bg-brass px-6 py-4 font-mono text-[11px] uppercase tracking-[0.32em] text-night transition-colors hover:bg-text"
            >
              Demander une estimation
            </Link>
            <Link
              href="/montres"
              className="inline-flex items-center justify-center border border-text/15 px-6 py-4 font-mono text-[11px] uppercase tracking-[0.32em] text-text transition-colors hover:border-brass hover:text-brass"
            >
              Voir nos montres
            </Link>
          </div>
        </div>
      </section>
    </SiteFrame>
  )
}
