# Design decision 0001: Bold green canvas for all core app screens

## Status

Accepted

## Context

Generated UI (e.g. Stitch) and some “familiar mobile app” patterns default to a **light neutral content area** (parchment / off-white) after sign-in, with green reserved for buttons only. That **breaks continuity** with Nomi’s verification flow, which uses a **full-bleed bold emerald** surface, and weakens the **green-first** brand direction in [branding](../../product/branding.md).

## Decision

**All core in-app surfaces** (shell, feed, friends, composer, profile roots, and primary settings list views unless a specific exception is approved) use the **same bold saturated emerald treatment** as auth: **full-bleed green canvas** (~`#00875A` / `#006b47` class), **not** a light gray or parchment default page background.

- **Text** on green: white / warm off-white; secondary copy via opacity, not a switch to dark-on-gray page chrome.
- **Primary CTAs** on green often use **inverse pills** (white/cream fill, dark green text) for parity with AUTH screens.
- **Light neutrals** are allowed for **small elevated elements** where needed (e.g. input fields, cards, sheets)—not as the default “app skin.”
- **Destructive / warning** UI still uses non-green semantics when required for clarity.

Design tools and prompts must state this explicitly so generators do not revert to a “light app shell.”

### Navigation chrome (`NAV-01` shell)

On **tab root** screens, **do not** place profile, settings, or other **actions in the top app bar**. The header is **context only** (e.g. centered screen title). **Primary navigation** (Feed / People / Create / You) lives in the **bottom tab bar** so behavior stays predictable and matches a single standard frame layout.

## Links

- [branding](../../product/branding.md) — global surface rule
- [stitch-projects](../stitch-projects.md) — project registry and frame ids
- [inventory](../../product/screens/inventory.md) — `NAV-01`, flows
