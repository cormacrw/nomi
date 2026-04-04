# Technical constraints

Hard or soft constraints that narrow stack choices. Update as the project commits to platforms and vendors.

## Product-driven

- **Phone verification** implies SMS or voice-capable providers; regional availability and cost vary by country.
- **Privacy**: phone numbers and message metadata are sensitive; minimize retention and access (see [../legal-privacy/](../legal-privacy/)).

## Delivery

- **Phase 1**: **Web app first** on **Supabase** — see [ADR 0002](decisions/0002-phase-1-stack-supabase-and-web.md). Native clients are out of scope for Phase 1 delivery order; plan later shells against the same backend.
- **Target regions for launch** (affects SMS, language, compliance) — still TBD; update here when chosen.

## Operational

- Solo or small team: prefer managed services where they reduce toil, unless cost forbids.
- Monorepo: application code will live under `apps/` and `packages/` at repo root.

## Non-constraints (until decided)

- Specific cloud provider, database, or framework — captured in [options](options.md) and [decisions/](decisions/).