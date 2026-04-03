# Product vision

**Product name (working): Nomi** — short, human; may change before launch.

## One-line north star

**A small, trusted social layer for people who already know each other in real life—discovered and connected through verified phone numbers, not open networks or algorithms.**

---

## Problem

Mainstream social products optimize for growth: public profiles, open discovery, follower graphs, and feeds tuned for engagement. That model works for creators and scale, but it creates noise, performative posting, and connections that do not match how people actually trust each other day to day.

Many people still want to share life updates, photos, and moments with a **defined circle they could name offline**. They do not need a global audience; they need **confidence that the other person is who they say they are** and that the graph stays small and intentional.

## Who this is for

- People who want a **private social space** without building a “brand” or public handle.
- Groups who already coordinate in real life (friends, family, teams) and want a shared feed **without** random adds or viral discovery.
- Anyone who finds **phone number** a reasonable proxy for “I know this person in context” (with the understanding that phone ownership can change—operational detail lives in other specs).

## Product idea

We are building a social app where **friendship is tied to people you actually know**, enforced by design:

1. **Every account is anchored to a verified phone number** so identity is grounded in something harder to mass-fake than an email or username alone.
2. **You find others by phone number** (exact match, normalized format)—not by browsing a public directory of strangers or by interest-based discovery at launch.
3. **The social graph is meant to stay small and mutual** relative to open social: connections reflect real-world acquaintance, not follower counts or broadcast reach.

The product is intentionally **not** a place to meet new people at scale. Growth comes from **inviting people you already have a reason to connect with**, not from algorithmic surfacing.

## Principles

- **Trust over reach**: Prefer fewer, stronger connections over maximizing impressions.
- **Explicit over implicit**: Adding someone requires knowing how to reach them (their number), not stumbling across them in a feed.
- **Privacy by structure**: No global username directory at launch; discovery rules are documented in [discovery-and-graph](discovery-and-graph.md).
- **Honest identity**: Phone verification is the baseline contract; details live in [phone-verification-spec](phone-verification-spec.md).

## Differentiation


| Incumbent pattern                         | Our direction                                                                                       |
| ----------------------------------------- | --------------------------------------------------------------------------------------------------- |
| Open discovery, trending, suggested users | Discovery by **phone number** first; no public people directory at launch                           |
| Follower/following counts as status       | **Graph** oriented around mutual acquaintance, not audience size                                    |
| Pseudonymous or optional identity         | **Verified phone** required for a real account                                                      |
| Engagement-optimized feeds                | Feed among **friends**; ranking philosophy is a later product choice, not growth hacking by default |


## What success looks like (early, qualitative)

- Users report that their network **feels like people they know**, not a feed of strangers.
- Low-friction posting among friends **without** pressure to perform for an algorithm.
- Verification and add-by-number flows are **understandable**; support burden for “who is this person?” stays bounded.

Concrete metrics (DAU, retention, invite rates) belong in a later product metrics doc once the stack exists.

## Non-goals (initial)

- Open discovery by interest, location, or trending topics.
- Anonymous or pseudonymous-first identity (phone-verified identity is the default contract).
- Creator monetization, tipping, or **algorithmic “For You”** feeds tuned for viral scale.
- Replacing SMS or chat apps for all messaging—unless we explicitly expand scope later.

## Relationship to other docs

- **Brand and voice** (for design and copy): [branding](branding.md).
- **Operational contracts** (how verification works, how search behaves): [phone-verification-spec](phone-verification-spec.md), [discovery-and-graph](discovery-and-graph.md).
- **Journeys and flows**: [personas-and-journeys](personas-and-journeys.md).
- **Traceable requirements**: [requirements](requirements.md).

## Open product decisions

These stay in vision as reminders; resolution belongs in the linked specs or ADRs.

- Mutual friendship only vs allowing one-way following for visibility.
- Whether **contacts upload**, **invite links**, or **QR** complement strict phone search—only if they preserve the “people you know” bar.
- Regional launch (SMS cost, regulations)—see [phone-verification-spec](phone-verification-spec.md) and [../legal-privacy/data-handling-principles.md](../legal-privacy/data-handling-principles.md).