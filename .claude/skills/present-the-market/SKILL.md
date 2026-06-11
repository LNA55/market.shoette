---
name: present-the-market
description: Skill 2 of the competitive-intelligence pipeline — Present the Market. Builds a fixed business-KPI table and applies the strategic frameworks relevant to a market, working from the latest Skill 1 run. Use when Elena asks to launch Skill 2, "lance la skill 2", "présente le marché" or "present the market" for a market already read by Skill 1.
---

# Present the Market — Skill 2

One execution = **one run**: a dated, frozen report page + its `data.json`, published at `https://market.shoette.com/[slug]/s2-[N]_[date]/` and listed in the market page's `RUNS-SKILL2` zone.

Work from the MARKET project root. Remote scope: the `market/` directory only.

## Step 0 — Choose the market (always interactive)

1. Scan `site/*/` for markets having at least one `s1-*` run.
2. **Always ask Elena which market** via clickable options (AskUserQuestion) — one option per market, even if only one exists. Label = market label; description = number of S1 runs + date of the latest.
3. No market has an S1 run → stop: Skill 1 must run first.

## Step 1 — Load the source run

1. **Primary source = the latest `s1-*` run** of the chosen market: read its `data.json` and its page. Online research is a **complement only** — reach for it when the source run lacks a KPI (typical gaps: sub-sector sizes, incumbent financials).
2. **Freshness**: if the source run is older than **3 months**, flag it prominently at the top of the report (and tell Elena), suggesting a fresh Skill 1 run first — without blocking.
3. Run number `N` = highest existing `s2-*` + 1 (first run: 1). Date = today. Language = the source run's language. Output: `site/[slug]/s2-[N]_[date]/`.

## Step 2 — Business KPI table (fixed structure, V1)

Always the same rows — that's what makes markets comparable:

1. **Définition du marché** — one tight sentence, derived from the S1 executive summary.
2. **Principaux sous-secteurs** — list.
3. **Taille du marché mondial** — value or range, year, flagged `~` when estimated, perimeter stated.
4. **Taille et part de chaque sous-secteur** — plus a « reste du marché » line so shares total 100 %.
5. **Acteur installé dominant** (the dominant incumbent — if biggest and oldest diverge, pick the dominant established player): name; creation date; annual revenue (average of the last two fiscal years when both are known, otherwise the latest known, saying so); **profit reported as a status — « en perte / rentable / à l'équilibre / information introuvable » — plus the figure when available**.
6. **Géographie** — mondial / centré sur une région (laquelle) / local (citer les pays).

Conventions: `~` estimated, `—` not found, ranges allowed, every figure sourced. For the complementary lookups, fan out **1-2 Sonnet subagents** (Agent tool, `model: "sonnet"`), each returning facts with source URL + date.

## Step 3 — Select the frameworks (rules, not a checklist)

Read the market's nature from the source `data.json` and page: maturity stage, B2C/B2B, digital-subscription vs multi-link filière, brand intensity, regulation exposure, identifiable segments, concentration, deal flow found by S1. V1 intent is implicit: **« évaluer l'opportunité du marché »**.

Three tiers: **activé** / **dégradé en qualitatif** (relevant but data too thin for numbers) / **écarté**.

| Framework | Activer quand | Écarter / dégrader quand |
|---|---|---|
| TAM / SAM / SOM | Des estimations de taille existent | Marché si naissant que tout chiffre serait fictif |
| Porter — 5 forces | Par défaut (socle structurel) | Marché émergent sans structure formée → lecture partielle |
| Value chain | Filière à plusieurs maillons (physique, distribution) | Chaîne courte (apps, SaaS) → **variante unit economics** : CAC/LTV + péages de plateformes |
| BCG Matrix | Segments distincts ET mesurables (niveau segments, pas acteurs) | Redondant avec le graphique 2a du run S1 (part × croissance par acteur) |
| Perceptual map | B2C à forte composante de marque + données de perception (avis, NPS) | B2B/commodité ; sinon renvoyer au graphique 2b du run S1 et n'ajouter que la couche perception |
| Vitalité (deal flow) | Levées/M&A trouvées par S1 — ou absence elle-même signifiante | Secteur sans écosystème d'investissement : une ligne suffit |
| PESTEL | Marché régulé, sensible au macro, ou choc externe déjà repéré par S1 | Marché stable sans exposition externe notable → version allégée |
| GE / McKinsey 9-box | ≥ 3 segments identifiables et données suffisantes pour des scores composites | Pas de segments, ou données trop minces |

**SWOT : hors périmètre par décision (2026-06-11)** — il exige un point de vue (« mon produit ») et appartient aux Skills 3/4. Ne jamais l'inclure ; pas besoin de justifier son absence.

Then write the report's section 2 — titled **« Remarques sur le marché et choix de la méthodologie d'analyse adaptée »** : a short intro line, then a **structured list, one line per remark** (never a dense paragraph) — each remark states a fact about *this* market and the methodological choice it drives (« fait → choix »). **Per Elena's decision (2026-06-11): the report shows retained frameworks only** — do not list the rejected ones.

## Step 4 — Framework analyses

One section per retained framework, containing in order:

1. The title, linked to the framework's documentation fiche (`/focus-skill-2/#[anchor]`), with the « lecture qualitative » badge when dégradé.
2. **The framework's objective sentence** (`objective` in the data) — the « question » verbatim from the documentation page (e.g. « Où se capture la marge dans la filière ? »).
3. A short paragraph or two answering those questions **for this market**, grounded in the KPI table and the S1 facts (keep the `~` flags).
4. **A market-specific visualization when relevant** — the framework's canonical diagram **filled with this market's actual data** (figures, players, events), drawn as inline SVG in the report charte, large and readable (~660px wide — bigger than the generic doc-page schematics), with a one-line caption. Examples: TAM/SAM/SOM circles with the amounts, Porter boxes annotated with the market's forces, a real deal-flow timeline, PESTEL cells filled per letter.

## Step 5 — Build the page + data.json

Contracts: [references/s2-contracts.md](references/s2-contracts.md) — page structure, data schema, zone format. The run data is inlined in the page (`const RUN_S2_DATA = {...}`) **and** written as `data.json`, identical. The page is autonomous (inline styles, report charte, fluid container) — it is a frozen run.

## Step 6 — Update the parent pages

- `RUNS-SKILL2` zone of `site/[slug]/index.html`: all S2 runs, **oldest first (Run 1 on top)**, card format with the `Run [N]` pill (see contracts).
- Home `MARKETS` zone: update the market's run count (all skills combined) and last-run date.
- Never touch the other skills' zones.

## Step 7 — Deploy, verify, commit

1. `./deploy.sh --dry-run` — review the transfer list.
2. `./deploy.sh`
3. Verify: lftp listing + fetch `https://market.shoette.com/[slug]/s2-[N]_[date]/`.
4. `git add -A && git commit -m "Run S2-[N] — [slug] ([date])"`.

## Rules

- Primary source = latest S1 run; online complements are cited in the sources list, distinguished from the S1-sourced facts.
- Conventions `~` / `—` everywhere; shares boucler à 100 % ; estimates never silently presented as exact.
- Frozen runs: never modify a past run's directory.
- **Models** (split acted 2026-06-11): analysis and writing on the best model available in the session; research complements on Sonnet subagents.
- Retained frameworks only in the report (Elena's decision, 2026-06-11).
