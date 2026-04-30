import type { Metadata } from 'next'
import Link from 'next/link'
import SiteFrame from '@/components/SiteFrame'
import PageHeader from '@/components/PageHeader'

export const metadata: Metadata = {
  title: 'Accessoires — Parker & Smith',
  description:
    'Bracelets, étuis et compléments soigneusement sélectionnés par nos horlogers.',
}

const FAMILIES = [
  {
    title: 'Bracelets',
    body: "Cuirs, NATO, mailles acier ou or — sélection et pose dans notre atelier. Lorsque les bracelets d'origine ne répondent pas à nos critères d'exigence, nous les remplaçons par des modèles neufs.",
  },
  {
    title: 'Écrins & boîtes',
    body: 'Écrins de présentation, étuis de transport, sur-boîtes pour collectionneurs. Disponibles à la demande pour vos pièces.',
  },
  {
    title: 'Outils & entretien',
    body: 'Lupes d\'horloger, kits de nettoyage doux, chiffons spécifiques. Pour prendre soin de vos pièces au quotidien.',
  },
]

export default function AccessoiresPage() {
  return (
    <SiteFrame>
      <PageHeader
        eyebrow="Accessoires"
        title="L'accompagnement, jusque dans le détail"
        subtitle="Au-delà de la montre elle-même, nous proposons une sélection d'accessoires — bracelets, écrins, outils — pensés pour prolonger la vie de vos pièces."
      />

      <section className="px-[clamp(20px,5vw,80px)]">
        <div className="mx-auto max-w-5xl">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
            {FAMILIES.map((f) => (
              <div key={f.title} className="border-t border-brass/30 pt-6">
                <h2 className="font-display text-2xl leading-tight text-text">
                  {f.title}
                </h2>
                <p className="mt-3 font-body text-sm leading-relaxed text-text-muted">
                  {f.body}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-[clamp(60px,10vw,120px)] text-spotlight rounded-[1px] px-8 py-12 text-center">
            <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-brass">
              Sur demande
            </p>
            <h3 className="mt-4 font-display text-3xl leading-tight text-text md:text-4xl">
              Nous sourçons l&apos;accessoire qu&apos;il vous faut
            </h3>
            <p className="mx-auto mt-4 max-w-xl font-body text-base leading-relaxed text-text-muted">
              Bracelet d&apos;origine pour une référence précise, écrin de
              collection, outil professionnel — décrivez-nous ce que vous
              cherchez, nous le trouvons.
            </p>
            <Link
              href="/contact"
              className="mt-8 inline-flex items-center justify-center bg-brass px-6 py-4 font-mono text-[11px] uppercase tracking-[0.32em] text-night transition-colors hover:bg-text"
            >
              Nous contacter
            </Link>
          </div>
        </div>
      </section>

      <div className="pb-[clamp(60px,10vw,140px)]" />
    </SiteFrame>
  )
}
