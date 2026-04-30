'use client'

import { useCallback, useEffect, useState } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/cn'
import { asset } from '@/lib/asset'
import type { WatchImage } from '@/lib/watches'

export default function WatchGallery({
  images,
  alt,
}: {
  images: WatchImage[]
  alt: string
}) {
  const [active, setActive] = useState(0)
  const [zoom, setZoom] = useState(false)

  const showPrev = useCallback(() => {
    setActive((i) => (i - 1 + images.length) % images.length)
  }, [images.length])

  const showNext = useCallback(() => {
    setActive((i) => (i + 1) % images.length)
  }, [images.length])

  useEffect(() => {
    if (!zoom) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setZoom(false)
      if (e.key === 'ArrowLeft') showPrev()
      if (e.key === 'ArrowRight') showNext()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [zoom, showPrev, showNext])

  useEffect(() => {
    if (zoom) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [zoom])

  if (images.length === 0) {
    return (
      <div className="aspect-square w-full bg-surface grid place-items-center text-text-dim">
        Aucune image
      </div>
    )
  }

  const current = images[active]

  return (
    <>
      <div className="relative">
        <button
          type="button"
          onClick={() => setZoom(true)}
          className="group relative block aspect-square w-full overflow-hidden bg-surface focus:outline-none"
          aria-label="Agrandir l'image"
        >
          <Image
            src={asset(current.src)}
            alt={alt}
            fill
            sizes="(max-width: 1024px) 100vw, 60vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
            priority
          />
          <span className="absolute right-4 top-4 bg-bg/70 px-2 py-1 font-mono text-[9px] uppercase tracking-[0.32em] text-text backdrop-blur opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            Agrandir
          </span>
          {images.length > 1 ? (
            <span className="absolute bottom-4 right-4 bg-bg/70 px-2 py-1 font-mono text-[10px] tracking-[0.2em] text-text backdrop-blur">
              {active + 1} / {images.length}
            </span>
          ) : null}
        </button>

        {images.length > 1 ? (
          <>
            <button
              type="button"
              onClick={showPrev}
              aria-label="Image précédente"
              className="absolute left-3 top-1/2 -translate-y-1/2 grid h-10 w-10 place-items-center rounded-full bg-bg/60 text-text backdrop-blur transition-colors hover:bg-bg/85"
            >
              ←
            </button>
            <button
              type="button"
              onClick={showNext}
              aria-label="Image suivante"
              className="absolute right-3 top-1/2 -translate-y-1/2 grid h-10 w-10 place-items-center rounded-full bg-bg/60 text-text backdrop-blur transition-colors hover:bg-bg/85"
            >
              →
            </button>
          </>
        ) : null}
      </div>

      {images.length > 1 ? (
        <ul className="mt-3 grid grid-cols-5 gap-2 sm:grid-cols-6 lg:grid-cols-7">
          {images.map((img, i) => (
            <li key={img.src}>
              <button
                type="button"
                onClick={() => setActive(i)}
                className={cn(
                  'relative block aspect-square w-full overflow-hidden bg-surface transition-opacity',
                  i === active
                    ? 'ring-1 ring-brass opacity-100'
                    : 'opacity-60 hover:opacity-100',
                )}
                aria-label={`Voir l'image ${i + 1}`}
                aria-current={i === active}
              >
                <Image
                  src={asset(img.src)}
                  alt=""
                  fill
                  sizes="120px"
                  className="object-cover"
                />
              </button>
            </li>
          ))}
        </ul>
      ) : null}

      {zoom ? (
        <div
          className="fixed inset-0 z-[100] bg-night/95 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
        >
          <button
            type="button"
            onClick={() => setZoom(false)}
            className="absolute right-5 top-5 z-10 grid h-10 w-10 place-items-center rounded-full bg-text/10 text-text transition hover:bg-text/20"
            aria-label="Fermer"
          >
            ✕
          </button>
          {images.length > 1 ? (
            <>
              <button
                type="button"
                onClick={showPrev}
                aria-label="Image précédente"
                className="absolute left-5 top-1/2 z-10 -translate-y-1/2 grid h-12 w-12 place-items-center rounded-full bg-text/10 text-text backdrop-blur transition hover:bg-text/20"
              >
                ←
              </button>
              <button
                type="button"
                onClick={showNext}
                aria-label="Image suivante"
                className="absolute right-5 top-1/2 z-10 -translate-y-1/2 grid h-12 w-12 place-items-center rounded-full bg-text/10 text-text backdrop-blur transition hover:bg-text/20"
              >
                →
              </button>
            </>
          ) : null}
          <div className="relative h-full w-full p-6 sm:p-12">
            <Image
              src={asset(current.src)}
              alt={alt}
              fill
              sizes="100vw"
              className="object-contain"
              priority
            />
          </div>
          <p className="absolute bottom-5 left-1/2 -translate-x-1/2 font-mono text-[10px] uppercase tracking-[0.32em] text-text-muted">
            {active + 1} / {images.length} · Échap pour fermer
          </p>
        </div>
      ) : null}
    </>
  )
}
