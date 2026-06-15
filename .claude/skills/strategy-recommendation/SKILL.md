---
name: strategy-recommendation
description: Skill 4 of the competitive-intelligence pipeline — Strategy recommendation. Builds strategic recommendations for Elena's project positioned by Skill 3 — a clear GO / NO GO verdict, market summary, positioning summary, dedicated SWOT, marketing-mix (4P) advice, other key recommendations and M&A/partnership targets. Use when Elena asks to launch Skill 4, "lance la skill 4", "recommandations stratégiques", or asks for strategic advice on a project already positioned by Skill 3.
---

# Strategy recommendation — Skill 4

One execution = **one run**: a dated, frozen strategy report + its `data.json`, published at `https://market.shoette.com/[slug]/s4-[N]_[date]/` and listed in the `RUNS-SKILL4` zone. Skill 4 **never modifies anything else** — no exception to frozen runs here (the S3 enrichment was the only one).

Work from the MARKET project root. Remote scope: the `market/` directory only.

## Step 0 — Gather the inputs (interactive)

1. **The market + project** — scan `site/*/` for markets having at least one `s3-*` run (the chain guarantees S1/S2 exist). One eligible couple → confirm it; several → ask via clickable options. A market without an S3 run is not eligible: Skill 4 starts from a positioned project — propose to launch Skill 3 first.
2. **Elena's declared marketing mix (optional)** — ask in ONE light question whether she already has choices on Produit / Prix / Promotion / Place. Partial answers are normal: judged where declared, recommended where not. Store verbatim in `declared_inputs.mix`.
3. **Optional** — constraints worth knowing (budget, calendar, personal constraints); cite as « information fournie par Elena ».

## Step 1 — Load the source runs

1. **S3 run (required)** = the latest `s3-*` of the chosen project: positioning values and analysis. Its `source_runs` give the paths of the S1 and S2 runs — load both (dimensions + player data from S1, KPI table + frameworks from S2).
2. **Freshness** : state the age of EVERY source run at the top of the report — sections 1-2 are a **pure synthesis of existing runs** (Elena's rule, 2026-06-12): no web refresh of market data, the report says plainly « données du [date] ». Source older than 3 months → flag prominently and suggest a fresh upstream run, without blocking.
3. `N` = highest existing `s4-*` + 1. Date = today. Language = the source runs'. Output: `site/[slug]/s4-[N]_[date]/`.

## Step 2 — Sections 1 & 2 : the summaries (pure synthesis, no web)

1. **« Le marché au [run date] »** — half a page from S1/S2 only: market definition, size, sub-sector structure, dynamics (growth, GLP-1-type structural shocks, deal flow), dominant forces. Each block keeps its `~` flags and shows the data date.
2. **« Le positionnement du projet »** — from S3: the project in two lines, its values on the market dimensions (declarative, flagged), where it sits (empty corridor, neighbours, blind spot), link to the enriched chart and to the S3 note.

## Step 3 — Section 3 : SWOT (dedicated section — Elena's decision, 2026-06-12)

The SWOT lives HERE (excluded from Skill 2 on 2026-06-11 because it requires the « my product » viewpoint). Strengths / Weaknesses = internal (product promise, stage, declarative data, beta status); Opportunities / Threats = external (market structure, GLP-1 wave, regulation, competitors' moves) — all grounded in S1/S2/S3 facts, conventions kept. Render as the canonical 2×2 grid **in CSS** (`.swot` → `.quad--s` blue/accent, `.quad--w` amber/watch, `.quad--o` green/good, `.quad--t` red/risk), each entry carrying a `.basis` provenance tag (S1/S2/S3 or declarative), plus one reading paragraph.

## Step 4 — Section 4 : Marketing mix (4P)

One block per P — Produit, Prix, Promotion, Place. For each:

- **Elena declared a choice** → a frank, evidence-based verdict on it (agree / challenge — never complacent: if the data contradicts her choice, say so plainly).
- **No declared choice** → a recommendation, **quantified whenever the runs allow it**, anchored in the data: e.g. for Prix — the competitors' effective price range and average (S1 `prix_mensuel`), the reserve-price signal, then a recommended bracket and billing format.

Each block shows: the supporting data (with run citations), the reasoning, the recommendation. Keep `~` on every estimated figure.

## Step 5 — Section 5 : other key recommendations + partnership / exit targets

1. **Recommandations essentielles** — only what materially matters beyond the 4P (product, target, launch, communication, distribution…): a short prioritized list, each item = recommendation + rationale.
2. **Partenariats & sorties (M&A)** — written as a seasoned M&A analyst / investor would: a list of named companies, each with the strategic logic (why THEM for this project), the plausible deal type (partenariat d'envergure / rachat / fusion / investisseur), and observable signals (comparable deals, stated strategies). Candidates go beyond the S1 panel (pharma, wearables, telehealth, insurers…) — **this is the only section where web research is allowed**: fan out **1-2 Sonnet subagents** (Agent tool, `model: "sonnet"`) for targeted lookups, every external fact cited with URL + date, distinguished from run-sourced facts.

## Step 6 — The GO / NO GO verdict (decided last, rendered first — Elena's decision, 2026-06-13)

Synthesize the whole analysis (sections 1-5: market, positioning, SWOT, mix, partnerships) into ONE binary verdict answering the entrepreneur/investor's question: « Faut-il creuser ce projet sur ce marché ? »

- **Binary headline, no « maybe »**: the big word is **GO** or **NO GO**. A conditional GO is allowed, but the condition lives in the rationale — it never softens the word.
- **Frankness over complacency** (same rule as the mix): a **NO GO** when the analysis warrants it — a verdict that can't say no is worthless. The decision follows the sections; it never flatters the project.
- Fields: `decision` (`GO` | `NO GO`), `question`, `answer` (one punchy line), `rationale` (why — grounded in the sections), `condition` (the honest caveat: what a GO hinges on, or what would flip a NO GO).
- **Rendered as a large card in the hero**, after the byline and before the age banner: green for GO, red for NO GO — CSS classes `.verdict--go` / `.verdict--nogo` (design system, see contracts).

## Step 7 — Build the page + data.json

Contracts: [references/s4-contracts.md](references/s4-contracts.md) — page structure, data schema, zone format. **Design system « My Market Data »** (acté 2026-06-14): copy the canonical run `s4-1_2026-06-12`'s inline `<style>` and only change the data; hero with the eyebrow market chip + « Étape 4. » (`.step-no`) + « Recommandation stratégique » + byline (project + the three source runs and their dates). Data inlined (`const RUN_S4_DATA = {...}`) **and** written as `data.json`, identical. Autonomous, frozen run.

## Step 8 — Update the parent pages

- `RUNS-SKILL4` zone of `site/[slug]/index.html`: all S4 runs, oldest first, card format with the project name in the card meta (see contracts).
- Home `MARKETS` zone: run count + last-run date.
- Never touch the other skills' zones.

## Step 9 — Deploy, verify, commit

1. `./deploy.sh --dry-run` — expected: the new `s4-*` directory + parent pages, nothing else (Skill 4 modifies no source run).
2. `./deploy.sh`
3. Verify online: fetch the S4 page.
4. `git add -A && git commit -m "Run S4-[N] — [slug] ([date])"`.

## Rules

- **Sections 1-2 are pure synthesis** of existing runs — no web refresh of market data (Elena's rule, 2026-06-12); data ages stated plainly.
- **Web research is limited to the partnership/M&A section**, cited and distinguished from run-sourced facts.
- **Frankness over complacency**: Elena's declared choices get a real verdict, contradicted by data when the data contradicts them. The same applies to the overall **GO / NO GO** — it is binary, decided from the full synthesis, and must be able to say NO.
- Conventions everywhere: `~` estimated, `—` not found, declarative values flagged; a recommendation displays its uncertainty.
- Skill 4 touches no other run — frozen runs, no exception.
- Publication: standard, like every run (Elena, 2026-06-12 — site-wide or per-market password planned later, out of this skill's scope).
- **Models**: strategic reasoning and writing on the best model available in the session; M&A lookups on Sonnet subagents.
