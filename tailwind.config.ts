import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Palette « atelier la nuit » — noir avec voile bleu profond, pas du bleu plein.
        bg: '#06080F',           // quasi-noir avec léger cast bleu — fond
        night: '#02030A',        // encore + sombre, moments dramatiques
        surface: '#0E1322',      // surface levée discrètement bleutée
        surfaceHi: '#161D2E',    // hover / cartes
        text: {
          DEFAULT: '#EDE3CE',    // crème ivoire — texte principal
          muted: '#7A8699',      // acier brossé
          dim: '#3D4859',        // captions en retrait
        },
        brass: '#C9A55B',        // laiton patiné refroidi
        copper: '#B8513E',       // cuivre chaud (moments drama)
        ruby: '#8B2230',         // rubis profond
      },
      fontFamily: {
        display: ['var(--font-cormorant)', 'Georgia', 'serif'],
        body: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-jetbrains)', 'Courier New', 'monospace'],
      },
      fontSize: {
        hero: 'clamp(64px, 11vw, 200px)',
        massive: 'clamp(48px, 8vw, 140px)',
        title: 'clamp(36px, 5vw, 88px)',
      },
      letterSpacing: {
        tightest: '-0.04em',
      },
    },
  },
  plugins: [],
}
export default config
