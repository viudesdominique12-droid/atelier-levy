'use client'

import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'

import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import ChapterIndex from '@/components/ui/ChapterIndex'
import WatchBackground from '@/components/WatchBackground'

// Note : les fichiers ont gardé leur nom d'origine, mais l'ordre narratif a changé.
//   ActOne_Instant.tsx           → Acte I — Le silence
//   ActThree_Matiere.tsx         → Acte II — Le démontage
//   ActTwo_Geste.tsx             → Acte III — Le geste
//   ActFour_Citation.tsx         → Acte IV — Le retour à la vie
//   ActFive_Mandelieu.tsx        → Acte V — Le territoire
//   ActSix_Invitation.tsx        → Acte VI — L'invitation
import ActOneSilence from '@/components/acts/ActOne_Instant'
import ActTwoDemontage from '@/components/acts/ActThree_Matiere'
import ActThreeGeste from '@/components/acts/ActTwo_Geste'
import ActServices from '@/components/acts/ActServices'
import ActFourRetour from '@/components/acts/ActFour_Citation'
import ActFiveTerritoire from '@/components/acts/ActFive_Mandelieu'
import ActSixInvitation from '@/components/acts/ActSix_Invitation'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export default function Home() {
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let lenis: Lenis | null = null
    let tickerHandler: ((time: number) => void) | null = null

    if (!reduced) {
      lenis = new Lenis({
        // Calibrage trackpad-friendly : durée courte + lerp léger pour ne pas
        // empiler trop d'inertie sur celle native du trackpad. La molette de
        // souris reste fluide grâce au wheelMultiplier conservateur.
        duration: 0.9,
        lerp: 0.12,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        wheelMultiplier: 1,
        touchMultiplier: 1.4,
        syncTouch: true,
      })
      lenis.on('scroll', ScrollTrigger.update)
      tickerHandler = (time: number) => lenis!.raf(time * 1000)
      gsap.ticker.add(tickerHandler)
      gsap.ticker.lagSmoothing(0)
    }

    const refreshTimer = window.setTimeout(() => ScrollTrigger.refresh(), 250)

    return () => {
      window.clearTimeout(refreshTimer)
      if (tickerHandler) gsap.ticker.remove(tickerHandler)
      lenis?.destroy()
      ScrollTrigger.getAll().forEach((t) => t.kill())
    }
  }, [])

  return (
    <>
      <WatchBackground />
      <Navigation />
      <ChapterIndex />

      <main className="relative z-[2]">
        <ActOneSilence />
        <ActTwoDemontage />
        <ActThreeGeste />
        <ActServices />
        <ActFourRetour />
        <ActFiveTerritoire />
        <ActSixInvitation />
      </main>

      <Footer />
    </>
  )
}
