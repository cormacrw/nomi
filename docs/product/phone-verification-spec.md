# Phone verification specification

**Canonical product contract** for identity tied to a phone number. Implementation details belong in stack/ADRs once chosen; this doc defines **what must be true** for the product.

## Requirements

1. **Every active account** must have a verified phone number before full use of the product (friend graph, posting, etc.). Define “active” and grace periods if needed.
2. **One primary number per account** at a time unless product explicitly allows multiple verified devices (TBD).
3. **Re-verification** may be required when risk signals appear (new device, SIM change, suspicious login) — policy TBD.

## Verification methods

- Document intended options (e.g. SMS OTP, voice OTP, flash call, app-based attestation). Final choice is a **stack decision**; this file should list **acceptable** and **excluded** methods once decided.
- **VoIP and burner numbers**: define whether restricted or allowed and how.

## Number format and normalization

- Store and compare numbers in a **canonical form** (typically E.164). Document allowed country coverage at launch.
- UX: country picker, validation, and error copy for invalid numbers.

## Change of number

- Flow when user gets a new phone number: verify new number, migrate account, invalidate old bindings.
- **Recycling**: previous owner’s number reassigned by carrier — see [../implementation/risks-and-open-questions.md](../implementation/risks-and-open-questions.md).

## Abuse and rate limits

- Per-number and per-IP limits on send attempts (conceptual; numbers set in implementation).
- Cooldown after repeated failures; possible lockout.

## Compliance note

SMS and phone data are sensitive; align with [../legal-privacy/data-handling-principles.md](../legal-privacy/data-handling-principles.md).