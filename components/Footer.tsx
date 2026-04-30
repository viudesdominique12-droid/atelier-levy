import Link from 'next/link'

const COLUMNS = [
  {
    title: 'Catalogue',
    links: [
      { href: '/montres', label: 'Montres' },
      { href: '/bijoux', label: 'Bijoux' },
      { href: '/accessoires', label: 'Accessoires' },
    ],
  },
  {
    title: 'Services',
    links: [
      { href: '/vendre-sa-montre', label: 'Vendre sa montre' },
      { href: '/contact', label: 'Demander un conseil' },
    ],
  },
  {
    title: 'Maison',
    links: [
      { href: '/contact', label: 'Nous rencontrer' },
    ],
  },
]

export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="relative z-10 border-t border-text/10 px-[clamp(20px,5vw,80px)] pt-16 pb-10">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-4">
          <div>
            <p className="font-display text-2xl text-text">
              <span className="text-brass">·</span> Parker &amp; Smith
            </p>
            <p className="mt-4 font-body text-sm leading-relaxed text-text-muted">
              Expertise et conseil en montres et bijoux de luxe. Spécialistes
              du marché de la montre d&apos;occasion.
            </p>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title}>
              <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-brass">
                {col.title}
              </p>
              <ul className="mt-4 space-y-2">
                {col.links.map((l) => (
                  <li key={l.href + l.label}>
                    <Link
                      href={l.href}
                      className="font-body text-sm text-text-muted transition-colors hover:text-text"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 hairline" />

        <div className="mt-8 flex flex-col items-start justify-between gap-3 font-mono text-[10px] uppercase tracking-[0.32em] text-text-dim md:flex-row md:items-center">
          <p>© {year} Parker &amp; Smith</p>
          <p>
            Authentification · Certification · Garantie 2 ans
          </p>
          <p>
            Ni agent, ni représentant, ni concessionnaire officiel
          </p>
        </div>
      </div>
    </footer>
  )
}
