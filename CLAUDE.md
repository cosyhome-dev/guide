# CosyHome Guide

Guide de séjour digital pour voyageurs (Airbnb/booking). Propriété : Le Saint Georges, Valais, Suisse.
Site privé (noindex, nofollow, robots.txt Disallow) sécurisé par code d'accès.

## Stack

- React 19, Vite 8, TypeScript 5.9, React Compiler (babel-plugin-react-compiler)
- Tailwind CSS v4 (config CSS via @theme, pas de tailwind.config.ts)
- react-router-dom (routing)
- TanStack Query (data fetching)
- Zod (validation schemas)
- lucide-react (icônes)
- clsx + tailwind-merge (cn utility)
- Fonts : DM Serif Text (titres) + DM Sans (body) via Google Fonts
- Package manager : **pnpm** (lockfile unique `pnpm-lock.yaml` — `package-lock.json` supprimé)

## Architecture

```
src/
  api/              → fonctions fetch (mock → Strapi)
    mock.ts         → delay() simulation réseau
    static-content.ts → fetchStaticContent()
    guide.ts        → fetchGuide(code), validateCode(code)
  hooks/            → TanStack Query hooks + context
    useStaticContent.ts → useQuery staleTime Infinity
    useGuide.ts     → useQuery par code d'accès
    useValidateCode.ts → useMutation login
    useAccessCode.ts → sessionStorage get/set/clear
    guideContext.ts → React.createContext + useGuideContext()
    GuideProvider.tsx → fetch + inject content/property via context
  content/          → données mock (seront remplacées par Strapi)
    static.ts       → texte UI + schemas Zod
    property.ts     → données propriété + schema Zod
  components/
    GuideLayout.tsx → header sticky + nav bottom + footer urgences
    guide/          → sections + composants partagés (barrel index.ts)
  pages/            → Login, GuideHome, GuideSection, NotFound
  lib/              → cn(), fmt()
```

## Flux de données

1. Login → useValidateCode mutation → sessionStorage → navigate /guide
2. Routes /guide/* wrappées dans GuideProvider
3. GuideProvider fetch staticContent + guide data → context
4. Composants lisent useGuideContext() — jamais d'import direct de content/

## Backend (phase 2)

- API : Strapi V5
- Schemas prêts dans strapi/guide.schema.json et strapi/static-content.schema.json
- Pour brancher : modifier uniquement src/api/ (fetch → URLs Strapi)

## Routes

| Route | Page | Description |
|---|---|---|
| `/` | Login | Split image hero + formulaire code d'accès |
| `/guide` | GuideHome | Hero + quick info + grille 6 sections |
| `/guide/:section` | GuideSection | Wrapper dynamique : back button + titre |
| `/guide/arrivee` | SectionArrivee | Adresse Maps + tip + 4 étapes |
| `/guide/depart` | SectionDepart | Check-out + checklist 6 items |
| `/guide/parking` | SectionParking | Lien Maps + note hiver + parkings |
| `/guide/logement` | SectionLogement | Accordion 6 items |
| `/guide/dechets` | SectionDechets | Sacs taxés + containers + collecte |
| `/guide/region` | SectionRegion | 6 blocs + CTAs externes |
| `/guide/regles` | SectionRegles | Accordion 8 règles |

## Design tokens

Palette beige/brun chaud, radius 0 (aucun border-radius).

```
--background: hsl(30 17% 91%)     beige clair
--foreground: hsl(0 0% 10%)       quasi noir
--primary: hsl(27 10% 22%)        brun foncé
--accent: hsl(20 14% 59%)         brun/tan
--card: hsl(30 14% 95%)           blanc cassé
--border: hsl(30 10% 82%)
--muted-fg: hsl(28 8% 44%)        gris chaud
```

## Typographie

- h1 : DM Serif Text, 30px, weight 400
- h2 : DM Sans, 14px, weight 600, UPPERCASE
- body : DM Sans, 13px, weight 300, tracking 0.4px
- Utilities : text-small (12px), label-upper (10px uppercase)

## Conventions code

- React.useState, React.useEffect — jamais d'import destructuré des hooks React
- Structure composants : Hooks → States → Derived → Handlers → Effects → Render
- Zod pour validation des données (schemas exportés, types inférés)
- Barrel imports (index.ts dans chaque dossier)
- Aucun texte hardcodé dans le JSX — tout via content/hooks
- DRY, YAGNI strict
- Prettier + ESLint configurés
