/** @type {import('next').NextConfig} */

// GitHub Pages sert le site à https://<user>.github.io/<repo>/.
// Il faut donc préfixer toutes les URL d'assets par /<repo>. En dev local
// le préfixe est vide pour que tout marche directement sur localhost:3002.
const isProd = process.env.NODE_ENV === 'production'
const repoName = 'atelier-levy'
const basePath = isProd ? `/${repoName}` : ''

const nextConfig = {
  // Export statique — GitHub Pages ne supporte pas Node.js
  output: 'export',
  // Préfixe les routes et les assets quand on build en prod
  basePath,
  assetPrefix: basePath,
  // Nécessaire pour l'export statique (pas d'optimiseur Next côté serveur)
  images: { unoptimized: true },
  // URL propres : /chapitre-1/ au lieu de /chapitre-1
  trailingSlash: true,
  // Expose le basePath au runtime côté client (utilisé par WatchBackground
  // pour construire le chemin des frames /atelier-levy/watch-frames/...).
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
}

export default nextConfig
