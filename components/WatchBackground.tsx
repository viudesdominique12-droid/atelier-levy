'use client'

/**
 * Fond global animé par le scroll — la montre.
 *
 * Deux chemins distincts pour ne JAMAIS faire planter un navigateur :
 *
 *   ▸ DESKTOP : image sequence scroll-driven (Rolex/Apple style).
 *     Décodage createImageBitmap off-thread, fenêtre glissante de 200
 *     bitmaps maximum (~1.6 GB RAM cap au pire) avec éviction LRU des
 *     frames éloignées de la position courante. C'est crucial sur les
 *     laptops 8 GB et indispensable car 484 frames non éviction = 4 GB.
 *
 *   ▸ MOBILE / coarse pointer / RAM ≤ 4 GB : <video> HTML5 en boucle,
 *     autoplay muet, playsinline. Aucun scroll-driven (jamais fluide
 *     sur mobile, et ça crash le navigateur), juste un fond qui tourne
 *     doucement à son rythme. C'est ce que Rolex et Patek font aussi.
 *
 * La détection se fait par `(pointer: coarse)` + `deviceMemory` + largeur
 * d'écran. On reste prudent : au moindre doute on tombe sur le path mobile.
 */

import { useEffect, useRef, useState } from 'react'

const TOTAL_FRAMES = 484
const EASE = 0.1
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? ''
const FRAME_PATH = (i: number) =>
  `${BASE_PATH}/watch-frames/frame_${String(i).padStart(4, '0')}.jpg`
const VIDEO_PATH = `${BASE_PATH}/watch.mp4`
const POSTER_PATH = `${BASE_PATH}/watch-frames/frame_0001.jpg`

// Combien de bitmaps on garde en RAM autour du frame courant.
// 200 × ~8 MB ≈ 1.6 GB max. Au-delà, on évince les plus éloignés.
const BITMAP_WINDOW = 200

function detectMobileMode(): boolean {
  if (typeof window === 'undefined') return false
  // 1. pointeur grossier (touch) → tablette/mobile
  if (window.matchMedia('(pointer: coarse)').matches) return true
  // 2. RAM faible (Chromium expose navigator.deviceMemory en GB)
  const dm = (navigator as Navigator & { deviceMemory?: number }).deviceMemory
  if (typeof dm === 'number' && dm <= 4) return true
  // 3. Écran étroit
  if (window.innerWidth < 900) return true
  return false
}

export default function WatchBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isMobile, setIsMobile] = useState<boolean | null>(null)
  const [firstFrameReady, setFirstFrameReady] = useState(false)

  // Détection au mount (côté client uniquement pour éviter mismatch SSR)
  useEffect(() => {
    setIsMobile(detectMobileMode())
  }, [])

  // === Path MOBILE : video element, autoplay + loop + muted + playsinline ===
  useEffect(() => {
    if (isMobile !== true) return
    const v = videoRef.current
    if (!v) return
    // Forcer la lecture après chargement (certains Safari bloquent autoplay
    // si on ne le redéclenche pas via JS après que le DOM est settled)
    const tryPlay = () => {
      v.play().catch(() => {
        /* l'utilisateur devra tap pour démarrer — on échoue silencieusement */
      })
    }
    v.addEventListener('canplay', tryPlay, { once: true })
    if (v.readyState >= 3) tryPlay()
    return () => v.removeEventListener('canplay', tryPlay)
  }, [isMobile])

  // === Path DESKTOP : image sequence scroll-driven avec fenêtre glissante ===
  useEffect(() => {
    if (isMobile !== false) return
    const canvas = canvasRef.current
    const wrap = wrapRef.current
    if (!canvas || !wrap) return
    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return

    const bitmaps = new Array<ImageBitmap | undefined>(TOTAL_FRAMES)
    let targetFrame = 0
    let currentFrame = 0
    let lastDrawn = -1
    let rafId = 0
    let cancelled = false

    function resize() {
      if (!canvas || !wrap) return
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
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

    function draw(idx: number) {
      const bm = bitmaps[idx]
      if (!bm) return
      const cw = canvas!.clientWidth
      const ch = canvas!.clientHeight
      const iw = bm.width
      const ih = bm.height
      const scale = Math.max(cw / iw, ch / ih)
      const dw = iw * scale
      const dh = ih * scale
      const dx = (cw - dw) / 2
      const dy = (ch - dh) / 2
      ctx!.clearRect(0, 0, cw, ch)
      ctx!.drawImage(bm, dx, dy, dw, dh)
    }

    function nearestLoaded(idx: number): number {
      for (let r = 0; r < TOTAL_FRAMES; r++) {
        if (bitmaps[idx - r]) return idx - r
        if (bitmaps[idx + r]) return idx + r
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
        if (bitmaps[idx]) {
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

    // === Fenêtre glissante : évince les bitmaps trop loin du curseur ===
    function evictDistant() {
      // On garde [center - WINDOW/2, center + WINDOW/2], le reste on close()
      const center = Math.round(currentFrame)
      const half = BITMAP_WINDOW / 2
      const lo = Math.max(0, center - half)
      const hi = Math.min(TOTAL_FRAMES - 1, center + half)
      for (let i = 0; i < TOTAL_FRAMES; i++) {
        if (i < lo || i > hi) {
          const bm = bitmaps[i]
          if (bm) {
            bm.close()
            bitmaps[i] = undefined
          }
        }
      }
    }
    const evictTimer = window.setInterval(evictDistant, 1500)

    function buildOrder() {
      const order: number[] = [0]
      const seen = new Set<number>([0])
      for (let i = 15; i < TOTAL_FRAMES; i += 15) {
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
    const MAX_PARALLEL = 8

    async function fetchAndDecode(idx: number) {
      // Si on a déjà cette frame en cache (suite à éviction puis re-besoin),
      // on ne la redemande pas
      if (bitmaps[idx]) return
      try {
        const res = await fetch(FRAME_PATH(idx + 1))
        const blob = await res.blob()
        const bm = await createImageBitmap(blob)
        if (cancelled) {
          bm.close()
          return
        }
        // Si on a évincé entre-temps, vérifier qu'on est toujours dans la
        // fenêtre — sinon on jette tout de suite pour ne pas re-remplir
        const center = Math.round(currentFrame)
        if (Math.abs(idx - center) > BITMAP_WINDOW / 2 + 50) {
          bm.close()
          return
        }
        bitmaps[idx] = bm
      } catch {
        /* frame manquante comblée par nearestLoaded */
      }
    }

    function pump() {
      while (inFlight < MAX_PARALLEL && cursor < order.length) {
        const idx = order[cursor++]
        inFlight++
        fetchAndDecode(idx).finally(() => {
          if (cancelled) return
          inFlight--
          if (idx === 0 && lastDrawn === -1) {
            draw(0)
            lastDrawn = 0
            setFirstFrameReady(true)
          }
          pump()
        })
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
      window.clearInterval(evictTimer)
      window.removeEventListener('resize', resize)
      window.removeEventListener('scroll', updateScroll)
      bitmaps.forEach((bm) => bm?.close())
    }
  }, [isMobile])

  // === Rendu ===
  // Tant qu'on n'a pas détecté, on rend l'image fixe poster pour ne pas
  // afficher de canvas vide ni démarrer la mauvaise version.
  return (
    <>
      {/* Couche 1 — la vidéo (mobile) ou le canvas (desktop) */}
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
          <video
            ref={videoRef}
            className="h-full w-full object-cover"
            style={{ filter: 'brightness(0.55) saturate(1.05)' }}
            src={VIDEO_PATH}
            poster={POSTER_PATH}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
          />
        )}
        {isMobile === null && (
          // Pendant la détection (1 frame), on affiche le poster pour éviter
          // un flash noir sur le first paint
          <div
            className="h-full w-full bg-cover bg-center"
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
