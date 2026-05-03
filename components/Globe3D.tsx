'use client'

/**
 * Globe terrestre 3D wireframe — façon "carnet d'expert".
 *
 * - Sphère sombre + maillage longitude/latitude en hairline brass
 * - Pinpoints lumineux sur les villes du réseau (pulse continu)
 * - Auto-rotation lente
 * - Drag pour faire tourner manuellement
 * - Pause du render quand la section est hors viewport (IntersectionObserver)
 * - Fallback statique sur appareils faibles (deviceMemory ≤ 4 GB)
 *
 * THREE.js plein, sans react-three-fiber, pour rester léger en bundle.
 * Dynamiquement importé par /sourcing pour ne pas alourdir le main bundle.
 */

import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'

type City = {
  name: string
  type: string
  lat: number
  lng: number
}

const CITIES: City[] = [
  { name: 'Paris', type: 'Maison horlogère', lat: 48.8566, lng: 2.3522 },
  { name: 'Genève', type: 'Maison horlogère', lat: 46.2044, lng: 6.1432 },
  { name: 'Zurich', type: 'Vente privée', lat: 47.3769, lng: 8.5417 },
  { name: 'Londres', type: 'Maison horlogère', lat: 51.5074, lng: -0.1278 },
  { name: 'Milan', type: 'Vente privée', lat: 45.4642, lng: 9.19 },
  { name: 'Monaco', type: 'Collection privée', lat: 43.7384, lng: 7.4246 },
  { name: 'New York', type: 'Maison horlogère', lat: 40.7128, lng: -74.006 },
  { name: 'Hong Kong', type: 'Vente privée', lat: 22.3193, lng: 114.1694 },
  { name: 'Singapour', type: 'Maison horlogère', lat: 1.3521, lng: 103.8198 },
  { name: 'Tokyo', type: 'Vente privée', lat: 35.6762, lng: 139.6503 },
  { name: 'Dubaï', type: 'Maison horlogère', lat: 25.2048, lng: 55.2708 },
]

// Convertit lat/lng en position sur une sphère de rayon r
function latLngToVec3(lat: number, lng: number, r: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180)
  const theta = (lng + 180) * (Math.PI / 180)
  return new THREE.Vector3(
    -r * Math.sin(phi) * Math.cos(theta),
    r * Math.cos(phi),
    r * Math.sin(phi) * Math.sin(theta),
  )
}

const BRASS = 0xc9a55b
const NIGHT = 0x06080f

export default function Globe3D() {
  const wrapRef = useRef<HTMLDivElement>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)
  const [hoveredCity, setHoveredCity] = useState<City | null>(null)

  useEffect(() => {
    const wrap = wrapRef.current
    if (!wrap) return

    // === Détection appareil faible : fallback texte ===
    const dm = (navigator as Navigator & { deviceMemory?: number }).deviceMemory
    if (typeof dm === 'number' && dm <= 2) {
      // On laisse le fallback HTML statique s'afficher
      return
    }

    // === Setup scene ===
    const scene = new THREE.Scene()

    const camera = new THREE.PerspectiveCamera(
      45,
      wrap.clientWidth / wrap.clientHeight,
      0.1,
      1000,
    )
    camera.position.z = 5.5

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'low-power',
    })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
    renderer.setSize(wrap.clientWidth, wrap.clientHeight)
    renderer.setClearColor(NIGHT, 0)
    wrap.appendChild(renderer.domElement)

    // === Sphère pleine, sombre, presque invisible — sert de masque ===
    const sphereGeom = new THREE.SphereGeometry(2, 64, 64)
    const sphereMat = new THREE.MeshBasicMaterial({
      color: NIGHT,
      transparent: true,
      opacity: 0.92,
    })
    const sphere = new THREE.Mesh(sphereGeom, sphereMat)
    scene.add(sphere)

    // === Wireframe brass : maillage longitude/latitude ===
    const wireGeom = new THREE.SphereGeometry(2.001, 32, 16)
    const wireMat = new THREE.LineBasicMaterial({
      color: BRASS,
      transparent: true,
      opacity: 0.18,
    })
    const wireframe = new THREE.LineSegments(
      new THREE.WireframeGeometry(wireGeom),
      wireMat,
    )
    scene.add(wireframe)

    // === Atmosphère brass diffuse autour ===
    const haloGeom = new THREE.SphereGeometry(2.15, 32, 32)
    const haloMat = new THREE.MeshBasicMaterial({
      color: BRASS,
      transparent: true,
      opacity: 0.04,
      side: THREE.BackSide,
    })
    const halo = new THREE.Mesh(haloGeom, haloMat)
    scene.add(halo)

    // === Pinpoints des villes ===
    const cityGroup = new THREE.Group()
    const cityMeshes: { mesh: THREE.Mesh; city: City; baseScale: number }[] = []

    CITIES.forEach((city) => {
      const pos = latLngToVec3(city.lat, city.lng, 2.02)

      // Petit dôme brass
      const dotGeom = new THREE.SphereGeometry(0.03, 16, 16)
      const dotMat = new THREE.MeshBasicMaterial({ color: BRASS })
      const dot = new THREE.Mesh(dotGeom, dotMat)
      dot.position.copy(pos)
      dot.userData = { city }
      cityGroup.add(dot)
      cityMeshes.push({ mesh: dot, city, baseScale: 1 })

      // Halo lumineux qui pulse autour du point
      const ringGeom = new THREE.RingGeometry(0.04, 0.08, 24)
      const ringMat = new THREE.MeshBasicMaterial({
        color: BRASS,
        transparent: true,
        opacity: 0.6,
        side: THREE.DoubleSide,
      })
      const ring = new THREE.Mesh(ringGeom, ringMat)
      ring.position.copy(pos)
      ring.lookAt(0, 0, 0)
      ring.rotateY(Math.PI)
      cityGroup.add(ring)
      cityMeshes.push({ mesh: ring, city, baseScale: 1 })
    })

    scene.add(cityGroup)

    // Le wireframe et les villes tournent solidaires
    const earthGroup = new THREE.Group()
    earthGroup.add(sphere)
    earthGroup.add(wireframe)
    earthGroup.add(halo)
    earthGroup.add(cityGroup)
    scene.remove(sphere, wireframe, halo, cityGroup)
    scene.add(earthGroup)

    // Inclinaison axiale style Terre
    earthGroup.rotation.x = 0.35

    // === Interaction : drag pour faire tourner ===
    let isDragging = false
    let prevMouse = { x: 0, y: 0 }
    const dragMomentum = { x: 0, y: 0 }

    const onPointerDown = (e: PointerEvent) => {
      isDragging = true
      prevMouse = { x: e.clientX, y: e.clientY }
      ;(e.target as HTMLElement).setPointerCapture?.(e.pointerId)
    }
    const onPointerMove = (e: PointerEvent) => {
      // Hover detection : raycaster sur les pinpoints
      const rect = renderer.domElement.getBoundingClientRect()
      const mouse = new THREE.Vector2(
        ((e.clientX - rect.left) / rect.width) * 2 - 1,
        -((e.clientY - rect.top) / rect.height) * 2 + 1,
      )
      const raycaster = new THREE.Raycaster()
      raycaster.setFromCamera(mouse, camera)
      const intersects = raycaster.intersectObjects(
        cityMeshes.map((c) => c.mesh),
      )
      const hit = intersects[0]?.object?.userData?.city as City | undefined
      if (hit) {
        if (tooltipRef.current) {
          tooltipRef.current.style.left = `${e.clientX - rect.left}px`
          tooltipRef.current.style.top = `${e.clientY - rect.top}px`
        }
        setHoveredCity((curr) => (curr?.name === hit.name ? curr : hit))
      } else {
        setHoveredCity(null)
      }

      if (!isDragging) return
      const dx = e.clientX - prevMouse.x
      const dy = e.clientY - prevMouse.y
      dragMomentum.x = dx * 0.005
      dragMomentum.y = dy * 0.005
      earthGroup.rotation.y += dragMomentum.x
      earthGroup.rotation.x += dragMomentum.y
      // Limite de tangage pour rester sur Terre
      earthGroup.rotation.x = Math.max(-0.6, Math.min(0.9, earthGroup.rotation.x))
      prevMouse = { x: e.clientX, y: e.clientY }
    }
    const onPointerUp = () => {
      isDragging = false
    }

    renderer.domElement.addEventListener('pointerdown', onPointerDown)
    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', onPointerUp)

    // === Render loop avec pause quand hors viewport ===
    let rafId = 0
    let inView = true
    let cancelled = false
    const startTime = performance.now()

    const tick = (now: number) => {
      if (cancelled) return
      if (inView) {
        // Auto-rotation lente quand pas en drag
        if (!isDragging) {
          earthGroup.rotation.y += 0.0012
          // Décay de la vélocité de drag
          dragMomentum.x *= 0.95
          dragMomentum.y *= 0.95
        }
        // Pulse des halos villes
        const t = (now - startTime) / 1000
        cityMeshes.forEach(({ mesh, baseScale }, i) => {
          if ((mesh as THREE.Mesh).geometry instanceof THREE.RingGeometry) {
            const phase = t * 1.4 + i * 0.3
            const pulse = 1 + Math.sin(phase) * 0.4
            mesh.scale.setScalar(baseScale * pulse)
            const mat = (mesh as THREE.Mesh).material as THREE.MeshBasicMaterial
            mat.opacity = 0.45 + (Math.cos(phase) + 1) * 0.18
          }
        })
        renderer.render(scene, camera)
      }
      rafId = requestAnimationFrame(tick)
    }
    rafId = requestAnimationFrame(tick)

    // === IntersectionObserver pour pause off-screen ===
    const obs = new IntersectionObserver(
      (entries) => {
        inView = entries.some((e) => e.isIntersecting)
      },
      { threshold: 0.1 },
    )
    obs.observe(wrap)

    // === Resize ===
    const onResize = () => {
      const w = wrap.clientWidth
      const h = wrap.clientHeight
      renderer.setSize(w, h)
      camera.aspect = w / h
      camera.updateProjectionMatrix()
    }
    window.addEventListener('resize', onResize)

    return () => {
      cancelled = true
      cancelAnimationFrame(rafId)
      obs.disconnect()
      window.removeEventListener('resize', onResize)
      renderer.domElement.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', onPointerUp)
      // Cleanup THREE
      sphereGeom.dispose()
      sphereMat.dispose()
      wireGeom.dispose()
      wireMat.dispose()
      haloGeom.dispose()
      haloMat.dispose()
      cityMeshes.forEach(({ mesh }) => {
        mesh.geometry.dispose()
        ;(mesh.material as THREE.Material).dispose()
      })
      renderer.dispose()
      if (renderer.domElement.parentNode === wrap) {
        wrap.removeChild(renderer.domElement)
      }
    }
  }, [])

  return (
    <div className="relative w-full">
      <div
        ref={wrapRef}
        className="relative aspect-square w-full max-w-[640px] mx-auto cursor-grab active:cursor-grabbing"
        style={{ touchAction: 'pan-y' }}
        aria-label="Globe interactif du réseau Parker & Smith"
      >
        {/* Fallback statique pour les appareils sans WebGL ou faibles */}
        <noscript>
          <div className="absolute inset-0 grid place-items-center text-text-muted">
            Réseau international — activez JavaScript pour voir le globe interactif.
          </div>
        </noscript>
      </div>

      {/* Tooltip ville */}
      <div
        ref={tooltipRef}
        className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-sm border border-brass/30 bg-night/90 px-3 py-2 backdrop-blur-md transition-opacity duration-200"
        style={{
          opacity: hoveredCity ? 1 : 0,
          transform: 'translate(-50%, calc(-100% - 12px))',
        }}
      >
        {hoveredCity && (
          <>
            <p className="font-mono text-[9px] uppercase tracking-[0.32em] text-brass">
              {hoveredCity.type}
            </p>
            <p className="mt-1 font-display text-base text-text">
              {hoveredCity.name}
            </p>
          </>
        )}
      </div>
    </div>
  )
}
