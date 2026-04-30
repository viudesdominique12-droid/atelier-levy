import Navigation from './Navigation'
import Footer from './Footer'

/**
 * Wrapper pour les pages internes : pas de fond montre, juste le voile bleu
 * nuit ambiant (body::after) — l'atmosphère reste cohérente, sans visuel
 * lourd.
 */
export default function SiteFrame({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <>
      <Navigation />
      <main
        className={`relative z-[2] pt-[88px] ${className}`}
      >
        {children}
      </main>
      <Footer />
    </>
  )
}
