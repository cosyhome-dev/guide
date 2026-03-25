# Prompt de setup Strapi — CosyHome Guide

Colle ce prompt dans ton projet Strapi pour qu'il crée toute la structure.

---

## Contexte

Ce Strapi gère déjà le site vitrine CosyHome. On ajoute maintenant les content types pour le **guide de séjour** (app React séparée, multilingue FR/EN/DE/IT).

**IMPORTANT** : Tous les content types et composants du guide sont préfixés `guide-` pour les distinguer clairement de la donnée du site vitrine existant.

L'API est déjà en place : `https://cosyhome.up.railway.app/api`

## Ce que tu dois faire

### 1. i18n — Vérifier les locales

Le plugin i18n devrait déjà être actif. Vérifier que les 4 locales existent : `fr` (défaut), `en`, `de`, `it`. Créer celles qui manquent.

### 2. Créer les composants réutilisables (catégorie "guide")

Créer les 6 composants suivants dans la catégorie `guide` :

**guide.step** — Étape numérotée (section arrivée)
- `title` : Short text, required
- `description` : Long text
- `images` : Media (multiple, images only)

**guide.checklist-item** — Item de checklist (section départ)
- `text` : Short text, required

**guide.logement-item** — Élément accordion (section logement)
- `title` : Short text, required
- `description` : Long text, required
- `images` : Media (multiple, images only)

**guide.dechets-block** — Bloc section déchets
- `title` : Short text, required
- `description` : Rich text (pour supporter `<strong>` dans le texte)
- `image` : Media (single, images only)

**guide.region-block** — Bloc section région
- `title` : Short text, required
- `description` : Long text, required
- `image` : Media (single, images only)
- `ctas` : JSON (array de `{ label: string, url: string }`)

**guide.rule** — Règle du règlement
- `title` : Short text, required
- `content` : Long text, required

### 3. Créer le Collection Type "Guide Gestionnaire"

Display name : `Guide Gestionnaire`
API ID : `guide-gestionnaire`
Pas de draft/publish, pas d'i18n.

| Champ | Type | Requis |
|---|---|---|
| firstName | Short text | oui |
| lastName | Short text | oui |
| phone | Short text | oui |

Relation : un gestionnaire a plusieurs guides (`oneToMany` vers Guide Sejour, mappedBy `gestionnaire`).

### 4. Créer le Collection Type "Guide Sejour"

Display name : `Guide Sejour`
API ID : `guide-sejour`
i18n : **activé**
Draft/publish : **activé**

**Infos générales :**

| Champ | Type | Requis | Localized | Notes |
|---|---|---|---|---|
| name | Short text | oui | **non** | Nom de la propriété |
| slug | UID (target: name) | oui | — | |
| address | Short text | oui | **oui** | Adresse formatée |
| mapsUrl | Short text | oui | **non** | URL Google Maps |
| accessCode | Short text | oui | **non** | Marquer **Private** — code d'accès voyageur |
| heroImage | Media (single, images) | oui | **non** | |
| checkIn | Short text | oui | **oui** | ex: "Dès 17h00" / "From 5:00 PM" |
| checkOut | Short text | oui | **oui** | ex: "Avant 11h00" / "Before 11:00 AM" |
| codeBuilding | Short text | oui | **non** | Code digicode immeuble |
| codeKeyBox | Short text | oui | **non** | Code boîte à clé |
| wifiSsid | Short text | non | **non** | |
| wifiPassword | Short text | non | **non** | |
| keyNote | Long text | non | **oui** | Note sous les infos rapides |

**Relation :**

| Champ | Relation | Target |
|---|---|---|
| gestionnaire | manyToOne | Guide Gestionnaire (inversedBy: `guides`) |

**Section Arrivée :**

| Champ | Type | Localized |
|---|---|---|
| arriveeTip | Long text | **oui** |
| arriveeSteps | Component repeatable `guide.step` | hérite du locale |

**Section Départ :**

| Champ | Type | Localized |
|---|---|---|
| departCheckoutMessage | Long text | **oui** |
| departChecklist | Component repeatable `guide.checklist-item` | hérite du locale |

**Section Parking :**

| Champ | Type | Localized |
|---|---|---|
| parkingWinterNote | Long text | **oui** |
| parkingPrivateTitle | Short text | **oui** |
| parkingPrivateDescription | Long text | **oui** |
| parkingPrivateImage | Media (single, images) | **non** |
| parkingPublicTitle | Short text | **oui** |
| parkingPublicDescription | Long text | **oui** |

**Section Logement :**

| Champ | Type | Localized |
|---|---|---|
| logementIntro | Long text | **oui** |
| logementItems | Component repeatable `guide.logement-item` | hérite du locale |

**Section Déchets :**

| Champ | Type |
|---|---|
| dechetsBlocks | Component repeatable `guide.dechets-block` |

**Section Région :**

| Champ | Type |
|---|---|
| regionBlocks | Component repeatable `guide.region-block` |

**Section Règles :**

| Champ | Type |
|---|---|
| regles | Component repeatable `guide.rule` |

**Urgences :**

| Champ | Type | Localized | Default |
|---|---|---|---|
| emergencyUrgences | Short text | **oui** | Urgences 144 |
| emergencyUrgencesTel | Short text | **non** | +41144 |
| emergencyPolice | Short text | **oui** | Police 117 |
| emergencyPoliceTel | Short text | **non** | +41117 |
| emergencyPompiers | Short text | **oui** | Pompiers 118 |
| emergencyPompiersTel | Short text | **non** | +41118 |

### 5. Créer le Single Type "Guide Static Content"

Display name : `Guide Static Content`
API ID : `guide-static-content`
i18n : **activé**
Draft/publish : **activé**

Tous les champs sont **localized** (traduisibles) sauf mention contraire.

**Login :**

| Champ | Type | Default | Localized |
|---|---|---|---|
| loginTitle | Short text | Guide de séjour | oui |
| loginDescription | Long text | Entrez le code d'accès fourni dans votre confirmation de réservation pour accéder au guide de votre logement. | oui |
| loginCodeLabel | Short text | Code d'accès | oui |
| loginCodePlaceholder | Short text | Entrez votre code | oui |
| loginSubmit | Short text | Accéder au guide | oui |
| loginNoCodePrefix | Short text | Vous n'avez pas reçu de code ? | oui |
| loginNoCodeLink | Short text | Contactez votre concierge | oui |
| loginNoCodeWhatsapp | Short text | +41791234567 | **non** |
| loginError | Short text | Veuillez entrer votre code d'accès | oui |

**Navigation :**

| Champ | Type | Default |
|---|---|---|
| navHome | Short text | Accueil |
| navRules | Short text | Règlement |
| navContact | Short text | Contact |
| navRoute | Short text | Itinéraire |

**Home labels :**

| Champ | Type | Default |
|---|---|---|
| homeWelcome | Short text | Bienvenue |
| homeCheckIn | Short text | Check-in |
| homeCheckOut | Short text | Check-out |
| homeAccessCodes | Short text | Codes d'accès |
| homeWifi | Short text | WiFi |

**Section labels :**

| Champ | Type | Default |
|---|---|---|
| sectionBack | Short text | Retour au guide |
| sectionNotFound | Short text | Section introuvable |
| sectionOpenMaps | Short text | Ouvrir dans Google Maps ↗ |
| sectionStepLabel | Short text | Étape |
| sectionArrivee | Short text | Arrivée |
| sectionDepart | Short text | Départ |
| sectionParking | Short text | Parking |
| sectionLogement | Short text | Le Logement |
| sectionDechets | Short text | Déchets |
| sectionRegion | Short text | Région |
| sectionRegles | Short text | Règles |
| departCheckoutLabel | Short text | Check-out |
| departChecklistTitle | Short text | Checklist de départ |

**404 :**

| Champ | Type | Default |
|---|---|---|
| notFoundTitle | Short text | 404 |
| notFoundMessage | Short text | Page introuvable |
| notFoundLink | Short text | Retour à l'accueil |

**Format templates (patterns avec `{value}`) :**

| Champ | Type | Default |
|---|---|---|
| formatBuilding | Short text | Bâtiment : {value} |
| formatKeyBox | Short text | Boîte à clé : {value} |
| formatPassword | Short text | MDP : {value} |

**Brand (non traduisible) :**

| Champ | Type | Default | Localized |
|---|---|---|---|
| altBrand | Short text | CosyHome Conciergerie | **non** |

**Logos (non traduisibles) :**

| Champ | Type | Localized | Description |
|---|---|---|---|
| logoLight | Media (single, images) | **non** | Logo rectangulaire clair |
| logoDark | Media (single, images) | **non** | Logo rectangulaire foncé (header) |
| logoCircle | Media (single, images) | **non** | Logo rond (watermark login) |
| logoCopyright | Media (single, images) | **non** | Logo copyright blanc (overlay login) |

### 6. Permissions API (Public)

Dans Settings → Roles → Public, activer :

- `guide-static-content` : `find` (GET)
- `guide-sejour` : `find`, `findOne` (GET)
- `guide-gestionnaire` : **aucun accès public** (les données gestionnaire sont populées via la relation)

### 7. Résumé

```
Guide Gestionnaire (1) ──→ (N) Guide Sejour
```

- Un gestionnaire gère N guides. Chaque guide a un gestionnaire.
- Le `phone` du gestionnaire = bouton WhatsApp "Contact" dans la nav du guide.
- Le `loginNoCodeWhatsapp` dans Static Content = contact générique CosyHome (pré-authentification).
- Tous les content types sont préfixés `guide-` pour coexister avec le site vitrine.
- L'API endpoint pour le front : `https://cosyhome.up.railway.app/api`
