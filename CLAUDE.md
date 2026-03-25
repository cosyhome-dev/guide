# CosyHome Guide

Guide de séjour digital pour voyageurs (Airbnb/booking). Propriété : Le Saint Georges, Valais, Suisse.
Le dossier `lovable/` contient le code de référence généré par Lovable — à reproduire proprement.

## Stack

- React 19, Vite 8, TypeScript 5.9
- Tailwind CSS v4 (à installer)
- react-router-dom (à installer)
- lucide-react (à installer)
- Pas de shadcn/ui — composants écrits à la main (Accordion, Button, Input)
- Fonts : DM Serif Text (titres) + DM Sans (body) via Google Fonts

## Routes

| Route | Page | Description |
|---|---|---|
| `/` | Login | Split image hero + formulaire code d'accès |
| `/guide` | GuideHome | Hero + quick info (check-in/out, WiFi, codes) + grille 6 sections |
| `/guide/:section` | GuideSection | Wrapper dynamique : back button + titre + trait décoratif |
| `/guide/arrivee` | SectionArrivee | Adresse Maps + tip + 4 étapes numérotées |
| `/guide/depart` | SectionDepart | Heure check-out + checklist 6 items |
| `/guide/parking` | SectionParking | Lien Maps + note hiver + parking privé/public |
| `/guide/logement` | SectionLogement | Accordion 6 items (cuisine, SdB, chauffage, TV, buanderie, ski) |
| `/guide/dechets` | SectionDechets | Sacs taxés + containers + point de collecte |
| `/guide/region` | SectionRegion | 6 blocs (commerces, activités, restos, transports, tourisme) |
| `/guide/regles` | SectionRegles | Accordion 8 règles |

## Layout (GuideLayout)

- Header sticky : logo rect dark + nom propriété + sélecteur langue (FR/EN/DE/IT)
- Footer urgences : 144, 117, 118 (masqué sur GuideHome)
- Nav bottom sticky : Accueil, Règlement, Contact, Itinéraire

## Design tokens

Palette beige/brun chaud, radius quasi carré (0.25rem).

```
--background: hsl(30, 17%, 91%)    beige clair
--foreground: hsl(0, 0%, 10%)      quasi noir
--primary: hsl(27, 10%, 22%)       brun foncé
--accent: hsl(20, 14%, 59%)        brun/tan
--card: hsl(30, 14%, 95%)          blanc cassé
--border: hsl(30, 10%, 82%)
--muted-fg: hsl(28, 8%, 44%)       gris chaud
--secondary: hsl(30, 12%, 86%)     beige clair
--destructive: hsl(0, 65%, 50%)
```

## Typographie

- h1 : DM Serif Text, 30px, weight 400
- h2 : DM Sans, 14px, weight 600, UPPERCASE, tracking 0.4px
- body : DM Sans, 13px, weight 300, tracking 0.4px
- .text-small : 12px
- Labels : text-[10px] uppercase tracking-wider text-muted-foreground

## Patterns UI récurrents

- Tip box : `bg-accent/10 border border-accent/20 rounded-sm p-4`
- Card interactive : `bg-card border rounded-sm hover:border-accent/50 hover:shadow-sm`
- Section spacing : `space-y-6` ou `space-y-10`
- PlaceholderImg : placeholder dashed + lightbox modale au clic
- Accordion maison (pas Radix)

## Backend (phase 2 — après le front)

- API : Strapi V5
- Data fetching : TanStack Query
- Le front est d'abord construit en statique (ISO Lovable), puis branché sur l'API

## Principes

- DRY, YAGNI, lisibilité
- React Compiler activé (babel-plugin-react-compiler) — pas de useMemo/useCallback manuels
- Tailwind v4 (config CSS, pas de tailwind.config.ts)
- cn() via clsx + tailwind-merge
- Texte centralisé dans src/content/ : statique (locale ou Strapi single-type) + dynamique (lié à la propriété)

## i18n / Content

```
src/content/
  static.ts    — texte UI statique (labels, boutons, titres de sections)
  property.ts  — données dynamiques par propriété (nom, adresse, codes, WiFi, etc.)
```

Le contenu statique sera à terme soit local soit Strapi single-type.
Les données property seront fetchées via TanStack Query + Strapi en phase 2.

## Plan d'implémentation

1. **Fondations** — installer deps, configurer Tailwind v4 + palette + fonts + alias @/
2. **Layout & Routing** — router 7 routes, GuideLayout (header/nav/footer)
3. **Pages principales** — Login, GuideHome, GuideSection
4. **Composants partagés** — PlaceholderImg, Accordion, cn()
5. **Sections contenu** — Arrivée, Départ, Parking, Logement, Déchets, Région, Règles
6. **Polish** — responsive, transitions, hover states

## Assets

Copier depuis `lovable/src/assets/` : hero-guide.jpg, logo-cosyhome.png, logo-cosyhome-rect.png, logo-cosyhome-rect-dark.png, logo-copyright-blanc.png
