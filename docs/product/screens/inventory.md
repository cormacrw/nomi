# Screen inventory

Stable IDs for Nomi. **States / variants** cover loading, empty, and error unless a separate ID is listed.

**Legend**: Entry = typical way user reaches the screen. **TBD** = product or design not locked.

---

## Shell and navigation (TBD)


| ID       | Screen             | Purpose                                                            | Entry           | Notes                                                      |
| -------- | ------------------ | ------------------------------------------------------------------ | --------------- | ---------------------------------------------------------- |
| `NAV-01` | App shell          | Root layout after sign-in (tabs, header, safe area).               | Successful auth | Tab set TBD: e.g. Feed                                     |
| `NAV-02` | Modal / sheet host | Shared container for sheets (report, block confirm, react picker). | Various         | Implementation detail; may not be a “screen” in analytics. |


---

## Onboarding and authentication


| ID        | Screen                    | Purpose                                                           | States / variants                                  | Spec refs                                                |
| --------- | ------------------------- | ----------------------------------------------------------------- | -------------------------------------------------- | -------------------------------------------------------- |
| `AUTH-01` | Welcome                   | First launch value prop; path to sign up / log in.                | —                                                  | [vision](../vision.md)                                   |
| `AUTH-02` | Phone entry               | Collect phone number (country + local); validate format.          | Inline validation error; rate-limit message        | [phone-verification-spec](../phone-verification-spec.md) |
| `AUTH-03` | OTP / verify code         | Enter one-time code (or alternate verification UI).               | Wrong code; resend cooldown; SMS not received help | [phone-verification-spec](../phone-verification-spec.md) |
| `AUTH-04` | Verification success      | Confirms account ready; routes to main app or profile completion. | —                                                  |                                                          |
| `AUTH-05` | Log in (returning user)   | If distinct from sign-up: phone + OTP for existing account.       | Same variants as `AUTH-02`–`AUTH-03`               |                                                          |
| `AUTH-06` | Session expired / re-auth | Step-up verification when session invalid or risky.               | —                                                  | TBD in stack                                             |


---

## Friends: discovery and graph


| ID        | Screen                       | Purpose                                                   | States / variants                        | Spec refs                                            |
| --------- | ---------------------------- | --------------------------------------------------------- | ---------------------------------------- | ---------------------------------------------------- |
| `FRND-01` | Add friend — phone entry     | Enter number to find a user (normalized).                 | Invalid number                           | [discovery-and-graph](../discovery-and-graph.md)     |
| `FRND-02` | Lookup result — found        | Shows minimal preview; action to send friend request.     | Already friends; request already pending | [discovery-and-graph](../discovery-and-graph.md)     |
| `FRND-03` | Lookup result — not found    | Number not registered; optional invite/share later (TBD). | —                                        |                                                      |
| `FRND-04` | Incoming requests list       | List of pending inbound friend requests.                  | Empty                                    | [personas-and-journeys](../personas-and-journeys.md) |
| `FRND-05` | Incoming request detail      | Accept / decline one request; optional block.             | —                                        |                                                      |
| `FRND-06` | Outgoing requests (optional) | List of pending outbound requests; cancel TBD.            | Empty                                    |                                                      |
| `FRND-07` | Friends list                 | All accepted connections (for browse or management).      | Empty                                    |                                                      |


---

## Feed and posts


| ID        | Screen                            | Purpose                                                                                   | States / variants                      | Spec refs                                              |
| --------- | --------------------------------- | ----------------------------------------------------------------------------------------- | -------------------------------------- | ------------------------------------------------------ |
| `FEED-01` | Home feed                         | Scrollable list of friends’ posts (ordering TBD).                                         | Loading; empty (no friends / no posts) | [content-and-moderation](../content-and-moderation.md) |
| `FEED-02` | Post detail                       | Full-screen or expanded post (carousel of up to 5 photos + caption).                      | —                                      | Same doc                                               |
| `FEED-03` | Post — friend reaction affordance | Friend can open **reaction picker** or tap react; **no** visibility of others’ reactions. | Already reacted (self-state only)      | Poster-only reactions                                  |
| `FEED-04` | Post — author reaction summary    | **Author only**: who reacted with what (list or summary).                                 | Empty reactions                        | Poster-only reactions                                  |


*Note*: `FEED-03` and `FEED-04` may be **sections or modes** on `FEED-01`/`FEED-02` rather than standalone routes—IDs stay for traceability.*

---

## Create post


| ID        | Screen           | Purpose                                                   | States / variants        | Spec refs                                              |
| --------- | ---------------- | --------------------------------------------------------- | ------------------------ | ------------------------------------------------------ |
| `POST-01` | Composer entry   | Start new post (big primary CTA).                         | —                        | [content-and-moderation](../content-and-moderation.md) |
| `POST-02` | Pick media       | Select up to **5** photos; reorder; remove.               | 0 photos; max 5 reached  |                                                        |
| `POST-03` | Caption          | Enter caption; shows thumbnail strip or carousel preview. | Over character limit TBD |                                                        |
| `POST-04` | Review / publish | Confirm photos + caption; publish.                        | Upload/progress failure  |                                                        |
| `POST-05` | Publish success  | Optional toast or return to feed with new post.           | —                        |                                                        |


---

## Profile


| ID        | Screen                     | Purpose                                                                       | States / variants           | Spec refs |
| --------- | -------------------------- | ----------------------------------------------------------------------------- | --------------------------- | --------- |
| `PROF-01` | My profile                 | Current user summary; entry to settings; optional posts grid later.           | —                           |           |
| `PROF-02` | Friend profile             | View friend’s minimal profile; actions: remove friend, block (TBD placement). | Blocked state if applicable |           |
| `PROF-03` | Edit profile (optional v1) | Display name, photo—only if in scope.                                         | —                           | TBD       |


---

## Safety and moderation


| ID        | Screen             | Purpose                                      | States / variants | Spec refs                                              |
| --------- | ------------------ | -------------------------------------------- | ----------------- | ------------------------------------------------------ |
| `SAFE-01` | Report post        | Reason selection + optional details; submit. | Success thanks    | [content-and-moderation](../content-and-moderation.md) |
| `SAFE-02` | Report user        | Same pattern for account-level report.       | —                 |                                                        |
| `SAFE-03` | Block confirmation | Confirm block user; consequence copy.        | —                 | [discovery-and-graph](../discovery-and-graph.md)       |
| `SAFE-04` | Blocked users list | Manage blocked accounts; unblock.            | Empty             |                                                        |


---

## Settings and account


| ID       | Screen           | Purpose                                                                       | States / variants    | Spec refs                                                |
| -------- | ---------------- | ----------------------------------------------------------------------------- | -------------------- | -------------------------------------------------------- |
| `SET-01` | Settings root    | Sections: account, privacy, notifications, support, sign out.                 | —                    |                                                          |
| `SET-02` | Account / phone  | View verified number; change number flow (multi-step—may span extra screens). | Pending verification | [phone-verification-spec](../phone-verification-spec.md) |
| `SET-03` | Notifications    | Toggle types if push exists in v1.                                            | —                    | TBD                                                      |
| `SET-04` | Sign out confirm | Confirm log out.                                                              | —                    |                                                          |


---

## System and errors


| ID       | Screen                 | Purpose                            | States / variants | Spec refs |
| -------- | ---------------------- | ---------------------------------- | ----------------- | --------- |
| `SYS-01` | Generic error          | Recoverable failure with retry.    | —                 |           |
| `SYS-02` | Offline / no network   | Feed or actions unavailable.       | —                 |           |
| `SYS-03` | Maintenance (optional) | Global banner or screen if needed. | —                 |           |


---

## Coverage checklist (for design)

Use this when building **Figma** frames — canonical file and tooling: Linear [NOM-11](https://linear.app/cormacw/issue/NOM-11/create-nomi-mvp-figma-file-structure-design-library); one issue per screen ID as children of the area epics ([NOM-2](https://linear.app/cormacw/issue/NOM-2/design-profile-prof)–[NOM-10](https://linear.app/cormacw/issue/NOM-10/design-create-post-post)):

- `AUTH-01`–`AUTH-04` (plus `AUTH-05` if login separate)
- `FRND-01`–`FRND-05` (plus `FRND-06`–`FRND-07` if in v1)
- `FEED-01`–`FEED-04` (merge visually if same frame with modes)
- `POST-01`–`POST-05`
- `PROF-01`–`PROF-02` (+ `PROF-03` if edit in v1)
- `SAFE-01`–`SAFE-04`
- `SET-01`–`SET-04`
- `SYS-01`–`SYS-02`
- `NAV-01` once tab/stack decided

---

## Open decisions (drive new rows or variants)

- **Tab bar vs stack**: affects `NAV-01` and entry points only; inventory IDs stay valid.
- **Single “Feed + compose” vs separate “Create” tab**: `POST-01` entry changes, not the composer steps.
- **Post detail**: separate route (`FEED-02`) vs inline expansion—same content spec.
- **Invite non-users**: if `FRND-03` grows an invite flow, add `FRND-08` etc.