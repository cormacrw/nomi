# Stitch projects registry

One row per Stitch workspace or project. Add a row when you create a new project; keep **Scope** aligned with [screen IDs](../product/screens/inventory.md).

| Project name | Link or ID | Scope (flows / screen IDs) | Status | Owner | Last updated |
| ------------ | ---------- | -------------------------- | ------ | ----- | ------------ |
| Nomi — Auth MVP | `18104376503220593266` (Stitch project id; open in Google Stitch) | `AUTH-*`, **`NAV-01`**, **`FRND-07`**, **`FEED-01`** ([NOM-54](https://linear.app/cormacw/issue/NOM-54/design-home-feed)), **`POST-01`–`POST-04`** + upload failure ([NOM-55](https://linear.app/cormacw/issue/NOM-55/design-create-post)) — bold full-bleed emerald; tab nav; **780×1688** logical (1560×3376 @2×) | In review | — | 2026-04-04 |
| *(example)* Nomi — MVP shell | `https://…` or internal id | MVP frames per [mvp.md](../product/screens/mvp.md); e.g. `AUTH-*`, `FEED-*` | Draft | — | — |

**Nomi — Auth MVP — canonical frames:**

- **Auth (Consistent Header)** — **1560×3376**: `aa6a979a38e74dda9ffb258b3d312750` (AUTH-01), `b0ea02f0dddc4dc1b6f992c3e5aff475` (AUTH-02), `31803516f521402c86b441b8faa4835c` (AUTH-03), `0d5c14e40ac94b618b5ca40b27f6c533` (AUTH-04). Session: `8824432112178061346`.

- **`NAV-01` App shell (Feed) — canonical:** **“NAV-01 Feed (Clean Header)”** — `84455a0623b04ee6aa439d0afeb5bae7`. Full-bleed emerald **without** a darker header band — **title floats on same green** as body; footer-only nav; inverse pill CTA; 4-tab bar. Session: `12653398914178613375`.

- **`FRND-07` People (friends list, empty) — canonical:** **“FRND-07 People (Clean Header)”** — `b9f7b3961bb54fac8d57a26156e43aec`. Same **clean header** rule as NAV-01. Session: `12653398914178613375`.

- **`FRND-07` People (with sample data) — canonical:** **“FRND-07 People (list — v3)”** — `6e8f1c50c9c4465895b685f88abb8f9c`. Rebuilt from **People empty (Clean Header)** with **standard iOS-style list density** (e.g. ~44–48pt avatars, ~17pt names, ~56–60pt rows) — middle ground vs oversized/tiny passes; **no** separate header strip; full-width tab bar. Session: `7428079361130783461`. Prior attempts: `df0f342…` (tuned), `cb49b36…` (fixed), `e9e0321f…` — delete in Stitch if unused.

- **NOM-54 — Home feed (`FEED-01` only):** No separate **post detail** screen for now — all reading happens in the feed. Align visually with **`NAV-01` Feed (Clean Header)** (`84455a0623b04ee6aa439d0afeb5bae7`): **bright** full-bleed emerald (**#00875A / #006b47**), **no** separate darker header band — title and profile float on the **same** green as the feed. **Do not** default the canvas to near-black forest green (#001209); that reads as a different chrome than the shell.

  **Product — reactions (non-negotiable for prompts):** Read [content-and-moderation.md](../product/content-and-moderation.md) § Reactions. Friends **do not** see reaction counts, who reacted, or aggregates. They only get a react affordance and **self-state** (e.g. outlined vs filled heart). **Only the poster** sees who reacted; that is **not** shown as “likes” in the feed list.

  **Prompt — `FEED-01` Home feed (filled)**  
  *FEED-01 Home (filled). Match NAV-01 Clean Header: continuous **bright** emerald #00875A / #006b47 full viewport; “Home” + profile on same plane as feed — no darker header strip. Per post, **vertical order only**: (1) author row — avatar, name, time; (2) **photo carousel** — full-width swipeable multi-photo area with pagination dots **under** the images; (3) **caption paragraph below the carousel** — never overlaid on photos; (4) single react affordance (filled/outline heart). **No white card panels.** **No** counts or names on reactions. Three sample posts. Bottom tab bar matches shell.*

  **Prompt — `FEED-01` Loading**  
  *Same shell; skeleton placeholders on green — **no** white card-shaped panels; subtle mint/gray-green bars only.*

  **Prompt — `FEED-01` Empty**  
  *Same shell; empty state + “Find friends” inverse pill.*

  **Canonical frames (NOM-54):**

  | Screen | Stitch screen id | Session id |
  | ------ | ---------------- | ---------- |
  | **FEED-01 Home (filled)** — current (carousel + caption below) | `8ee302d4b9494bcfaaa606626c1cb636` | `1300973042713177189` |
  | **FEED-01 Home (loading)** | `44533363b8864fd4a9a1bc708ed7e8eb` | `13229400848542984050` |
  | **FEED-01 Home (empty)** | `3f5824e7a36f4b69b209ed58afe87da1` | `16123406971353446521` |

  **Superseded / not used:** earlier FEED-01 passes `c8ead7255e414cfb98aeffa1895e6e01`, `f9fc266b3a9d4e53957c52255353389e`, `54c1d819312d4d118810380144a72397` (caption-on-image / single photo). **Dropped — post detail not in scope:** experimental `FEED-02` frame `90dfd161703642a8832be1867f2cc041` — delete in Stitch if unused.

  *Note:* Stitch’s bundled design system may still attach dark `surface` tokens in metadata; **judge the PNG** against NAV-01 brightness. Tweak in Stitch until the canvas matches the shell reference.

- **NOM-55 — Create post (`POST-01`–`POST-04`, upload failure):** Composer flow from feed entry through media, caption, review/publish, plus **upload error** retry path. Align with **`NAV-01` / `FEED-01`**: bright full-bleed emerald (**#00875A / #006b47**), clean header (no darker band), inverse pills for primary actions. **`POST-05`** (dedicated success) deferred per [mvp.md](../../product/screens/mvp.md) — prefer toast or return to feed.

  **Prompt — `POST-01` Composer entry**  
  *POST-01 Composer entry — Nomi social iOS mobile vertical frame (~780×1688 logical). Match NAV-01 Feed Clean Header: full-bleed BRIGHT emerald #00875A / #006b47 — NOT dark forest green #001209; NO separate darker header band — “Home” title + profile avatar top; feed with sample posts. Bottom tab bar with Create emphasized; inverse pill “New post”. Frame title: “POST-01 Composer entry”.*

  **Wizard header (POST-02–POST-04):** One row on emerald: back chevron left; **single centered title** in white (~18pt semibold) — “New post” (picker + upload error), “Caption” (caption), “Review” (review). No extra header band, logos, or tabs.

  **Prompt — `POST-02` Pick media**  
  *POST-02 — clean header above; 3-column grid; 3 photos with order badges + reorder; “+” tile; “3 of 5”; bottom “Next” inverse pill.*

  **Prompt — `POST-03` Caption**  
  *POST-03 — same header; thumbnails row; **inline caption** — body text on emerald, no cream form card; placeholder / sample lines; quiet “0 / 280” corner; “Next” pill.*

  **Prompt — `POST-04` Review / publish**  
  *POST-04 — “Review”; carousel + caption; “Visible to friends”; “Edit” + “Publish”.*

  **Prompt — `POST-04` Upload failed**  
  *POST-04 — error banner; partial progress; Retry; Save draft / Cancel.*

  **Canonical frames (NOM-55):**

  | Screen | Stitch screen id | Session id |
  | ------ | ---------------- | ---------- |
  | **POST-01 Composer entry** | `c9d7fbd7ea4c43c7b2a77552eb033041` | `7463950028279651390` |
  | **POST-02 Pick media** | `57dea91f8b484fcab5dcbcece71dcc74` | `12628674047138994381` |
  | **POST-03 Caption (inline)** | `a0cadc4ddaf14e358f0a3f7655849e50` | `3470613539111573807` |
  | **POST-04 Review / publish** | `394fc084aeb54728a57b77d110729ca6` | `12628674047138994381` |
  | **POST-04 Upload failed** | `cbe4707a1eec4938b4534c5886093c38` | `12628674047138994381` |

  **Superseded (earlier NOM-55 passes):** `94c9c36a177a4188bf52e2af30941597`, `e586ff5089c64e8eac7b99078819d25b`, `5dfae4db2ac84eff928171441eb02890`, `93d117366c4f4a4c8bab22c6f5599370` — delete in Stitch if unused.

  *Note:* Judge PNGs against NAV-01 brightness; Stitch metadata may still list dark `surface` tokens.

- **Superseded:** NAV-01 **Super Green Refined** — `24267fcade634b8bb472f1f411b7451c` (distinct header strip). FRND-07 earlier — `250791c96c51471bbdefffb70f671843`. Older NAV-01 variants — `74f915e81…`, `990b18e1…`. Delete in Stitch UI if unused.

**Global rule:** Core app screens use **bold green canvas**, not light parchment — see [branding](../product/branding.md) and [decision 0001](decisions/0001-bold-green-canvas-all-core-screens.md).

Prior **Flat** auth ids: `2298bddc…`, `929c9158…`, `6ee43d83…`, `ecb9ffa6…`. Older duplicates can be removed in the Stitch UI — the Stitch MCP cannot delete frames. **`get_screen`** on the ids above confirms metadata if **`list_screens`** lags.

### Status (suggested values)

- **Draft** — exploratory or incomplete.
- **In review** — ready for feedback.
- **Baseline** — agreed reference for implementation for the scoped screens.
