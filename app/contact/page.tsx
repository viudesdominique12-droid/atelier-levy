import type { Metadata } from 'next'
import SiteFrame from '@/components/SiteFrame'
import PageHeader from '@/components/PageHeader'

export const metadata: Metadata = {
  title: 'Contact — Parker & Smith',
  description: 'Contactez Parker & Smith — expertise et conseil en montres et bijoux de luxe.',
}

const REASONS = [
  {
    title: "Acheter une pièce",
    body: "Vous avez repéré une montre ou un bijou dans notre catalogue, ou vous cherchez une référence précise.",
  },
  {
    title: 'Vendre votre montre',
    body: "Photos, références, papiers : nous revenons vers vous avec une estimation et la suite la plus simple.",
  },
  {
    title: 'Demander un conseil',
    body: 'Première montre, complication, vintage, joaillerie. Nous prenons le temps de répondre.',
  },
]

export default function ContactPage() {
  return (
    <SiteFrame>
      <PageHeader
        eyebrow="Contact"
        title="Venez nous rencontrer"
        subtitle="Que vous recherchiez un classique de l'horlogerie, un modèle plus rare, ou que vous souhaitiez faire estimer une pièce — notre équipe vous répond avec attention."
      />

      <section className="px-[clamp(20px,5vw,80px)] pb-[clamp(60px,10vw,140px)]">
        <div className="mx-auto max-w-5xl">
          <ul className="grid grid-cols-1 gap-10 md:grid-cols-3">
            {REASONS.map((r) => (
              <li key={r.title} className="border-t border-brass/30 pt-6">
                <h2 className="font-display text-2xl leading-tight text-text">
                  {r.title}
                </h2>
                <p className="mt-3 font-body text-sm leading-relaxed text-text-muted">
                  {r.body}
                </p>
              </li>
            ))}
          </ul>

          <div className="mt-[clamp(80px,12vw,140px)] grid grid-cols-1 gap-12 md:grid-cols-2">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-brass">
                Le mot d&apos;ordre
              </p>
              <h2 className="mt-4 font-display text-3xl leading-[1.05] tracking-tightest text-text md:text-4xl">
                Acheter en confiance, vendre en sérénité
              </h2>
              <p className="mt-6 font-body text-base leading-relaxed text-text-muted">
                Parker &amp; Smith n&apos;est ni agent, ni représentant, ni
                concessionnaire officiel des marques proposées. Notre métier,
                c&apos;est l&apos;expertise et le conseil en montres et bijoux
                de luxe — au service de chaque pièce qui nous passe entre les
                mains.
              </p>
            </div>
            <div className="border-l border-brass/20 pl-8">
              <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-brass">
                Pour nous écrire
              </p>
              <p className="mt-4 font-body text-base leading-relaxed text-text">
                Le formulaire et les coordonnées de la boutique vous sont
                communiqués sur simple demande. Décrivez-nous votre projet —
                nous reviendrons vers vous rapidement.
              </p>
              <p className="mt-8 font-mono text-[10px] uppercase tracking-[0.32em] text-text-dim">
                Garantie 2 ans · Authentification systématique
              </p>
            </div>
          </div>
        </div>
      </section>
    </SiteFrame>
  )
}
