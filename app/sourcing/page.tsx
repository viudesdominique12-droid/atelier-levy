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
    body: "Maisons horlogères, ventes privées, collectionneurs internationaux. Nous activons notre carnet d'adresses pour identifier les pièces qui correspondent à votre brief. Vous recevez 1 à 3 propositions, photos + provenance + prix.",
  },
  {
    num: '03',
    title: 'Authentification & livraison',
    body: 'La pièce que vous choisissez passe par notre grille d\'expertise (5 points), reçoit la garantie 2 ans, et vous est livrée sous valeur déclarée — en France ou à l\'étranger.',
  },
]

const CASES = [
  {
    num: '01',
    title: 'Une pièce sur liste d’attente boutique',
    example:
      'Rolex Daytona, Patek Nautilus, AP Royal Oak Jumbo — années d’attente chez le concessionnaire, accessibles via le marché secondaire.',
  },
  {
    num: '02',
    title: 'Une référence vintage précise',
    example:
      'Submariner 1680 années 70, Speedmaster 145.012, Royal Oak 5402 première série — pas en boutique, dans le réseau de collectionneurs.',
  },
  {
    num: '03',
    title: 'Une configuration rare',
    example:
      'Cadran spécifique, complication particulière, série limitée numérotée — la pièce existe quelque part, on la cherche.',
  },
  {
    num: '04',
    title: 'Le souvenir d’un proche',
    example:
      'La montre vue chez votre grand-père, celle d’un héritage à reconstituer, ou un modèle de votre mariage à retrouver — on retrouve la référence puis la pièce.',
  },
]

const ADVANTAGES = [
  {
    title: 'Réseau international',
    body: 'Onze places horlogères mondiales. Là où une recherche solo plafonne à 5 % du marché disponible, nous accédons à l’ensemble.',
  },
  {
    title: 'Authentification systématique',
    body: 'Aucune pièce ne vous est proposée avant d’avoir passé notre grille des 5 points. Vous ne recevez jamais une fausse, ni une pièce trafiquée.',
  },
  {
    title: 'Juste prix, négocié',
    body: 'Notre lecture des cotes internationales et de la demande sur chaque référence garantit que vous payez le prix juste — ni plus, ni moins.',
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

      {/* === Quand faire appel — 4 cas concrets === */}
      <section className="px-[clamp(20px,5vw,80px)] py-[clamp(60px,10vw,120px)]">
        <div className="mx-auto max-w-5xl">
          <div className="hairline mb-14" />
          <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-brass">
            Quand faire appel au sourcing
          </p>
          <h2 className="mt-6 font-display text-[clamp(40px,5vw,68px)] leading-[1.05] tracking-tightest text-text">
            Quatre cas où chercher seul ne suffit plus.
          </h2>

          <ol className="mt-12 grid grid-cols-1 gap-x-10 gap-y-10 md:grid-cols-2">
            {CASES.map((c) => (
              <li
                key={c.num}
                className="border-l border-brass/30 pl-5"
              >
                <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-brass">
                  {c.num}
                </p>
                <h3 className="mt-3 font-display text-2xl leading-tight text-text">
                  {c.title}
                </h3>
                <p className="mt-3 font-body text-sm leading-relaxed text-text-muted">
                  {c.example}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* === Processus en 3 étapes === */}
      <section className="px-[clamp(20px,5vw,80px)] pb-[clamp(60px,10vw,120px)]">
        <div className="mx-auto max-w-5xl">
          <div className="hairline mb-14" />
          <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-brass">
            La méthode
          </p>
          <h2 className="mt-6 font-display text-[clamp(40px,5vw,68px)] leading-[1.05] tracking-tightest text-text">
            Trois étapes, du brief à la livraison.
          </h2>

          {/* Bandeau conditions clés — gratuit / délai / engagement */}
          <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3">
            <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.32em] text-text-muted">
              <span className="h-1 w-1 rounded-full bg-brass" />
              Recherche gratuite
            </span>
            <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.32em] text-text-muted">
              <span className="h-1 w-1 rounded-full bg-brass" />
              Délai 1 à 4 semaines
            </span>
            <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.32em] text-text-muted">
              <span className="h-1 w-1 rounded-full bg-brass" />
              Aucun engagement
            </span>
          </div>

          <ol className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
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

      {/* === Pourquoi nous : différenciateurs vs chercher seul === */}
      <section className="px-[clamp(20px,5vw,80px)] pb-[clamp(60px,10vw,120px)]">
        <div className="mx-auto max-w-5xl">
          <div className="hairline mb-14" />
          <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-brass">
            Pourquoi passer par nous
          </p>
          <h2 className="mt-6 font-display text-[clamp(40px,5vw,68px)] leading-[1.05] tracking-tightest text-text">
            Trois raisons que vous n’avez pas tout seul.
          </h2>

          <ul className="mt-14 grid grid-cols-1 gap-10 md:grid-cols-3">
            {ADVANTAGES.map((adv) => (
              <li key={adv.title} className="border-t border-brass/30 pt-6">
                <h3 className="font-display text-2xl leading-tight text-text">
                  {adv.title}
                </h3>
                <p className="mt-3 font-body text-sm leading-relaxed text-text-muted">
                  {adv.body}
                </p>
              </li>
            ))}
          </ul>
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
