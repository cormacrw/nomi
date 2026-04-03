# Stitch projects registry

One row per Stitch workspace or project. Add a row when you create a new project; keep **Scope** aligned with [screen IDs](../product/screens/inventory.md).

| Project name | Link or ID | Scope (flows / screen IDs) | Status | Owner | Last updated |
| ------------ | ---------- | -------------------------- | ------ | ----- | ------------ |
| Nomi — Auth MVP | `18104376503220593266` (Stitch project id; open in Google Stitch) | `AUTH-*`, **`NAV-01`**, **`FRND-07`** (People empty + **with sample friends**) — bold full-bleed emerald; 4-tab nav; **780×1688** logical (1560×3376 @2×), no scroll | In review | — | 2026-04-03 |
| *(example)* Nomi — MVP shell | `https://…` or internal id | MVP frames per [mvp.md](../product/screens/mvp.md); e.g. `AUTH-*`, `FEED-*` | Draft | — | — |

**Nomi — Auth MVP — canonical frames:**

- **Auth (Consistent Header)** — **1560×3376**: `aa6a979a38e74dda9ffb258b3d312750` (AUTH-01), `b0ea02f0dddc4dc1b6f992c3e5aff475` (AUTH-02), `31803516f521402c86b441b8faa4835c` (AUTH-03), `0d5c14e40ac94b618b5ca40b27f6c533` (AUTH-04). Session: `8824432112178061346`.

- **`NAV-01` App shell (Feed) — canonical:** **“NAV-01 Feed (Clean Header)”** — `84455a0623b04ee6aa439d0afeb5bae7`. Full-bleed emerald **without** a darker header band — **title floats on same green** as body; footer-only nav; inverse pill CTA; 4-tab bar. Session: `12653398914178613375`.

- **`FRND-07` People (friends list, empty) — canonical:** **“FRND-07 People (Clean Header)”** — `b9f7b3961bb54fac8d57a26156e43aec`. Same **clean header** rule as NAV-01. Session: `12653398914178613375`.

- **`FRND-07` People (with sample data) — canonical:** **“FRND-07 People (list — v3)”** — `6e8f1c50c9c4465895b685f88abb8f9c`. Rebuilt from **People empty (Clean Header)** with **standard iOS-style list density** (e.g. ~44–48pt avatars, ~17pt names, ~56–60pt rows) — middle ground vs oversized/tiny passes; **no** separate header strip; full-width tab bar. Session: `7428079361130783461`. Prior attempts: `df0f342…` (tuned), `cb49b36…` (fixed), `e9e0321f…` — delete in Stitch if unused.

- **Superseded:** NAV-01 **Super Green Refined** — `24267fcade634b8bb472f1f411b7451c` (distinct header strip). FRND-07 earlier — `250791c96c51471bbdefffb70f671843`. Older NAV-01 variants — `74f915e81…`, `990b18e1…`. Delete in Stitch UI if unused.

**Global rule:** Core app screens use **bold green canvas**, not light parchment — see [branding](../product/branding.md) and [decision 0001](decisions/0001-bold-green-canvas-all-core-screens.md).

Prior **Flat** auth ids: `2298bddc…`, `929c9158…`, `6ee43d83…`, `ecb9ffa6…`. Older duplicates can be removed in the Stitch UI — the Stitch MCP cannot delete frames. **`get_screen`** on the ids above confirms metadata if **`list_screens`** lags.

### Status (suggested values)

- **Draft** — exploratory or incomplete.
- **In review** — ready for feedback.
- **Baseline** — agreed reference for implementation for the scoped screens.
