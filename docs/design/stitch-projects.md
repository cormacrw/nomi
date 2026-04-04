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

- **NOM-54 — Home feed & post detail (`FEED-01`–`FEED-04`):** Generate in this project so frames sit next to **`NAV-01` Feed (Clean Header)** (`84455a0623b04ee6aa439d0afeb5bae7`). **Global rule:** full-bleed emerald viewport (**#00875A / #006b47**), **white/cream typography** on the green, post bodies on **elevated light cards** (inverse of the green canvas) — see [decision 0001](decisions/0001-bold-green-canvas-all-core-screens.md). Manrope for titles/author names, Inter for body and meta.

  **Prompt — `FEED-01` Home feed (filled)**  
  *Nomi mobile — FEED-01 Home feed (filled). Match NAV-01 Feed (Clean Header): same full-bleed emerald background, no darker header band, title “Home” or “Nomi” in white, subtle profile icon top-right. Scrollable feed: 3 friend post cards on light elevated surfaces (rounded corners, soft shadow or tonal lift). Each card: avatar, name (Manrope semibold), relative time (Inter caption), one landscape photo placeholder, 2-line caption, reaction row: heart + “You, Alex, Sam” on a **friend’s** post; on **your own** post show poster-visible aggregate like “Loved by 12 friends”. Bottom: same 4-tab bar as NAV-01 with Home active. Screen label: FEED-01 Home (filled).*

  **Prompt — `FEED-01` Loading**  
  *Same shell as FEED-01 filled; replace feed with skeleton placeholders (shimmer-style gray bars and rounded rects on card-shaped areas). Label: FEED-01 Home (loading).*

  **Prompt — `FEED-01` Empty**  
  *Same shell; main area: calm empty illustration or icon, headline “No posts yet”, supporting line about adding friends or checking back, primary button “Find friends” (inverse pill). Label: FEED-01 Home (empty).*

  **Prompt — `FEED-02` Post detail**  
  *FEED-02 Post detail: full-screen on same emerald canvas; back affordance top-left; author row; **multi-photo** area with swipeable carousel (dots), up to 5 photos; full caption; reaction affordance consistent with feed. For `FEED-03`/`FEED-04` product modes: show **friend** view (react + no others’ reaction list) vs **author** view (who reacted summary) as a small segmented note or subtitle — or generate two labeled variants. Title: FEED-02 Post detail.*

  **Canonical frames (NOM-54, generated 2026-04-03):**

  | Screen | Stitch screen id | Session id |
  | ------ | ---------------- | ---------- |
  | **FEED-01 Home (filled)** | `c8ead7255e414cfb98aeffa1895e6e01` | `3784742257647662720` |
  | **FEED-02 Post detail** (`FEED-03` / `FEED-04` modes via segmented control) | `90dfd161703642a8832be1867f2cc041` | `15212239764316721281` |
  | **FEED-01 Home (loading)** | `44533363b8864fd4a9a1bc708ed7e8eb` | `13229400848542984050` |
  | **FEED-01 Home (empty)** | `3f5824e7a36f4b69b209ed58afe87da1` | `16123406971353446521` |

  *Note:* Generations use the project’s current **High-Chroma Emerald Immersion** design system (dark emerald canvas, Epilogue + Manrope). This aligns with full-bleed green direction; older **NAV-01** (`84455a0623b04ee6aa439d0afeb5bae7`) is lighter — reconcile in Stitch if you need pixel continuity with that exact frame.

- **Superseded:** NAV-01 **Super Green Refined** — `24267fcade634b8bb472f1f411b7451c` (distinct header strip). FRND-07 earlier — `250791c96c51471bbdefffb70f671843`. Older NAV-01 variants — `74f915e81…`, `990b18e1…`. Delete in Stitch UI if unused.

**Global rule:** Core app screens use **bold green canvas**, not light parchment — see [branding](../product/branding.md) and [decision 0001](decisions/0001-bold-green-canvas-all-core-screens.md).

Prior **Flat** auth ids: `2298bddc…`, `929c9158…`, `6ee43d83…`, `ecb9ffa6…`. Older duplicates can be removed in the Stitch UI — the Stitch MCP cannot delete frames. **`get_screen`** on the ids above confirms metadata if **`list_screens`** lags.

### Status (suggested values)

- **Draft** — exploratory or incomplete.
- **In review** — ready for feedback.
- **Baseline** — agreed reference for implementation for the scoped screens.
