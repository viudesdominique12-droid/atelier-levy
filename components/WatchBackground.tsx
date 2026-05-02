'use client'

/**
 * Fond global animé par le scroll — la montre.
 *
 * Approche Chanel/Rolex : une seule vidéo MP4 (H.264, keyframes denses)
 * dont le `currentTime` est synchronisé sur la position de scroll. Le
 * décodage est fait au niveau matériel par la puce vidéo dédiée du GPU,
 * donc ~0 % de charge CPU même sur MacBook Air ou iPhone vieux.
 *
 *   ▸ DESKTOP : <video> en pause, on lit `currentTime = scroll * duration`
 *     à chaque frame. La vidéo est encodée avec une keyframe tous les
 *     5 frames (ffmpeg -g 5) pour que `currentTime` saute instantanément
 *     n'importe où sans devoir re-décoder depuis une keyframe lointaine.
 *
 *   ▸ MOBILE / coarse pointer : <video> autoplay loop muted playsinline.
 *     Pas de scroll-scrub sur mobile (Safari iOS gère mal les seek
 *     rapides). Boucle douce identique à la version précédente.
 */

import { useEffect, useRef, useState } from 'react'

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? ''
// Vidéo encodée avec keyframes tous les 5 frames (ffmpeg -g 5 -keyint_min 5
// -sc_threshold 0). 12 MB pour 484 frames à 1600px — vs 96 MB en JPEG.
const VIDEO_PATH_DESKTOP = `${BASE_PATH}/watch-scrub.mp4`
const VIDEO_PATH_MOBILE = `${BASE_PATH}/watch-mobile.mp4`

// Coefficient de lissage du scroll : plus c'est petit, plus le scrub est
// lent à converger (plus cinématique). 0.12 = même feeling que la version
// canvas précédente.
const EASE = 0.12

function detectMobileMode(): boolean {
  if (typeof window === 'undefined') return false
  if (window.matchMedia('(pointer: coarse)').matches) return true
  const dm = (navigator as Navigator & { deviceMemory?: number }).deviceMemory
  if (typeof dm === 'number' && dm <= 4) return true
  if (window.innerWidth < 900) return true
  return false
}

export default function WatchBackground() {
  const desktopVideoRef = useRef<HTMLVideoElement>(null)
  const mobileVideoRef = useRef<HTMLVideoElement>(null)
  const [isMobile, setIsMobile] = useState<boolean | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    setIsMobile(detectMobileMode())
  }, [])

  // === Path MOBILE : boucle douce, identique à avant ===
  useEffect(() => {
    if (isMobile !== true) return
    const v = mobileVideoRef.current
    if (!v) return
    const tryPlay = () => {
      v.play().catch(() => {
        /* iOS sans interaction utilisateur : le poster reste */
      })
    }
    v.addEventListener('canplay', tryPlay, { once: true })
    if (v.readyState >= 3) tryPlay()
    return () => v.removeEventListener('canplay', tryPlay)
  }, [isMobile])

  // === Path DESKTOP : video.currentTime synchronisé au scroll ===
  useEffect(() => {
    if (isMobile !== false) return
    const v = desktopVideoRef.current
    if (!v) return

    let rafId = 0
    let cancelled = false
    let target = 0
    let current = 0
    let lastApplied = -1

    const onMetadataReady = () => {
      // CRITIQUE : la vidéo NE DOIT PAS s'auto-jouer. On contrôle currentTime
      // manuellement à chaque frame. Sans pause(), la lecture native
      // entrerait en concurrence avec nos seek et causerait du bégaiement.
      v.pause()
      // Forcer la première frame visible
      try {
        v.currentTime = 0
      } catch {
        /* certains browsers refusent avant que la metadata soit dispo —
           le tick suivant retentera */
      }
      setReady(true)
    }

    const updateScroll = () => {
      const doc = document.documentElement
      const max = doc.scrollHeight - window.innerHeight
      const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0
      const dur = v.duration
      if (Number.isFinite(dur) && dur > 0) {
        target = p * dur
      }
    }

    const tick = () => {
      if (cancelled) return
      const delta = target - current
      if (Math.abs(delta) < 0.005) current = target
      else current += delta * EASE

      // On évite les set inutiles (Safari peut bégayer si on assigne
      // currentTime à chaque frame). Seuil de 1/60s = différence d'une
      // frame minimum.
      if (
        Number.isFinite(current) &&
        Math.abs(current - lastApplied) > 0.016
      ) {
        try {
          v.currentTime = current
          lastApplied = current
        } catch {
          /* seek pas encore prêt — on retentera */
        }
      }
      rafId = requestAnimationFrame(tick)
    }

    v.addEventListener('loadedmetadata', onMetadataReady, { once: true })
    if (v.readyState >= 1) onMetadataReady()

    window.addEventListener('scroll', updateScroll, { passive: true })
    updateScroll()
    rafId = requestAnimationFrame(tick)

    return () => {
      cancelled = true
      cancelAnimationFrame(rafId)
      v.removeEventListener('loadedmetadata', onMetadataReady)
      window.removeEventListener('scroll', updateScroll)
    }
  }, [isMobile])

  return (
    <>
      {/* Couche 1 — vidéo desktop scrubée OU vidéo mobile en boucle */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0"
      >
        {isMobile === false && (
          <video
            ref={desktopVideoRef}
            className="h-full w-full object-cover transition-opacity duration-700 ease-out"
            style={{
              opacity: ready ? 1 : 0,
              filter: 'brightness(0.55) saturate(1.05)',
            }}
            src={VIDEO_PATH_DESKTOP}
            preload="auto"
            muted
            playsInline
            disablePictureInPicture
            // Pas d'autoplay et pas de loop : on contrôle currentTime à la main
          />
        )}
        {isMobile === true && (
          <div
            className="ken-burns h-full w-full"
            style={{ filter: 'brightness(0.55) saturate(1.05)' }}
          >
            <video
              ref={mobileVideoRef}
              className="h-full w-full object-cover"
              src={VIDEO_PATH_MOBILE}
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
            />
          </div>
        )}
        {isMobile === null && (
          <div className="h-full w-full bg-night" />
        )}
      </div>

      {/* Couche 2 — scrim graduel + vignette pour la lisibilité du texte */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[1]"
        style={{
          background:
            'linear-gradient(to bottom, rgba(2,3,10,0.78) 0%, rgba(2,3,10,0.35) 32%, rgba(2,3,10,0.25) 50%, rgba(2,3,10,0.4) 68%, rgba(2,3,10,0.82) 100%)',
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[1]"
        style={{
          background:
            'radial-gradient(ellipse 120% 80% at 50% 50%, transparent 35%, rgba(2,3,10,0.5) 100%)',
        }}
      />
    </>
  )
}
