'use client'

/**
 * Fond global animé par le scroll — la montre.
 *
 * Inspiration : Rolex / Apple. Canvas en position: fixed couvre tout le
 * viewport, derrière le texte. Le scrub se fait sur une image sequence
 * (484 frames JPEG q=2 quasi-lossless, 1928×1072) plutôt qu'une balise
 * <video> — frame-perfect, pas de stutter de keyframe.
 *
 * Optimisations critiques pour la fluidité « Rolex » :
 *   1. Décodage via createImageBitmap → off main-thread, pas de blocage UI
 *      pendant la décompression JPEG (essentiel à 200KB+/frame).
 *   2. Bitmaps stockés en mémoire — drawImage devient quasi-instantané.
 *   3. Lerp easing par-dessus Lenis (double couche de douceur).
 *   4. cover-fit plein écran (source 16:9, viewport rempli edge-to-edge).
 *   5. Préchargement squelette (1/15) puis comblement, 10 fetches parallèles.
 *   6. Aucun loader bloquant : la page est scrollable dès le premier ms,
 *      le canvas fade-in sur sa première frame quand elle est prête.
 *   7. imageSmoothingQuality 'high' pour interpolation propre.
 */

import { useEffect, useRef, useState } from 'react'

const TOTAL_FRAMES = 484
const EASE = 0.1
// basePath GitHub Pages : /atelier-levy en prod, vide en dev. Indispensable
// sinon les frames retournent du HTML 404 au lieu du JPEG attendu.
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? ''
const FRAME_PATH = (i: number) =>
  `${BASE_PATH}/watch-frames/frame_${String(i).padStart(4, '0')}.jpg`

export default function WatchBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)
  const [firstFrameReady, setFirstFrameReady] = useState(false)

  useEffect(() => {
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
      // cover-fit : remplit le viewport edge-to-edge
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
    const MAX_PARALLEL = 10

    async function fetchAndDecode(idx: number) {
      try {
        const res = await fetch(FRAME_PATH(idx + 1))
        const blob = await res.blob()
        const bm = await createImageBitmap(blob)
        if (cancelled) {
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
      window.removeEventListener('resize', resize)
      window.removeEventListener('scroll', updateScroll)
      bitmaps.forEach((bm) => bm?.close())
    }
  }, [])

  return (
    <>
      {/* Couche 1 : la vidéo, assombrie pour devenir atmosphérique */}
      <div
        ref={wrapRef}
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0"
      >
        <canvas
          ref={canvasRef}
          className="h-full w-full transition-opacity duration-700 ease-out"
          style={{
            opacity: firstFrameReady ? 1 : 0,
            // Assombrit la montre pour qu'elle reste un décor, pas un sujet
            // qui mange le texte. Saturation préservée pour garder la chaleur.
            filter: 'brightness(0.55) saturate(1.05)',
          }}
        />
      </div>

      {/* Couche 2 : scrim graduel — plus dense en haut/bas (zones de texte),
          transparent au milieu vertical (zone d'éclat de la montre).
          + un voile latéral plus discret pour cadrer la composition. */}
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
