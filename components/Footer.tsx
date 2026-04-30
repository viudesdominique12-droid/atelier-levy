export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="relative z-10 border-t border-text/10 px-[clamp(20px,5vw,80px)] py-10">
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-text-dim">
          © {year} Parker &amp; Smith
        </p>
        <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-text-dim">
          Mandelieu-la-Napoule · Côte d&apos;Azur
        </p>
      </div>
    </footer>
  )
}
