# Risks and open questions

## Phone number lifecycle

- **Recycling**: Carriers reassign numbers; a new owner might receive someone else’s account recovery or friend lookups. Mitigations: re-verification, grace periods, support process — decide in product + stack.
- **SIM swap**: Attacker porting a number could take over SMS OTP. Consider step-up auth for sensitive actions.

## Cost and operations

- **SMS cost** scales with signups and resends; budget and per-region pricing matter.
- **Deliverability**: some regions or carriers have poor SMS reliability; fallback channels may be needed.

## Platform policy

- App store rules for social apps, age gating, and moderation — align [content-and-moderation](../product/content-and-moderation.md) before launch.
- **VoIP / virtual numbers**: fraud risk vs excluding legitimate users.

## Product ambiguity (resolve in `docs/product/`)

- Mutual-only vs asymmetric relationships.
- Whether contact-upload matching is in scope and how consent is obtained.
- Default visibility of “this number is registered” on lookup.

## Technical unknowns

- Real-time vs polling for feed and requests — decide with stack.
- Data residency if operating in multiple jurisdictions.
