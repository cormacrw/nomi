# Milestones

Outcomes per phase (documentation-level; not project tickets). Check off when true.

## Phase 0

- [ ] `phone-verification-spec.md` and `discovery-and-graph.md` reviewed and treated as stable enough to implement.
- [ ] Initial ADRs for monorepo tooling and SMS/auth provider **Accepted** or explicitly **Proposed** with owner.
- [ ] `legal-privacy` stubs reviewed for gaps before collecting real user data.

## Phase 1

- [ ] A user can verify a phone number and create an account.
- [ ] A user can find another user by phone number (per privacy rules) and complete a friend request flow.
- [ ] No public username directory required for core flow.

## Phase 2

- [ ] Authenticated users can publish posts to friends: **up to 5 photos + caption** ([content-and-moderation](../product/content-and-moderation.md)).
- [ ] Friends can add **simple reactions**; **only the poster** sees reaction detail; other viewers do not see others’ reactions.
- [ ] Friends see each other’s posts in a feed (exact ordering documented in product later).
- [ ] Block and report paths exist (even if manual admin at first).

## Phase 3

- [ ] Operational runbooks or equivalent for incidents and data requests (scale with team).
- [ ] Monitoring and alerts for core APIs and verification pipeline.
