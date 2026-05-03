import type { Metadata } from 'next'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import SiteFrame from '@/components/SiteFrame'
import PageHeader from '@/components/PageHeader'

// Globe en chargement dynamique côté client uniquement (SSR off + lazy)
// pour ne pas embarquer THREE.js dans le bundle initial.
const Globe3D = dynamic(() => import('@/components/Globe3D'), {
  ssr: false,
  loading: () => (
    <div className="relative aspect-square w-full max-w-[640px] mx-auto grid place-items-center bg-night/40 rounded-sm border border-brass/20">
      <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-text-dim">
        Chargement du réseau…
      </p>
    </div>
  ),
})

export const metadata: Metadata = {
  title: 'Sourcing — Parker & Smith',
  description:
    "Vous savez ce que vous voulez. Nous trouvons. Service de recherche personnalisée à travers notre réseau international de maisons horlogères, ventes privées et collectionneurs.",
}

const STEPS = [
  {
    num: '01',
    title: 'Le brief',
    body: "Marque, référence, budget, urgence — vous nous décrivez la pièce que vous cherchez. 10 minutes par téléphone ou par écrit, c'est suffisant.",
  },
  {
    num: '02',
    title: 'Le réseau active',
    body: "Maisons horlogères, ventes privées, collectionneurs internationaux. Nous activons notre carnet d'adresses pour identifier les pièces qui correspondent à votre brief.",
  },
  {
    num: '03',
    title: 'Authentification & livraison',
    body: 'La pièce passe par notre grille d\'expertise (5 points), reçoit la garantie 2 ans, et vous est livrée sous valeur déclarée — en France ou à l\'étranger.',
  },
]

export default function SourcingPage() {
  return (
    <SiteFrame>
      <PageHeader
        eyebrow="Recherche personnalisée"
        title="Vous savez ce que vous voulez. On la trouve."
        subtitle="Une référence précise, un modèle rare, une complication, une pièce de collection — notre service de sourcing active un réseau international de maisons horlogères, ventes privées et collectionneurs pour vous."
      />

      {/* === Globe 3D international === */}
      <section className="relative px-[clamp(20px,5vw,80px)] pb-[clamp(40px,8vw,100px)]">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center lg:gap-16">
            <div className="lg:col-span-5">
              <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-brass">
                Notre réseau
              </p>
              <h2 className="mt-6 font-display text-[clamp(40px,5.5vw,84px)] font-normal leading-[0.98] tracking-tightest text-text">
                International, par essence.
              </h2>
              <p className="mt-6 max-w-md font-display text-xl italic leading-snug text-text-muted md:text-2xl">
                De Paris à Genève, de Hong Kong à Dubaï — onze places
                horlogères, un seul interlocuteur.
              </p>
              <p className="mt-6 max-w-md font-body text-sm leading-relaxed text-text-muted md:text-base">
                Notre réseau s&apos;étend sur les principales places
                horlogères mondiales. Maisons partenaires, ventes privées,
                collectionneurs : nous savons où chercher quand une pièce
                est rare.
              </p>
              <p className="mt-8 font-mono text-[10px] uppercase tracking-[0.32em] text-text-dim">
                Glissez sur le globe pour explorer
              </p>
            </div>

            <div className="lg:col-span-7">
              <Globe3D />
            </div>
          </div>
        </div>
      </section>

      {/* === Processus en 3 étapes === */}
      <section className="px-[clamp(20px,5vw,80px)] py-[clamp(60px,10vw,120px)]">
        <div className="mx-auto max-w-5xl">
          <div className="hairline mb-14" />
          <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-brass">
            La méthode
          </p>
          <h2 className="mt-6 font-display text-[clamp(40px,5vw,68px)] leading-[1.05] tracking-tightest text-text">
            Trois étapes, du brief à la livraison.
          </h2>

          <ol className="mt-14 grid grid-cols-1 gap-8 md:grid-cols-3">
            {STEPS.map((step) => (
              <li
                key={step.num}
                className="border-t border-brass/30 pt-6"
              >
                <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-brass">
                  Étape {step.num}
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

      {/* === Brief : ce qu'on demande === */}
      <section className="px-[clamp(20px,5vw,80px)] pb-[clamp(60px,10vw,140px)]">
        <div className="mx-auto max-w-3xl text-center">
          <div className="hairline mb-14" />
          <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-brass">
            Pour démarrer
          </p>
          <h2 className="mt-6 font-display text-[clamp(36px,5vw,68px)] leading-[1.05] tracking-tightest text-text">
            Décrivez la pièce que vous cherchez.
          </h2>
          <p className="mt-6 font-body text-base leading-relaxed text-text-muted">
            Marque · Référence · Année si vous l&apos;avez · Budget
            indicatif · Urgence. Plus vos critères sont précis, plus la
            recherche est rapide. Nous revenons vers vous sous quelques
            jours avec une première proposition.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center bg-brass px-6 py-4 font-mono text-[11px] uppercase tracking-[0.32em] text-night transition-colors hover:bg-text"
            >
              Lancer une recherche
            </Link>
            <Link
              href="/montres"
              className="inline-flex items-center justify-center border border-text/15 px-6 py-4 font-mono text-[11px] uppercase tracking-[0.32em] text-text transition-colors hover:border-brass hover:text-brass"
            >
              Voir d&apos;abord notre catalogue
            </Link>
          </div>
        </div>
      </section>
    </SiteFrame>
  )
}
