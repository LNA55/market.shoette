---
name: position-my-product
description: Skill 3 of the competitive-intelligence pipeline — Position MY product in the Market. Places a new project (Elena's) on the interactive positioning chart (2b) of a market already analyzed, and publishes a short positioning note. Use when Elena asks to launch Skill 3, "lance la skill 3", "positionne mon produit / mon projet", or gives a new project to position on a market that has Skill 1 and Skill 2 runs.
---

# Position MY product — Skill 3

One execution = **one run**: a short, dated positioning note + its `data.json`, published at `https://market.shoette.com/[slug]/s3-[N]_[date]/` and listed in the `RUNS-SKILL3` zone — **plus one strictly-scoped, additive enrichment** of the source S1 run: the project is added to the interactive 2b chart and its data table.

Work from the MARKET project root. Remote scope: the `market/` directory only.

## Step 0 — Gather the inputs (interactive)

1. **The project** — a free-text description or a source URL (e.g. `https://w.shoette.com/`). If a URL is given, fetch and read it to understand the offer.
2. **The market** — scan `site/*/` for markets having at least one `s1-*` run **and** at least one `s2-*` run (both are required — Elena's rule, 2026-06-12) and ask Elena which one via clickable options (AskUserQuestion), as Skill 2 does. Elena may instead paste the S1/S2 run links directly. A market with S1 runs but no S2 run is not eligible: say so and propose to launch Skill 2 first.
3. **Optional** — extra market info from Elena; when used, cite it as « information fournie par Elena ».
4. If the material is too thin to score the project on the market's dimensions, ask **at most 2-3 targeted questions** — never a form-like interrogation.

## Step 1 — Load the source runs

1. **S1 source run (required)** = the latest `s1-*` of the market (or the one Elena linked): its `data.json` provides the dimensions, scales and players of the 2b chart.
2. **S2 run (required)** = the latest `s2-*` of the market: the KPI table and retained frameworks feed the analysis paragraph. No S2 run → **stop**: Skill 3 depends on the existence of a Skill 2 run for the same market (Elena's rule, 2026-06-12) — propose to launch Skill 2 first.
3. **Freshness**: if the S1 source is older than **3 months**, flag it prominently in the note (and tell Elena), suggesting a fresh Skill 1 run first — without blocking.
4. **Engine prerequisite**: check that the chart engine supports the `is_mine` marker style. If not, stop and tell Elena the engine session must happen first — the engine never evolves during a run (rule acted 2026-06-11).
5. Run number `N` = highest existing `s3-*` + 1 (first run: 1). Date = today. Language = the source run's. Output: `site/[slug]/s3-[N]_[date]/`.

## Step 2 — Position the project

Score the project on **each dimension of the 2b chart** — same dimension ids, same scales, same conventions (`~` estimated) as the source run.

- **`market_share_pct` is always `0`, not estimated** — a new project has no market share by definition (Elena's rule, 2026-06-12). `growth_pct` = null (not applicable). The whole point of Skill 3 is the **other** dimensions.
- Project values are **declarative** — they come from the project's site or from Elena, not from press sources like competitors' values. Each carries `declared: true` and a one-line rationale.

## Step 3 — Enrich the source S1 run — strict scope (the ONLY exception to frozen runs)

Touch exactly three things in the S1 run, in **both** the inline `RUN_DATA` and its `data.json` (kept strictly identical):

1. **Append the project** as a `players[]` entry with `is_mine: true` + `added_by_run` (see contracts) → it appears automatically in the interactive chart **and** in the generated data table — single data source, nothing else to edit. **Never modify any competitor's data.**
2. **Leave the existing « Dernière mise à jour » date untouched.** Next to it, append the enrichment mention: « Graphique enrichi des infos sur le nouveau projet [name], le [S3 run date] » (`data-role="s3-enrichment"`, one per project).
3. **Record the enrichment** in the S1 `data.json` `enrichments[]` block (see contracts).

Re-run for the same project → update its entry and mention (same `id`). Another project → one more entry and mention. Everything else in the S1 run is untouchable: texts, section 2a, annexes, sources, competitors' values.

## Step 4 — Build the note + data.json

Contracts: [references/s3-contracts.md](references/s3-contracts.md) — page structure, data schema, enrichment format, zone format. The note is short — three sections:

1. **Le projet** — name, 2-3 lines, source link.
2. **Le positionnement** — a small table: dimension → assigned value (with `~` / declared flags) + one-line rationale; then the **link to the enriched chart**: `../s1-[n]_[date]/#s2b`.
3. **Analyse du graphique** — one paragraph: where the project lands, nearest neighbours, empty spaces, reading keys — including the **recommended layer/channel configuration**: the project sits at 0% on the default Y axis (market share), so tell the reader which dimensions to map on which visual channels to actually see it.

No SWOT, no frameworks in V1 — they belong to Skill 4. Data inlined (`const RUN_S3_DATA = {...}`) **and** written as `data.json`, identical. The page is autonomous (inline styles, report charte, fluid container) — it is a frozen run.

## Step 5 — Update the parent pages

- `RUNS-SKILL3` zone of `site/[slug]/index.html`: all S3 runs, **oldest first (Run 1 on top)**, card format with the project name in the card meta (see contracts).
- Home `MARKETS` zone: update the market's run count (all skills combined) and last-run date.
- Never touch the other skills' zones.

## Step 6 — Deploy, verify, commit

1. `./deploy.sh --dry-run` — the transfer list must show: the new `s3-*` directory, the enriched S1 run (page + data.json), the parent pages — and nothing unexpected.
2. `./deploy.sh`
3. Verify online: fetch the S3 note **and** the enriched S1 page (project present in chart + table, mention next to the untouched date).
4. `git add -A && git commit -m "Run S3-[N] — [slug] ([date])"`.

## Rules

- **Additive only in the S1 run**: competitors' values, texts, 2a, annexes, sources and the original last-updated date are never modified. The Step 3 scope is the single authorized exception to the frozen-runs principle (acted 2026-06-12).
- Project values are declarative and flagged as such; market data conventions (`~`, `—`) unchanged.
- Frozen runs everywhere else: never modify a past run's directory.
- **Models**: no research fan-out — read the project's site, analyse and write on the best model available in the session; at most 1 Sonnet subagent if the project's site is large.
