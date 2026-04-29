'use client'

import { useRef, useState, type MouseEvent, type ReactNode } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/cn'

type Props = {
  children: ReactNode
  href?: string
  onClick?: () => void
  className?: string
  ariaLabel?: string
  variant?: 'solid' | 'ghost'
}

const RADIUS = 90
const STRENGTH = 0.32

export default function MagneticButton({
  children,
  href,
  onClick,
  className,
  ariaLabel,
  variant = 'solid',
}: Props) {
  const ref = useRef<HTMLAnchorElement | HTMLButtonElement | null>(null)
  const [offset, setOffset] = useState({ x: 0, y: 0 })

  const handleMove = (e: MouseEvent<HTMLElement>) => {
    if (typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches) return
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    const dx = e.clientX - cx
    const dy = e.clientY - cy
    const dist = Math.hypot(dx, dy)
    if (dist > RADIUS) {
      setOffset({ x: 0, y: 0 })
      return
    }
    setOffset({ x: dx * STRENGTH, y: dy * STRENGTH })
  }

  const handleLeave = () => setOffset({ x: 0, y: 0 })

  const styleVariant =
    variant === 'solid'
      ? 'bg-brass text-bg hover:bg-text'
      : 'border border-brass/40 text-brass hover:border-brass hover:bg-brass/5'

  const baseClasses = cn(
    'group relative inline-flex items-center justify-center gap-3',
    'px-9 py-5 font-mono text-[11px] uppercase tracking-[0.28em]',
    'rounded-full transition-colors duration-300 ease-out',
    'will-change-transform',
    styleVariant,
    className,
  )

  const style = {
    transform: `translate3d(${offset.x}px, ${offset.y}px, 0)`,
    transition: 'transform 0.4s cubic-bezier(0.22, 1, 0.36, 1)',
  } as const

  const inner = (
    <>
      <span className="relative z-10">{children}</span>
      <span
        aria-hidden
        className="relative z-10 inline-block transition-transform duration-300 group-hover:translate-x-1"
      >
        →
      </span>
    </>
  )

  if (href) {
    return (
      <Link
        ref={ref as React.RefObject<HTMLAnchorElement>}
        href={href}
        aria-label={ariaLabel}
        className={baseClasses}
        style={style}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        onClick={onClick}
      >
        {inner}
      </Link>
    )
  }

  return (
    <button
      ref={ref as React.RefObject<HTMLButtonElement>}
      type="button"
      aria-label={ariaLabel}
      className={baseClasses}
      style={style}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      onClick={onClick}
    >
      {inner}
    </button>
  )
}
