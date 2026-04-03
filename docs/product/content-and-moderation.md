# Content and moderation

Conceptual policy layer for posts, reactions, and safety. Exact tooling and workflows come with implementation.

**Related**: friend-level visibility of posts is tied to the graph in [discovery-and-graph](discovery-and-graph.md).

---

## Posts (Instagram-like)

### Shape

- A **post** consists of:
  - **Up to 5 photos** per post (user can publish fewer).
  - **One caption** (text) accompanying the set.
- Ordering of photos is **author-defined** (carousel / gallery order). UX matches familiar patterns (e.g. swipe or grid) — **TBD in design**; this doc defines capacity and structure only.

### Audience

- Posts are visible to **accepted friends** (default), unless the product later adds lists or subsets — see [discovery-and-graph](discovery-and-graph.md).

### What viewers see vs the poster

- **Everyone who can see the post** sees the photos and caption.
- **Reactions** are special: see [Reactions](#reactions) below.

---

## Reactions

### Behavior

- Friends can add a **simple reaction** to a post (e.g. a small fixed set—heart, thumbs up, laugh — **exact set TBD**; keep it minimal).
- **Only the poster (author) can see reactions** — who reacted and with what, and any aggregate or list UI for that is **author-only**.
- **Other viewers** (other friends who can see the post) **do not** see:
  - reaction counts,
  - who reacted,
  - or any reaction affordance that reveals others’ reactions (unless we explicitly add a “react” control that does not leak others’ data — see below).

### Reacting without leaking

- A viewer who has not posted may still **add their own reaction** if the product exposes a react action to them; they do not learn whether anyone else reacted. Their own action is only visible to the **poster**.
- **Poster** sees the full picture: e.g. per-friend reactions or a summarized list — **presentation TBD**, privacy rule is fixed: **poster-only visibility for reaction data**.

### Rationale (product)

- Reduces performative “social proof” on the feed (no public like counts).
- Keeps feedback intimate: feedback goes to the author, not the crowd.

---

## Allowed content

- Define categories aligned with app store policies and regional law (high level in this doc; legal review later).
- **Non-goals**: illegal content, harassment, non-consensual imagery, etc. — reference external standards and internal zero-tolerance where applicable.

## Reporting

- Users can report posts or accounts.
- Reports produce a queue for review (human and/or automated — TBD in stack).

## Enforcement

- Actions: warning, content removal, temporary suspension, permanent ban.
- **Rate limits**: posting and inviting to reduce spam (details in implementation).

## Appeals

- Whether appeals exist and SLA — TBD.