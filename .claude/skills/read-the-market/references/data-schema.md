# `data.json` — schéma du canevas de données (v1)

Un `data.json` par run, écrit dans le dossier du run. Il est à la fois la source de données du graphique 2b et l'enregistrement versionné que la Skill 3 lit, met à jour (nouveau run) et compare entre runs.

Tous les champs en texte libre sont rédigés dans la langue du run. Toute valeur quantitative est enveloppée : `{"value": ..., "estimated": true|false}` — `estimated: true` dès que le chiffre est déduit plutôt que sourcé précisément.

## Exemple complet

```json
{
  "schema_version": 1,
  "market": {
    "slug": "chaussure",
    "label": "Marché de la chaussure",
    "input": "texte exact fourni en entrée du run",
    "language": "fr",
    "geo_scope": "France",
    "assumptions": [
      "Périmètre retenu : chaussure grand public, hors orthopédie.",
      "..."
    ]
  },
  "run": { "number": 1, "date": "2026-06-11" },
  "reading": {
    "maturity_summary": "Quelques phrases : stade de maturité du marché + événements structurels récents.",
    "reference_period": {
      "choice": "1y",
      "options": ["6m", "1y", "3y"],
      "rationale": "Pourquoi cette période de référence, au vu de la vélocité du marché."
    },
    "dimensions": [
      {
        "id": "positionnement_prix",
        "label": "Positionnement prix",
        "rank": 1,
        "type": "numeric",
        "unit": "€ (panier moyen)",
        "description": "Ce que mesure la dimension et pourquoi elle structure ce marché.",
        "scale": { "min": 0, "max": 300 }
      },
      {
        "id": "largeur_gamme",
        "label": "Largeur de gamme",
        "rank": 2,
        "type": "ordinal",
        "scale": { "values": ["mono-produit", "spécialiste", "généraliste"] },
        "description": "..."
      }
    ],
    "default_channels": {
      "y": "market_share",
      "x_color": "id_dimension_rang2",
      "size": "id_dimension_rang3",
      "opacity": "id_dimension_rang4",
      "border": "id_dimension_rang5"
    },
    "default_config_rationale": "Paragraphe : pourquoi ce classement des dimensions, et comment lire la configuration par défaut.",
    "export_note": "Texte intégré aux exports PNG/SVG du graphique 2b : clé de lecture + une première observation du marché. 2 à 4 phrases."
  },
  "players": [
    {
      "id": "nike",
      "name": "Nike",
      "market_share_pct": { "value": 27.0, "estimated": true },
      "growth_pct": { "value": 4.2, "estimated": true },
      "dimensions": {
        "positionnement_prix": { "value": 110, "estimated": true, "note": "fourchette 90–130 € selon les gammes" },
        "largeur_gamme": { "value": "généraliste", "estimated": false }
      },
      "card": {
        "summary": "2-3 phrases de présentation de l'acteur.",
        "facts": ["CA 2025 : ...", "Positionnement : ..."],
        "source_ids": [1, 3]
      }
    }
  ],
  "players_without_data": [
    {
      "name": "MarqueX",
      "why_significant": "Pourquoi cet acteur semble compter sur ce marché.",
      "what_was_searched": "Ce qui a été cherché sans résultat quantitatif.",
      "source_ids": [5]
    }
  ],
  "sources": [
    {
      "id": 1,
      "title": "Titre de l'article ou du rapport",
      "publisher": "Éditeur / média",
      "url": "https://...",
      "accessed": "2026-06-11"
    }
  ],
  "lexicon": [
    {
      "term": "DTC",
      "fr": "Vente directe au consommateur, sans intermédiaire de distribution.",
      "en": "Direct-to-consumer: selling without retail intermediaries."
    }
  ],
  "last_updated": "2026-06-11"
}
```

## Notes champ par champ

- **`dimensions[].type`** : `numeric` | `ordinal` | `categorical`. Pour `ordinal` et `categorical`, fournir `scale.values` (liste ordonnée) au lieu de `min`/`max`.
- **`dimensions[].rank`** : 1 = la plus structurante. Le classement pilote `default_channels`.
- **`default_channels`** : `y` démarre sur `market_share` (spec : « Default = market share ») ; rang 2 → `x_color`, rang 3 → `size`, rang 4 → `opacity`, rang 5 → `border`. Moins de 5 dimensions → canaux excédentaires à `null`.
- **`players[].dimensions`** : une dimension peut manquer pour un acteur (valeur introuvable) — l'omettre et, si utile, l'expliquer en `note` ailleurs. Le moteur du graphique gère l'absence (canal neutre pour ce marqueur).
- **`players[].card`** : alimente la fiche détaillée ouverte au clic sur un marqueur (panneau latéral droit).
- **`source_ids`** : références vers `sources[].id` — la traçabilité passe par là (les données brutes ne sont pas conservées).
- **`reading.export_note`** : repris tel quel par le moteur 2b dans le bloc d'annotations des exports PNG/SVG (avec la légende des canaux, les calques actifs et la date). À générer à chaque run.
- **`last_updated`** : seul champ qu'une Skill 3 réécrit dans un run publié.
- **Stabilité des `id`** (acteurs et dimensions) : slugs ASCII stables d'un run à l'autre — la Skill 3 s'en sert pour apparier les données entre runs.
