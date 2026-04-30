export default function PageHeader({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow?: string
  title: string
  subtitle?: string
}) {
  return (
    <header className="relative px-[clamp(20px,5vw,80px)] pt-[clamp(40px,9vw,120px)] pb-[clamp(28px,5vw,72px)]">
      <div className="mx-auto max-w-7xl">
        {eyebrow ? (
          <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-brass">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="mt-3 font-display text-title leading-[0.95] tracking-tightest text-text">
          {title}
        </h1>
        {subtitle ? (
          <p className="mt-6 max-w-2xl font-body text-base leading-relaxed text-text-muted md:text-lg">
            {subtitle}
          </p>
        ) : null}
        <div className="mt-10 hairline" />
      </div>
    </header>
  )
}
