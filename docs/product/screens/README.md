# Screens (planning)

**Where this lives**: All screen-level planning for **Nomi** lives under `**docs/product/screens/`** so product, design (e.g. Stitch), and implementation share one map. This is **not** the design system—see [branding](../branding.md) for voice and visual direction.

## Files


| File                         | Purpose                                                    |
| ---------------------------- | ---------------------------------------------------------- |
| [README.md](README.md)       | Conventions and how to use this folder (this page).        |
| [mvp.md](mvp.md)             | **MVP-only** screen scaffold (what to design/build first). |
| [inventory.md](inventory.md) | Full list of screens with stable IDs, grouped by flow.     |


## Conventions

- **Screen IDs**: `AREA-NN` (e.g. `AUTH-01`, `FEED-03`). Use the same ID in Figma/Stitch frame names, tickets, and tests when you add code.
- **States**: One logical “screen” can have **variants** (loading, empty, error); those are listed under **States / variants** in the inventory, not always as separate IDs—split IDs only when layout differs materially.
- **Navigation pattern**: Shell (tabs vs stack) is **TBD** until design; inventory notes **entry points** instead of assuming a tab bar.
- **Out of scope (v1)**: Admin/moderator consoles stay out of this folder unless you add a separate `admin/` doc later.

## Related docs

- Journeys: [personas-and-journeys](../personas-and-journeys.md)
- Posts and reactions: [content-and-moderation](../content-and-moderation.md)
- Graph and discovery: [discovery-and-graph](../discovery-and-graph.md)
- Verification: [phone-verification-spec](../phone-verification-spec.md)
- Brand: [branding](../branding.md)

