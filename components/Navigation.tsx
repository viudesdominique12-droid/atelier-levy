'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/cn'

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50',
        'px-[clamp(20px,5vw,80px)] py-5',
        'transition-all duration-500',
        scrolled
          ? 'bg-bg/65 backdrop-blur-xl border-b border-text/5'
          : 'bg-transparent',
      )}
    >
      <nav className="flex items-center justify-between">
        <Link
          href="/"
          aria-label="Atelier R. Levy — accueil"
          className="font-display text-xl text-text leading-none tracking-tight"
        >
          <span className="text-brass">·</span> Atelier R. Levy
        </Link>

        <div className="flex items-center gap-8">
          <span className="hidden font-mono text-[10px] uppercase tracking-[0.32em] text-text-dim md:inline">
            Mandelieu-la-Napoule
          </span>
          <Link
            href="#invitation"
            className="font-mono text-[10px] uppercase tracking-[0.28em] text-brass underline-offset-4 hover:underline"
          >
            Contact
          </Link>
        </div>
      </nav>
    </header>
  )
}
