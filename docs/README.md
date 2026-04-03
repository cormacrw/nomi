# Documentation index

Canonical planning specs for **Nomi** (working name). Implementation code will live under `apps/` and `packages/` when the project moves past documentation.

## Suggested reading order

1. **[Product vision](product/vision.md)** — north star, audience, principles, differentiation vs incumbent social, non-goals.
2. **[Branding](product/branding.md)** — voice, visual territory, anti-patterns, copy-paste context for design tools (e.g. Stitch).
3. **[Personas and journeys](product/personas-and-journeys.md)** — signup, friend flow, posting.
4. **[Phone verification spec](product/phone-verification-spec.md)** — mandatory verification and number lifecycle (**product contract**).
5. **[Discovery and graph](product/discovery-and-graph.md)** — find-by-phone and friendship rules (**product contract**).
6. **[Content and moderation](product/content-and-moderation.md)** — posts (up to 5 photos + caption), poster-only reactions, safety and reporting.
7. **[Screens](product/screens/)** — [MVP scaffold](product/screens/mvp.md) first; full [inventory](product/screens/inventory.md); conventions in `screens/README.md`.
8. **[Design](design/)** — Stitch project registry and design decision log.
9. **[Requirements](product/requirements.md)** — numbered requirements (draft).
10. **[Stack constraints](stack/constraints.md)** — hard/soft technical boundaries.
11. **[Stack options](stack/options.md)** — brainstorm before ADRs.
12. **[Architecture decisions](stack/decisions/)** — ADRs (`0000` template, `0001` process).
13. **[Phases](implementation/phases.md)** → **[Milestones](implementation/milestones.md)** → **[Risks and open questions](implementation/risks-and-open-questions.md)**.
14. **[Legal / privacy](legal-privacy/)** — data handling and third parties (draft).

## Map of folders


| Folder                             | Purpose                                                                                                                 |
| ---------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| [product/](product/)               | What we build: vision, branding, journeys, verification, graph, moderation, [screens/](product/screens/), requirements. |
| [design/](design/)               | Mockup workflow: [Stitch registry](design/stitch-projects.md), [design decisions](design/decisions/) (UX/visual; distinct from stack ADRs). |
| [stack/](stack/)                   | How we might build it: constraints, options, [decisions/](stack/decisions/) (ADRs).                                     |
| [implementation/](implementation/) | Phasing, milestones, risks.                                                                                             |
| [legal-privacy/](legal-privacy/)   | PII/phone/sms and vendor tracking (draft).                                                                              |


## Glossary


| Term                      | Meaning                                                                                                              |
| ------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| **Nomi**                  | Working product name; see [vision](product/vision.md) and [branding](product/branding.md).                           |
| **E.164**                 | International phone number format (e.g. +15551234567); typical canonical storage format.                             |
| **ADR**                   | Architecture Decision Record; see [stack/decisions/](stack/decisions/).                                              |
| **Friend graph**          | Relationships between users (pending, connected, blocked) per [discovery-and-graph](product/discovery-and-graph.md). |
| **OTP**                   | One-time passcode, often delivered by SMS or voice for verification.                                                 |
| **Poster-only reactions** | Friends can react; only the author sees who reacted — [content-and-moderation](product/content-and-moderation.md).   |


## Cursor agents

Optional `[.cursor/rules/](../.cursor/rules/)` files can reference paths under `docs/` so implementation follows these specs.