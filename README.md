# Atelier d'horlogerie R. Levy — Site vitrine premium

Site Next.js 14 avec React Three Fiber, palette territoriale Côte d'Azur, deux scènes 3D (calibre mécanique + baie de Cannes) et formulaire contact via Resend.

## Stack technique

- **Next.js 14** App Router (TypeScript strict)
- **Tailwind CSS** — design tokens custom Côte d'Azur
- **React Three Fiber** + drei + postprocessing — scènes 3D
- **GSAP** + ScrollTrigger + Lenis — animations scroll-driven
- **Resend** — formulaire contact (envoi email)

## Installation locale

```bash
npm install
cp .env.example .env.local   # remplir RESEND_API_KEY si test du formulaire
npm run dev
```

Ouvrir http://localhost:3000

## Build de production local

```bash
npm run build
npm run start
```

## Déploiement (à faire manuellement — Claude Code ne déploie rien)

### 1. Créer un repo GitHub

Depuis le dossier `parker/` :

```bash
git init
git add .
git commit -m "Initial commit — Site Atelier R. Levy"
git branch -M main
git remote add origin https://github.com/[USERNAME]/parker.git
git push -u origin main
```

### 2. Déployer sur Vercel

1. Aller sur [vercel.com](https://vercel.com) → **New Project**
2. Importer le repo GitHub `parker`
3. Framework Preset : **Next.js** (auto-détecté)
4. Build Command : `next build` (par défaut)
5. **Variables d'environnement** à ajouter :
   - `RESEND_API_KEY` — clé API Resend
   - `RESEND_RECIPIENT_EMAIL` — ex. `contact@atelier-levy.fr`
   - `NEXT_PUBLIC_SITE_URL` — ex. `https://atelier-levy.fr`
6. **Deploy**

### 3. Configurer Resend (formulaire contact)

1. Créer un compte sur [resend.com](https://resend.com) (gratuit jusqu'à 100 emails/jour)
2. Dashboard → **API Keys** → Create API Key → coller dans Vercel
3. **Vérifier le domaine** :
   - Resend → Domains → Add Domain → `atelier-levy.fr`
   - Ajouter les records DNS (DKIM, SPF, DMARC) chez le registrar
   - Attendre validation (24-48h)
4. Remplacer le sender dans [`app/api/contact/route.ts`](app/api/contact/route.ts) :
   `onboarding@resend.dev` → `contact@atelier-levy.fr`
5. Tester l'envoi depuis `/contact` après déploiement

### 4. Nom de domaine custom

1. Vercel → Project Settings → **Domains** → Add Domain → `atelier-levy.fr`
2. Vercel donne les DNS records à créer :
   - Type **A** : `76.76.21.21`
   - ou **CNAME** : `cname.vercel-dns.com`
3. Chez le registrar (OVH, Gandi, etc.) → DNS Zone → ajouter les records
4. Attendre la propagation DNS (2-48h). SSL automatique via Let's Encrypt.

### 5. Vérifications post-déploiement

- [ ] [Google Rich Results Test](https://search.google.com/test/rich-results) — coller l'URL home, vérifier que `LocalBusiness` + `aggregateRating` 4.8/102 sont détectés
- [ ] [Lighthouse mobile](https://pagespeed.web.dev/) — cibles : Performance ≥ 85, Accessibility ≥ 98, Best Practices ≥ 95, SEO ≥ 98
- [ ] Soumettre `https://atelier-levy.fr/sitemap.xml` dans **Google Search Console**
- [ ] Ajouter l'URL du site dans la fiche **Google My Business**

## TODO CLIENT — à remplir avant mise en ligne

### Données manquantes critiques

- [ ] **SIRET, raison sociale, directeur de publication** → [`app/mentions-legales/page.tsx`](app/mentions-legales/page.tsx)
- [ ] **Adresse exacte** atelier (rue + code postal) → mentions légales + page contact + iframe Maps
- [ ] **Téléphone** cliquable — remplacer `tel:+33XXXXXXXXX` dans [`app/contact/page.tsx`](app/contact/page.tsx), [`components/Footer.tsx`](components/Footer.tsx) et [`app/mentions-legales/page.tsx`](app/mentions-legales/page.tsx)
- [ ] **Horaires d'ouverture réels** — le `TimestampLive` affiche actuellement les horaires fictifs **9h-12h30 / 14h-18h30** pour la démo. Modifier la logique dans [`components/ui/TimestampLive.tsx`](components/ui/TimestampLive.tsx). Ne **pas** ajouter d'`openingHoursSpecification` dans le Schema.org tant que les horaires ne sont pas validés.
- [ ] **Email destinataire** formulaire — configurer `RESEND_RECIPIENT_EMAIL` dans Vercel

### Assets à fournir

- [ ] **Modèle 3D calibre** (`.glb` Draco compressé < 3 MB) → `public/models/caliber.glb`. La scène hero utilise actuellement de la **géométrie procédurale** (platine + ponts + balancier oscillant) en attendant — voir [`components/sections/HeroCaliberScene.tsx`](components/sections/HeroCaliberScene.tsx). Source recommandée : Sketchfab CC0 (vérifier la licence).
- [ ] **Heightmap baie de Cannes** (PNG 16-bit 512×512, < 500 KB) → `public/heightmaps/baie-de-cannes.png`. Le terrain Estérel est actuellement **généré procéduralement** (FBM noise) — voir [`components/sections/TerritoireScene.tsx`](components/sections/TerritoireScene.tsx). Générer via [terrain.party](https://terrain.party) centré sur 43.55°N / 6.94°E.
- [ ] **Vidéo MP4 fallback mobile** du calibre (H.264 720p 30fps < 2 MB, 6s loop) → `public/videos/caliber-mobile-fallback.mp4`. Le hero mobile montre actuellement un placeholder CSS.
- [ ] **Photo réelle** mains/portrait artisan → remplacer le placeholder Unsplash dans [`components/sections/ArtisanSection.tsx`](components/sections/ArtisanSection.tsx)
- [ ] **Image Open Graph** 1200×630px → `public/og-image.jpg`
- [ ] **Logo** atelier (si existant) → remplacer le texte « Atelier R. Levy » dans [`components/Navigation.tsx`](components/Navigation.tsx)

### Validation textes

- [ ] Relire les paragraphes génériques de la section *Artisan* (savoir-faire) — `components/sections/ArtisanSection.tsx`
- [ ] Valider les 3 citations clients (« Service exceptionnel », « Travail d'une précision remarquable », « Un véritable savoir-faire »). **Aucun nom propre** n'est utilisé : ces formulations sont attribuées à la note Google globale 4.8/102.
- [ ] Confirmer l'URL exacte de la fiche Google Business pour le lien « Voir tous les avis Google » dans [`components/sections/ConstellationSection.tsx`](components/sections/ConstellationSection.tsx)

### Décision font display

Le site utilise actuellement **Cormorant Garamond** (Google Fonts, gratuit). La direction artistique initiale recommandait **Canela** (Commercial Type, ~$100-300 licence web).

- [ ] **Option A** — Conserver Cormorant Garamond (gratuit, esthétique très proche)
- [ ] **Option B** — Acheter la licence Canela sur [commercialtype.com](https://commercialtype.com), placer `canela-medium.woff2` dans `public/fonts/`, modifier [`app/layout.tsx`](app/layout.tsx) pour utiliser `next/font/local` au lieu de `Cormorant_Garamond`

## Structure des fichiers

| Fichier / dossier | Rôle |
| --- | --- |
| `app/page.tsx` | Home narrative 5 sections + Schema.org JSON-LD |
| `app/contact/page.tsx` | Formulaire contact + carte + infos |
| `app/mentions-legales/page.tsx` | Mentions LCEN |
| `app/politique-confidentialite/page.tsx` | RGPD |
| `app/api/contact/route.ts` | API route — envoi email via Resend |
| `app/layout.tsx` | Layout global, fonts, Navigation, Footer, CustomCursor, metadata |
| `components/sections/` | 5 sections narratives (Hero, Revelation, Artisan, Constellation, Territoire) |
| `components/ui/` | MagneticButton, CustomCursor, TimestampLive |
| `components/forms/ContactForm.tsx` | Formulaire client avec validation + honeypot |
| `components/Navigation.tsx`, `Footer.tsx` | Header/footer partagés |
| `lib/cn.ts`, `lib/useReducedMotion.ts` | Utilitaires |
| `public/sitemap.xml`, `public/robots.txt` | SEO |
| `public/models/`, `public/videos/`, `public/heightmaps/` | Assets 3D & médias (à fournir par le client) |

## Performance — cibles

- **Lighthouse mobile** : Performance ≥ 85 (3D pénalisante), Accessibility ≥ 98, Best Practices ≥ 95, SEO ≥ 98
- **Core Web Vitals** : LCP < 2.8s · CLS < 0.05 · INP < 200ms
- **Bundle JS initial** : < 350 KB gzipped (R3F + drei lourds, acceptable pour vitrine premium)

## Notes techniques

- **3D désactivée < 768px** — fallback CSS/vidéo (à fournir) pour le hero, gradient pour le territoire
- **`prefers-reduced-motion`** — coupe oscillation balancier, particules, parallax, SplitText
- **Lenis** — smooth scroll synchronisé avec ScrollTrigger via `gsap.ticker`
- **Schema.org** — `LocalBusiness` + `aggregateRating` 4.8/102 uniquement. **Pas** de `priceRange`, `telephone`, `openingHoursSpecification`, `review[]` (données non vérifiées ou personnelles).
- **RGPD** — formulaire avec consentement explicite, honeypot anti-spam, aucun analytics par défaut

---

**Prêt à `git init` + `git push` + import Vercel.** Suivre la section « Déploiement » ci-dessus.
