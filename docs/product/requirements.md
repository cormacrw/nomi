# Functional requirements (draft)

Numbered requirements for traceability into future implementation and tests. Status values: draft, agreed, implemented.


| ID  | Requirement                                                                  | Notes                                                                                      |
| --- | ---------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| R1  | Every user must verify a phone number before using core features.            | See [phone-verification-spec](phone-verification-spec.md)                                  |
| R2  | Users can discover other registered users by entering a phone number.        | See [discovery-and-graph](discovery-and-graph.md)                                          |
| R3  | Users can send and respond to friend requests within the rules of the graph. |                                                                                            |
| R4  | Users can create posts visible to their accepted connections (default).      | Post shape: up to 5 photos + caption — [content-and-moderation](content-and-moderation.md) |
| R5  | Users can block other users.                                                 |                                                                                            |
| R6  | Users can report content or accounts for moderation.                         | See [content-and-moderation](content-and-moderation.md)                                    |
| R7  | A post consists of at most five images and one caption.                      | [content-and-moderation](content-and-moderation.md)                                        |
| R8  | Friends can react to a post; only the poster sees who reacted and how.       | Poster-only reaction visibility — [content-and-moderation](content-and-moderation.md)      |


Add acceptance criteria per requirement when the product stabilizes (e.g. Given/When/Then or checklist form).