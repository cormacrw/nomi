# Technical constraints

Hard or soft constraints that narrow stack choices. Update as the project commits to platforms and vendors.

## Product-driven

- **Phone verification** implies SMS or voice-capable providers; regional availability and cost vary by country.
- **Privacy**: phone numbers and message metadata are sensitive; minimize retention and access (see [../legal-privacy/](../legal-privacy/)).

## Delivery (TBD)

- Mobile-first vs web-first vs both — decide before major client stack choices.
- Target regions for launch (affects SMS, language, compliance).

## Operational

- Solo or small team: prefer managed services where they reduce toil, unless cost forbids.
- Monorepo: application code will live under `apps/` and `packages/` at repo root.

## Non-constraints (until decided)

- Specific cloud provider, database, or framework — captured in [options](options.md) and [decisions/](decisions/).