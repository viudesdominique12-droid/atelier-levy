'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/cn'

const NAV_LINKS = [
  { href: '/montres', label: 'Catalogue' },
  { href: '/services', label: 'Services' },
  { href: '/sourcing', label: 'Sourcing' },
  { href: '/vendre-sa-montre', label: 'Vendre' },
  { href: '/bijoux', label: 'Bijoux' },
  { href: '/contact', label: 'Contact' },
]

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50',
        'px-[clamp(20px,5vw,80px)] py-5',
        'transition-all duration-500',
        scrolled || open
          ? 'bg-bg/80 backdrop-blur-xl border-b border-text/5'
          : 'bg-transparent',
      )}
    >
      <nav className="flex items-center justify-between">
        <Link
          href="/"
          aria-label="Parker & Smith — accueil"
          className="font-display text-xl text-text leading-none tracking-tight"
        >
          <span className="text-brass">·</span> Parker &amp; Smith
        </Link>

        <div className="hidden items-center gap-7 lg:flex">
          {NAV_LINKS.map((link) => {
            const active =
              pathname === link.href ||
              (link.href !== '/' && pathname?.startsWith(link.href))
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'font-mono text-[10px] uppercase tracking-[0.28em] transition-colors',
                  active
                    ? 'text-brass'
                    : 'text-text-muted hover:text-text',
                )}
              >
                {link.label}
              </Link>
            )
          })}
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
          className="flex items-center gap-2 lg:hidden"
        >
          <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-text">
            {open ? 'Fermer' : 'Menu'}
          </span>
          <span className="relative block h-3 w-5">
            <span
              className={cn(
                'absolute inset-x-0 h-px bg-text transition-all duration-300',
                open ? 'top-1.5 rotate-45' : 'top-0',
              )}
            />
            <span
              className={cn(
                'absolute inset-x-0 h-px bg-text transition-all duration-300',
                open ? 'top-1.5 -rotate-45' : 'top-3',
              )}
            />
          </span>
        </button>
      </nav>

      <div
        className={cn(
          'lg:hidden overflow-hidden transition-[max-height,opacity] duration-500',
          open ? 'max-h-[480px] opacity-100' : 'max-h-0 opacity-0',
        )}
      >
        <ul className="flex flex-col gap-1 pt-6 pb-3">
          {NAV_LINKS.map((link) => {
            const active =
              pathname === link.href ||
              (link.href !== '/' && pathname?.startsWith(link.href))
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={cn(
                    'block py-3 font-display text-2xl tracking-tight transition-colors',
                    active ? 'text-brass' : 'text-text hover:text-brass',
                  )}
                >
                  {link.label}
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
    </header>
  )
}
