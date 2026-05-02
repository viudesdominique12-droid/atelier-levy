'use client'

/**
 * Fond global animé par le scroll — la montre.
 *
 * Deux chemins pour ne JAMAIS faire planter ni figer un navigateur :
 *
 *   ▸ DESKTOP : image sequence scroll-driven via HTMLImageElement.
 *     C'est l'approche utilisée par Apple, Rolex, Patek. Les JPEG restent
 *     compressés en RAM (~58 MB total pour 484 frames vs 4 GB décodés
 *     avec createImageBitmap). Le navigateur gère automatiquement le
 *     cache décodé : il garde les frames récemment dessinées prêtes,
 *     évince les anciennes sous pression mémoire, redécompresse à la
 *     volée. Zéro gestion mémoire manuelle = zéro bug d'éviction.
 *
 *   ▸ MOBILE / coarse pointer / RAM ≤ 4 GB : <video> HTML5 en boucle,
 *     autoplay muet, playsinline. Le décodeur natif iOS/Android consomme
 *     une seule frame à la fois. Pas de scroll-scrub (jamais fluide sur
 *     mobile), juste une boucle douce en fond. Comportement Rolex/Patek.
 */

import { useEffect, useRef, useState } from 'react'

// Bundle "Conservateur Apple-like" : 150 frames AVIF qualité 70, max 1600px.
// Total ~6,8 MB au lieu de 96 MB en JPEG. À perception visuelle équivalente
// sur tous les écrans (même Pro Retina 16"). 14× plus léger que la version
// précédente — premier paint quasi instantané, scroll fluide partout.
const TOTAL_FRAMES = 150
// Nombre de frames préchargées en priorité haute. Couvre le premier ~15%
// du scroll, donc la séquence est utilisable dès la fin de leur fetch.
const HIGH_PRIORITY_FRAMES = 20
const EASE = 0.1
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? ''
const FRAME_PATH = (i: number) =>
  `${BASE_PATH}/watch-frames-avif/frame_${String(i).padStart(4, '0')}.avif`
const VIDEO_PATH_MOBILE = `${BASE_PATH}/watch-mobile.mp4`
const POSTER_PATH = `${BASE_PATH}/watch-frames-avif/frame_0001.avif`

function detectMobileMode(): boolean {
  if (typeof window === 'undefined') return false
  if (window.matchMedia('(pointer: coarse)').matches) return true
  const dm = (navigator as Navigator & { deviceMemory?: number }).deviceMemory
  if (typeof dm === 'number' && dm <= 4) return true
  if (window.innerWidth < 900) return true
  return false
}

export default function WatchBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isMobile, setIsMobile] = useState<boolean | null>(null)
  const [firstFrameReady, setFirstFrameReady] = useState(false)

  useEffect(() => {
    setIsMobile(detectMobileMode())
  }, [])

  // === Path MOBILE : <video> autoplay loop muted playsinline ===
  useEffect(() => {
    if (isMobile !== true) return
    const v = videoRef.current
    if (!v) return
    const tryPlay = () => {
      v.play().catch(() => {
        /* iOS sans interaction utilisateur : pas grave, le poster reste */
      })
    }
    v.addEventListener('canplay', tryPlay, { once: true })
    if (v.readyState >= 3) tryPlay()
    return () => v.removeEventListener('canplay', tryPlay)
  }, [isMobile])

  // === Path DESKTOP : HTMLImageElement, gestion mémoire navigateur ===
  useEffect(() => {
    if (isMobile !== false) return
    const canvas = canvasRef.current
    const wrap = wrapRef.current
    if (!canvas || !wrap) return
    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return

    const images: HTMLImageElement[] = new Array(TOTAL_FRAMES)
    let targetFrame = 0
    let currentFrame = 0
    let lastDrawn = -1
    let rafId = 0
    let cancelled = false

    function resize() {
      if (!canvas || !wrap) return
      // DPR plafonné à 1.5 — sur un fond animé continu (pas de bords nets
      // type texte), l'œil ne distingue pas la différence avec DPR 2 ou 3,
      // mais le GPU travaille 2 à 4× moins. Apple plafonne pareil sur ses
      // séquences scroll-driven.
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
      const w = wrap.clientWidth
      const h = wrap.clientHeight
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      canvas.style.width = w + 'px'
      canvas.style.height = h + 'px'
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx!.imageSmoothingEnabled = true
      ctx!.imageSmoothingQuality = 'high'
      lastDrawn = -1
    }

    function isReady(img: HTMLImageElement | undefined): img is HTMLImageElement {
      return !!img && img.complete && img.naturalWidth > 0
    }

    function draw(idx: number) {
      const img = images[idx]
      if (!isReady(img)) return
      const cw = canvas!.clientWidth
      const ch = canvas!.clientHeight
      const iw = img.naturalWidth
      const ih = img.naturalHeight
      const scale = Math.max(cw / iw, ch / ih)
      const dw = iw * scale
      const dh = ih * scale
      const dx = (cw - dw) / 2
      const dy = (ch - dh) / 2
      ctx!.clearRect(0, 0, cw, ch)
      ctx!.drawImage(img, dx, dy, dw, dh)
    }

    function nearestLoaded(idx: number): number {
      for (let r = 0; r < TOTAL_FRAMES; r++) {
        if (isReady(images[idx - r])) return idx - r
        if (isReady(images[idx + r])) return idx + r
      }
      return -1
    }

    function updateScroll() {
      const doc = document.documentElement
      const max = doc.scrollHeight - window.innerHeight
      const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0
      targetFrame = p * (TOTAL_FRAMES - 1)
    }

    function tick() {
      const delta = targetFrame - currentFrame
      if (Math.abs(delta) < 0.005) currentFrame = targetFrame
      else currentFrame += delta * EASE

      const idx = Math.round(currentFrame)
      if (idx !== lastDrawn) {
        if (isReady(images[idx])) {
          draw(idx)
          lastDrawn = idx
        } else {
          const f = nearestLoaded(idx)
          if (f !== -1 && f !== lastDrawn) {
            draw(f)
            lastDrawn = f
          }
        }
      }
      rafId = requestAnimationFrame(tick)
    }

    // === Hint navigateur : preload haute priorité des N premières frames ===
    // Injecte <link rel="preload" fetchpriority="high"> pour que le browser
    // les fetche en parallèle avec le bundle JS, au lieu d'attendre que
    // pump() en demande l'image. Gain : la séquence est utilisable ~1s
    // après le premier paint, au lieu de 3-4s.
    const preloadLinks: HTMLLinkElement[] = []
    for (let i = 0; i < HIGH_PRIORITY_FRAMES && i < TOTAL_FRAMES; i++) {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.as = 'image'
      link.href = FRAME_PATH(i + 1)
      // Pas tous les browsers respectent fetchpriority mais ceux qui le
      // font (Chrome, Edge, Safari 17+) traitent ces 20 fetches en HIGH.
      ;(link as HTMLLinkElement & { fetchPriority?: string }).fetchPriority = 'high'
      document.head.appendChild(link)
      preloadLinks.push(link)
    }

    // === Préchargement progressif : frame 0 → squelette 1/10 → reste ===
    // 150 frames → 15 frames squelette (espacées de ~10) avant le fill.
    function buildOrder() {
      const order: number[] = [0]
      const seen = new Set<number>([0])
      for (let i = 10; i < TOTAL_FRAMES; i += 10) {
        if (!seen.has(i)) {
          order.push(i)
          seen.add(i)
        }
      }
      for (let i = 0; i < TOTAL_FRAMES; i++) {
        if (!seen.has(i)) {
          order.push(i)
          seen.add(i)
        }
      }
      return order
    }

    const order = buildOrder()
    let inFlight = 0
    let cursor = 0
    // Avec moins de frames et 14× moins de poids, on peut paralléliser plus.
    const MAX_PARALLEL = 8

    function pump() {
      while (inFlight < MAX_PARALLEL && cursor < order.length) {
        if (cancelled) return
        const idx = order[cursor++]
        inFlight++
        const img = new Image()
        img.decoding = 'async'
        // IMPORTANT : on assigne d'abord dans le tableau, puis on déclenche
        // le load. Avec les <link rel="preload"> ajoutés en amont, l'AVIF
        // est déjà en cache navigateur. Si on faisait `img.src = ...` avant
        // `images[idx] = img`, certains browsers (Chromium notamment)
        // déclenchent `onload` SYNCHRONEMENT sur cache hit — et draw(0)
        // accéderait alors à un slot encore undefined.
        images[idx] = img
        img.onload = img.onerror = () => {
          inFlight--
          if (cancelled) return
          if (idx === 0 && lastDrawn === -1) {
            draw(0)
            lastDrawn = 0
            setFirstFrameReady(true)
          }
          pump()
        }
        img.src = FRAME_PATH(idx + 1)
      }
    }

    resize()
    window.addEventListener('resize', resize)
    window.addEventListener('scroll', updateScroll, { passive: true })
    updateScroll()
    pump()
    rafId = requestAnimationFrame(tick)

    return () => {
      cancelled = true
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', resize)
      window.removeEventListener('scroll', updateScroll)
      // Détacher les sources pour aider le GC à libérer les buffers
      images.forEach((img) => {
        if (img) img.src = ''
      })
      // Retirer les <link rel="preload"> injectés (utile en HMR + SPA)
      preloadLinks.forEach((link) => {
        if (link.parentNode) link.parentNode.removeChild(link)
      })
    }
  }, [isMobile])

  return (
    <>
      {/* Couche 1 — vidéo (mobile) ou canvas (desktop) ou poster (détection) */}
      <div
        ref={wrapRef}
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0"
      >
        {isMobile === false && (
          <canvas
            ref={canvasRef}
            className="h-full w-full transition-opacity duration-700 ease-out"
            style={{
              opacity: firstFrameReady ? 1 : 0,
              filter: 'brightness(0.55) saturate(1.05)',
            }}
          />
        )}
        {isMobile === true && (
          // Wrapper Ken Burns : zoom + pan continu en CSS. Garantit qu'il
          // y a TOUJOURS du mouvement, même avant que la vidéo ne démarre
          // (sur 4G, 1-2s de buffering) et même si Safari bloque autoplay.
          <div
            className="ken-burns h-full w-full"
            style={{ filter: 'brightness(0.55) saturate(1.05)' }}
          >
            <video
              ref={videoRef}
              className="h-full w-full object-cover"
              src={VIDEO_PATH_MOBILE}
              poster={POSTER_PATH}
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
            />
          </div>
        )}
        {isMobile === null && (
          <div
            className="ken-burns h-full w-full bg-cover bg-center"
            style={{
              backgroundImage: `url('${POSTER_PATH}')`,
              filter: 'brightness(0.55) saturate(1.05)',
            }}
          />
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
