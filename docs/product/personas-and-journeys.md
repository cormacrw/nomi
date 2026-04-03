# Personas and journeys

## Primary persona: everyday user

Wants to share life updates with a small circle of people they know. Accepts phone verification as the cost of trust. Does not want to manage a public brand or large follower list.

## Core journeys

### 1. Sign up and verify phone

- User installs app or opens web client.
- Enters phone number; receives one-time code (or carrier-dependent verification where applicable).
- Account is **inactive or limited** until verification succeeds.
- **Edge cases**: wrong number, no SMS delivery, landline, VoIP policies — see [phone-verification-spec](phone-verification-spec.md).

### 2. Find someone by phone number

- User enters a contact’s phone number (normalized format — see [discovery-and-graph](discovery-and-graph.md)).
- System shows whether that number is registered (and optionally a minimal profile preview subject to privacy rules).
- User sends a **friend request** or equivalent.

### 3. Accept or decline friendship

- Recipient sees pending requests (from known numbers / in-app identity).
- Accept → relationship established per [discovery-and-graph](discovery-and-graph.md).
- Decline or ignore → no relationship; optional blocking.

### 4. Post and consume within the friend graph

- Author creates a **post**: up to **5 photos** and a **caption** (Instagram-like structure — see [content-and-moderation](content-and-moderation.md)).
- Friends see the post in feed; **reactions** are visible **only to the poster**, not to other viewers.
- Feed shows posts from accepted connections only (ordering and ranking TBD).

### 5. Safety and account hygiene

- Change phone number, lose device, report abuse — cross-link [content-and-moderation](content-and-moderation.md) and legal docs.

## Secondary personas (later)

- **Moderator / support**: handles abuse reports within policy.
- **Admin**: internal tooling (out of scope until stack exists).

## Screens

Journeys above map to concrete UI in **[screen inventory](screens/inventory.md)** (stable IDs for design and engineering).