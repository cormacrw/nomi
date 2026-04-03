# Stitch projects registry

One row per Stitch workspace or project. Add a row when you create a new project; keep **Scope** aligned with [screen IDs](../product/screens/inventory.md).

| Project name | Link or ID | Scope (flows / screen IDs) | Status | Owner | Last updated |
| ------------ | ---------- | -------------------------- | ------ | ----- | ------------ |
| Nomi — Auth MVP | `18104376503220593266` (Stitch project id; open in Google Stitch) | `AUTH-01`–`AUTH-04`; **Consistent Header** — unified top bar (padding, height, centered titles; back left where present); **Flat** (no drop shadows); **780×1688** logical (1560×3376 @2×), no scroll | In review | — | 2026-04-03 |
| *(example)* Nomi — MVP shell | `https://…` or internal id | MVP frames per [mvp.md](../product/screens/mvp.md); e.g. `AUTH-*`, `FEED-*` | Draft | — | — |

**Nomi — Auth MVP — canonical frames:** Prefer the four screens titled **“(Consistent Header)”** — unified size **1560×3376**. Screen id suffixes: `aa6a979a38e74dda9ffb258b3d312750` (AUTH-01 Welcome), `b0ea02f0dddc4dc1b6f992c3e5aff475` (AUTH-02 Phone), `31803516f521402c86b441b8faa4835c` (AUTH-03 OTP), `0d5c14e40ac94b618b5ca40b27f6c533` (AUTH-04 Success). Session: `8824432112178061346`. Prior **Flat** ids: `2298bddc…`, `929c9158…`, `6ee43d83…`, `ecb9ffa6…`. Older duplicates can be removed in the Stitch UI — the Stitch MCP cannot delete frames. **`get_screen`** on the ids above confirms metadata if **`list_screens`** lags.

### Status (suggested values)

- **Draft** — exploratory or incomplete.
- **In review** — ready for feedback.
- **Baseline** — agreed reference for implementation for the scoped screens.
