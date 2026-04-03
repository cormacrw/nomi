# Discovery and social graph

**Canonical product contract** for how users find each other and what “friendship” means.

## Discovery

- **Primary discovery**: search or add by **phone number** (canonical format aligned with [phone-verification-spec](phone-verification-spec.md)).
- **No global username directory** at launch unless explicitly added later; if handles exist, they are secondary and do not replace phone-based trust boundaries.
- Optional future additions (must be documented when introduced): contact matching, invite links, QR — each must preserve the “people you know” intent.

## Friend request semantics

- Define whether relationships are **mutual only** (recommended for “friends”) or if asymmetric follows are allowed.
- States: none, pending (outbound/inbound), connected, blocked.
- **Blocking**: blocked users cannot see each other’s presence or content; block list is private.

## Visibility

- Default assumption: content is visible only to **accepted connections** unless product adds private groups or lists later.
- **Post shape and reaction visibility** (photos + caption, poster-only reactions): [content-and-moderation](content-and-moderation.md).

## Search privacy

- Reveal of “this number is on the service” vs silent lookup is a **product decision** with privacy tradeoffs; document the chosen behavior here when decided.