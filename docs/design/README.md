# Design (mockups and decisions)

This folder holds **design-process** artifacts for **Nomi**: which **Google Stitch** projects cover which flows, and **decisions made while iterating mockups** (UX, layout, visual choices).

It does **not** replace product specs:

- **Screen IDs, MVP scope, and flows** — source of truth: [docs/product/screens/](../product/screens/) ([inventory](../product/screens/inventory.md), [MVP](../product/screens/mvp.md)).
- **Brand voice and visual territory** — [docs/product/branding.md](../product/branding.md).
- **Technical architecture** — [docs/stack/decisions/](../stack/decisions/) (ADRs). When a design choice implies a durable engineering commitment (e.g. data model, APIs), capture it there or link from a design decision to a new ADR.

## Contents


| Resource                                 | Purpose                                                                                                                                |
| ---------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| [stitch-projects.md](stitch-projects.md) | Registry of Stitch projects: links, scope (screen IDs / flows), status, owner.                                                         |
| [decisions/](decisions/)                 | Numbered design decision records; start from [decisions/0000-design-decision-template.md](decisions/0000-design-decision-template.md). **0001** — [bold green canvas for all core screens](decisions/0001-bold-green-canvas-all-core-screens.md) (do not default to light “app shell”). |


## Naming in Stitch

- Use the same **screen IDs** as in the inventory (`AUTH-01`, `FEED-03`, etc.) in frame names so tickets, tests, and docs stay aligned.
- Reference **flows** by area or ID ranges in the Stitch registry (e.g. onboarding → `AUTH-`*, `VERIFY-*`) rather than duplicating the full screen list here.

## Related docs

- Screens: [docs/product/screens/README.md](../product/screens/README.md)
- Branding (prompts and tool context): [docs/product/branding.md](../product/branding.md)