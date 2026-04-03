# Implementation phases

High-level sequencing. Adjust dates and scope when execution starts.

## Phase 0 — Documentation and compliance groundwork

- Finalize product specs under `docs/product/` and legal/privacy stubs.
- Choose initial launch regions and phone verification approach (stack ADRs).

## Phase 1 — Identity and graph MVP

- Phone verification end-to-end.
- Account creation, session handling.
- Friend discovery by phone number and friend request lifecycle.
- Minimal profile (subject to privacy doc).

## Phase 2 — Core social features

- Posts visible to friends: **up to 5 photos + caption** per post; **simple reactions** with **poster-only visibility** (see [../product/content-and-moderation.md](../product/content-and-moderation.md)).
- Feed for connected users.
- Blocking and basic reporting hooks.

## Phase 3 — Hardening and scale

- Moderation workflows, rate limits, abuse prevention.
- Performance, observability, backups.
- App store / policy review readiness.

Later phases (notifications, media, groups, etc.) — add when product scope expands.
