# ADR 0002: Phase 1 stack — Supabase and web client

## Status

Accepted

## Context

Nomi needs a concrete stack for Phase 1 ([phases](../../implementation/phases.md)): phone verification, accounts, friend graph, minimal profile. Product hypothesis: **Supabase** for backend/auth/data and a **web app** first, with room to add native shells later. See [constraints](../constraints.md) and brainstorm [options](../options.md).

Forces:

- Phone OTP and SMS-capable providers with regional pricing variance
- Postgres-friendly relational graph and RLS for privacy boundaries
- Photo storage path aligned with upcoming posts (up to five photos per post)
- Solo/small team — prefer managed services where they reduce toil

## Decision

**Adopt Phase 1 on Supabase plus a web client**, and record a **go** for the Supabase + web hypothesis for this phase.

- **Platform**: **Supabase** (managed Postgres, Auth, Storage, optional Realtime) as the primary backend and data plane.
- **Client**: Ship a **web application** first (SPA or SSR-capable framework — exact framework is a follow-up choice under this ADR). Plan for **future native shells** (e.g. React Native or hybrid wrappers) consuming the same Supabase project and APIs; avoid web-only assumptions that cannot translate to mobile later.
- **Phone verification**: **Supabase Auth** phone/OTP, with an **SMS provider** configured in the Supabase project (see callouts below).
- **Media**: **Supabase Storage** for user-generated photos with bucket policies aligned to **RLS**; signed URLs for delivery.
- **Realtime**: Use **Supabase Realtime** when it clearly reduces complexity. For **feed and graph reads**, prefer **request/response** with **short polling or cache invalidation** initially unless latency requirements force Realtime earlier — revisit during implementation.

## Alternatives considered

| Option | Why not Phase 1 default |
|--------|-------------------------|
| **Firebase / Firestore** | Strong mobile SDKs; weaker fit for a SQL-first graph and portable RLS patterns in Postgres. |
| **Custom API (Node/Go) + managed Postgres** | Full control; higher auth/session and ops burden for a small team. Revisit if Supabase limits block. |
| **Separate auth vendor (e.g. Clerk) + custom DB** | Extra overlap with Supabase Auth for a phone-first product; consolidate on one auth plane first. |
| **Native-first client** | Higher cost before validating web plus Supabase; conflicts with the stated web-first bet. |

## Callouts — vendors and operations

### Verification / SMS

Supabase Auth supports phone OTP; configure an **SMS provider** in the Supabase project. Common integrations include **Twilio**, **MessageBird**, and **Vonage** (confirm current supported providers in Supabase documentation). **Practical default**: start with **Twilio** for documentation depth and broad region coverage, then **compare per-region SMS rates** against MessageBird/Vonage before launch countries are fixed. If the product requires voice fallback, evaluate whether the chosen provider supports it and align with [phone verification spec](../../product/phone-verification-spec.md).

### File uploads

**Supabase Storage** with least-privilege bucket policies; uploads via client or server SDKs with **RLS**, **content-type checks**, and **size limits**. Virus scanning and async moderation pipelines are hardening steps for later phases ([content and moderation](../../product/content-and-moderation.md)).

### Realtime

**Supabase Realtime** for targeted channels (e.g. notifications) when warranted. Avoid wiring the entire graph through Realtime on day one unless product proof requires it.

### Cost and operations

- **Supabase**: development on free/low tiers; monitor **database size**, **Auth MAU**, **Storage**, **egress**, and **Realtime** as load grows. Enable **backups** and consider **PITR** before production user data at scale.
- **SMS**: **per-OTP cost** varies by country — budget using the selected provider’s pricing for target regions.
- **Web hosting**: static or edge hosting for SPAs, or managed SSR — pick with the framework; keep CI/CD straightforward.

## Go / no-go

**Go** for **Supabase + web** for Phase 1, provided:

- Target regions and **SMS pricing** remain acceptable after a **pricing pass** before production.
- A short **spike** (phone OTP + Storage + RLS in a dev project) does not surface a blocking Supabase limitation.

If a blocker appears, **supersede** this ADR with a new one rather than drifting without a record.

## Consequences

- **Positive**: One primary vendor for auth, database, and storage APIs; Postgres and RLS; web-first delivery; a clear path for native clients against the same backend.
- **Negative**: Vendor concentration; must monitor platform limits and SMS spend as usage grows.
- **Follow-up**: Choose web framework and `apps/` layout; add Supabase project bootstrap and environment handling; lock **launch regions** in [constraints](../constraints.md) when known.

## Links

- Related ADRs: [0001](0001-record-architecture-decisions.md)
- Related product docs: [phases](../../implementation/phases.md), [phone verification](../../product/phone-verification-spec.md)
