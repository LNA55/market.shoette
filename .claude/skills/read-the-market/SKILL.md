---
name: read-the-market
description: Skill 1 of the competitive-intelligence pipeline. Runs a full market-reading cycle and publishes a dated run on market.shoette.com. Use when Elena asks to analyze/read a market, launch a (new) run, or names a sector, need or geography to investigate (e.g. "lance un run sur le marché de la chaussure", "read the market for X").
---

# Read the Market — Skill 1

One execution of this skill = **one run**: a dated, frozen report page + its `data.json`, published at `https://market.shoette.com/[slug]/[N]_[date]/`, plus updated parent pages.

Work from the MARKET project root (where `deploy.sh` lives). Remote scope: the `market/` directory only — never write anywhere else on the hosting.

## Step 0 — Resolve the run context

1. **Market slug**: lowercase ASCII, no accents or spaces (e.g. `chaussure`, `sneakers-us`). If the market already exists under `site/`, reuse its slug.
2. **Run number `N`**: list `site/[slug]/` — N = highest existing run number + 1 (first run: 1).
3. **Date**: today, `YYYY-MM-DD` → output directory `site/[slug]/[N]_[date]/`.
4. **Language**: the input language. All user-facing output (report, charts, annexes) is written in it. Parent pages stay in French.
5. **Pre-flight**: check that the chart engine exists (`site/assets/positioning-chart-v*.js`). If missing, stop and tell Elena it must be built first.

## Step 1 — Interpret the input

The input can be a sector, a need expressed in natural language, a geographic scope, or any combination. When input is incomplete, infer the most likely market and state your assumptions explicitly at the top of the output. Ask a clarifying question only if the input is too ambiguous to proceed.

## Step 2 — Research

Goal: identify all significant players and read the market's structure. Use web search and web fetch extensively (international economic press, market-specific press, reports, databases, company sites).

- Establish the market's **maturity stage** and main recent structural events — this drives the choice of the 2a reference period (6 months, 1 year, or 3 years), which must be stated with its rationale.
- Identify the **dimensions that most structurally define this market** — the criteria a sophisticated buyer or investor would use to evaluate and compare offers (product types, audiences, price range, any structural factor that materially shapes competition). Rank them by importance for reading this market.
- For each significant player: estimate current market share (%) and market-share growth over the reference period; collect a value per ranked dimension. **Estimate when exact data is unavailable and flag every estimate explicitly.**
- A player that appears significant but has no findable quantitative data is **never silently omitted**: list it separately, with what was searched.
- Record every source used (title, publisher, URL, access date) for Annex A1; collect sector jargon for Annex A2 along the way.
- Raw gathered material is **not persisted**. Only the structured data (`data.json`) and the source references survive the run.

For breadth, you may fan out research to subagents (e.g. one per player group or source family) and consolidate the results yourself.

## Step 3 — Build `data.json`

Schema and field-by-field notes: [references/data-schema.md](references/data-schema.md). Key points:

- the ranked `dimensions` drive the 2b default configuration (`default_channels`: Y starts on market share per spec; rank 2 → X+Color, rank 3 → size, rank 4 → opacity, rank 5 → border);
- every quantitative value carries its `estimated` flag;
- `players_without_data`, `sources` and `lexicon` are part of the file;
- player and dimension `id`s are stable slugs — Skill 3 matches on them across runs.

Write it to the run directory.

## Step 4 — Generate the run page

Structure contract: [references/site-contracts.md](references/site-contracts.md). The page contains, in the run language:

1. **Section 1 — Executive Summary**: a market framing of about half a page — the reading grid for everything that follows, grounded in concrete market realities; the structuring dimensions; the stated assumptions. It is **not** a summary of players.
2. **Section 2a — Market Share & Growth**: the short maturity summary and the chosen reference period with its rationale, then a static SVG scatter (Y = current market share %, X = growth over the reference period). Estimated figures visibly flagged; no-data players listed below the chart.
3. **Section 2b — Player Positioning Chart**: the interactive chart mounted from the shared engine with this run's data and default channel config, preceded by the paragraph explaining the dimension ranking and how to read the default view.
4. **Annexes**: A1 Sources (all of them, URL + access date when available), A2 Sector Lexicon (key terms, short definitions in both French and English, oriented to a newcomer).
5. A visible **last-updated date** (`<span data-role="last-updated">`) — the only element Skill 3 may rewrite later.

The run data is both inlined in the page (`const RUN_DATA = {...}`) and written as `data.json` — the two must be identical.

## Step 5 — Update the parent pages

Edit **only between the markers** — everything else on these pages belongs to Elena (exact formats and the market-index template: [references/site-contracts.md](references/site-contracts.md)):

- `site/[slug]/index.html` — create from the template if this is the market's first run; rewrite the list inside `<!-- RUNS:START -->` / `<!-- RUNS:END -->` (all runs, newest first).
- `site/index.html` — rewrite the list inside `<!-- MARKETS:START -->` / `<!-- MARKETS:END -->` (markets alphabetical, each with run count and last-run date).

## Step 6 — Deploy, verify, commit

1. `./deploy.sh --dry-run` — review the transfer list (only the expected files).
2. `./deploy.sh`
3. Verify: lftp listing of the new remote directory, then fetch `https://market.shoette.com/[slug]/[N]_[date]/` and confirm it serves.
4. `git add -A && git commit -m "Run [N] — [slug] ([date])"`.

## Rules

- **Frozen runs**: never modify a past run's directory (except the last-updated field — Skill 3's job, not yours).
- Estimates always flagged; significant players never silently dropped.
- Run this skill on the top model tier (Fable/Opus class) — it carries the research, the strategic reading and the chart generation.
