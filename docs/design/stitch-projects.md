# Stitch projects registry

One row per Stitch workspace or project. Add a row when you create a new project; keep **Scope** aligned with [screen IDs](../product/screens/inventory.md).

| Project name | Link or ID | Scope (flows / screen IDs) | Status | Owner | Last updated |
| ------------ | ---------- | -------------------------- | ------ | ----- | ------------ |
| Nomi — Auth MVP | `18104376503220593266` (Stitch project id; open in Google Stitch) | `AUTH-01`–`AUTH-04` + **`NAV-01`** app shell — **bold full-bleed emerald** (same as auth); 4-tab nav, Feed empty; **780×1688** logical (1560×3376 @2×), no scroll | In review | — | 2026-04-03 |
| *(example)* Nomi — MVP shell | `https://…` or internal id | MVP frames per [mvp.md](../product/screens/mvp.md); e.g. `AUTH-*`, `FEED-*` | Draft | — | — |

**Nomi — Auth MVP — canonical frames:**

- **Auth (Consistent Header)** — **1560×3376**: `aa6a979a38e74dda9ffb258b3d312750` (AUTH-01), `b0ea02f0dddc4dc1b6f992c3e5aff475` (AUTH-02), `31803516f521402c86b441b8faa4835c` (AUTH-03), `0d5c14e40ac94b618b5ca40b27f6c533` (AUTH-04). Session: `8824432112178061346`.

- **`NAV-01` App shell (Feed) — canonical:** **“NAV-01 App shell (Super Green Refined)”** — `24267fcade634b8bb472f1f411b7451c`. Full-bleed emerald; **header = centered title only** (no avatar, menu, or header actions); **all section switching and Create from the bottom tab bar only**. Inverse pill CTA; 4-tab **Feed** · **People** · **Create** · **You**. Session: `16599957174888968314`. Target **standard frame** **780×1688** logical (**1560×3376** @2×), no scroll — confirm in Stitch if export metadata differs.

- **Superseded for NAV-01:** **“Super Green”** with header chrome — `74f915e81ab84ac28882761ff6080316` (session `9022681122729880110`). Light-canvas variant — `990b18e1c0b14178aff678107e159890` (session `6363684422371864630`). Delete in Stitch UI if unused.

**Global rule:** Core app screens use **bold green canvas**, not light parchment — see [branding](../product/branding.md) and [decision 0001](decisions/0001-bold-green-canvas-all-core-screens.md).

Prior **Flat** auth ids: `2298bddc…`, `929c9158…`, `6ee43d83…`, `ecb9ffa6…`. Older duplicates can be removed in the Stitch UI — the Stitch MCP cannot delete frames. **`get_screen`** on the ids above confirms metadata if **`list_screens`** lags.

### Status (suggested values)

- **Draft** — exploratory or incomplete.
- **In review** — ready for feedback.
- **Baseline** — agreed reference for implementation for the scoped screens.
