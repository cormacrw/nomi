# Stitch projects registry

One row per Stitch workspace or project. Add a row when you create a new project; keep **Scope** aligned with [screen IDs](../product/screens/inventory.md).

| Project name | Link or ID | Scope (flows / screen IDs) | Status | Owner | Last updated |
| ------------ | ---------- | -------------------------- | ------ | ----- | ------------ |
| Nomi — Auth MVP | `18104376503220593266` (Stitch project id; open in Google Stitch) | `AUTH-*`, **`NAV-01`**, **`FRND-07`**, **`FEED-01`–`FEED-04`** ([NOM-54](https://linear.app/cormacw/issue/NOM-54/design-home-feed-and-post-detail)) — bold full-bleed emerald; 4-tab nav; **780×1688** logical (1560×3376 @2×), no scroll | In review | — | 2026-04-03 |
| *(example)* Nomi — MVP shell | `https://…` or internal id | MVP frames per [mvp.md](../product/screens/mvp.md); e.g. `AUTH-*`, `FEED-*` | Draft | — | — |

**Nomi — Auth MVP — canonical frames:**

- **Auth (Consistent Header)** — **1560×3376**: `aa6a979a38e74dda9ffb258b3d312750` (AUTH-01), `b0ea02f0dddc4dc1b6f992c3e5aff475` (AUTH-02), `31803516f521402c86b441b8faa4835c` (AUTH-03), `0d5c14e40ac94b618b5ca40b27f6c533` (AUTH-04). Session: `8824432112178061346`.

- **`NAV-01` App shell (Feed) — canonical:** **“NAV-01 Feed (Clean Header)”** — `84455a0623b04ee6aa439d0afeb5bae7`. Full-bleed emerald **without** a darker header band — **title floats on same green** as body; footer-only nav; inverse pill CTA; 4-tab bar. Session: `12653398914178613375`.

- **`FRND-07` People (friends list, empty) — canonical:** **“FRND-07 People (Clean Header)”** — `b9f7b3961bb54fac8d57a26156e43aec`. Same **clean header** rule as NAV-01. Session: `12653398914178613375`.

- **`FRND-07` People (with sample data) — canonical:** **“FRND-07 People (list — v3)”** — `6e8f1c50c9c4465895b685f88abb8f9c`. Rebuilt from **People empty (Clean Header)** with **standard iOS-style list density** (e.g. ~44–48pt avatars, ~17pt names, ~56–60pt rows) — middle ground vs oversized/tiny passes; **no** separate header strip; full-width tab bar. Session: `7428079361130783461`. Prior attempts: `df0f342…` (tuned), `cb49b36…` (fixed), `e9e0321f…` — delete in Stitch if unused.

- **NOM-54 — Home feed & post detail (`FEED-01`–`FEED-04`):** Align visually with **`NAV-01` Feed (Clean Header)** (`84455a0623b04ee6aa439d0afeb5bae7`): **bright** full-bleed emerald (**#00875A / #006b47**), **no** separate darker header band — title and profile float on the **same** green as the feed. **Do not** default the canvas to near-black forest green (#001209); that reads as a different chrome than the shell.

  **Product — reactions (non-negotiable for prompts):** Read [content-and-moderation.md](../product/content-and-moderation.md) § Reactions. Friends **do not** see reaction counts, who reacted, or aggregates. They only get a react affordance and **self-state** (e.g. outlined vs filled heart). **Only the poster** sees who reacted (`FEED-04`); that belongs in author flows — **not** as “likes” in the feed list.

  **Prompt — `FEED-01` Home feed (filled)**  
  *FEED-01 Home (filled). Match NAV-01 Clean Header: continuous **bright** emerald #00875A / #006b47 full viewport; “Home” + profile on same plane as feed — no darker header strip. Posts are **editorial on green**: avatar, name, time, photo, caption — **no white card panels** behind whole posts; spacing and typography only; optional rounded photo only. Three sample posts. Reaction: **one** minimal control (heart or “React”) per post — **zero** counts, **zero** names, **zero** “Loved by…”. Show reacted state only as icon filled vs outline. Bottom tab bar matches shell.*

  **Prompt — `FEED-01` Loading**  
  *Same shell; skeleton placeholders on green — **no** white card-shaped panels; subtle mint/gray-green bars only.*

  **Prompt — `FEED-01` Empty**  
  *Same shell; empty state + “Find friends” inverse pill.*

  **Prompt — `FEED-02` Post detail**  
  *Carousel + caption; friend view: react + self-state only, no list of reactors; author-only summary is separate (`FEED-04`), not a public like count.*

  **Canonical frames (NOM-54):**

  | Screen | Stitch screen id | Session id |
  | ------ | ---------------- | ---------- |
  | **FEED-01 Home (filled)** — current | `54c1d819312d4d118810380144a72397` | `16752028322217442920` |
  | **FEED-02 Post detail** (needs pass for same reaction rules) | `90dfd161703642a8832be1867f2cc041` | `15212239764316721281` |
  | **FEED-01 Home (loading)** | `44533363b8864fd4a9a1bc708ed7e8eb` | `13229400848542984050` |
  | **FEED-01 Home (empty)** | `3f5824e7a36f4b69b209ed58afe87da1` | `16123406971353446521` |

  **Superseded (wrong social proof / white cards / dark chrome):** `c8ead7255e414cfb98aeffa1895e6e01`; intermediate edits `f9fc266b3a9d4e53957c52255353389e`. Delete in Stitch if cluttering the canvas.

  *Note:* Stitch’s bundled design system may still attach dark `surface` tokens in metadata; **judge the PNG** against NAV-01 brightness. Tweak in Stitch until the canvas matches the shell reference.

- **Superseded:** NAV-01 **Super Green Refined** — `24267fcade634b8bb472f1f411b7451c` (distinct header strip). FRND-07 earlier — `250791c96c51471bbdefffb70f671843`. Older NAV-01 variants — `74f915e81…`, `990b18e1…`. Delete in Stitch UI if unused.

**Global rule:** Core app screens use **bold green canvas**, not light parchment — see [branding](../product/branding.md) and [decision 0001](decisions/0001-bold-green-canvas-all-core-screens.md).

Prior **Flat** auth ids: `2298bddc…`, `929c9158…`, `6ee43d83…`, `ecb9ffa6…`. Older duplicates can be removed in the Stitch UI — the Stitch MCP cannot delete frames. **`get_screen`** on the ids above confirms metadata if **`list_screens`** lags.

### Status (suggested values)

- **Draft** — exploratory or incomplete.
- **In review** — ready for feedback.
- **Baseline** — agreed reference for implementation for the scoped screens.
